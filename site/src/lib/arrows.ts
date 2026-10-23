import { fromNum, powConst, toTex, type Huge } from './huge'

/** Knuth arrows, Def. 2.11 of 《大数理论》:
 *  a ↑^1 b = a^b;  a ↑^c 0 = 1 (c ≥ 1);  a ↑^{c+1} (b+1) = a ↑^c (a ↑^{c+1} b).  (a ≥ 1 integer, b ≥ 0)
 */

const DIGIT_CAP = 3000

/** Exact value if it has at most ~DIGIT_CAP digits, else null. */
export function arrowExact(a: bigint, c: number, b: bigint): bigint | null {
  if (c === 1) {
    if (a <= 1n) return a === 1n || b > 0n ? a : 1n
    const digits = Number(b) * Math.log10(Number(a))
    if (digits > DIGIT_CAP) return null
    return a ** b
  }
  if (b === 0n) return 1n
  if (a === 1n) return 1n
  // a ↑^c b = a ↑^{c-1} (a ↑^c (b-1)), unrolled
  let v = a // a ↑^c 1 = a
  for (let i = 1n; i < b; i++) {
    if (v > 100000n && c - 1 >= 2) return null
    const nv = arrowExact(a, c - 1, v)
    if (nv === null) return null
    v = nv
  }
  return v
}

export type Size =
  | { kind: 'exact'; v: bigint }
  | { kind: 'approx'; v: Huge }
  | { kind: 'tower'; base: number; height: Huge } // a ↑↑ height, height too big to evaluate
  | { kind: 'towers'; base: number; depth: number; inner: Huge } // tower whose height is a tower… (depth levels), innermost height `inner`
  | { kind: 'beyond'; c: number }

/** a ↑↑ b as Huge for moderate b (b ≤ 1e5). */
function tetrHuge(a: number, b: number): Huge {
  let v = fromNum(1)
  for (let i = 0; i < b; i++) v = powConst(a, v)
  return v
}

export function arrowSize(a: number, c: number, b: number): Size {
  const ex = arrowExact(BigInt(a), c, BigInt(b))
  if (ex !== null) return { kind: 'exact', v: ex }
  if (c === 1) return { kind: 'approx', v: powConst(a, fromNum(b)) }
  if (c === 2) {
    if (b <= 100000) return { kind: 'approx', v: tetrHuge(a, b) }
    return { kind: 'tower', base: a, height: fromNum(b) }
  }
  if (c === 3) {
    // a↑↑↑b = a↑↑(a↑↑↑(b-1)); a↑↑↑1 = a, a↑↑↑2 = a↑↑a
    if (b === 2) return a <= 100000 ? { kind: 'approx', v: tetrHuge(a, a) } : { kind: 'tower', base: a, height: fromNum(a) }
    // b ≥ 3: tower whose height is a↑↑↑(b-1)
    const h2 = a <= 100000 ? tetrHuge(a, a) : fromNum(a) // a↑↑a
    if (b === 3) return { kind: 'tower', base: a, height: h2 }
    return { kind: 'towers', base: a, depth: b - 2, inner: h2 }
  }
  return { kind: 'beyond', c }
}

export function sizeTex(s: Size): string {
  switch (s.kind) {
    case 'exact':
      return s.v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '{,}')
    case 'approx':
      return '\\approx ' + toTex(s.v)
    default:
      return ''
  }
}
