/* Reusable Turing-machine UI pieces (Chapter 11, also imported by Chapter 12). */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { HALT, Sim, formatTM, history, parseTM, stateName, transText, type Machine, type Row } from './tm'

export const STATE_COLORS = ['#6be4ff', '#ff7ab6', '#7dffa8', '#b59bff', '#ffa95e', '#ff6b6b', '#ffd36b', '#9ad0ff']
export const stateColor = (s: number) => (s < 0 ? '#ffffff' : STATE_COLORS[s % STATE_COLORS.length])

/* ------------------------------------------------------------------ */
/* Tape strip                                                          */
/* ------------------------------------------------------------------ */
export function TapeView({ sim, width = 25, flash }: { sim: Sim; width?: number; flash?: boolean }) {
  const half = width >> 1
  const cells = []
  for (let p = sim.pos - half; p <= sim.pos + half; p++) {
    const v = sim.read(p)
    const head = p === sim.pos
    cells.push(
      <div key={p} className={`c11-cell ${v ? 'one' : ''} ${head ? 'head' : ''}`} style={head ? { borderColor: stateColor(sim.halted ? HALT : sim.state) } : undefined}>
        {v}
        {head && (
          <span className={`c11-headtag ${flash ? 'flash' : ''}`} style={{ background: stateColor(sim.halted ? HALT : sim.state) }}>
            {sim.halted ? 'Z' : stateName(sim.state)}
          </span>
        )}
      </div>,
    )
  }
  return <div className="c11-tape">{cells}</div>
}

/* ------------------------------------------------------------------ */
/* Space-time diagram on a canvas                                       */
/* ------------------------------------------------------------------ */
export function SpaceTime({ rows, maxH = 420, highlight }: { rows: Row[]; maxH?: number; highlight?: (i: number) => string | null }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const geo = useMemo(() => {
    let lo = 0
    let hi = 0
    for (const r of rows) {
      lo = Math.min(lo, r.lo)
      hi = Math.max(hi, r.lo + r.cells.length - 1)
    }
    const cols = hi - lo + 1
    const cw = Math.max(1, Math.min(18, Math.floor(720 / cols)))
    const rh = Math.max(1, Math.min(cw, Math.floor(1400 / Math.max(1, rows.length))))
    return { lo, hi, cols, cw, rh }
  }, [rows])
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const { lo, cols, cw, rh } = geo
    cv.width = cols * cw
    cv.height = Math.max(1, rows.length * rh)
    const g = cv.getContext('2d')
    if (!g) return
    g.fillStyle = '#0b1128'
    g.fillRect(0, 0, cv.width, cv.height)
    rows.forEach((r, i) => {
      const hl = highlight?.(i)
      if (hl) {
        g.fillStyle = hl
        g.fillRect(0, i * rh, cv.width, rh)
      }
      g.fillStyle = '#ffd36b'
      for (let k = 0; k < r.cells.length; k++) if (r.cells[k]) g.fillRect((r.lo + k - lo) * cw, i * rh, cw, rh)
      g.fillStyle = stateColor(r.state)
      const hx = (r.pos - lo) * cw
      if (cw >= 4) {
        g.globalAlpha = 0.9
        g.fillRect(hx + cw * 0.25, i * rh + rh * 0.2, cw * 0.5, Math.max(1, rh * 0.6))
        g.globalAlpha = 1
      } else g.fillRect(hx, i * rh, cw, rh)
    })
  }, [rows, geo, highlight])
  return (
    <div className="c11-st-wrap" style={{ maxHeight: maxH }}>
      <canvas ref={ref} className="c11-st" style={{ maxHeight: maxH }} />
    </div>
  )
}

/** Small legend for space-time diagrams. */
export function StLegend({ n }: { n: number }) {
  return (
    <div className="c11-legend small muted">
      <span>
        <i style={{ background: '#ffd36b' }} /> <L en="cell = 1" zh="格子为 1" />
      </span>
      {Array.from({ length: n }, (_, s) => (
        <span key={s}>
          <i style={{ background: stateColor(s) }} /> <L en={`head in ${stateName(s)}`} zh={`读头处于 ${stateName(s)}`} />
        </span>
      ))}
      <span className="muted">
        <L en="time runs downward" zh="时间向下流" />
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Transition-table editor                                             */
/* ------------------------------------------------------------------ */
function options(n: number) {
  const out: string[] = ['---']
  for (const w of '01') for (const m of 'LR') for (let s = 0; s < n; s++) out.push(`${w}${m}${stateName(s)}`)
  for (const w of '01') for (const m of 'LR') out.push(`${w}${m}Z`)
  return out
}

export function TableEditor({
  M,
  onChange,
  active,
  locked,
}: {
  M: Machine
  onChange: (M: Machine) => void
  active?: { s: number; sym: number } | null
  locked?: boolean
}) {
  const opts = useMemo(() => options(M.n), [M.n])
  const set = (s: number, sym: number, txt: string) => {
    const t = M.t.map((r) => r.slice())
    t[s][sym] =
      txt === '---' ? null : { w: txt[0] === '1' ? 1 : 0, m: txt[1] === 'L' ? -1 : 1, s: txt[2] === 'Z' ? HALT : txt.charCodeAt(2) - 65 }
    onChange({ n: M.n, t })
  }
  return (
    <div className="scroll-x">
      <table className="grid c11-table">
        <thead>
          <tr>
            <th></th>
            {M.t.map((_, s) => (
              <th key={s} style={{ color: stateColor(s) }}>
                {stateName(s)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1].map((sym) => (
            <tr key={sym}>
              <th>
                <L en={`read ${sym}`} zh={`读到 ${sym}`} />
              </th>
              {M.t.map((row, s) => {
                const on = active && active.s === s && active.sym === sym
                const v = transText(row[sym])
                return (
                  <td key={s} className={on ? 'c11-active' : ''}>
                    {locked ? (
                      <span className={`mono ${v.endsWith('Z') ? 'c11-haltcell' : ''}`}>{v}</span>
                    ) : (
                      <select className={`c11-sel ${v.endsWith('Z') ? 'c11-haltcell' : ''}`} value={v} onChange={(e) => set(s, sym, e.target.value)} aria-label={`${stateName(s)}${sym}`}>
                        {opts.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* A hook that drives a simulator with animation                         */
/* ------------------------------------------------------------------ */
export function useRunner(M: Machine | null, input: number[] = [], speed = 4) {
  const simRef = useRef<Sim | null>(null)
  const [, setTick] = useState(0)
  const [running, setRunning] = useState(false)
  const [last, setLast] = useState<{ s: number; sym: number } | null>(null)
  const inputKey = input.join('')
  const reset = useCallback(() => {
    simRef.current = M ? new Sim(M).load(input) : null
    setLast(null)
    setRunning(false)
    setTick((x) => x + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [M, inputKey])
  useEffect(() => reset(), [reset])
  const step = useCallback(
    (k = 1) => {
      const sim = simRef.current
      if (!sim) return
      for (let i = 0; i < k && !sim.halted; i++) {
        const sym = sim.read(sim.pos)
        const s = sim.state
        sim.step()
        setLast({ s, sym })
      }
      if (sim.halted) setRunning(false)
      setTick((x) => x + 1)
    },
    [],
  )
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => step(speed), 90)
    return () => clearInterval(id)
  }, [running, step, speed])
  return { sim: simRef.current, step, reset, running, setRunning, last }
}

/** Convenience: code text field that accepts the standard format. */
export function CodeField({ M, onChange }: { M: Machine; onChange: (M: Machine) => void }) {
  const { t } = useLang()
  const [txt, setTxt] = useState(formatTM(M))
  const [bad, setBad] = useState(false)
  useEffect(() => {
    setTxt(formatTM(M))
    setBad(false)
  }, [M])
  return (
    <input
      className={`c11-code ${bad ? 'bad' : ''}`}
      value={txt}
      spellCheck={false}
      aria-label={t('machine code', '机器代码')}
      onChange={(e) => {
        setTxt(e.target.value)
        const p = parseTM(e.target.value)
        setBad(!p)
        if (p) onChange(p)
      }}
    />
  )
}

export { history }
