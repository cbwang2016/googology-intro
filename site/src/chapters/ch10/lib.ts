/* Chapter 10 helper library: hereditarily finite sets, a tiny first-order logic engine,
   quantifier-class computation, the reflection-expression expansion rule (book Thm 9.5),
   and Laver tables. Pure functions only (no React). */

/* ------------------------------------------------------------------ */
/* Hereditarily finite sets via Ackermann coding                       */
/* code(x) = sum of 2^code(y) over y ∈ x; so  y ∈ x  iff bit y of x.   */
/* ------------------------------------------------------------------ */
export const hfIn = (y: number, x: number) => y < 31 && ((x >>> y) & 1) === 1
export const hfMembers = (x: number) => {
  const out: number[] = []
  for (let y = 0; y < 31; y++) if (hfIn(y, x)) out.push(y)
  return out
}
/** von Neumann numeral n as an Ackermann code: 0 → 0, n+1 = n ∪ {n}. */
export function vnCode(n: number): number {
  let c = 0
  for (let k = 0; k < n; k++) c = c | (1 << c)
  return c
}
/** Codes of the von Neumann numerals that fit (code < 2^31). */
export const VN_CODES: number[] = [0, 1, 3, 11]
/** Label a hereditarily finite set; numerals are abbreviated as 0,1,2,3 when `numerals` is on. */
export function hfLabel(x: number, numerals = true): string {
  if (numerals) {
    const k = VN_CODES.indexOf(x)
    if (k >= 0) return String(k)
  } else if (x === 0) return '∅'
  return '{' + hfMembers(x).map((y) => hfLabel(y, numerals)).join(',') + '}'
}
/** |V_k|: 0, 1, 2, 4, 16, 65536, … (V_{k+1} = power set of V_k) */
export const vSize = (k: number) => (k === 0 ? 0 : k === 1 ? 1 : k === 2 ? 2 : k === 3 ? 4 : k === 4 ? 16 : 65536)

/* ------------------------------------------------------------------ */
/* Structures: a domain {0..n-1} with a binary relation E ("∈")         */
/* ------------------------------------------------------------------ */
export type Structure = { size: number; E: (a: number, b: number) => boolean; label: (a: number) => string }

export function vStructure(k: number, numerals = true): Structure {
  const n = vSize(k)
  return { size: n, E: hfIn, label: (a) => hfLabel(a, numerals) }
}
/** The von Neumann ordinal m = {0,…,m-1} as a structure with ∈. */
export function ordinalStructure(m: number): Structure {
  return { size: m, E: (a, b) => a < b, label: (a) => String(a) }
}
export function matrixStructure(names: string[], M: boolean[][]): Structure {
  return { size: names.length, E: (a, b) => M[a][b], label: (a) => names[a] }
}

/* ------------------------------------------------------------------ */
/* Formulas                                                            */
/* ------------------------------------------------------------------ */
export type F =
  | { k: 'in' | 'eq'; a: string; b: string }
  | { k: 'not'; f: F }
  | { k: 'and' | 'or' | 'imp' | 'iff'; l: F; r: F }
  | { k: 'ex' | 'all'; v: string; bd?: string; f: F }

type Tok = { t: string; v?: string }

function tokenize(s: string): Tok[] {
  const out: Tok[] = []
  let i = 0
  const two: Record<string, string> = { '->': '→', '<->': '↔', '!=': '≠', '/\\': '∧', '\\/': '∨' }
  while (i < s.length) {
    const c = s[i]
    if (/\s/.test(c)) {
      i++
      continue
    }
    let hit = false
    for (const k of ['<->', '->', '!=', '/\\', '\\/']) {
      if (s.startsWith(k, i)) {
        out.push({ t: two[k] })
        i += k.length
        hit = true
        break
      }
    }
    if (hit) continue
    if (/[a-zA-Z]/.test(c)) {
      let j = i
      while (j < s.length && /[a-zA-Z0-9_₀-₉]/.test(s[j])) j++
      const w = s.slice(i, j)
      const low = w.toLowerCase()
      if (low === 'exists' || low === 'e') out.push({ t: '∃' })
      else if (low === 'forall' || low === 'a') out.push({ t: '∀' })
      else if (low === 'not') out.push({ t: '¬' })
      else if (low === 'and') out.push({ t: '∧' })
      else if (low === 'or') out.push({ t: '∨' })
      else if (low === 'in') out.push({ t: '∈' })
      else out.push({ t: 'var', v: w.replace(/[₀-₉]/g, (d) => String(d.charCodeAt(0) - 0x2080)) })
      i = j
      continue
    }
    const map: Record<string, string> = { '~': '¬', '!': '¬', '&': '∧', '|': '∨', '^': '∧' }
    const t = map[c] ?? c
    if (!'¬∧∨→↔∃∀∈∉=≠()'.includes(t)) throw new Error(`unexpected “${c}”`)
    out.push({ t })
    i++
  }
  return out
}

export function parseFormula(src: string): F {
  const toks = tokenize(src)
  let p = 0
  const peek = () => toks[p]?.t
  const eat = (t: string) => {
    if (toks[p]?.t !== t) throw new Error(`expected “${t}”${toks[p] ? ` but found “${toks[p].v ?? toks[p].t}”` : ' at the end'}`)
    p++
  }
  const variable = () => {
    const tk = toks[p]
    if (!tk || tk.t !== 'var') throw new Error('expected a variable')
    p++
    return tk.v as string
  }
  const iff = (): F => {
    const l = imp()
    if (peek() === '↔') {
      p++
      return { k: 'iff', l, r: iff() }
    }
    return l
  }
  const imp = (): F => {
    const l = or()
    if (peek() === '→') {
      p++
      return { k: 'imp', l, r: imp() }
    }
    return l
  }
  const or = (): F => {
    let l = and()
    while (peek() === '∨') {
      p++
      l = { k: 'or', l, r: and() }
    }
    return l
  }
  const and = (): F => {
    let l = unary()
    while (peek() === '∧') {
      p++
      l = { k: 'and', l, r: unary() }
    }
    return l
  }
  const unary = (): F => {
    const t = peek()
    if (t === '¬') {
      p++
      return { k: 'not', f: unary() }
    }
    if (t === '∃' || t === '∀') {
      p++
      const v = variable()
      let bd: string | undefined
      if (peek() === '∈') {
        p++
        bd = variable()
      }
      return { k: t === '∃' ? 'ex' : 'all', v, bd, f: unary() }
    }
    if (t === '(') {
      p++
      const f = iff()
      eat(')')
      return f
    }
    const a = variable()
    const op = peek()
    if (op === '∈' || op === '=' || op === '∉' || op === '≠') {
      p++
      const b = variable()
      const at: F = { k: op === '∈' || op === '∉' ? 'in' : 'eq', a, b }
      return op === '∉' || op === '≠' ? { k: 'not', f: at } : at
    }
    throw new Error(op ? `unexpected “${op}”` : 'formula ends too early')
  }
  if (toks.length === 0) throw new Error('empty formula')
  const f = iff()
  if (p < toks.length) throw new Error(`unexpected “${toks[p].v ?? toks[p].t}”`)
  return f
}

/** Pretty-print a variable: x12 → x₁₂ */
export const varTex = (v: string) => v.replace(/[0-9]/g, (d) => String.fromCharCode(0x2080 + Number(d)))

export function show(f: F, ab = true): string {
  const sh = (g: F) => show(g, ab)
  const wrap = (g: F) => (g.k === 'and' || g.k === 'or' || g.k === 'imp' || g.k === 'iff' ? `(${sh(g)})` : sh(g))
  switch (f.k) {
    case 'in':
      return `${varTex(f.a)}∈${varTex(f.b)}`
    case 'eq':
      return `${varTex(f.a)}=${varTex(f.b)}`
    case 'not':
      if (ab && f.f.k === 'in') return `${varTex(f.f.a)}∉${varTex(f.f.b)}`
      if (ab && f.f.k === 'eq') return `${varTex(f.f.a)}≠${varTex(f.f.b)}`
      return `¬${f.f.k === 'in' || f.f.k === 'eq' ? `(${sh(f.f)})` : wrap(f.f)}`
    case 'and':
      return `${wrap(f.l)} ∧ ${wrap(f.r)}`
    case 'or':
      return `${wrap(f.l)} ∨ ${wrap(f.r)}`
    case 'imp':
      return `${wrap(f.l)} → ${wrap(f.r)}`
    case 'iff':
      return `${wrap(f.l)} ↔ ${wrap(f.r)}`
    case 'ex':
    case 'all':
      return `${f.k === 'ex' ? '∃' : '∀'}${varTex(f.v)}${f.bd ? '∈' + varTex(f.bd) : ''}(${sh(f.f)})`
  }
}

/** Rewrite into the primitive language: only ∈, =, ¬, ∧, ∃ (book/Rayo style). */
export function primitive(f: F): F {
  const N = (g: F): F => (g.k === 'not' ? g.f : { k: 'not', f: g })
  switch (f.k) {
    case 'in':
    case 'eq':
      return f
    case 'not':
      return N(primitive(f.f))
    case 'and':
      return { k: 'and', l: primitive(f.l), r: primitive(f.r) }
    case 'or':
      return N({ k: 'and', l: N(primitive(f.l)), r: N(primitive(f.r)) })
    case 'imp':
      return N({ k: 'and', l: primitive(f.l), r: N(primitive(f.r)) })
    case 'iff':
      return { k: 'and', l: primitive({ k: 'imp', l: f.l, r: f.r }), r: primitive({ k: 'imp', l: f.r, r: f.l }) }
    case 'ex': {
      const body = primitive(f.f)
      return { k: 'ex', v: f.v, f: f.bd ? { k: 'and', l: { k: 'in', a: f.v, b: f.bd }, r: body } : body }
    }
    case 'all': {
      const body = N(primitive(f.f))
      return N({ k: 'ex', v: f.v, f: f.bd ? { k: 'and', l: { k: 'in', a: f.v, b: f.bd }, r: body } : body })
    }
  }
}

/** Free variables (a bound-quantifier's bound `∈y` counts y as free unless y is bound outside). */
export function freeVars(f: F, bound: Set<string> = new Set()): string[] {
  const out = new Set<string>()
  const go = (g: F, b: Set<string>) => {
    switch (g.k) {
      case 'in':
      case 'eq':
        if (!b.has(g.a)) out.add(g.a)
        if (!b.has(g.b)) out.add(g.b)
        return
      case 'not':
        return go(g.f, b)
      case 'and':
      case 'or':
      case 'imp':
      case 'iff':
        go(g.l, b)
        go(g.r, b)
        return
      case 'ex':
      case 'all': {
        if (g.bd && !b.has(g.bd)) out.add(g.bd)
        const nb = new Set(b)
        nb.add(g.v)
        go(g.f, nb)
        return
      }
    }
  }
  go(f, bound)
  return [...out].sort((x, y) => x.localeCompare(y, undefined, { numeric: true }))
}

export type Env = Record<string, number>

/** Tarski satisfaction  (S, env) ⊨ f. */
export function sat(S: Structure, f: F, env: Env): boolean {
  switch (f.k) {
    case 'in':
      return S.E(env[f.a], env[f.b])
    case 'eq':
      return env[f.a] === env[f.b]
    case 'not':
      return !sat(S, f.f, env)
    case 'and':
      return sat(S, f.l, env) && sat(S, f.r, env)
    case 'or':
      return sat(S, f.l, env) || sat(S, f.r, env)
    case 'imp':
      return !sat(S, f.l, env) || sat(S, f.r, env)
    case 'iff':
      return sat(S, f.l, env) === sat(S, f.r, env)
    case 'ex':
    case 'all': {
      for (let x = 0; x < S.size; x++) {
        if (f.bd !== undefined && !S.E(x, env[f.bd])) continue
        const r = sat(S, f.f, { ...env, [f.v]: x })
        if (f.k === 'ex' && r) return true
        if (f.k === 'all' && !r) return false
      }
      return f.k === 'all'
    }
  }
}

/** A short human-readable trace of why (S,env) ⊨ f holds or fails. */
export type TraceLine = { depth: number; text: string; ok: boolean }
export function trace(S: Structure, f: F, env: Env, depth = 0, maxDepth = 4): TraceLine[] {
  const ok = sat(S, f, env)
  const val = (v: string) => S.label(env[v])
  const head: TraceLine = { depth, text: show(f), ok }
  if (depth >= maxDepth) return [head]
  switch (f.k) {
    case 'in':
    case 'eq':
      return [{ depth, text: `${show(f)}   [${varTex(f.a)}=${val(f.a)}, ${varTex(f.b)}=${val(f.b)}]`, ok }]
    case 'not':
      return [head, ...trace(S, f.f, env, depth + 1, maxDepth)]
    case 'and': {
      const l = sat(S, f.l, env)
      if (!l) return [head, ...trace(S, f.l, env, depth + 1, maxDepth)]
      const r = sat(S, f.r, env)
      if (!r) return [head, ...trace(S, f.r, env, depth + 1, maxDepth)]
      return [head, ...trace(S, f.l, env, depth + 1, maxDepth), ...trace(S, f.r, env, depth + 1, maxDepth)]
    }
    case 'or': {
      if (sat(S, f.l, env)) return [head, ...trace(S, f.l, env, depth + 1, maxDepth)]
      if (sat(S, f.r, env)) return [head, ...trace(S, f.r, env, depth + 1, maxDepth)]
      return [head, ...trace(S, f.l, env, depth + 1, maxDepth), ...trace(S, f.r, env, depth + 1, maxDepth)]
    }
    case 'imp': {
      if (!sat(S, f.l, env)) return [head, ...trace(S, f.l, env, depth + 1, maxDepth)]
      return [head, ...trace(S, f.r, env, depth + 1, maxDepth)]
    }
    case 'iff':
      return [head, ...trace(S, f.l, env, depth + 1, maxDepth), ...trace(S, f.r, env, depth + 1, maxDepth)]
    case 'ex':
    case 'all': {
      const range: number[] = []
      for (let x = 0; x < S.size; x++) if (f.bd === undefined || S.E(x, env[f.bd])) range.push(x)
      const want = f.k === 'ex'
      const hit = range.find((x) => sat(S, f.f, { ...env, [f.v]: x }) === want)
      if (hit === undefined) {
        return [{ ...head, text: `${show(f)}   ⟵ ${want ? 'no witness / 无见证' : 'every value works / 每个值都成立'}${range.length === 0 ? ' ∅' : ''}` }]
      }
      return [
        { ...head, text: `${show(f)}   ⟵ ${varTex(f.v)} = ${S.label(hit)} ${want ? '(witness / 见证)' : '(counterexample / 反例)'}` },
        ...trace(S, f.f, { ...env, [f.v]: hit }, depth + 1, maxDepth),
      ]
    }
  }
}

/* ------------------------------------------------------------------ */
/* Σn / Πn classification (bounded quantifiers are free)               */
/* s = least n with a Σn form, p = least n with a Πn form              */
/* ------------------------------------------------------------------ */
export function levels(f: F): { s: number; p: number } {
  switch (f.k) {
    case 'in':
    case 'eq':
      return { s: 0, p: 0 }
    case 'not': {
      const x = levels(f.f)
      return { s: x.p, p: x.s }
    }
    case 'and':
    case 'or': {
      const a = levels(f.l)
      const b = levels(f.r)
      return { s: Math.max(a.s, b.s), p: Math.max(a.p, b.p) }
    }
    case 'imp':
      return levels({ k: 'or', l: { k: 'not', f: f.l }, r: f.r })
    case 'iff':
      return levels({ k: 'and', l: { k: 'imp', l: f.l, r: f.r }, r: { k: 'imp', l: f.r, r: f.l } })
    case 'ex': {
      const x = levels(f.f)
      if (f.bd) return x
      const s = Math.max(1, x.s)
      return { s, p: s + 1 }
    }
    case 'all': {
      const x = levels(f.f)
      if (f.bd) return x
      const p = Math.max(1, x.p)
      return { s: p + 1, p }
    }
  }
}
/** Classify a prefix of quantifiers ('∃'|'∀') in front of a Δ0 body. */
export function prefixClass(q: string[]): { kind: 'Δ' | 'Σ' | 'Π'; n: number; blocks: string[][] } {
  const blocks: string[][] = []
  for (const x of q) {
    if (blocks.length && blocks[blocks.length - 1][0] === x) blocks[blocks.length - 1].push(x)
    else blocks.push([x])
  }
  if (!blocks.length) return { kind: 'Δ', n: 0, blocks }
  return { kind: blocks[0][0] === '∃' ? 'Σ' : 'Π', n: blocks.length, blocks }
}

/* ------------------------------------------------------------------ */
/* Reflection expressions and the book's Thm 9.5 expansion rule        */
/* An expression is a list of positive integers, written left to right */
/* with "−" between a ≤ b and a space between a > b.                    */
/* ------------------------------------------------------------------ */
export function reflParse(s: string): number[] {
  const m = s.match(/\d+/g)
  return m ? m.map(Number) : []
}
export function reflShow(t: number[]): string {
  let out = ''
  t.forEach((x, i) => {
    if (i > 0) out += t[i - 1] <= x ? '−' : ' '
    out += String(x)
  })
  return out
}
export type ReflExpansion =
  | { kind: 'rule'; ak: number; pad: 'none' | 'inserted' | 'appended'; one: number[]; two: number[]; approx: (n: number) => number[] }
  | { kind: 'nth'; rest: number[] }
  | { kind: 'empty' }

/** Book Thm 9.5: a_k #1 (a_k − 1) #2  ⇒  (#1 (a_k − 1))^α #2. */
export function reflExpand(t: number[]): ReflExpansion {
  if (t.length === 0) return { kind: 'empty' }
  const ak = t[0]
  if (ak === 1) return { kind: 'nth', rest: t.slice(1) }
  let i = -1
  for (let j = 1; j < t.length; j++)
    if (t[j] < ak) {
      i = j
      break
    }
  let one: number[]
  let two: number[]
  let pad: 'none' | 'inserted' | 'appended'
  if (i === -1) {
    one = t.slice(1)
    two = []
    pad = 'appended'
  } else if (t[i] === ak - 1) {
    one = t.slice(1, i)
    two = t.slice(i + 1)
    pad = 'none'
  } else {
    one = t.slice(1, i)
    two = t.slice(i)
    pad = 'inserted'
  }
  const block = [...one, ak - 1]
  const approx = (n: number) => {
    let r: number[] = []
    for (let c = 0; c < n; c++) r = r.concat(block)
    r = r.concat(two)
    // "X y" with X's last term > y and nothing after: X ∩ Π_y = X, so drop the redundant tail.
    if (two.length === 0 && r.length > 1 && r[r.length - 2] > r[r.length - 1]) r = r.slice(0, -1)
    return r
  }
  return { kind: 'rule', ak, pad, one, two, approx }
}
/** The same rule seen as a primitive sequence: reverse the list. */
export const reflAsSequence = (t: number[]) => [...t].reverse()

/* ------------------------------------------------------------------ */
/* Laver tables A_n on {1,…,2^n}:  a⋆1 = a+1 (mod 2^n),                */
/* a⋆(b⋆c) = (a⋆b)⋆(a⋆c).  Computed bottom-up with                     */
/* row 2^n = identity and a⋆(b+1) = (a⋆b)⋆(a+1).                        */
/* ------------------------------------------------------------------ */
export type Laver = { n: number; N: number; T: Uint16Array; at: (a: number, b: number) => number }
export function laver(n: number): Laver {
  const N = 1 << n
  const T = new Uint16Array((N + 1) * (N + 1))
  const W = N + 1
  for (let b = 1; b <= N; b++) T[N * W + b] = b
  for (let a = N - 1; a >= 1; a--) {
    T[a * W + 1] = a + 1
    for (let b = 1; b < N; b++) T[a * W + b + 1] = T[T[a * W + b] * W + a + 1]
  }
  return { n, N, T, at: (a, b) => T[a * W + b] }
}
/** Period of row a: least p ≥ 1 with a⋆p = 2^n. */
export function rowPeriod(L: Laver, a: number): number {
  let p = 1
  while (L.at(a, p) !== L.N) p++
  return p
}
/** Check left self-distributivity: exhaustive when small, random sample otherwise. */
export function checkLD(L: Laver, samples = 20000): { ok: boolean; checked: number; bad?: [number, number, number] } {
  const N = L.N
  if (N <= 32) {
    let c = 0
    for (let a = 1; a <= N; a++)
      for (let b = 1; b <= N; b++)
        for (let d = 1; d <= N; d++) {
          c++
          if (L.at(a, L.at(b, d)) !== L.at(L.at(a, b), L.at(a, d))) return { ok: false, checked: c, bad: [a, b, d] }
        }
    return { ok: true, checked: c }
  }
  let seed = 12345
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return (seed % N) + 1
  }
  for (let i = 0; i < samples; i++) {
    const a = rnd()
    const b = rnd()
    const d = rnd()
    if (L.at(a, L.at(b, d)) !== L.at(L.at(a, b), L.at(a, d))) return { ok: false, checked: i + 1, bad: [a, b, d] }
  }
  return { ok: true, checked: samples }
}
