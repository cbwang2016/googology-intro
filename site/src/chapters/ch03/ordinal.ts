/**
 * Ordinals below ε₀ in Cantor normal form (CNF), shared by chapters 3 and 4.
 * Pure TypeScript (no React) so it can be tested directly with node.
 *
 * α = ω^{e₀}·c₀ + ω^{e₁}·c₁ + …  with e₀ > e₁ > … (each again in CNF) and cᵢ ≥ 1.  0 = [].
 */
export type Term = { e: Ord; c: number }
export type Ord = Term[]

export const ZERO: Ord = []
export const ONE: Ord = [{ e: ZERO, c: 1 }]
export const OMEGA: Ord = [{ e: ONE, c: 1 }]
export const nat = (n: number): Ord => (n <= 0 ? ZERO : [{ e: ZERO, c: n }])
export const wpow = (e: Ord, c = 1): Ord => (c <= 0 ? ZERO : [{ e, c }])

export const isZero = (a: Ord) => a.length === 0
export const isNat = (a: Ord) => a.length === 0 || (a.length === 1 && a[0].e.length === 0)
export const natVal = (a: Ord) => (a.length === 0 ? 0 : a[0].c)
export const isSucc = (a: Ord) => a.length > 0 && a[a.length - 1].e.length === 0
export const isLimit = (a: Ord) => a.length > 0 && !isSucc(a)

export function cmp(a: Ord, b: Ord): number {
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    if (i >= a.length) return -1
    if (i >= b.length) return 1
    const d = cmp(a[i].e, b[i].e)
    if (d !== 0) return d
    if (a[i].c !== b[i].c) return a[i].c < b[i].c ? -1 : 1
  }
  return 0
}
export const eq = (a: Ord, b: Ord) => cmp(a, b) === 0

/** Ordinal addition (absorbs the terms of a that are smaller than the leading term of b). */
export function add(a: Ord, b: Ord): Ord {
  if (b.length === 0) return a
  const lead = b[0].e
  const out: Ord = []
  for (const t of a) {
    const d = cmp(t.e, lead)
    if (d > 0) out.push(t)
    else if (d === 0) {
      out.push({ e: t.e, c: t.c + b[0].c })
      return [...out, ...b.slice(1)]
    } else break
  }
  return [...out, ...b]
}

export const succ = (a: Ord) => add(a, ONE)

/** α − 1 for a successor α. */
export function pred(a: Ord): Ord {
  const last = a[a.length - 1]
  const head = a.slice(0, -1)
  return last.c > 1 ? [...head, { e: ZERO, c: last.c - 1 }] : head
}

/** Ordinal multiplication (left-distributive: a·(b₁+b₂) = a·b₁ + a·b₂). */
export function mul(a: Ord, b: Ord): Ord {
  if (a.length === 0 || b.length === 0) return ZERO
  let out: Ord = ZERO
  for (const t of b) {
    let piece: Ord
    if (t.e.length === 0) piece = [{ e: a[0].e, c: a[0].c * t.c }, ...a.slice(1)]
    else piece = [{ e: add(a[0].e, t.e), c: t.c }]
    out = add(out, piece)
  }
  return out
}

/** The β with ω^β' = ω·ω^β where β' ≥ 1 (i.e. 1+β = β'). */
function minusOneLeft(b: Ord): Ord {
  return isNat(b) ? nat(natVal(b) - 1) : b
}

export class OrdError extends Error {}

/** Ordinal exponentiation a^b (general CNF). */
export function pow(a: Ord, b: Ord): Ord {
  if (b.length === 0) return ONE
  if (a.length === 0) return ZERO
  if (eq(a, ONE)) return ONE
  const last = b[b.length - 1]
  const m = last.e.length === 0 ? last.c : 0
  const lim = last.e.length === 0 ? b.slice(0, -1) : b
  let p1: Ord = ONE
  if (lim.length > 0) {
    if (isNat(a)) {
      // k^(ω·γ) = (k^ω)^γ = ω^γ
      const gamma: Ord = lim.map((t) => ({ e: minusOneLeft(t.e), c: t.c }))
      p1 = wpow(gamma)
    } else {
      p1 = wpow(mul(a[0].e, lim))
    }
  }
  if (m > 64 && !isNat(a)) throw new OrdError('exponent too large')
  let p2: Ord = ONE
  if (isNat(a)) {
    const v = Math.pow(natVal(a), m)
    if (!Number.isSafeInteger(v)) throw new OrdError('number too large')
    p2 = nat(v)
  } else for (let i = 0; i < m; i++) p2 = mul(p2, a)
  return mul(p1, p2)
}

/** Standard fundamental sequence below ε₀ (book Def 3.6), for a limit α. */
export function fs(a: Ord, n: number): Ord {
  if (!isLimit(a)) throw new OrdError('not a limit')
  const last = a[a.length - 1]
  const head = a.slice(0, -1)
  const rest: Ord = last.c > 1 ? [...head, { e: last.e, c: last.c - 1 }] : head
  let tail: Ord
  if (isSucc(last.e)) tail = wpow(pred(last.e), n)
  else tail = wpow(fs(last.e, n))
  return add(rest, tail)
}

/** ω↑↑n with ω↑↑0 = 1. */
export function omegaTower(n: number): Ord {
  let a = ONE
  for (let i = 0; i < n; i++) a = wpow(a)
  return a
}

/** Leading exponent as a natural number, if finite (else Infinity); −1 for 0. */
export function degree(a: Ord): number {
  if (a.length === 0) return -1
  return isNat(a[0].e) ? natVal(a[0].e) : Infinity
}

/* ------------------------------------------------------------------ */
/* TeX                                                                 */
/* ------------------------------------------------------------------ */
export function tex(a: Ord): string {
  if (a.length === 0) return '0'
  return a.map(termTex).join('+')
}
function termTex(t: Term): string {
  if (t.e.length === 0) return String(t.c)
  const base = eq(t.e, ONE) ? '\\omega' : `\\omega^{${tex(t.e)}}`
  return t.c === 1 ? base : `${base}\\cdot ${t.c}`
}
/** Plain-text (unicode) rendering, for SVG labels. */
export function plain(a: Ord): string {
  if (a.length === 0) return '0'
  return a
    .map((t) => {
      if (t.e.length === 0) return String(t.c)
      const ex = eq(t.e, ONE) ? '' : isNat(t.e) ? sup(String(natVal(t.e))) : '^(' + plain(t.e) + ')'
      return 'ω' + ex + (t.c === 1 ? '' : '·' + t.c)
    })
    .join('+')
}
const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
const sup = (s: string) => s.split('').map((ch) => SUP[ch] ?? ch).join('')

/* ------------------------------------------------------------------ */
/* Parser: numbers, w / ω, + * · ^, parentheses                        */
/* ------------------------------------------------------------------ */
export function parse(src: string): Ord {
  const s = src.replace(/omega/gi, 'w').replace(/ω/g, 'w').replace(/[×·]/g, '*').replace(/\s+/g, '')
  let i = 0
  const peek = () => s[i]
  function expr(): Ord {
    let v = term()
    while (peek() === '+') {
      i++
      v = add(v, term())
    }
    return v
  }
  function term(): Ord {
    let v = factor()
    while (peek() === '*') {
      i++
      v = mul(v, factor())
    }
    return v
  }
  function factor(): Ord {
    const b = atom()
    if (peek() === '^') {
      i++
      return pow(b, factor())
    }
    return b
  }
  function atom(): Ord {
    const ch = peek()
    if (ch === '(') {
      i++
      const v = expr()
      if (peek() !== ')') throw new OrdError('missing )')
      i++
      return v
    }
    if (ch === 'w' || ch === 'W') {
      i++
      return OMEGA
    }
    const m = /^\d+/.exec(s.slice(i))
    if (m) {
      i += m[0].length
      const v = Number(m[0])
      if (!Number.isSafeInteger(v)) throw new OrdError('number too large')
      return nat(v)
    }
    throw new OrdError(`unexpected “${ch ?? 'end'}”`)
  }
  const v = expr()
  if (i < s.length) throw new OrdError(`unexpected “${s[i]}”`)
  return v
}

/* ------------------------------------------------------------------ */
/* Position on the line [0,1) for α < ω^ω (order-preserving)           */
/* ------------------------------------------------------------------ */
/** P_k: ordinals < ω^k → [0,1).  P_1(n) = 1 − 2^{−n};  P_{k+1}(ω^k·c + β) = 1 − 2^{−c} + 2^{−c−1} P_k(β). */
export function posK(a: Ord, k: number): number {
  if (k <= 1) {
    const n = natVal(a)
    return 1 - Math.pow(2, -n)
  }
  const top = k - 1
  let c = 0
  let rest = a
  if (a.length > 0 && isNat(a[0].e) && natVal(a[0].e) === top) {
    c = a[0].c
    rest = a.slice(1)
  }
  return 1 - Math.pow(2, -c) + Math.pow(2, -c - 1) * posK(rest, k - 1)
}
/** Position of α < ω^ω on [0,1): degree-k block occupies [1 − 2^{−k}, 1 − 2^{−k−1}). */
export function posW(a: Ord): number {
  const d = degree(a)
  if (d === Infinity) return 1 // α ≥ ω^ω: off the map, drawn at the top
  if (d <= 0) return posK(a, 1) / 2
  const p = posK(a, d + 1) // in [1/2, 1)
  return 1 - Math.pow(2, -d) + (p - 0.5) * Math.pow(2, -d)
}

/** All ordinals < ω^k whose coefficients are ≤ cap (in increasing order). */
export function enumBelow(k: number, cap: number): Ord[] {
  if (k <= 0) return [ZERO]
  const lower = enumBelow(k - 1, cap)
  const out: Ord[] = []
  for (let c = 0; c <= cap; c++) for (const r of lower) out.push(c === 0 ? r : [{ e: nat(k - 1), c }, ...r])
  return out
}

/* ------------------------------------------------------------------ */
/* Slow-growing "replace ω by n" and hereditary base-n                 */
/* ------------------------------------------------------------------ */
/** Value of α with every ω replaced by n (BigInt). Returns null if it would exceed `maxBits`. */
export function replaceOmega(a: Ord, n: bigint, maxBits = 4096): bigint | null {
  let total = 0n
  for (const t of a) {
    const e = replaceOmega(t.e, n, maxBits)
    if (e === null) return null
    if (n > 1n && Number(e) * Math.log2(Number(n)) > maxBits) return null
    total += n ** e * BigInt(t.c)
  }
  return total
}

/** Hereditary base-b representation of N as an ordinal (b replaced by ω). */
export function hereditary(N: bigint, b: bigint): Ord {
  const out: Ord = []
  let e = 0n
  const digits: { e: bigint; d: bigint }[] = []
  while (N > 0n) {
    const d = N % b
    if (d > 0n) digits.push({ e, d })
    N /= b
    e++
  }
  for (let i = digits.length - 1; i >= 0; i--) out.push({ e: hereditary(digits[i].e, b), c: Number(digits[i].d) })
  return out
}

/** Largest integer appearing in the hereditary CNF of α (coefficients and finite exponents). */
export function maxInt(a: Ord): number {
  let m = 0
  for (const t of a) {
    m = Math.max(m, t.c)
    if (isNat(t.e)) m = Math.max(m, natVal(t.e))
    else m = Math.max(m, maxInt(t.e))
  }
  return m
}

/** Repeatedly take α[n] until reaching a successor (or 0). */
export function fsUntilSucc(a: Ord, n: number): Ord {
  let x = a
  let guard = 0
  while (isLimit(x) && guard++ < 10000) x = fs(x, n)
  return x
}
