/**
 * Chapter 13 helpers: a tiny first-order language of set theory (∈, =, ¬, ∧, ∃),
 * Rayo's symbol count, and evaluation over the hereditarily finite sets V_k.
 *
 * Hereditarily finite sets are coded by Ackermann's bijection: the set with code m
 * has as elements exactly the sets whose codes are the 1-bits of m.
 *   0 = ∅, 1 = {∅}, 2 = {{∅}}, 3 = {∅,{∅}}, …   V_k = {0, 1, …, 2↑↑k − 1}.
 */

export type F =
  | { k: 'in'; i: number; j: number }
  | { k: 'eq'; i: number; j: number }
  | { k: 'not'; a: F }
  | { k: 'and'; a: F; b: F }
  | { k: 'ex'; v: number; a: F }

/* ------------------------------------------------------------------ */
/* Length (book eq. 27.15–27.16)                                       */
/* ------------------------------------------------------------------ */
export function len(f: F): number {
  switch (f.k) {
    case 'in':
    case 'eq':
      return 3
    case 'not':
      return len(f.a) + 3
    case 'and':
      return len(f.a) + len(f.b) + 3
    case 'ex':
      return len(f.a) + 4
  }
}

export function depth(f: F): number {
  switch (f.k) {
    case 'in':
    case 'eq':
      return 0
    case 'not':
      return depth(f.a)
    case 'and':
      return Math.max(depth(f.a), depth(f.b))
    case 'ex':
      return depth(f.a) + 1
  }
}

export function freeVars(f: F): Set<number> {
  switch (f.k) {
    case 'in':
    case 'eq':
      return new Set([f.i, f.j])
    case 'not':
      return freeVars(f.a)
    case 'and':
      return new Set([...freeVars(f.a), ...freeVars(f.b)])
    case 'ex': {
      const s = freeVars(f.a)
      s.delete(f.v)
      return s
    }
  }
}

const SUB = '₀₁₂₃₄₅₆₇₈₉'
export const sub = (n: number) => String(n).split('').map((d) => SUB[Number(d)]).join('')
export const vname = (i: number) => `x${sub(i)}`

/** Canonical string with full parentheses, exactly as the length convention counts it. */
export function show(f: F): string {
  switch (f.k) {
    case 'in':
      return `${vname(f.i)}∈${vname(f.j)}`
    case 'eq':
      return `${vname(f.i)}=${vname(f.j)}`
    case 'not':
      return `(¬${show(f.a)})`
    case 'and':
      return `(${show(f.a)}∧${show(f.b)})`
    case 'ex':
      return `∃${vname(f.v)}(${show(f.a)})`
  }
}

/** The canonical formula as a list of symbols (a variable is one symbol). Its length equals len(f). */
export function tiles(f: F): string[] {
  switch (f.k) {
    case 'in':
      return [vname(f.i), '∈', vname(f.j)]
    case 'eq':
      return [vname(f.i), '=', vname(f.j)]
    case 'not':
      return ['(', '¬', ...tiles(f.a), ')']
    case 'and':
      return ['(', ...tiles(f.a), '∧', ...tiles(f.b), ')']
    case 'ex':
      return ['∃', vname(f.v), '(', ...tiles(f.a), ')']
  }
}

/* ------------------------------------------------------------------ */
/* Parser (with abbreviations that expand into the five primitives)    */
/* ------------------------------------------------------------------ */
type Tok =
  | { t: 'var'; v: number }
  | { t: 'op'; o: 'not' | 'and' | 'or' | 'imp' | 'iff' | 'ex' | 'all' | 'in' | 'nin' | 'eq' | 'neq' | '(' | ')' }

export type ParseResult = { ok: true; f: F; sugar: string[] } | { ok: false; err: { en: string; zh: string } }

const SUBDIG: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' }

function lex(s: string): Tok[] | { en: string; zh: string } {
  const out: Tok[] = []
  let i = 0
  type OpName = Extract<Tok, { t: 'op' }>['o']
  const sym: [string, OpName][] = [
    ['<->', 'iff'], ['↔', 'iff'], ['->', 'imp'], ['=>', 'imp'], ['→', 'imp'], ['!=', 'neq'], ['≠', 'neq'], ['∉', 'nin'],
    ['&&', 'and'], ['/\\', 'and'], ['∧', 'and'], ['&', 'and'], ['||', 'or'], ['\\/', 'or'], ['∨', 'or'], ['|', 'or'],
    ['¬', 'not'], ['~', 'not'], ['!', 'not'], ['∃', 'ex'], ['∀', 'all'], ['∈', 'in'], ['=', 'eq'], ['(', '('], [')', ')'],
  ]
  outer: while (i < s.length) {
    const c = s[i]
    if (/\s/.test(c) || c === ',' || c === '.' || c === ':') {
      i++
      continue
    }
    for (const [k, o] of sym) {
      if (s.startsWith(k, i)) {
        out.push({ t: 'op', o })
        i += k.length
        continue outer
      }
    }
    if (c === 'E' || c === 'A') {
      out.push({ t: 'op', o: c === 'E' ? 'ex' : 'all' })
      i++
      continue
    }
    const m = /^[a-z]+(?:_?[0-9₀-₉]+)?/.exec(s.slice(i))
    if (m) {
      const w = m[0]
      i += w.length
      const kw: Record<string, Tok> = {
        not: { t: 'op', o: 'not' }, and: { t: 'op', o: 'and' }, or: { t: 'op', o: 'or' }, implies: { t: 'op', o: 'imp' },
        iff: { t: 'op', o: 'iff' }, exists: { t: 'op', o: 'ex' }, forall: { t: 'op', o: 'all' }, in: { t: 'op', o: 'in' },
        notin: { t: 'op', o: 'nin' },
      }
      if (kw[w]) {
        out.push(kw[w])
        continue
      }
      const xm = /^x_?([0-9₀-₉]+)$/.exec(w)
      if (xm) {
        const n = Number(xm[1].split('').map((d) => SUBDIG[d] ?? d).join(''))
        if (n < 1 || n > 20) return { en: `variable ${w}: use x1 … x20`, zh: `变量 ${w}：请使用 x1 … x20` }
        out.push({ t: 'var', v: n })
        continue
      }
      if (w.length === 1 && w !== 'x') {
        out.push({ t: 'var', v: w.charCodeAt(0) - 96 })
        continue
      }
      return { en: `unknown word “${w}”`, zh: `不认识的词“${w}”` }
    }
    return { en: `unexpected symbol “${c}”`, zh: `无法识别的符号“${c}”` }
  }
  return out
}

export function parse(src: string): ParseResult {
  const toks = lex(src)
  if (!Array.isArray(toks)) return { ok: false, err: toks }
  if (toks.length === 0) return { ok: false, err: { en: 'type a formula', zh: '请输入一个公式' } }
  let p = 0
  const sugar = new Set<string>()
  const peek = () => toks[p]
  const isOp = (o: string) => {
    const t = toks[p]
    return t && t.t === 'op' && t.o === o
  }
  const fail = (en: string, zh: string): never => {
    throw { en, zh }
  }
  const NOT = (a: F): F => ({ k: 'not', a })
  const AND = (a: F, b: F): F => ({ k: 'and', a, b })
  const IMP = (a: F, b: F): F => NOT(AND(a, NOT(b)))
  function iff(): F {
    const a = imp()
    if (isOp('iff')) {
      p++
      sugar.add('↔')
      const b = iff()
      return AND(IMP(a, b), IMP(b, a))
    }
    return a
  }
  function imp(): F {
    const a = or()
    if (isOp('imp')) {
      p++
      sugar.add('→')
      return IMP(a, imp())
    }
    return a
  }
  function or(): F {
    let a = and()
    while (isOp('or')) {
      p++
      sugar.add('∨')
      const b = and()
      a = NOT(AND(NOT(a), NOT(b)))
    }
    return a
  }
  function and(): F {
    let a = unary()
    while (isOp('and')) {
      p++
      a = AND(a, unary())
    }
    return a
  }
  function variable(): number {
    const t = peek()
    if (!t || t.t !== 'var') return fail('expected a variable', '这里应当是一个变量')
    p++
    return t.v
  }
  function unary(): F {
    const t = peek()
    if (!t) return fail('formula ends too early', '公式提前结束了')
    if (t.t === 'op') {
      if (t.o === 'not') {
        p++
        return NOT(unary())
      }
      if (t.o === 'ex' || t.o === 'all') {
        p++
        const v = variable()
        const body = unary()
        if (t.o === 'ex') return { k: 'ex', v, a: body }
        sugar.add('∀')
        return NOT({ k: 'ex', v, a: NOT(body) })
      }
      if (t.o === '(') {
        p++
        const f = iff()
        if (!isOp(')')) fail('missing “)”', '缺少右括号“)”')
        p++
        return f
      }
      return fail('unexpected operator', '运算符的位置不对')
    }
    const i = variable()
    const o = peek()
    if (!o || o.t !== 'op' || !['in', 'nin', 'eq', 'neq'].includes(o.o)) return fail('expected ∈ or = after a variable', '变量后面应当是 ∈ 或 =')
    p++
    const j = variable()
    const op = (o as { o: string }).o
    if (op === 'in') return { k: 'in', i, j }
    if (op === 'eq') return { k: 'eq', i, j }
    sugar.add(op === 'nin' ? '∉' : '≠')
    return NOT({ k: op === 'nin' ? 'in' : 'eq', i, j })
  }
  try {
    const f = iff()
    if (p < toks.length) fail('extra symbols at the end', '末尾有多余的符号')
    return { ok: true, f, sugar: [...sugar] }
  } catch (e) {
    return { ok: false, err: e as { en: string; zh: string } }
  }
}

/* ------------------------------------------------------------------ */
/* Hereditarily finite sets                                            */
/* ------------------------------------------------------------------ */
/** |V_0| = 0 and |V_{k+1}| = 2^|V_k|: 0, 1, 2, 4, 16, 65536. */
export const V_SIZE = [0, 1, 2, 4, 16, 65536]

/** x ∈ y for Ackermann codes (both below 65536). */
export const mem = (x: number, y: number) => x < 16 && ((y >> x) & 1) === 1

export function members(y: number): number[] {
  const r: number[] = []
  for (let x = 0; x < 16; x++) if (mem(x, y)) r.push(x)
  return r
}

/** Rank: least k with the set in V_k, minus one. */
export function rank(y: number): number {
  if (y === 0) return 0
  return Math.max(...members(y).map(rank)) + 1
}

export function braces(y: number): string {
  if (y === 0) return '∅'
  return '{' + members(y).map(braces).join(',') + '}'
}

/** von Neumann naturals 0,1,2,3,4 have codes 0,1,3,11,2059. */
export const NAT_CODE = [0, 1, 3, 11, 2059]
export const natOf = (code: number) => {
  const i = NAT_CODE.indexOf(code)
  return i < 0 ? null : i
}

export class TooExpensive extends Error {}

/** All codes in V_k satisfying f with x1 := code; other free variables are not allowed. */
export function satisfiers(f: F, k: number, budget = 4_000_000): number[] {
  const D = V_SIZE[k]
  const env = new Array<number>(21).fill(0)
  let steps = 0
  const ev = (g: F): boolean => {
    if (++steps > budget) throw new TooExpensive()
    switch (g.k) {
      case 'in':
        return mem(env[g.i], env[g.j])
      case 'eq':
        return env[g.i] === env[g.j]
      case 'not':
        return !ev(g.a)
      case 'and':
        return ev(g.a) && ev(g.b)
      case 'ex': {
        const old = env[g.v]
        for (let x = 0; x < D; x++) {
          env[g.v] = x
          if (ev(g.a)) {
            env[g.v] = old
            return true
          }
        }
        env[g.v] = old
        return false
      }
    }
  }
  const out: number[] = []
  for (let x = 0; x < D; x++) {
    env.fill(0)
    env[1] = x
    if (ev(f)) out.push(x)
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Exhaustive search over tiny formulas (variables x1, x2, x3)          */
/* ------------------------------------------------------------------ */
export type SearchRow = { L: number; total: number; onlyX1: number; namers: { f: string; v3: number; v4: number[] }[] }

export function exhaustive(maxL: number, V = 3): SearchRow[] {
  const byLen: F[][] = Array.from({ length: maxL + 1 }, () => [])
  for (let i = 1; i <= V; i++)
    for (let j = 1; j <= V; j++) {
      byLen[3].push({ k: 'in', i, j })
      byLen[3].push({ k: 'eq', i, j })
    }
  for (let L = 4; L <= maxL; L++) {
    for (const a of byLen[L - 3]) byLen[L].push({ k: 'not', a })
    if (L >= 7) for (const a of byLen[L - 4]) for (let v = 1; v <= V; v++) byLen[L].push({ k: 'ex', v, a })
    for (let l1 = 3; l1 <= L - 6; l1++) for (const a of byLen[l1]) for (const b of byLen[L - 3 - l1]) byLen[L].push({ k: 'and', a, b })
  }
  const rows: SearchRow[] = []
  for (let L = 1; L <= maxL; L++) {
    let onlyX1 = 0
    const namers: SearchRow['namers'] = []
    for (const f of byLen[L]) {
      const fv = freeVars(f)
      if (!(fv.size === 1 && fv.has(1))) continue
      onlyX1++
      const s3 = satisfiers(f, 3)
      if (s3.length === 1) namers.push({ f: show(f), v3: s3[0], v4: satisfiers(f, 4) })
    }
    rows.push({ L, total: byLen[L].length, onlyX1, namers })
  }
  return rows
}
