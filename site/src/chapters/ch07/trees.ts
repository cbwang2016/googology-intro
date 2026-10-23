/**
 * Rooted, vertex-coloured finite trees and Friedman's (inf-preserving) homeomorphic embedding.
 *
 * Definition used (Friedman's standard one for TREE/tree):
 *   A ≤ B  iff there is an injective map h : V(A) → V(B) that preserves colours and infima
 *   (h(inf(u,v)) = inf(h(u),h(v)), where inf = nearest common ancestor).
 * Recursive characterisation used by the code (equivalent for finite rooted trees):
 *   A ≤ B iff  (a) A ≤ some child-subtree of B,  or
 *              (b) colour(root A) = colour(root B) and the child-subtrees of A can be sent
 *                  injectively to distinct child-subtrees of B, each one embedding there.
 * Self-contained (no imports) so it can be tested directly with node.
 */

export type Tree = { c: number; ch: Tree[] }

export const leaf = (c = 0): Tree => ({ c, ch: [] })

export function size(t: Tree): number {
  let s = 1
  for (const k of t.ch) s += size(k)
  return s
}

/** Canonical string, independent of child order. Colour digits, children in parentheses. */
export function canon(t: Tree): string {
  if (t.ch.length === 0) return String(t.c)
  return t.c + '(' + t.ch.map(canon).sort().join(',') + ')'
}

export function parseCanon(s: string): Tree {
  let i = 0
  const rec = (): Tree => {
    const c = Number(s[i++])
    const ch: Tree[] = []
    if (s[i] === '(') {
      i++
      for (;;) {
        ch.push(rec())
        if (s[i] === ',') i++
        else break
      }
      i++ // ')'
    }
    return { c, ch }
  }
  return rec()
}

/** Pre-order list of nodes with parent indices; node 0 is the root. */
export type Flat = { c: number[]; parent: number[]; children: number[][]; depth: number[] }
export function flatten(t: Tree): Flat {
  const c: number[] = []
  const parent: number[] = []
  const children: number[][] = []
  const depth: number[] = []
  const rec = (n: Tree, p: number, d: number) => {
    const id = c.length
    c.push(n.c)
    parent.push(p)
    children.push([])
    depth.push(d)
    if (p >= 0) children[p].push(id)
    for (const k of n.ch) rec(k, id, d + 1)
  }
  rec(t, -1, 0)
  return { c, parent, children, depth }
}

/**
 * Embedding search on flattened trees. Returns a map A-node → B-node, or null.
 * Memoised on (a, b) pairs; the matching is a small augmenting-path bipartite matching.
 */
export function embedding(A: Tree, B: Tree): number[] | null {
  const fa = flatten(A)
  const fb = flatten(B)
  const nA = fa.c.length
  const nB = fb.c.length
  // memo for "subtree a embeds somewhere in subtree b" and "with root a → root b"
  const memoAny = new Map<number, number[] | null>()
  const memoRoot = new Map<number, number[] | null>()
  const key = (a: number, b: number) => a * (nB + 1) + b

  const atRoot = (a: number, b: number): number[] | null => {
    const k = key(a, b)
    if (memoRoot.has(k)) return memoRoot.get(k)!
    let res: number[] | null = null
    if (fa.c[a] === fb.c[b]) {
      const ca = fa.children[a]
      const cb = fb.children[b]
      if (ca.length <= cb.length) {
        // bipartite matching ca → cb using anywhere-embeddings
        const matchB = new Map<number, number>() // cb node → index in ca
        const tryAssign = (i: number, seen: Set<number>): boolean => {
          for (const y of cb) {
            if (seen.has(y)) continue
            if (!anywhere(ca[i], y)) continue
            seen.add(y)
            const prev = matchB.get(y)
            if (prev === undefined || tryAssign(prev, seen)) {
              matchB.set(y, i)
              return true
            }
          }
          return false
        }
        let ok = true
        for (let i = 0; i < ca.length && ok; i++) ok = tryAssign(i, new Set())
        if (ok) {
          const m: number[] = new Array(nA).fill(-1)
          m[a] = b
          for (const [y, i] of matchB) {
            const sub = anywhere(ca[i], y)!
            sub.forEach((v, idx) => {
              if (v >= 0) m[idx] = v
            })
          }
          res = m
        }
      }
    }
    memoRoot.set(k, res)
    return res
  }

  const anywhere = (a: number, b: number): number[] | null => {
    const k = key(a, b)
    if (memoAny.has(k)) return memoAny.get(k)!
    let res = atRoot(a, b)
    if (!res) {
      for (const y of fb.children[b]) {
        res = anywhere(a, y)
        if (res) break
      }
    }
    memoAny.set(k, res)
    return res
  }

  return anywhere(0, 0)
}

export const embeds = (A: Tree, B: Tree) => embedding(A, B) !== null

/** All rooted trees with exactly n vertices and colours < k, up to isomorphism (canonical strings). */
const cacheExact = new Map<string, string[]>()
export function treesExact(n: number, k: number): string[] {
  const ck = n + ':' + k
  if (cacheExact.has(ck)) return cacheExact.get(ck)!
  const out = new Set<string>()
  if (n === 1) for (let c = 0; c < k; c++) out.add(String(c))
  else {
    // root colour + multiset of child trees with total size n-1
    const forests = forestsOf(n - 1, k)
    for (let c = 0; c < k; c++) for (const f of forests) out.add(canon({ c, ch: f.map(parseCanon) }))
  }
  const res = [...out].sort()
  cacheExact.set(ck, res)
  return res
}

/** Multisets of trees (as canonical strings, non-increasing order) with total size m. */
function forestsOf(m: number, k: number): string[][] {
  const res: string[][] = []
  const all: string[] = []
  for (let s = 1; s <= m; s++) all.push(...treesExact(s, k))
  all.sort()
  const rec = (rem: number, maxIdx: number, cur: string[]) => {
    if (rem === 0) {
      res.push([...cur])
      return
    }
    for (let i = maxIdx; i >= 0; i--) {
      const sz = size(parseCanon(all[i]))
      if (sz <= rem) {
        cur.push(all[i])
        rec(rem - sz, i, cur)
        cur.pop()
      }
    }
  }
  rec(m, all.length - 1, [])
  return res
}

export function treesUpTo(n: number, k: number): string[] {
  const r: string[] = []
  for (let s = 1; s <= n; s++) r.push(...treesExact(s, k))
  return r
}

/**
 * Exhaustive search for the longest "bad" sequence: tree i (1-based) has at most bound(i) vertices,
 * colours < k, and no earlier tree embeds into a later one.
 * Returns the length and one optimal sequence. Only for tiny cases.
 */
export function longestBad(k: number, bound: (i: number) => number, cap = 12): { len: number; seq: string[]; nodes: number } {
  let best: string[] = []
  let nodes = 0
  const embCache = new Map<string, boolean>()
  const emb = (a: string, b: string) => {
    const key = a + '|' + b
    let v = embCache.get(key)
    if (v === undefined) {
      v = embeds(parseCanon(a), parseCanon(b))
      embCache.set(key, v)
    }
    return v
  }
  const rec = (seq: string[]) => {
    nodes++
    if (seq.length > best.length) best = [...seq]
    if (seq.length >= cap) return
    const i = seq.length + 1
    for (const t of treesUpTo(bound(i), k)) {
      if (seq.some((s) => emb(s, t))) continue
      seq.push(t)
      rec(seq)
      seq.pop()
    }
  }
  rec([])
  return { len: best.length, seq: best, nodes }
}
