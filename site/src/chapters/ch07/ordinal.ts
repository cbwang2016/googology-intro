/**
 * A small exact engine for ordinals below Γ_{Γ_{Γ_…}} written with binary Veblen φ and Γ-terms.
 *
 *   Ord  = non-increasing list of additively principal terms (empty list = 0)
 *   Term = φ(a,b)  (φ(0,b) = ω^b, φ(1,b) = ε_b, …)   |   Γ_c  (= φ(1,0,c), the (1+c)-th fixed point of α ↦ φ(α,0))
 *
 * Every constructor normalises, so equal ordinals have equal representations.
 * Fundamental sequences follow 《大数理论》 Def 4.15 with the course convention of Ch.4:
 * where the book starts an iteration at [0] = 0 (rules 3–4 and Γ₀), we drop that trivial 0 term,
 * so ε₀[n] = ω↑↑n (ε₀[0] = 1). Self-contained (no imports) so it can be tested with node.
 */

export type Term = { k: 'phi'; a: Ord; b: Ord } | { k: 'G'; c: Ord }
export type Ord = Term[]

export const ZERO: Ord = []

/* ---------------- comparison ---------------- */
export function cmp(x: Ord, y: Ord): number {
  const n = Math.min(x.length, y.length)
  for (let i = 0; i < n; i++) {
    const c = cmpTerm(x[i], y[i])
    if (c !== 0) return c
  }
  return Math.sign(x.length - y.length)
}

export function cmpTerm(s: Term, t: Term): number {
  if (s.k === 'G' && t.k === 'G') return cmp(s.c, t.c)
  if (s.k === 'phi' && t.k === 'G') {
    const T = [t]
    return cmp(s.a, T) < 0 && cmp(s.b, T) < 0 ? -1 : 1
  }
  if (s.k === 'G' && t.k === 'phi') return -cmpTerm(t, s)
  const S = s as Extract<Term, { k: 'phi' }>
  const U = t as Extract<Term, { k: 'phi' }>
  const ca = cmp(S.a, U.a)
  if (ca === 0) return cmp(S.b, U.b)
  if (ca < 0) return cmp(S.b, [U]) < 0 ? -1 : 1
  return cmp([S], U.b) <= 0 ? -1 : 1
}

export const eq = (x: Ord, y: Ord) => cmp(x, y) === 0
export const lt = (x: Ord, y: Ord) => cmp(x, y) < 0

/* ---------------- constructors ---------------- */
export function phi(a: Ord, b: Ord): Ord {
  if (b.length === 1) {
    const t = b[0]
    if (t.k === 'G' && lt(a, b)) return b
    if (t.k === 'phi' && lt(a, t.a)) return b
  }
  if (b.length === 0 && a.length === 1 && a[0].k === 'G') return a
  return [{ k: 'phi', a, b }]
}
export const gamma = (c: Ord): Ord => [{ k: 'G', c }]
export const ONE: Ord = phi(ZERO, ZERO)
export const nat = (n: number): Ord => Array.from({ length: n }, () => ONE[0])
export const W: Ord = phi(ZERO, ONE)
export const wpow = (b: Ord) => phi(ZERO, b)
export const eps = (b: Ord) => phi(ONE, b)
export const zeta = (b: Ord) => phi(nat(2), b)
export const eta = (b: Ord) => phi(nat(3), b)

export function add(x: Ord, y: Ord): Ord {
  if (y.length === 0) return x
  const keep = x.filter((t) => cmpTerm(t, y[0]) >= 0)
  return [...keep, ...y]
}
export const succ = (x: Ord) => add(x, ONE)

/** exponent e of a principal term, i.e. t = ω^e */
export function expOf(t: Term): Ord {
  if (t.k === 'phi' && t.a.length === 0) return t.b
  return [t]
}

export function mul(x: Ord, y: Ord): Ord {
  if (x.length === 0 || y.length === 0) return ZERO
  let res: Ord = ZERO
  for (const t of y) {
    if (eq([t], ONE)) res = add(res, x)
    else res = add(res, wpow(add(expOf(x[0]), expOf(t))))
  }
  return res
}
export const mulNat = (x: Ord, n: number) => mul(x, nat(n))
/** β^x for β an ε-number (so β = ω^β): β^x = ω^(β·x). */
export const epsPow = (beta: Ord, x: Ord) => wpow(mul(beta, x))

/* ---------------- classification ---------------- */
export const isZero = (x: Ord) => x.length === 0
export const isSucc = (x: Ord) => x.length > 0 && eq([x[x.length - 1]], ONE)
export const isLimit = (x: Ord) => x.length > 0 && !isSucc(x)
export const pred = (x: Ord) => x.slice(0, -1)
export const asNat = (x: Ord): number | null => (x.every((t) => eq([t], ONE)) ? x.length : null)

/* ---------------- fundamental sequences ---------------- */
export type FSRule = string // short tag of the rule of Def 4.15 used (book numbering)

export function fs(x: Ord, n: number): { v: Ord; rule: FSRule } {
  if (!isLimit(x)) throw new Error('fs of non-limit')
  if (x.length > 1) {
    const r = fs([x[x.length - 1]], n)
    return { v: add(x.slice(0, -1), r.v), rule: '1' }
  }
  const t = x[0]
  if (t.k === 'G') {
    const c = t.c
    if (isZero(c)) {
      let v: Ord = ZERO
      for (let i = 0; i <= n; i++) v = phi(v, ZERO)
      return { v, rule: 'Γ0' }
    }
    if (isSucc(c)) {
      let v = succ(gamma(pred(c)))
      for (let i = 0; i < n; i++) v = phi(v, ZERO)
      return { v, rule: 'Γ+' }
    }
    return { v: gamma(fs(c, n).v), rule: 'Γλ' }
  }
  const { a, b } = t
  if (isZero(a)) {
    if (isSucc(b)) return { v: mulNat(wpow(pred(b)), n), rule: '2b' }
    return { v: wpow(fs(b, n).v), rule: '2a' }
  }
  if (isLimit(b)) return { v: phi(a, fs(b, n).v), rule: '9' }
  if (isSucc(a)) {
    const a1 = pred(a)
    if (isZero(b)) {
      let v: Ord = ZERO
      for (let i = 0; i <= n; i++) v = phi(a1, v)
      return { v, rule: '3-4' }
    }
    let v = succ(phi(a, pred(b)))
    for (let i = 0; i < n; i++) v = phi(a1, v)
    return { v, rule: '5-6' }
  }
  // a limit
  if (isZero(b)) return { v: phi(fs(a, n).v, ZERO), rule: '7' }
  return { v: phi(fs(a, n).v, succ(phi(a, pred(b)))), rule: '8' }
}

/* ---------------- least fixed points (for the fixed-point machine) ---------------- */
/** Least fixed point ≥ s of ξ ↦ φ(k, ξ), k a natural number. Fixed points are exactly the φ(k+1, x). */
export function lfpPhi(k: number, s: Ord): Ord {
  const K = nat(k)
  const K1 = nat(k + 1)
  if (lt(s, phi(K1, ZERO)) || isZero(s)) return phi(K1, ZERO)
  const t = s[0]
  const isFp = t.k === 'G' || lt(K, t.a)
  if (isFp) {
    if (s.length === 1) return s
    return phi(K1, succ(indexIn(k + 1, t)))
  }
  // t = φ(c,d) with c ≤ k: least fixed point above t is the least one ≥ d+1
  return lfpPhi(k, succ(t.b))
}
/** For a fixed point t of φ(k-1,·) (so t = φ(k, x)), return x. */
export function indexIn(k: number, t: Term): Ord {
  if (t.k === 'phi' && eq(t.a, nat(k))) return t.b
  return [t]
}
/** Least fixed point ≥ s of α ↦ φ(α, 0): these are the Γ-terms. */
export function lfpGamma(s: Ord): Ord {
  if (isZero(s) || lt(s, gamma(ZERO))) return gamma(ZERO)
  const t = s[0]
  if (t.k === 'G') {
    if (s.length === 1) return s
    return gamma(succ(t.c))
  }
  return lfpGamma(succ(lt(t.a, t.b) ? t.b : t.a))
}

/* ---------------- printing ---------------- */
export function tex(x: Ord, raw = false): string {
  if (x.length === 0) return '0'
  const parts: string[] = []
  let i = 0
  while (i < x.length) {
    let j = i
    while (j + 1 < x.length && cmpTerm(x[j + 1], x[i]) === 0) j++
    const k = j - i + 1
    parts.push(termTex(x[i], k, raw))
    i = j + 1
  }
  return parts.join('+')
}

function wrap(s: string) {
  return s
}

function termTex(t: Term, k: number, raw: boolean): string {
  const times = k > 1 ? `\\cdot ${k}` : ''
  if (t.k === 'G') return `\\Gamma_{${tex(t.c, raw)}}${times}`
  const { a, b } = t
  if (raw) {
    if (a.length === 0 && b.length === 0) return String(k)
    return `\\varphi(${tex(a, raw)},${tex(b, raw)})${times}`
  }
  if (a.length === 0) {
    if (b.length === 0) return String(k)
    if (eq(b, ONE)) return `\\omega${times}`
    return `\\omega^{${wrap(tex(b))}}${times}`
  }
  const an = asNat(a)
  const sub = tex(b)
  if (an === 1) return `\\varepsilon_{${sub}}${times}`
  if (an === 2) return `\\zeta_{${sub}}${times}`
  if (an === 3) return `\\eta_{${sub}}${times}`
  return `\\varphi(${tex(a)},${sub})${times}`
}

/* ---------------- parsing (for the explorer's input box) ---------------- */
/**
 * Grammar (spaces ignored):
 *   expr   := prod ('+' prod)*
 *   prod   := pow ('*' nat)?
 *   pow    := atom ('^' pow)?            // only ω may be raised to a power
 *   atom   := nat | 'w'|'ω' | ('e'|'ε'|'z'|'ζ'|'h'|'η'|'G'|'Γ') '_'? atom
 *           | ('phi'|'φ'|'ϕ') '(' expr ',' expr ')' | '(' expr ')'
 */
export function parseOrd(src: string): Ord {
  const s = src.replace(/\s+/g, '').replace(/phi|ϕ|φ/g, 'φ').replace(/ω/g, 'w')
  let i = 0
  const fail = (m: string): never => {
    throw new Error(m + ' @' + i)
  }
  const expr = (): Ord => {
    let v = prod()
    while (s[i] === '+') {
      i++
      v = add(v, prod())
    }
    return v
  }
  const prod = (): Ord => {
    let v = pw()
    while (s[i] === '*' || s[i] === '·') {
      i++
      const m = /^\d+/.exec(s.slice(i))
      if (!m) fail('expected a natural number after *')
      i += m![0].length
      v = mulNat(v, Number(m![0]))
    }
    return v
  }
  const pw = (): Ord => {
    const startsW = s[i] === 'w'
    const base = atom()
    if (s[i] === '^') {
      if (!startsW || !eq(base, W)) fail('only ω can be raised to a power')
      i++
      return wpow(pw())
    }
    return base
  }
  const atom = (): Ord => {
    const c = s[i]
    if (c === undefined) fail('unexpected end')
    if (/\d/.test(c)) {
      const m = /^\d+/.exec(s.slice(i))!
      i += m[0].length
      const n = Number(m[0])
      if (n > 50) fail('number too large')
      return nat(n)
    }
    if (c === 'w') {
      i++
      return W
    }
    if (c === '(') {
      i++
      const v = expr()
      if (s[i] !== ')') fail('expected )')
      i++
      return v
    }
    if (c === 'φ') {
      i++
      if (s[i] !== '(') fail('expected (')
      i++
      const a = expr()
      if (s[i] !== ',') fail('expected ,')
      i++
      const b = expr()
      if (s[i] !== ')') fail('expected )')
      i++
      return phi(a, b)
    }
    const map: Record<string, (o: Ord) => Ord> = { e: eps, ε: eps, z: zeta, ζ: zeta, h: eta, η: eta, G: gamma, Γ: gamma }
    if (map[c]) {
      i++
      if (s[i] === '_') i++
      const sub = atom()
      return map[c](sub)
    }
    return fail('unexpected ' + c)
  }
  const v = expr()
  if (i !== s.length) fail('trailing input')
  return v
}
