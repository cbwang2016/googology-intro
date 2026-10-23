/**
 * Game engines for Chapter 6: Kirby–Paris hydra, Beklemishev's worm, Goodstein sequences.
 * Pure TypeScript (no React) so it can be tested with node.
 */
import { add, cloneTree, newTree, ZERO, type Ord, type Tree } from '../ch05/ordinal.ts'

/* ============================== Hydra ============================== */

/** A path from the root: child indices. */
export type Path = number[]

export function straightHydra(edges: number): Tree {
  let t = newTree()
  for (let i = 0; i < edges; i++) t = newTree([t])
  return t
}

/** All heads (leaves other than a bare root), left to right, with their paths and depths. */
export function heads(t: Tree): { path: Path; depth: number; siblings: number }[] {
  const out: { path: Path; depth: number; siblings: number }[] = []
  const walk = (node: Tree, path: Path) => {
    node.ch.forEach((c, i) => {
      const p = [...path, i]
      if (c.ch.length === 0) out.push({ path: p, depth: p.length, siblings: node.ch.length })
      else walk(c, p)
    })
  }
  walk(t, [])
  return out
}

/**
 * Kirby–Paris chop at step m (book Def 20.3): remove the head; if its parent is not the root,
 * the parent's remaining subtree is copied m times and attached to the grandparent, right after the parent.
 */
const cloneKeep = (t: Tree): Tree => ({ id: t.id, ch: t.ch.map(cloneKeep) })

export function chop(t: Tree, path: Path, m: number): Tree {
  const root = cloneKeep(t)
  const nodes: Tree[] = [root]
  for (const i of path) nodes.push(nodes[nodes.length - 1].ch[i])
  const parent = nodes[nodes.length - 2]
  parent.ch.splice(path[path.length - 1], 1)
  if (path.length >= 2) {
    const grand = nodes[nodes.length - 3]
    const at = path[path.length - 2]
    const copies = Array.from({ length: m }, () => cloneTree(parent))
    grand.ch.splice(at + 1, 0, ...copies)
  }
  return root
}

export type Strategy = 'rightmost' | 'deepest' | 'random'

export function pickHead(t: Tree, s: Strategy): Path | null {
  const hs = heads(t)
  if (hs.length === 0) return null
  if (s === 'rightmost') return hs[hs.length - 1].path
  if (s === 'random') return hs[Math.floor(Math.random() * hs.length)].path
  // deepest head; among equals, the one with the most siblings (book's fastest strategy)
  let best = hs[0]
  for (const h of hs) if (h.depth > best.depth || (h.depth === best.depth && h.siblings > best.siblings)) best = h
  return best.path
}

/** Number of chops to kill a hydra with a fixed strategy (null if it exceeds the budget). */
export function killCount(t: Tree, s: Strategy, maxSteps = 1e6, maxNodes = 5e4): number | null {
  let cur = t
  let m = 0
  while (cur.ch.length > 0) {
    m++
    if (m > maxSteps) return null
    cur = chop(cur, pickHead(cur, s)!, m)
    if (sizeOf(cur) > maxNodes) return null
  }
  return m
}
export const sizeOf = (t: Tree): number => 1 + t.ch.reduce((a, c) => a + sizeOf(c), 0)

/* ============================== Worm ============================== */

/** Beklemishev's worm, round m (book Def 20.6). */
export function wormNext(w: number[], m: number): number[] {
  const n = w.length - 1
  if (w[n] === 0) return w.slice(0, -1)
  let k = -1
  for (let i = n - 1; i >= 0; i--)
    if (w[i] < w[n]) {
      k = i
      break
    }
  const g = w.slice(0, k + 1)
  const b = [...w.slice(k + 1, n), w[n] - 1]
  const out = [...g]
  for (let i = 0; i < m + 1; i++) out.push(...b)
  return out
}

/**
 * Ordinal of a worm, by translating it into a standard primitive sequence and reading that:
 * a worm entry v that climbs above the previous entry p is preceded by the missing steps p+1, …, v−1.
 * (Checked in tests: every worm move strictly lowers this ordinal.)
 */
export function wormToSeq(w: number[]): number[] {
  const out: number[] = []
  let prev = -1
  for (const v of w) {
    for (let x = prev + 1; x < v; x++) out.push(x)
    out.push(v)
    prev = v
  }
  return out
}

/* ============================== Goodstein ============================== */

/** Hereditary base-b representation: Σ c·b^e, exponents decreasing, 0 < c < b. */
export type Hered = { e: Hered; c: bigint }[]

export function toHered(n: bigint, b: bigint): Hered {
  const terms: Hered = []
  let k = 0n
  while (n > 0n) {
    const d = n % b
    if (d !== 0n) terms.push({ e: toHered(k, b), c: d })
    n /= b
    k++
  }
  return terms.reverse()
}

/** Value at base b, or null if it would have more than `maxDigits` decimal digits. */
export function heredValue(h: Hered, b: bigint, maxBits = 20000): bigint | null {
  let s = 0n
  for (const t of h) {
    const e = heredValue(t.e, b, maxBits)
    if (e === null) return null
    const bits = Number(e) * Math.log2(Number(b))
    if (e > 100000n || bits > maxBits) return null
    s += t.c * b ** e
  }
  return s
}

/** Number of terms in the whole hereditary tree (to keep displays sane). */
export const heredSize = (h: Hered): number => h.reduce((a, t) => a + 1 + heredSize(t.e), 0)

/** h − 1 at base b (h > 0). Returns null if the result would have too many terms to write down. */
export function heredMinus1(h: Hered, b: bigint, maxTerms = 400): Hered | null {
  const last = h[h.length - 1]
  const head = h.slice(0, -1)
  if (last.e.length === 0) return last.c === 1n ? head : [...head, { e: [], c: last.c - 1n }]
  // c·b^E − 1 = (c−1)·b^E + (b−1)·b^{E−1} + … + (b−1)·b^0
  const E = heredValue(last.e, b)
  if (E === null || E > BigInt(maxTerms)) return null
  const out: Hered = [...head]
  if (last.c > 1n) out.push({ e: last.e, c: last.c - 1n })
  for (let k = E - 1n; k >= 0n; k--) out.push({ e: toHered(k, b), c: b - 1n })
  return out
}

export type GState = { h: Hered; b: bigint; k: bigint }

/** One Goodstein step: bump the base (the tree is unchanged!), then subtract 1. */
export function goodsteinStep(s: GState): GState | null {
  if (s.h.length === 0) return s
  const nb = s.b + 1n
  const h = heredMinus1(s.h, nb)
  if (h === null) return null
  return { h, b: nb, k: s.k + 1n }
}

/** Skip a whole run of "constant countdown" steps at once (exact). */
export function goodsteinSkip(s: GState): GState | null {
  const last = s.h[s.h.length - 1]
  if (!last) return s
  if (last.e.length === 0) return { h: s.h.slice(0, -1), b: s.b + last.c, k: s.k + last.c }
  return goodsteinStep(s)
}

/** Shadow ordinal of a hereditary representation (replace the base by ω), if coefficients are small. */
export function heredToOrd(h: Hered): Ord | null {
  let r: Ord = ZERO
  for (const t of h) {
    if (t.c > 1000000000n) return null
    const e = heredToOrd(t.e)
    if (e === null) return null
    r = add(r, [{ e, c: Number(t.c) }])
  }
  return r
}

/** Approximate log10 of the value of a hereditary representation at base b (may be Infinity). */
export function heredLog10(h: Hered, b: bigint): number {
  if (h.length === 0) return -Infinity
  const lb = Math.log10(Number(b))
  const t = h[0]
  const e = heredApprox(t.e, b)
  return Math.log10(Number(t.c)) + e * lb
}
function heredApprox(h: Hered, b: bigint): number {
  let s = 0
  for (const t of h) s += Number(t.c) * Math.pow(Number(b), heredApprox(t.e, b))
  return s
}
