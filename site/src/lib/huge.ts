/**
 * Huge positive numbers in "tower form": value = E^h(x), where E(y) = 10^y.
 * Canonical form: h = 0 and 0 <= x < 1e10, or h >= 1 and 10 <= x < 1e10.
 * Accurate to double precision at the top of the tower, which is all that
 * matters once numbers have more than a few hundred digits.
 */
export type Huge = { h: number; x: number }

const CAP = 1e10

export function norm(h: number, x: number): Huge {
  while (x >= CAP) {
    x = Math.log10(x)
    h++
  }
  while (h > 0 && x < 10) {
    x = Math.pow(10, x)
    h--
  }
  return { h, x }
}

export const fromNum = (n: number): Huge => norm(0, n)
/** 10^L */
export const fromLog10 = (L: number): Huge => (L < 10 ? norm(0, Math.pow(10, L)) : norm(1, L))
/** 10^a */
export const exp10 = (a: Huge): Huge => norm(a.h + 1, a.x)

/** log10 of a (a >= 1). */
export function log10(a: Huge): Huge {
  if (a.h === 0) return fromNum(Math.log10(Math.max(a.x, 1)))
  return norm(a.h - 1, a.x)
}

/** a + d for a small real d (may be negative). */
export function addSmall(a: Huge, d: number): Huge {
  if (a.h === 0) return fromNum(a.x + d)
  if (a.h === 1 && a.x < 300) return fromNum(Math.pow(10, a.x) + d)
  return a // relative change below double precision
}

/** a · c for real c > 0. */
export function mulConst(a: Huge, c: number): Huge {
  if (a.h === 0) {
    const v = a.x * c
    return Number.isFinite(v) ? fromNum(v) : norm(1, Math.log10(a.x) + Math.log10(c))
  }
  return exp10(addSmall(log10(a), Math.log10(c)))
}

/** b^e for real base b > 1. */
export function powConst(b: number, e: Huge): Huge {
  if (b === 1) return fromNum(1)
  return exp10(mulConst(e, Math.log10(b)))
}

/** a · b */
export function mul(a: Huge, b: Huge): Huge {
  if (a.h === 0) return mulConst(b, a.x)
  if (b.h === 0) return mulConst(a, b.x)
  // both >= 1e10: log10(ab) = log a + log b
  const la = log10(a)
  const lb = log10(b)
  return exp10(cmp(la, lb) >= 0 ? addHuge(la, lb) : addHuge(lb, la))
}

/** a + b with a >= b. */
function addHuge(a: Huge, b: Huge): Huge {
  if (a.h === 0 && b.h === 0) return fromNum(a.x + b.x)
  if (b.h === 0) return addSmall(a, b.x)
  // b >= 1e10: a + b = a (1 + b/a); if b/a is tiny ignore
  const la = log10(a)
  const lb = log10(b)
  if (la.h === 0 && lb.h === 0) {
    const diff = lb.x - la.x
    return exp10(fromNum(la.x + Math.log10(1 + Math.pow(10, diff))))
  }
  return a
}

/** Power tower a1^a2^...^ak (a1 at the bottom), evaluated from the top. */
export function tower(bases: number[]): Huge {
  if (bases.length === 0) return fromNum(1)
  let v = fromNum(bases[bases.length - 1])
  for (let i = bases.length - 2; i >= 0; i--) v = powConst(bases[i], v)
  return v
}

export function cmp(a: Huge, b: Huge): number {
  if (a.h !== b.h) return a.h - b.h
  return a.x - b.x
}

/** Apply log10 k times; returns null when the value drops below 1 (log undefined/negative). */
export function iterLog(a: Huge, k: number): number | null {
  let v = a
  for (let i = 0; i < k; i++) {
    if (v.h === 0 && v.x < 1) return null
    v = log10(v)
  }
  return v.h === 0 ? v.x : Infinity
}

function sci(log: number, digits = 3): string {
  const e = Math.floor(log)
  let m = Math.pow(10, log - e)
  let ee = e
  if (Number(m.toFixed(digits - 1)) >= 10) {
    m /= 10
    ee += 1
  }
  return `${m.toFixed(digits - 1)}\\times10^{${groupDigits(ee)}}`
}

export function groupDigits(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '{,}')
}

/** TeX rendering of a Huge. */
export function toTex(a: Huge, digits = 3): string {
  if (a.h === 0) {
    if (a.x < 1e15 && Number.isInteger(a.x)) return groupDigits(a.x)
    if (a.x < 1e6) return a.x.toPrecision(digits + 2).replace(/\.?0+$/, '')
    return sci(Math.log10(a.x), digits)
  }
  if (a.h === 1) return sci(a.x, digits)
  if (a.h <= 6) {
    // E^h(x) = 10^10^...^(10^x), with h-1 tens below the top 10^x
    const top = sci(a.x, digits)
    let s = top
    for (let i = 0; i < a.h - 1; i++) s = `10^{${s}}`
    return s
  }
  return `(10\\uparrow)^{${a.h}}\\,${a.x.toFixed(2)}`
}

/** Number of decimal digits as a Huge (floor(log10 V) + 1, approximately for huge V). */
export function digitCount(a: Huge): Huge {
  if (a.h === 0) return fromNum(a.x < 1 ? 1 : Math.floor(Math.log10(a.x)) + 1)
  return addSmall(log10(a), 1)
}
