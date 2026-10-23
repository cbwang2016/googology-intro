// Bashicu Matrix System (BM4) — exact book rules (《大数理论》 Def. 13.1–13.4, formal 13.39–13.64).
// Port of the verified Python reference in ref/notes/p4.md §1.6.
// A matrix is a list of columns; each column is a list of rows; row 0 is the top row. Everything is 0-indexed.

export type Mat = number[][]

/* ------------------------------------------------------------------ */
/* parsing / printing                                                  */
/* ------------------------------------------------------------------ */
/** Parse "(0,0)(1,1)" — trailing zeros may be dropped, e.g. "(0)(1,1,1)". Returns null if malformed. */
export function parseMat(src: string): Mat | null {
  const s = src.replace(/\s+/g, '')
  if (s === '' || s === '()') return []
  if (!/^(\(\d+(,\d+)*\))+$/.test(s)) return null
  const cols = s
    .slice(1, -1)
    .split(')(')
    .map((c) => c.split(',').map(Number))
  const h = Math.max(...cols.map((c) => c.length))
  if (h > 8 || cols.length > 60) return null
  return cols.map((c) => [...c, ...Array(h - c.length).fill(0)])
}

export function fmtMat(S: Mat, dropZeros = false): string {
  return S.map((c) => {
    let k = c.length
    if (dropZeros) while (k > 1 && c[k - 1] === 0) k--
    return '(' + c.slice(0, k).join(',') + ')'
  }).join('')
}

export const rows = (S: Mat) => (S.length ? S[0].length : 0)
export const eqMat = (a: Mat, b: Mat) => a.length === b.length && a.every((c, i) => c.every((v, j) => v === b[i][j]))

/** Lexicographic comparison (columns compared lexicographically, then by length). By the well-ordering theorem this is the ordinal order on standard matrices. */
export function cmpLex(a: Mat, b: Mat): number {
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) {
    const m = Math.min(a[i].length, b[i].length)
    for (let j = 0; j < m; j++) if (a[i][j] !== b[i][j]) return a[i][j] - b[i][j]
    if (a[i].length !== b[i].length) return a[i].length - b[i].length
  }
  return a.length - b.length
}

/* ------------------------------------------------------------------ */
/* parents                                                             */
/* ------------------------------------------------------------------ */
/**
 * P[y][x] = parent column of entry (x, y), or -1.
 * Row 0: nearest column to the left with a smaller entry.
 * Row y>0: nearest column to the left with a smaller entry in row y whose row-(y-1) entry is an ancestor of (x, y-1).
 */
export function parentTable(S: Mat): number[][] {
  const X = S.length
  const Y = rows(S)
  const P: number[][] = []
  for (let y = 0; y < Y; y++) {
    const row: number[] = []
    for (let x = 0; x < X; x++) {
      let anc: Set<number> | null = null
      if (y > 0) {
        anc = new Set()
        for (let p = P[y - 1][x]; p >= 0; p = P[y - 1][p]) anc.add(p)
      }
      let par = -1
      for (let p = x - 1; p >= 0; p--) {
        if (S[p][y] < S[x][y] && (anc === null || anc.has(p))) {
          par = p
          break
        }
      }
      row.push(par)
    }
    P.push(row)
  }
  return P
}

export function ancestors(P: number[][], x: number, y: number): number[] {
  const out: number[] = []
  for (let p = P[y][x]; p >= 0; p = P[y][p]) out.push(p)
  return out
}

/* ------------------------------------------------------------------ */
/* anatomy of one expansion                                            */
/* ------------------------------------------------------------------ */
export type Anatomy =
  | { kind: 'empty' }
  | { kind: 'succ' }
  | {
      kind: 'limit'
      P: number[][]
      t: number // lowermost nonzero row of the last column
      r: number // bad root column
      delta: number[]
      mask: boolean[][] // mask[x][y] for bad-part column r+x: does it ascend?
    }

export function anatomy(S: Mat): Anatomy {
  if (S.length === 0) return { kind: 'empty' }
  const L = S[S.length - 1]
  const Y = L.length
  if (L.every((v) => v === 0)) return { kind: 'succ' }
  const P = parentTable(S)
  // t = the lowest row in which the last column has a parent. For standard matrices this is exactly the
  // book's "lowermost nonzero entry"; using the parent-based form (as in the arXiv formalisation) keeps
  // nonstandard input from crashing: a last column with no parent at all behaves like a successor.
  let t = -1
  for (let y = 0; y < Y; y++) if (P[y][S.length - 1] >= 0) t = y
  if (t < 0) return { kind: 'succ' }
  const r = P[t][S.length - 1]
  const delta = L.map((v, y) => (y < t ? v - S[r][y] : 0))
  const mask: boolean[][] = []
  for (let x = 0; x < S.length - 1 - r; x++) {
    const m: boolean[] = []
    for (let y = 0; y < Y; y++) m.push(x === 0 || ancestors(P, r + x, y).includes(r))
    mask.push(m)
  }
  return { kind: 'limit', P, t, r, delta, mask }
}

/** One cell of an expansion result, with its provenance (for colouring). */
export type Cell = { v: number; copy: number; lifted: boolean; frozen: boolean; forced: boolean }

/**
 * S[n]: G B(0) B(1) … B(n). With rule=false, the special rule is switched off (every bad-part entry ascends).
 * copy = -1 for the good part; lifted = this entry received +aΔ; frozen = kept still by the special rule;
 * forced = lifted only because the special rule is off.
 */
export function expandCells(S: Mat, n: number, rule = true): Cell[][] {
  const a = anatomy(S)
  if (a.kind === 'empty') return []
  if (a.kind === 'succ') return S.slice(0, -1).map((c) => c.map((v) => ({ v, copy: -1, lifted: false, frozen: false, forced: false })))
  const { r, delta, mask } = a
  const out: Cell[][] = S.slice(0, r).map((c) => c.map((v) => ({ v, copy: -1, lifted: false, frozen: false, forced: false })))
  const B = S.slice(r, -1)
  for (let k = 0; k <= n; k++)
    B.forEach((c, x) =>
      out.push(
        c.map((v, y) => {
          const asc = !rule || mask[x][y]
          const add = asc ? k * delta[y] : 0
          const blocked = !mask[x][y] && k > 0 && delta[y] > 0
          return { v: v + add, copy: k, lifted: add > 0, frozen: rule && blocked, forced: !rule && blocked }
        }),
      ),
    )
  return out
}

export function expand(S: Mat, n: number, rule = true): Mat {
  return expandCells(S, n, rule).map((c) => c.map((e) => e.v))
}

/* ------------------------------------------------------------------ */
/* PSS hydra  <->  2-row BMS                                           */
/* ------------------------------------------------------------------ */
// Column (d, s) is the term p_{s+1} sitting at bracket depth d; its enclosing term is its row-0 parent.
export function bmsToPss(S: Mat): string | null {
  if (S.length === 0) return '0'
  if (rows(S) > 2) {
    if (S.some((c) => c.slice(2).some((v) => v !== 0))) return null
  }
  const P = parentTable(S)
  const kids: number[][] = S.map(() => [])
  const tops: number[] = []
  S.forEach((_, x) => (P[0][x] < 0 ? tops.push(x) : kids[P[0][x]].push(x)))
  const term = (x: number): string => {
    const s = (S[x][1] ?? 0) + 1
    return kids[x].length ? `p_{${s}}(${kids[x].map(term).join('+')})` : `p_{${s}}`
  }
  // depth must step by exactly one for a faithful translation
  for (let x = 0; x < S.length; x++) {
    const p = P[0][x]
    if ((p < 0 && S[x][0] !== 0) || (p >= 0 && S[x][0] !== S[p][0] + 1)) return null
  }
  return tops.map(term).join('+')
}

/** Parse "p1(p2(p3)+p2)" (also accepts p_1, ψ, and spaces). */
export function pssToBms(src: string): Mat | null {
  const s = src.replace(/[\s_{}]/g, '').replace(/ψ/g, 'p')
  let i = 0
  const out: Mat = []
  const sum = (d: number): boolean => {
    for (;;) {
      if (s[i] !== 'p') return false
      i++
      const m = /^\d+/.exec(s.slice(i))
      if (!m) return false
      i += m[0].length
      const k = Number(m[0])
      if (k < 1) return false
      out.push([d, k - 1])
      if (s[i] === '(') {
        i++
        if (s[i] === '0' && s[i + 1] === ')') i += 1
        else if (!sum(d + 1)) return false
        if (s[i] !== ')') return false
        i++
      }
      if (s[i] === '+') {
        i++
        continue
      }
      return true
    }
  }
  if (!sum(0) || i !== s.length || out.length > 40) return null
  return out
}

/* ------------------------------------------------------------------ */
/* BMS -> 0-Y mountain (book §14.3, p.486–489)                         */
/* ------------------------------------------------------------------ */
/** V[y][x] for y = 0..Y (row Y is the extra all-1 layer). Row 0 is the 0-Y sequence. */
export function zeroY(S: Mat): number[][] {
  const Y = rows(S)
  const P = parentTable(S)
  const V: number[][] = Array.from({ length: Y + 1 }, () => Array(S.length).fill(1))
  for (let y = Y - 1; y >= 0; y--)
    for (let x = 0; x < S.length; x++) V[y][x] = S[x][y] === 0 ? 1 : V[y + 1][x] + V[y][P[y][x]]
  return V
}

/* ------------------------------------------------------------------ */
/* the infinite descending chain without the special rule (§13.10)     */
/* ------------------------------------------------------------------ */
const CHAIN_G = '(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)'
/** A_0 = book 13.1776, A_1 = 13.1779, … each A_{k+1} reached from A_k by fundamental-sequence steps when the rule is off. */
export function chainA(k: number): Mat {
  let s = CHAIN_G
  for (let j = 0; j < k; j++) s += `(${j + 2},${j + 2},0)(${j + 3},${j + 3},1)(${j + 4},1,0)`
  s += `(${k + 2},${k + 2},1)`
  return parseMat(s)!
}

/** Find a path of FS steps S → S[n₁] → … → target (n=0 deletes the last column). Returns the list of n's, or null. */
export function reach(src: Mat, tgt: Mat, rule: boolean): number[] | null {
  const path: number[] = []
  const go = (s: Mat, depth: number): boolean => {
    if (eqMat(s, tgt)) return true
    if (depth > 2000 || s.length === 0) return false
    let i = 0
    while (i < s.length && i < tgt.length && s[i].every((v, j) => v === tgt[i][j])) i++
    if (i === s.length) return false
    if (i < s.length - 1) {
      path.push(0)
      if (go(s.slice(0, -1), depth + 1)) return true
      path.pop()
      return false
    }
    for (let n = 1; n <= 4; n++) {
      const t = expand(s, n, rule)
      if (cmpLex(t, tgt) >= 0) {
        path.push(n)
        if (go(t, depth + 1)) return true
        path.pop()
      }
    }
    return false
  }
  return go(src, 0) ? path : null
}

/* ------------------------------------------------------------------ */
/* values                                                              */
/* ------------------------------------------------------------------ */
/** Exact CNF of a 1-row (PrSS) matrix, as TeX. Returns null if not a valid 1-row standard shape. */
export function prssTex(seq: number[]): string | null {
  if (seq.length === 0) return '0'
  if (seq[0] !== 0) return null
  for (let i = 1; i < seq.length; i++) if (seq[i] > seq[i - 1] + 1) return null
  // split into top-level blocks starting at each 0; each block 0,(children+1) = ω^{value(children)}
  type T = { e: string; count: number }
  const terms: T[] = []
  let i = 0
  const blocks: number[][] = []
  while (i < seq.length) {
    let j = i + 1
    while (j < seq.length && seq[j] > 0) j++
    blocks.push(seq.slice(i + 1, j).map((v) => v - 1))
    i = j
  }
  for (const b of blocks) {
    const inner = prssTex(b)!
    const e = inner
    const last = terms[terms.length - 1]
    if (last && last.e === e) last.count++
    else terms.push({ e, count: 1 })
  }
  // collapse ω^0 = 1, ω^1 = ω
  const pow = (e: string) => (e === '0' ? '1' : e === '1' ? '\\omega' : `\\omega^{${e}}`)
  return terms
    .map(({ e, count }) => {
      if (e === '0') return String(count)
      return count > 1 ? `${pow(e)}\\cdot${count}` : pow(e)
    })
    .join('+')
}

/** Known values (book tables, MOCF = Madore's ψ). Keys are fmtMat with zero-padding to the stated rows. */
const KNOWN: Record<string, { tex: string }> = {
  '(0,0)(1,1)': { tex: '\\varepsilon_0' },
  '(0,0)(1,1)(1,0)': { tex: '\\varepsilon_0\\cdot\\omega' },
  '(0,0)(1,1)(1,0)(2,1)': { tex: '\\varepsilon_0^2' },
  '(0,0)(1,1)(1,1)': { tex: '\\varepsilon_1' },
  '(0,0)(1,1)(1,1)(1,1)': { tex: '\\varepsilon_2' },
  '(0,0)(1,1)(2,0)': { tex: '\\varepsilon_\\omega' },
  '(0,0)(1,1)(2,0)(3,1)': { tex: '\\varepsilon_{\\varepsilon_0}' },
  '(0,0)(1,1)(2,1)': { tex: '\\zeta_0=\\psi(\\Omega)' },
  '(0,0)(1,1)(2,1)(1,1)(2,1)': { tex: '\\zeta_1' },
  '(0,0)(1,1)(2,1)(2,0)': { tex: '\\zeta_\\omega' },
  '(0,0)(1,1)(2,1)(2,1)': { tex: '\\eta_0=\\psi(\\Omega^2)' },
  '(0,0)(1,1)(2,1)(3,0)': { tex: '\\varphi(\\omega,0)' },
  '(0,0)(1,1)(2,1)(3,1)': { tex: '\\Gamma_0=\\psi(\\Omega^\\Omega)' },
  '(0,0)(1,1)(2,1)(3,1)(2,0)': { tex: '\\Gamma_\\omega' },
  '(0,0)(1,1)(2,1)(3,1)(3,1)': { tex: '\\varphi(1,0,0,0)' },
  '(0,0)(1,1)(2,1)(3,1)(4,0)': { tex: '\\text{SVO}=\\psi(\\Omega^{\\Omega^\\omega})' },
  '(0,0)(1,1)(2,1)(3,1)(4,1)': { tex: '\\text{LVO}=\\psi(\\Omega^{\\Omega^\\Omega})' },
  '(0,0)(1,1)(2,1)(3,1)(4,1)(5,1)': { tex: '\\psi(\\Omega^{\\Omega^{\\Omega^\\Omega}})' },
  '(0,0)(1,1)(2,1)(3,1)(4,1)(5,1)(6,1)': { tex: '\\psi(\\Omega^{\\Omega^{\\Omega^{\\Omega^\\Omega}}})' },
  '(0,0)(1,1)(2,2)': { tex: '\\text{BHO}=\\psi(\\varepsilon_{\\Omega+1})' },
  '(0,0)(1,1)(2,2)(1,1)': { tex: '\\psi(\\psi_1(0)+1)' },
  '(0,0)(1,1)(2,2)(2,1)': { tex: '\\psi(\\psi_1(0)\\cdot\\Omega)' },
  '(0,0)(1,1)(2,2)(2,2)': { tex: '\\psi(\\psi_1(1))' },
  '(0,0)(1,1)(2,2)(3,1)': { tex: '\\psi(\\psi_1(\\Omega))' },
  '(0,0)(1,1)(2,2)(3,2)': { tex: '\\psi(\\Omega_2)' },
  '(0,0)(1,1)(2,2)(3,3)': { tex: '\\psi(\\psi_2(0))' },
  '(0,0)(1,1)(2,2)(3,3)(4,4)': { tex: '\\psi(\\psi_3(0))' },
  '(0,0)(1,1)(2,2)(3,3)(4,4)(5,5)': { tex: '\\psi(\\psi_4(0))' },
  '(0,0,0)(1,1,1)': { tex: '\\text{BO}=\\psi(\\Omega_\\omega)' },
  '(0,0,0)(1,1,1)(1,1,1)': { tex: '\\psi(\\Omega_\\omega\\cdot2)' },
  '(0,0,0)(1,1,1)(2,1,0)': { tex: '\\psi(\\Omega_\\omega\\cdot\\Omega)' },
  '(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)(2,2,1)': { tex: '\\psi(\\Omega_\\omega\\cdot\\Omega+\\Omega_\\omega)' },
  '(0,0,0)(1,1,1)(2,1,0)(3,2,0)': { tex: '\\text{TFBO}' },
  '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,0,0)': { tex: '\\text{EBO}' },
  '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,0)': { tex: '\\text{JO}' },
  '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,0)(4,2,0)': { tex: '\\text{SRO}' },
  '(0,0,0)(1,1,1)(2,2,0)': { tex: '\\text{SSO}' },
  '(0,0,0)(1,1,1)(2,2,2)': { tex: '\\text{LRO}' },
  '(0,0,0,0)(1,1,1,1)': { tex: '\\text{TSSO}' },
  '(0,0,0,0,0)(1,1,1,1,1)': { tex: '\\text{QSSO}' },
}

/** Strip all-zero trailing rows so that (0,0)(1,0)(2,0) is recognised as 1-row. */
export function trimRows(S: Mat): Mat {
  let h = rows(S)
  while (h > 1 && S.every((c) => c[h - 1] === 0)) h--
  return S.map((c) => c.slice(0, h))
}

/** Necessary conditions for standardness (book Thm 13.1). Returns a list of violated condition numbers. */
export function standardIssues(S: Mat): number[] {
  const out = new Set<number>()
  if (S.length === 0) return []
  if (S[0].some((v) => v !== 0)) out.add(1)
  S.forEach((c) => c.forEach((v, y) => y > 0 && v > c[y - 1] && out.add(2)))
  const P = parentTable(S)
  S.forEach((c, x) => c.forEach((v, y) => v > 0 && (P[y][x] < 0 || v > S[P[y][x]][y] + 1) && out.add(3)))
  return [...out].sort()
}

/** TeX of the value if we know it (exact for 1-row; from the book's tables otherwise). */
export function valueTex(S: Mat): string | null {
  if (S.length === 0) return '0'
  const T = trimRows(S)
  if (rows(T) === 1) return prssTex(T.map((c) => c[0]))
  // successor: strip trailing zero columns
  let k = T.length
  while (k > 0 && T[k - 1].every((v) => v === 0)) k--
  const plus = T.length - k
  const core = T.slice(0, k)
  const hit = KNOWN[fmtMat(trimRows(core))]
  if (!hit) return null
  return plus ? `${hit.tex}+${plus}` : hit.tex
}
