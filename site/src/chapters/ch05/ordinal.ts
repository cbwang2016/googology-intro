/**
 * Ordinals below ε₀ in Cantor normal form, plus the Primitive Sequence System (PrSS).
 * Shared by chapters 5 and 6 (both written by the same author). No React here, so the
 * file can be tested directly with `node`.
 */

/** α = ω^{e₀}·c₀ + ω^{e₁}·c₁ + …, exponents strictly decreasing, coefficients ≥ 1. 0 = []. */
export type Ord = Term[]
export type Term = { e: Ord; c: number }

export const ZERO: Ord = []
export const ONE: Ord = [{ e: ZERO, c: 1 }]
export const OMEGA: Ord = [{ e: ONE, c: 1 }]
export const nat = (n: number): Ord => (n <= 0 ? ZERO : [{ e: ZERO, c: n }])
export const omPow = (e: Ord, c = 1): Ord => [{ e, c }]

export function cmp(a: Ord, b: Ord): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i >= a.length) return -1
    if (i >= b.length) return 1
    const d = cmp(a[i].e, b[i].e)
    if (d !== 0) return d
    if (a[i].c !== b[i].c) return a[i].c < b[i].c ? -1 : 1
  }
  return 0
}
export const eq = (a: Ord, b: Ord) => cmp(a, b) === 0

/** Ordinary (non-commutative) ordinal addition. */
export function add(a: Ord, b: Ord): Ord {
  if (b.length === 0) return a
  const lead = b[0].e
  const keep: Ord = []
  for (const t of a) {
    const d = cmp(t.e, lead)
    if (d > 0) keep.push(t)
    else if (d === 0) {
      keep.push({ e: t.e, c: t.c + b[0].c })
      return [...keep, ...b.slice(1)]
    } else break
  }
  return [...keep, ...b]
}

export const isZero = (a: Ord) => a.length === 0
export const isSucc = (a: Ord) => a.length > 0 && a[a.length - 1].e.length === 0
export const isLimit = (a: Ord) => a.length > 0 && !isSucc(a)

/** α − 1 for a successor α. */
export function pred(a: Ord): Ord {
  const last = a[a.length - 1]
  if (last.c === 1) return a.slice(0, -1)
  return [...a.slice(0, -1), { e: ZERO, c: last.c - 1 }]
}

/** Standard fundamental sequences below ε₀ (book Def 3.6). For successors returns the predecessor. */
export function fs(a: Ord, n: number): Ord {
  if (a.length === 0) return ZERO
  if (isSucc(a)) return pred(a)
  const last = a[a.length - 1]
  const head: Ord = a.slice(0, -1)
  if (last.c > 1) head.push({ e: last.e, c: last.c - 1 })
  // ω^e [n]
  let inner: Ord
  if (isSucc(last.e)) {
    const p = pred(last.e)
    inner = n === 0 ? ZERO : [{ e: p, c: n }]
  } else inner = [{ e: fs(last.e, n), c: 1 }]
  return add(head, inner)
}

/** ω↑↑n with ω↑↑0 = 1. */
export function omegaTower(n: number): Ord {
  let a: Ord = ONE
  for (let i = 0; i < n; i++) a = omPow(a)
  return a
}

/* ---------------------------- TeX ---------------------------- */
export function texNum(c: number): string {
  return c >= 1e4 ? c.toLocaleString('en-US').replace(/,/g, '{,}') : String(c)
}
export function toTex(a: Ord): string {
  if (a.length === 0) return '0'
  return a
    .map((t) => {
      if (t.e.length === 0) return texNum(t.c)
      const base = eq(t.e, ONE) ? '\\omega' : `\\omega^{${toTex(t.e)}}`
      return t.c === 1 ? base : `${base}\\cdot ${texNum(t.c)}`
    })
    .join('+')
}
/** Plain-text version for SVG labels. */
export function toText(a: Ord): string {
  if (a.length === 0) return '0'
  const sup = (s: string) => (s.length === 1 ? s : `(${s})`)
  return a
    .map((t) => {
      if (t.e.length === 0) return String(t.c)
      const base = eq(t.e, ONE) ? 'ω' : `ω^${sup(toText(t.e))}`
      return t.c === 1 ? base : `${base}·${t.c}`
    })
    .join('+')
}

/* ---------------------------- PrSS ---------------------------- */
export type Seq = number[]

/** Index of the bad root: rightmost term smaller than the last term (book Def 2.16), or −1. */
export function badRoot(s: Seq): number {
  const last = s[s.length - 1]
  for (let i = s.length - 2; i >= 0; i--) if (s[i] < last) return i
  return -1
}

/** Parent of term i: the nearest term to its left that is smaller (−1 = the virtual root). */
export function parentOf(s: Seq, i: number): number {
  for (let j = i - 1; j >= 0; j--) if (s[j] < s[i]) return j
  return -1
}

/**
 * Rule (3) of Def 2.16 / 2.17 / 2.18: delete the last term a_m, keep the good part,
 * write the bad part (bad root … term before a_m) `copies` times in total.
 * If `copyLast` is true we also copy a_m — the broken, ill-founded variant (book 2.387).
 */
export function expandLimit(s: Seq, copies: number, copyLast = false): Seq {
  const r = badRoot(s)
  if (r < 0) return s.slice(0, -1)
  const good = s.slice(0, r)
  const bad = copyLast ? s.slice(r) : s.slice(r, -1)
  const out = [...good]
  for (let k = 0; k < copies; k++) out.push(...bad)
  return out
}

/** Theorem 2.1's necessary condition: first term 0, each step rises by at most 1. */
export function isLegalShape(s: Seq): boolean {
  if (s.length === 0) return true
  if (s[0] !== 0) return false
  for (let i = 1; i < s.length; i++) if (s[i] > s[i - 1] + 1 || s[i] < 0) return false
  return true
}

/** Book's conversion algorithm (ref [885]): split at every 0; (0) ↦ 1; (0,X) ↦ ω^{X−1}. */
export function seqToOrd(s: Seq): Ord {
  // Works for any sequence of the Thm 2.1 shape (non-standard ones are standardised by + absorption).
  let res: Ord = ZERO
  let i = 0
  const base = s.length ? Math.min(...s) : 0
  while (i < s.length) {
    let j = i + 1
    while (j < s.length && s[j] > base) j++
    const inner = s.slice(i + 1, j)
    res = add(res, omPow(seqToOrd(inner)))
    i = j
  }
  return res
}

/** Inverse: the standard sequence of an ordinal below ε₀. */
export function ordToSeq(a: Ord, shift = 0): Seq {
  const out: Seq = []
  for (const t of a) {
    for (let k = 0; k < t.c; k++) {
      out.push(shift)
      out.push(...ordToSeq(t.e, shift + 1))
    }
  }
  return out
}

export const isStandard = (s: Seq) => isLegalShape(s) && ordToSeq(seqToOrd(s)).join(',') === s.join(',')

/* ---------------------------- Trees ---------------------------- */
/** Ordered rooted tree; a hydra or a PrSS mountain. */
export type Tree = { ch: Tree[]; id: number }
let nextId = 1
export const newTree = (ch: Tree[] = []): Tree => ({ ch, id: nextId++ })
export const cloneTree = (t: Tree): Tree => newTree(t.ch.map(cloneTree))

/** Value of a tree: leaf-only = 0, (H₁ … Hₙ) = ω^{H₁} ⊕ … ⊕ ω^{Hₙ} (sorted, i.e. natural sum). */
export function treeOrd(t: Tree): Ord {
  const parts = t.ch.map(treeOrd).sort((x, y) => -cmp(x, y))
  let res: Ord = ZERO
  for (const p of parts) res = add(res, omPow(p))
  return res
}

/** PrSS sequence → tree (each term is a node; parent = nearest smaller term to the left). */
export function seqToTree(s: Seq): Tree {
  const root = newTree()
  const nodes: Tree[] = []
  s.forEach((_, i) => {
    const node = newTree()
    nodes.push(node)
    const p = parentOf(s, i)
    ;(p < 0 ? root : nodes[p]).ch.push(node)
  })
  return root
}

/** Tree → PrSS sequence (pre-order depth list). */
export function treeToSeq(t: Tree, depth = 0, out: Seq = []): Seq {
  for (const c of t.ch) {
    out.push(depth)
    treeToSeq(c, depth + 1, out)
  }
  return out
}

export const countNodes = (t: Tree): number => 1 + t.ch.reduce((s, c) => s + countNodes(c), 0)
export const treeDepth = (t: Tree): number => (t.ch.length ? 1 + Math.max(...t.ch.map(treeDepth)) : 0)

/** Bracket string: leaf = (), node with children = (…). */
export function treeBrackets(t: Tree): string {
  return '(' + t.ch.map(treeBrackets).join('') + ')'
}

/* -------- an order-preserving "altimeter" position for ordinals below ε₀ -------- */
/** Maps ordinals < ε₀ strictly increasingly into [0, 1). */
export function altitude(a: Ord): number {
  if (a.length === 0) return 0
  if (a.length === 1 && a[0].e.length === 0) return 0.5 + 0.25 * (1 - 2 ** -(a[0].c - 1))
  const t = a[0]
  const rest: Ord = a.slice(1)
  if (t.e.length === 0) return altitude(a) // unreachable (finite handled above)
  const lo = 0.5 + altitude(t.e) / 2
  const hi = 0.5 + altitude(add(t.e, ONE)) / 2
  const w = hi - lo
  const cLo = lo + w * (1 - 2 ** -(t.c - 1))
  const cW = w * 2 ** -t.c
  const rel = rest.length ? altitude(rest) / lo : 0
  return cLo + cW * rel
}
