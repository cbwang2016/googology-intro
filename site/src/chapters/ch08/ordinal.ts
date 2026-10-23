/**
 * Small Cantor-normal-form engine for ordinals below ζ₀, with ε-numbers as atoms.
 * Used by the brick builder (Def 5.3 closure sets C^n(α)).
 *
 * An ordinal is a list of terms in strictly decreasing order of exponent.
 *   { k: 'w', e, c }   means ω^e · c      (e is an ordinal, c ≥ 1)
 *   { k: 'eps', i, c } means ε_i · c      (= ω^{ε_i} · c)
 * The only fixed point of e ↦ ω^e below ζ₀ is an ε-number, so ω^e is rewritten to
 * ε_i exactly when e is the single term ε_i (coefficient 1). Indices i must stay below ζ₀.
 */
export type Term = { k: 'w'; e: Ord; c: number } | { k: 'eps'; i: Ord; c: number }
export type Ord = Term[]

export const ZERO: Ord = []
export const nat = (n: number): Ord => (n <= 0 ? [] : [{ k: 'w', e: [], c: n }])
export const ONE = nat(1)
export const OMEGA: Ord = [{ k: 'w', e: ONE, c: 1 }]
export const eps = (i: Ord): Ord => [{ k: 'eps', i, c: 1 }]

/** Exponent of a term, as an ordinal. */
function expOf(t: Term): Ord {
  return t.k === 'w' ? t.e : [{ k: 'eps', i: t.i, c: 1 }]
}

function cmpExp(a: Term, b: Term): number {
  if (a.k === 'eps' && b.k === 'eps') return cmp(a.i, b.i)
  return cmp(expOf(a), expOf(b))
}

export function cmp(a: Ord, b: Ord): number {
  const n = Math.min(a.length, b.length)
  for (let j = 0; j < n; j++) {
    const d = cmpExp(a[j], b[j])
    if (d !== 0) return d
    if (a[j].c !== b[j].c) return a[j].c < b[j].c ? -1 : 1
  }
  return a.length === b.length ? 0 : a.length < b.length ? -1 : 1
}

export const isZero = (a: Ord) => a.length === 0
export const isFinite = (a: Ord) => a.length === 0 || (a.length === 1 && a[0].k === 'w' && a[0].e.length === 0)
export const finiteValue = (a: Ord) => (a.length === 0 ? 0 : a[0].c)

/** ω^e · c, with ω^{ε_i} rewritten to ε_i. */
export function wTerm(e: Ord, c = 1): Ord {
  if (c <= 0) return []
  if (e.length === 1 && e[0].k === 'eps' && e[0].c === 1) return [{ k: 'eps', i: e[0].i, c }]
  return [{ k: 'w', e, c }]
}

export function add(a: Ord, b: Ord): Ord {
  if (b.length === 0) return a
  const lead = b[0]
  const out: Term[] = []
  for (const t of a) {
    const d = cmpExp(t, lead)
    if (d > 0) out.push(t)
    else if (d === 0) {
      out.push({ ...lead, c: lead.c + t.c } as Term)
      return [...out, ...b.slice(1)]
    } else break
  }
  return [...out, ...b]
}

export function mul(a: Ord, b: Ord): Ord {
  if (a.length === 0 || b.length === 0) return []
  const a0 = expOf(a[0])
  let out: Ord = []
  for (const t of b) {
    const e = expOf(t)
    if (e.length === 0) {
      // a · c = (lead of a)·(c·coeff) + rest of a
      out = add(out, [{ ...a[0], c: a[0].c * t.c } as Term, ...a.slice(1)])
    } else {
      out = add(out, wTerm(add(a0, e), t.c))
    }
  }
  return out
}

export function pow(a: Ord, b: Ord): Ord {
  if (b.length === 0) return ONE
  if (a.length === 0) return []
  if (isFinite(a) && finiteValue(a) === 1) return ONE
  // split b = binf + k
  const last = b[b.length - 1]
  const k = last.k === 'w' && last.e.length === 0 ? last.c : 0
  const binf = k > 0 ? b.slice(0, -1) : b
  let head: Ord = ONE
  if (binf.length > 0) {
    if (isFinite(a)) {
      // m^{ω·β} = ω^β, where binf = ω·β
      const beta: Ord = binf.map((t) => {
        const e = expOf(t)
        if (isFinite(e)) return { k: 'w', e: nat(finiteValue(e) - 1), c: t.c } as Term
        return t
      })
      head = wTerm(beta)
    } else {
      head = wTerm(mul(expOf(a[0]), binf))
    }
  }
  let tail: Ord = ONE
  if (isFinite(a)) {
    const v = Math.pow(finiteValue(a), k)
    tail = nat(v > 1e9 ? 1e9 : v)
  } else for (let j = 0; j < k; j++) tail = mul(tail, a)
  return mul(head, tail)
}

/* ---------------------------- printing ---------------------------- */
function wrapIdx(s: string) {
  return `{${s}}`
}
export function tex(a: Ord): string {
  if (a.length === 0) return '0'
  return a
    .map((t) => {
      if (t.k === 'eps') {
        const base = `\\varepsilon_${wrapIdx(tex(t.i))}`
        return t.c === 1 ? base : `${base}\\cdot ${t.c}`
      }
      if (t.e.length === 0) return String(t.c)
      const base = isFinite(t.e) && finiteValue(t.e) === 1 ? '\\omega' : `\\omega^{${tex(t.e)}}`
      return t.c === 1 ? base : `${base}\\cdot ${t.c}`
    })
    .join('+')
}
export const key = (a: Ord) => tex(a)

/** Height of the term tree, a rough "complexity" used to keep closure sets small. */
export function size(a: Ord): number {
  let s = 0
  for (const t of a) s += 1 + (t.k === 'w' ? size(t.e) : size(t.i))
  return s
}
