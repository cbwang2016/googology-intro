/**
 * Fast-growing hierarchy below ε₀ (plus ε₀ itself), with the standard fundamental
 * sequences of book Def 3.6 and ε₀[n] = ω↑↑n.  Pure TS, testable with node.
 */
import * as O from '../ch03/ordinal'
import { addSmall, fromNum, mul, mulConst, powConst, type Huge } from '../../lib/huge'

/** An index: an ordinal below ε₀ in CNF, or ε₀ itself. */
export type Idx = O.Ord | 'e0'

export const idxTex = (a: Idx) => (a === 'e0' ? '\\varepsilon_0' : O.tex(a))
export const isLim = (a: Idx) => a === 'e0' || O.isLimit(a)
export const fsIdx = (a: Idx, n: number): O.Ord => (a === 'e0' ? O.omegaTower(n) : O.fs(a, n))

export function parseIdx(s: string): Idx {
  const t = s.trim().toLowerCase()
  if (t === 'e0' || t === 'ε0' || t === 'ε₀' || t === 'epsilon0') return 'e0'
  return O.parse(s)
}

/* ------------------------------------------------------------------ */
/* Exact evaluation (BigInt) with budgets                              */
/* ------------------------------------------------------------------ */
export class TooBig extends Error {}
const MAX_BITS = 40000n

function f2(x: bigint): bigint {
  if (x > MAX_BITS) throw new TooBig()
  return x * (1n << x)
}

/** f_α(n) exactly, or throws TooBig. */
export function fExact(a: Idx, n: bigint, budget = { steps: 3000 }): bigint {
  if (--budget.steps < 0) throw new TooBig()
  if (a !== 'e0' && O.isNat(a)) {
    const m = O.natVal(a)
    if (m === 0) return n + 1n
    if (m === 1) return 2n * n
    if (m === 2) return f2(n)
  }
  if (isLim(a)) {
    if (n > 60n) throw new TooBig()
    return fExact(fsIdx(a, Number(n)), n, budget)
  }
  const b = O.pred(a as O.Ord)
  if (n > 100000n) throw new TooBig()
  let x = n
  for (let i = 0n; i < n; i++) x = fExact(b, x, budget)
  return x
}

/** f_α(n) as a Huge (top-of-tower precision), or null if out of reach. */
export function fHuge(a: Idx, n: Huge, budget = { steps: 3000 }): Huge | null {
  if (--budget.steps < 0) return null
  if (a !== 'e0' && O.isNat(a)) {
    const m = O.natVal(a)
    if (m === 0) return addSmall(n, 1)
    if (m === 1) return mulConst(n, 2)
    if (m === 2) return mul(n, powConst(2, n))
  }
  const small = n.h === 0 && n.x <= 5000 && Number.isInteger(n.x) ? n.x : null
  if (small === null) return null
  if (isLim(a)) return fHuge(fsIdx(a, small), n, budget)
  const b = O.pred(a as O.Ord)
  let x: Huge | null = n
  for (let i = 0; i < small; i++) {
    x = fHuge(b, x, budget)
    if (x === null) return null
  }
  return x
}

export type FVal = { kind: 'exact'; v: bigint } | { kind: 'approx'; v: Huge } | { kind: 'none' }
export function fValue(a: Idx, n: number): FVal {
  try {
    return { kind: 'exact', v: fExact(a, BigInt(n)) }
  } catch {
    /* fall through */
  }
  const h = fHuge(a, fromNum(n))
  return h ? { kind: 'approx', v: h } : { kind: 'none' }
}

/* ------------------------------------------------------------------ */
/* The unfolding machine: f_{a1}^{k1}( f_{a2}^{k2}( … (x) ) )           */
/* ------------------------------------------------------------------ */
export type Frame = { a: Idx; k: bigint }
export type MState = { stack: Frame[]; x: bigint }
export type Rule = 'zero' | 'succ' | 'lim' | 'f0k' | 'f1' | 'f2' | 'done' | 'stuck'

/** One literal rule application on the innermost frame. */
export function mStep(s: MState, shortcuts: boolean): { s: MState; rule: Rule } {
  const stack = s.stack.filter((f) => f.k > 0n)
  if (stack.length === 0) return { s: { stack, x: s.x }, rule: 'done' }
  const top = stack[stack.length - 1]
  const rest = stack.slice(0, -1)
  const dec = (f: Frame): Frame[] => (f.k > 1n ? [{ a: f.a, k: f.k - 1n }] : [])
  const a = top.a
  if (a !== 'e0' && O.isZero(a)) {
    if (shortcuts) return { s: { stack: rest, x: s.x + top.k }, rule: 'f0k' }
    return { s: { stack: [...rest, ...dec(top)], x: s.x + 1n }, rule: 'zero' }
  }
  if (shortcuts && a !== 'e0' && O.isNat(a) && O.natVal(a) <= 2) {
    const m = O.natVal(a)
    if (m === 1) {
      if (top.k > 100000n) return { s, rule: 'stuck' }
      return { s: { stack: rest, x: s.x << top.k }, rule: 'f1' }
    }
    if (s.x > MAX_BITS) return { s, rule: 'stuck' }
    return { s: { stack: [...rest, ...dec(top)], x: s.x * (1n << s.x) }, rule: 'f2' }
  }
  if (isLim(a)) {
    if (s.x > 1000000n) return { s, rule: 'stuck' }
    return { s: { stack: [...rest, ...dec(top), { a: fsIdx(a, Number(s.x)), k: 1n }], x: s.x }, rule: 'lim' }
  }
  // successor β+1: f_{β+1}(x) = f_β^x(x)
  return { s: { stack: [...rest, ...dec(top), { a: O.pred(a as O.Ord), k: s.x }], x: s.x }, rule: 'succ' }
}

export const commas = (v: bigint) => {
  const s = v.toString()
  if (s.length > 24) return `\\underbrace{${s.slice(0, 6)}\\cdots${s.slice(-4)}}_{${s.length}\\text{ digits}}`
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, '{,}')
}

export function mTex(s: MState): string {
  const fr = s.stack.filter((f) => f.k > 0n)
  let out = commas(s.x)
  for (let i = fr.length - 1; i >= 0; i--) {
    const f = fr[i]
    const pw = f.k === 1n ? '' : `^{${f.k.toString().length > 12 ? `[${f.k.toString().length}\\text{-digit}]` : f.k.toString()}}`
    out = `f_{${idxTex(f.a)}}${pw}(${out})`
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Hardy hierarchy machine: (α, n) → successor (α−1, n+1); limit (α[n], n) */
/* ------------------------------------------------------------------ */
export function hardyStep(a: O.Ord, n: number): [O.Ord, number] {
  if (O.isLimit(a)) return [O.fs(a, n), n]
  return [O.pred(a), n + 1]
}

/* ------------------------------------------------------------------ */
/* "Tower height" of a number: slog₁₀ with the linear approximation     */
/* ------------------------------------------------------------------ */
function slogNum(x: number): number {
  let h = 0
  while (x > 1) {
    x = Math.log10(x)
    h++
  }
  return h + x - 1 + 1 // linear piece on [0,1]
}
export function slogHuge(v: Huge): number {
  return v.h + slogNum(v.x)
}
export function slogBig(v: bigint): number {
  const s = v.toString()
  if (s.length < 300) return slogNum(Number(v))
  return 1 + slogNum(s.length - 1 + Math.log10(Number(s.slice(0, 15)) / 1e14))
}
