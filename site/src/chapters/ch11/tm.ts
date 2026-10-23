/* Turing-machine engine shared by Chapter 11 and Chapter 12.
 * Conventions (book §25.3, also bbchallenge): two-way infinite tape of 0/1, start in state A on an
 * all-0 tape, every transition (including the halting one) counts as one step.
 * Standard text format: rows A0 A1 _ B0 B1 _ …, each entry "write move next", e.g. 1RB1LB_1LA1RZ.
 * Halting state: Z (also written H). "---" = undefined transition; reaching one is treated exactly
 * like the halting transition 1RZ (this is how Tree Normal Form fills it in). */

export type Trans = { w: 0 | 1; m: -1 | 1; s: number } // s = -1 means halt
export type Machine = { n: number; t: (Trans | null)[][] } // t[state][symbol]

export const HALT = -1
export const stateName = (s: number) => (s < 0 ? 'Z' : String.fromCharCode(65 + s))

export function transText(tr: Trans | null): string {
  if (!tr) return '---'
  return `${tr.w}${tr.m < 0 ? 'L' : 'R'}${stateName(tr.s)}`
}

export function parseTM(code: string): Machine | null {
  const rows = code.trim().split('_')
  const n = rows.length
  if (n < 1 || n > 8) return null
  const t: (Trans | null)[][] = []
  for (const r of rows) {
    if (r.length !== 6) return null
    const row: (Trans | null)[] = []
    for (let k = 0; k < 2; k++) {
      const e = r.slice(3 * k, 3 * k + 3).toUpperCase()
      if (e === '---') {
        row.push(null)
        continue
      }
      const w = e[0] === '1' ? 1 : e[0] === '0' ? 0 : -9
      const m = e[1] === 'L' ? -1 : e[1] === 'R' ? 1 : 0
      const c = e[2]
      const s = c === 'Z' || c === 'H' ? HALT : c.charCodeAt(0) - 65
      if (w < 0 || m === 0 || (s !== HALT && (s < 0 || s >= n))) return null
      row.push({ w: w as 0 | 1, m: m as -1 | 1, s })
    }
    t.push(row)
  }
  return { n, t }
}

export const formatTM = (M: Machine) => M.t.map((row) => row.map(transText).join('')).join('_')

/* ------------------------------------------------------------------ */
/* Simulator with a growable typed-array tape                          */
/* ------------------------------------------------------------------ */
export class Sim {
  M: Machine
  tape: Uint8Array
  off: number // tape index of position 0
  pos = 0
  state = 0
  steps = 0
  halted = false
  minPos = 0
  maxPos = 0
  ones = 0
  constructor(M: Machine, size = 256) {
    this.M = M
    this.tape = new Uint8Array(size)
    this.off = size >> 1
  }
  /** Put input on the tape: cells[k] goes to position k; the head starts at position 0. */
  load(cells: number[]) {
    while (cells.length + 4 > (this.tape.length >> 1)) this.grow()
    cells.forEach((c, k) => {
      this.tape[k + this.off] = c ? 1 : 0
      this.ones += c ? 1 : 0
    })
    this.maxPos = Math.max(0, cells.length - 1)
    return this
  }
  read(p: number) {
    const i = p + this.off
    return i < 0 || i >= this.tape.length ? 0 : this.tape[i]
  }
  private grow() {
    const old = this.tape
    const nt = new Uint8Array(old.length * 2)
    const shift = old.length >> 1
    nt.set(old, shift)
    this.tape = nt
    this.off += shift
  }
  step(): boolean {
    if (this.halted) return false
    let i = this.pos + this.off
    if (i < 0 || i >= this.tape.length) {
      this.grow()
      i = this.pos + this.off
    }
    const sym = this.tape[i]
    const tr = this.M.t[this.state][sym]
    const w = tr ? tr.w : 1
    const m = tr ? tr.m : 1
    const s = tr ? tr.s : HALT
    this.ones += w - sym
    this.tape[i] = w
    this.pos += m
    this.steps++
    if (this.pos < this.minPos) this.minPos = this.pos
    if (this.pos > this.maxPos) this.maxPos = this.pos
    if (s === HALT) {
      this.halted = true
    } else this.state = s
    return !this.halted
  }
  /** Fast inner loop for long runs; returns true if halted. */
  run(maxSteps: number): boolean {
    const t = this.M.t
    let tape = this.tape
    let off = this.off
    let pos = this.pos
    let state = this.state
    let steps = this.steps
    let ones = this.ones
    let minP = this.minPos
    let maxP = this.maxPos
    const lim = steps + maxSteps
    let halted = this.halted
    while (!halted && steps < lim) {
      let i = pos + off
      if (i < 0 || i >= tape.length) {
        this.off = off
        this.grow()
        tape = this.tape
        off = this.off
        i = pos + off
      }
      const sym = tape[i]
      const tr = t[state][sym]
      const w = tr ? tr.w : 1
      ones += w - sym
      tape[i] = w
      pos += tr ? tr.m : 1
      steps++
      if (pos < minP) minP = pos
      if (pos > maxP) maxP = pos
      if (!tr || tr.s === HALT) halted = true
      else state = tr.s
    }
    this.off = off
    this.pos = pos
    this.state = state
    this.steps = steps
    this.ones = ones
    this.minPos = minP
    this.maxPos = maxP
    this.halted = halted
    return halted
  }
  /** Tape contents between lo and hi (inclusive) as 0/1 array. */
  window(lo: number, hi: number): number[] {
    const out: number[] = []
    for (let p = lo; p <= hi; p++) out.push(this.read(p))
    return out
  }
  key(): string {
    // exact configuration (state, head, used tape)
    let s = `${this.state}|${this.pos}|`
    for (let p = this.minPos - 1; p <= this.maxPos + 1; p++) s += this.read(p)
    return s
  }
}

export type RunResult = { halted: boolean; steps: number; ones: number }
export function runTM(M: Machine, maxSteps: number): RunResult {
  const sim = new Sim(M)
  sim.run(maxSteps)
  return { halted: sim.halted, steps: sim.steps, ones: sim.ones }
}

/** History of configurations for space-time diagrams. Each row: tape window, head, state (before the step). */
export type Row = { cells: Uint8Array; lo: number; pos: number; state: number }
export function history(M: Machine, maxSteps: number): { rows: Row[]; sim: Sim } {
  const sim = new Sim(M)
  const rows: Row[] = []
  const snap = () => {
    const lo = sim.minPos - 1
    const hi = sim.maxPos + 1
    rows.push({ cells: Uint8Array.from(sim.window(lo, hi)), lo, pos: sim.pos, state: sim.halted ? HALT : sim.state })
  }
  snap()
  while (!sim.halted && sim.steps < maxSteps) {
    sim.step()
    snap()
  }
  return { rows, sim }
}

/* ------------------------------------------------------------------ */
/* Tree Normal Form enumeration                                        */
/* ------------------------------------------------------------------ */
/** Enumerate n-state machines in Tree Normal Form with A0 = 1RB (TNF-1RB).
 *  Starting from the machine with only A0 defined, run it; when an undefined transition is reached
 *  either it is the last undefined one (a halting leaf) or we branch: halt here (leaf), or define it
 *  with any write/move and any already-used state or the next new one. A machine is a leaf when it
 *  halts (undefined transition reached) or runs past `limit` steps. */
export type Leaf = { M: Machine; halted: boolean; steps: number; ones: number }
export function enumerateTNF(n: number, limit = 1000): Leaf[] {
  const leaves: Leaf[] = []
  const blank = (): Machine => ({ n, t: Array.from({ length: n }, () => [null, null] as (Trans | null)[]) })
  const root = blank()
  root.t[0][0] = { w: 1, m: 1, s: n > 1 ? 1 : HALT }
  const clone = (M: Machine): Machine => ({ n, t: M.t.map((r) => r.slice()) })
  const rec = (M: Machine) => {
    const sim = new Sim(M)
    // find first undefined transition reached
    let hitState = -1
    let hitSym = -1
    while (sim.steps < limit) {
      const sym = sim.read(sim.pos)
      const tr = M.t[sim.state][sym]
      if (!tr) {
        hitState = sim.state
        hitSym = sym
        break
      }
      sim.step()
      if (sim.halted) break
    }
    if (hitState < 0) {
      leaves.push({ M, halted: sim.halted, steps: sim.steps, ones: sim.ones })
      return
    }
    const undefinedCount = M.t.flat().filter((x) => x === null).length
    // halting leaf (undefined transition acts as 1RZ)
    const H = clone(M)
    H.t[hitState][hitSym] = { w: 1, m: 1, s: HALT }
    leaves.push({ M: H, halted: true, steps: sim.steps + 1, ones: sim.ones + (1 - hitSym) })
    if (undefinedCount <= 1) return
    // states used so far
    let maxUsed = 0
    M.t.forEach((row) => row.forEach((tr) => tr && tr.s > maxUsed && (maxUsed = tr.s)))
    maxUsed = Math.max(maxUsed, 0)
    const top = Math.min(n - 1, maxUsed + 1)
    for (let s = 0; s <= top; s++)
      for (const w of [0, 1] as const)
        for (const m of [-1, 1] as const) {
          const N = clone(M)
          N.t[hitState][hitSym] = { w, m, s }
          rec(N)
        }
  }
  if (n === 1) {
    leaves.push({ M: { n, t: [[{ w: 1, m: 1, s: HALT }, null]] }, halted: true, steps: 1, ones: 1 })
    return leaves
  }
  rec(root)
  return leaves
}

/* ------------------------------------------------------------------ */
/* Non-halting classification (heuristic, exact for the small machines we show) */
/* ------------------------------------------------------------------ */
export type Kind = 'halt' | 'cycler' | 'translated' | 'bouncer' | 'counter' | 'unknown'
export function classify(M: Machine): { kind: Kind; steps: number; ones: number; period?: number } {
  const sim = new Sim(M)
  const seen = new Map<string, number>()
  for (let i = 0; i < 4000; i++) {
    const k = sim.key()
    const prev = seen.get(k)
    if (prev !== undefined) return { kind: 'cycler', steps: prev, ones: sim.ones, period: i - prev }
    seen.set(k, i)
    sim.step()
    if (sim.halted) return { kind: 'halt', steps: sim.steps, ones: sim.ones }
  }
  // growth of the visited region tells the rest apart
  const w1 = sim.maxPos - sim.minPos
  sim.run(12000) // now at 16000 steps
  if (sim.halted) return { kind: 'halt', steps: sim.steps, ones: sim.ones }
  const w2 = sim.maxPos - sim.minPos
  const ratio = w2 / Math.max(1, w1)
  if (ratio > 3) return { kind: 'translated', steps: sim.steps, ones: sim.ones } // linear: ×4
  if (ratio > 1.6) return { kind: 'bouncer', steps: sim.steps, ones: sim.ones } // square-root: ×2
  return { kind: 'counter', steps: sim.steps, ones: sim.ones } // logarithmic: +2
}

/* ------------------------------------------------------------------ */
/* Famous machines                                                      */
/* ------------------------------------------------------------------ */
export const CHAMPIONS = {
  bb1: '1RZ---',
  bb2: '1RB1LB_1LA1RZ',
  s3: '1RB1RZ_1LB0RC_1LC1LA',
  sigma3: '1RB1RZ_0RC1RB_1LC1LA',
  bb4: '1RB1LB_1LA0LC_1RZ1LD_1RD0RA',
  bb5: '1RB1LC_1RC1RB_1RD0LE_1LA1LD_1RZ0LA',
  bb6: '1RB1RA_1RC1RZ_1LD0RF_1RA0LE_0LD1RC_1RA0RE',
  antihydra: '1RB1RA_0LC1LE_1LD1LC_1LA0LB_1LF1RE_---0RA',
}
