/**
 * Expression engine for Madore's ψ with Ω_n (book §5.3–5.4), used by the folding stepper.
 *
 * Terms are trees. Ω_0 is ω. We never normalise to a standard form; expressions are
 * written with the "last Ω split off" (e.g. Ω·2 is entered as Ω+Ω, Ω² as Ω·Ω).
 *
 * Fundamental sequences (the convention this course fixes, book eq. 5.316–5.318 and Def 5.11):
 *   ω[k] = k,  Ω_ω[k] = Ω_k
 *   (a+b)[k] = a + b[k],  (a·b)[k] = a·b[k],  (a^b)[k] = a^{b[k]}  (b limit)
 *   ψ_m(0)[0] = Ω_m,  ψ_m(0)[k+1] = Ω_m^{ψ_m(0)[k]}
 *   ψ_m(β+1)[0] = ψ_m(β),  ψ_m(β+1)[k+1] = ψ_m(β)^{ψ_m(β+1)[k]}
 *   ψ_m(β)[k] = ψ_m(β[k])  when β is a recursive limit
 *   Find-layer: the rightmost Ω_n is found by the innermost enclosing ψ_m with m < n.
 *   Write that layer as ψ_m(A[∗Ω_n]). Then
 *     [0]   = ψ_m(A[ ])                (delete "∗Ω_n"; a bare Ω_n becomes 0)
 *     [k+1] = ψ_m(A[∗ g_{k+1}]),  g_1 = ψ_{n−1}(A[ ]),  g_{j+1} = ψ_{n−1}(A[∗ g_j])
 *   i.e. the copies are renamed ψ_{n−1}.
 */
export type Hl = 'layer' | 'copy' | 'leaf' | undefined
export type E =
  | { t: 'nat'; v: number; hl?: Hl }
  | { t: 'om'; n: number; hl?: Hl } // n = 0 is ω
  | { t: 'omw'; hl?: Hl } // Ω_ω
  | { t: 'psi'; m: number; a: E; hl?: Hl; alias?: string }
  | { t: 'add'; l: E; r: E; hl?: Hl }
  | { t: 'mul'; l: E; r: E; hl?: Hl }
  | { t: 'pow'; l: E; r: E; hl?: Hl }

/* ----------------------------- constructors ----------------------------- */
export const N = (v: number): E => ({ t: 'nat', v })
export const W: E = { t: 'om', n: 0 }
export const O = (n = 1): E => ({ t: 'om', n })
export const OW: E = { t: 'omw' }
export const P = (m: number, a: E): E => ({ t: 'psi', m, a })
export const p = (a: E): E => P(0, a)
export function A(l: E, r: E): E {
  if (r.t === 'nat' && r.v === 0) return l
  if (l.t === 'nat' && l.v === 0) return r
  if (l.t === 'nat' && r.t === 'nat') return N(l.v + r.v)
  if (r.t === 'nat' && l.t === 'add' && l.r.t === 'nat') return { t: 'add', l: l.l, r: N(l.r.v + r.v) }
  return { t: 'add', l, r }
}
export function Mu(l: E, r: E): E {
  if (r.t === 'nat' && r.v === 0) return N(0)
  if (l.t === 'nat' && l.v === 0) return N(0)
  if (r.t === 'nat' && r.v === 1) return l
  if (l.t === 'nat' && l.v === 1) return r
  return { t: 'mul', l, r }
}
export function Pw(l: E, r: E): E {
  if (r.t === 'nat' && r.v === 0) return N(1)
  if (r.t === 'nat' && r.v === 1) return l
  return { t: 'pow', l, r }
}

/* ------------------------------ classification ------------------------------ */
type Cls = { c: 'zero' } | { c: 'succ' } | { c: 'lim' } | { c: 'Om'; n: number }

export function classify(e: E): Cls {
  switch (e.t) {
    case 'nat':
      return e.v === 0 ? { c: 'zero' } : { c: 'succ' }
    case 'om':
      return e.n === 0 ? { c: 'lim' } : { c: 'Om', n: e.n }
    case 'omw':
      return { c: 'lim' }
    case 'add':
      return classify(e.r)
    case 'mul': {
      const cr = classify(e.r)
      return cr.c === 'succ' ? classify(e.l) : cr
    }
    case 'pow': {
      const cr = classify(e.r)
      if (cr.c === 'zero') return { c: 'succ' }
      return cr.c === 'succ' ? classify(e.l) : cr
    }
    case 'psi': {
      const ca = classify(e.a)
      if (ca.c === 'Om' && ca.n <= e.m) return ca
      return { c: 'lim' }
    }
  }
}

/** predecessor of a successor term written as x+1 (or a natural number) */
export function pred(e: E): E {
  if (e.t === 'nat') return N(e.v - 1)
  if (e.t === 'add') return A(e.l, pred(e.r))
  throw new Error('pred: not a simple successor')
}

/* "a·(x+1) = a·x + a" and "a^(x+1) = a^x · a" — split a successor on the right */
function splitRight(e: E): E {
  if (e.t === 'mul' && classify(e.r).c === 'succ') return A(Mu(e.l, pred(e.r)), e.l)
  if (e.t === 'pow' && classify(e.r).c === 'succ') return Mu(Pw(e.l, pred(e.r)), e.l)
  return e
}

/** Substitute γ for the active Ω_n leaf (the one that sets the cofinality). */
function sub(e: E, g: E): E {
  const s = splitRight(e)
  if (s !== e) return sub(s, g)
  switch (e.t) {
    case 'om':
      return g
    case 'add':
      return A(e.l, sub(e.r, g))
    case 'mul':
      return Mu(e.l, sub(e.r, g))
    case 'pow':
      return Pw(e.l, sub(e.r, g))
    case 'psi':
      return { ...e, a: sub(e.a, g) }
    default:
      throw new Error('sub: no Ω leaf')
  }
}
/** Delete "∗Ω_n" for the active leaf: L∗Ω_n becomes L; a bare Ω_n becomes 0. */
function del(e: E): E {
  const s = splitRight(e)
  if (s !== e) return del(s)
  switch (e.t) {
    case 'om':
      return N(0)
    case 'add':
      return e.r.t === 'om' && e.r.n > 0 ? e.l : A(e.l, del(e.r))
    case 'mul':
      return e.r.t === 'om' && e.r.n > 0 ? e.l : Mu(e.l, del(e.r))
    case 'pow':
      return e.r.t === 'om' && e.r.n > 0 ? e.l : Pw(e.l, del(e.r))
    case 'psi':
      return { ...e, a: del(e.a) }
    default:
      throw new Error('del: no Ω leaf')
  }
}

export type StepInfo =
  | { kind: 'omega' } // ω[k] = k or Ω_ω[k] = Ω_k reached
  | { kind: 'psi0'; m: number }
  | { kind: 'psiSucc'; m: number }
  | { kind: 'fold'; m: number; n: number } // find-layer

/** k-th term of the fundamental sequence of a limit term, plus which rule fired. */
export function fs(e: E, k: number): { r: E; info: StepInfo } {
  const s = splitRight(e)
  if (s !== e) return fs(s, k)
  switch (e.t) {
    case 'om':
      if (e.n === 0) return { r: N(k), info: { kind: 'omega' } }
      throw new Error('Ω_n has no ω-sequence')
    case 'omw':
      return { r: O(k), info: { kind: 'omega' } }
    case 'add': {
      const x = fs(e.r, k)
      return { r: A(e.l, x.r), info: x.info }
    }
    case 'mul': {
      const x = fs(e.r, k)
      return { r: Mu(e.l, x.r), info: x.info }
    }
    case 'pow': {
      const x = fs(e.r, k)
      return { r: Pw(e.l, x.r), info: x.info }
    }
    case 'nat':
      throw new Error('not a limit')
    case 'psi': {
      const ca = classify(e.a)
      const m = e.m
      if (ca.c === 'zero') {
        let t: E = O(m)
        for (let j = 0; j < k; j++) t = Pw(O(m), t)
        return { r: t, info: { kind: 'psi0', m } }
      }
      if (ca.c === 'succ') {
        const base = P(m, pred(e.a))
        let t: E = base
        for (let j = 0; j < k; j++) t = Pw(base, t)
        return { r: t, info: { kind: 'psiSucc', m } }
      }
      if (ca.c === 'lim') {
        const x = fs(e.a, k)
        return { r: { ...e, a: x.r, hl: undefined }, info: x.info }
      }
      // Ω_n with n > m: this ψ_m is the found layer
      const n = ca.n
      if (n <= m) throw new Error('uncountable cofinality at top level')
      const empty = del(e.a)
      if (k === 0) return { r: { t: 'psi', m, a: empty, hl: 'layer' }, info: { kind: 'fold', m, n } }
      let g: E = { t: 'psi', m: n - 1, a: empty, hl: 'copy' }
      for (let j = 1; j < k; j++) g = { t: 'psi', m: n - 1, a: sub(e.a, g), hl: 'copy' }
      return { r: { t: 'psi', m, a: sub(e.a, g), hl: 'layer' }, info: { kind: 'fold', m, n } }
    }
  }
}

/** Mark the found layer and the active Ω leaf of a limit term (for display). */
export function annotate(e: E): E {
  const go = (x: E): { r: E; need: number | null } => {
    const y = splitRight(x)
    switch (y.t) {
      case 'om':
        return y.n > 0 ? { r: { ...y, hl: 'leaf' }, need: y.n } : { r: { ...y, hl: 'leaf' }, need: null }
      case 'omw':
        return { r: { ...y, hl: 'leaf' }, need: null }
      case 'add':
      case 'mul':
      case 'pow': {
        const c = go(y.r)
        return { r: { ...y, r: c.r }, need: c.need }
      }
      case 'nat':
        return { r: y, need: null }
      case 'psi': {
        const ca = classify(y.a)
        if (ca.c === 'zero' || ca.c === 'succ') return { r: { ...y, hl: 'leaf' }, need: null }
        const c = go(y.a)
        if (c.need !== null && c.need > y.m) return { r: { ...y, a: c.r, hl: 'layer' }, need: null }
        return { r: { ...y, a: c.r }, need: c.need }
      }
    }
  }
  return go(e).r
}

/* --------------------------------- TeX --------------------------------- */
const COL: Record<string, string> = { layer: '#ffd36b', copy: '#ff7ab6', leaf: '#ff6b6b' }
function omTex(n: number) {
  return n === 0 ? '\\omega' : n === 1 ? '\\Omega' : `\\Omega_{${n}}`
}
function psiName(m: number) {
  return m === 0 ? '\\psi' : `\\psi_{${m}}`
}
const atomic = (e: E) => e.t === 'nat' || e.t === 'om' || e.t === 'omw' || e.t === 'psi'
export function toTex(e: E, color = true): string {
  const c = (s: string, h: Hl) => (color && h ? `\\textcolor{${COL[h]}}{${s}}` : s)
  switch (e.t) {
    case 'nat':
      return String(e.v)
    case 'om':
      return c(omTex(e.n), e.hl)
    case 'omw':
      return c('\\Omega_{\\omega}', e.hl)
    case 'psi': {
      if (e.alias && (!e.hl || !color)) return e.alias
      const inner = toTex(e.a, color)
      if (color && e.hl === 'leaf') return `\\textcolor{${COL.leaf}}{${e.alias ?? `${psiName(e.m)}(${toTex(e.a, false)})`}}`
      return `${c(psiName(e.m), e.hl)}${c('(', e.hl)}${inner}${c(')', e.hl)}`
    }
    case 'add':
      return `${toTex(e.l, color)}+${toTex(e.r, color)}`
    case 'mul': {
      const l = e.l.t === 'add' ? `(${toTex(e.l, color)})` : toTex(e.l, color)
      const r = e.r.t === 'add' || e.r.t === 'mul' ? `(${toTex(e.r, color)})` : toTex(e.r, color)
      return `${l}\\cdot ${r}`
    }
    case 'pow': {
      const l = atomic(e.l) ? toTex(e.l, color) : `(${toTex(e.l, color)})`
      return `${l}^{${toTex(e.r, color)}}`
    }
  }
}
export const plain = (e: E) => toTex(e, false)

/** Count ψ-nesting depth (for size limits). */
export function depth(e: E): number {
  switch (e.t) {
    case 'psi':
      return 1 + depth(e.a)
    case 'add':
    case 'mul':
    case 'pow':
      return Math.max(depth(e.l), depth(e.r))
    default:
      return 0
  }
}
export function texLength(e: E) {
  return plain(e).length
}
