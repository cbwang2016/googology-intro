import { useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { TOWER } from './data'
import { checkLD, laver, rowPeriod, type Laver } from './lib'

/* ------------------------------------------------------------------ */
/* 1. Large-cardinal tower with recursive shadows                       */
/* ------------------------------------------------------------------ */
export function CardinalTower() {
  const { t } = useLang()
  const [i, setI] = useState(4)
  const c = TOWER[i]
  return (
    <div className="c10-tower-wrap">
      <div className="c10-tower">
        {TOWER.map((x, k) => (
          <button
            key={k}
            className={`c10-floor ${k === i ? 'on' : ''} ${k === TOWER.length - 1 ? 'ceiling' : ''}`}
            style={{ borderLeftColor: x.color }}
            onClick={() => setI(k)}
          >
            <span>{t(x.name.en, x.name.zh)}</span>
            {x.shadow && <span className="c10-shadow">⇢ {t(x.shadow.en, x.shadow.zh)}</span>}
          </button>
        ))}
      </div>
      <div className="c10-tower-panel">
        <b style={{ color: c.color }}>{t(c.name.en, c.name.zh)}</b>
        <p className="small">{t(c.def.en, c.def.zh)}</p>
        <p className="small">
          <span className="muted">
            <L en="What it buys: " zh="它带来什么：" />
          </span>
          {t(c.gives.en, c.gives.zh)}
        </p>
        {c.shadow && (
          <p className="small">
            <span className="muted">
              <L en="Recursive shadow: " zh="递归影子：" />
            </span>
            {t(c.shadow.en, c.shadow.zh)}
          </p>
        )}
        <p className="muted small">
          <L
            en="Higher floors prove the consistency of lower ones, never of themselves (Gödel II). No floor above ZFC can be proved to exist in ZFC."
            zh="高层能证明低层的一致性，却永远证明不了自己的（哥德尔第二定理）。ZFC 之上的任何一层都无法在 ZFC 中被证明存在。"
          />
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Laver table builder: fill A_n cell by cell                       */
/* ------------------------------------------------------------------ */
function fillOrder(N: number): [number, number][] {
  const out: [number, number][] = []
  for (let b = 1; b <= N; b++) out.push([N, b])
  for (let a = N - 1; a >= 1; a--) for (let b = 1; b <= N; b++) out.push([a, b])
  return out
}

export function LaverBuilder() {
  const { t } = useLang()
  const [n, setN] = useState(3)
  const Lt = useMemo(() => laver(n), [n])
  const N = Lt.N
  const order = useMemo(() => fillOrder(N), [N])
  const [k, setK] = useState(8)
  useEffect(() => setK(1 << n), [n])
  const filled = new Set(order.slice(0, k).map(([a, b]) => a * 100 + b))
  const last = k > 0 ? order[k - 1] : null
  let ref1: [number, number] | null = null
  let ref2: [number, number] | null = null
  let why = ''
  if (last) {
    const [a, b] = last
    const v = Lt.at(a, b)
    if (a === N) why = t(`Row 2ⁿ is the identity: ${N} ⋆ ${b} = ${b}.`, `第 2ⁿ 行是恒等映射：${N} ⋆ ${b} = ${b}。`)
    else if (b === 1) why = t(`a ⋆ 1 = a + 1: ${a} ⋆ 1 = ${v}.`, `a ⋆ 1 = a + 1：${a} ⋆ 1 = ${v}。`)
    else {
      const x = Lt.at(a, b - 1)
      ref1 = [a, b - 1]
      ref2 = [x, a + 1]
      why = t(
        `${a} ⋆ ${b} = (${a} ⋆ ${b - 1}) ⋆ (${a} + 1) = ${x} ⋆ ${a + 1} = ${v}. Row ${x} > ${a} is already finished.`,
        `${a} ⋆ ${b} = (${a} ⋆ ${b - 1}) ⋆ (${a} + 1) = ${x} ⋆ ${a + 1} = ${v}。第 ${x} 行（${x} > ${a}）早已填好。`,
      )
    }
  }
  const rowDone = (a: number) => filled.has(a * 100 + N)
  const done = k >= order.length
  const advance = (steps: number) => setK(Math.min(order.length, k + steps))
  const finishRow = () => {
    let j = k
    while (j < order.length && order[j][1] !== N) j++
    setK(Math.min(order.length, j + 1))
  }
  const cell = Math.max(18, Math.min(29, Math.floor(400 / (N + 1))))
  return (
    <div>
      <div className="btn-row">
        {[1, 2, 3, 4].map((m) => (
          <button key={m} className={`chip ${n === m ? 'on' : ''}`} onClick={() => setN(m)}>
            A<sub>{m}</sub> ({1 << m}×{1 << m})
          </button>
        ))}
      </div>
      <div className="scroll-x">
        <table className="c10-laver" style={{ fontSize: cell < 24 ? 11 : 13 }}>
          <thead>
            <tr>
              <th>⋆</th>
              {Array.from({ length: N }, (_, b) => (
                <th key={b} style={{ width: cell }}>
                  {b + 1}
                </th>
              ))}
              <th className="c10-per">
                <L en="period" zh="周期" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: N }, (_, ai) => {
              const a = ai + 1
              return (
                <tr key={a} className={a === 1 ? 'first' : ''}>
                  <th>{a}</th>
                  {Array.from({ length: N }, (_, bi) => {
                    const b = bi + 1
                    const on = filled.has(a * 100 + b)
                    const isLast = last && last[0] === a && last[1] === b
                    const isRef = (ref1 && ref1[0] === a && ref1[1] === b) || (ref2 && ref2[0] === a && ref2[1] === b)
                    const v = Lt.at(a, b)
                    return (
                      <td key={b} className={`${on ? 'f' : ''} ${isLast ? 'last' : ''} ${isRef ? 'ref' : ''} ${on && v === N ? 'top' : ''}`} style={{ height: cell }}>
                        {on ? v : ''}
                      </td>
                    )
                  })}
                  <td className="c10-per">{rowDone(a) ? rowPeriod(Lt, a) : ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="readout small c10-why">{k === N ? t(`Row ${N} = 2ⁿ is the identity (filled). Now work upwards, row by row.`, `第 ${N} = 2ⁿ 行是恒等映射（已填好）。接下来逐行往上填。`) : why}</div>
      <div className="btn-row">
        <button className="btn small" disabled={done} onClick={() => advance(1)}>
          <L en="Next cell" zh="下一格" />
        </button>
        <button className="btn small" disabled={done} onClick={finishRow}>
          <L en="Finish row" zh="填完这一行" />
        </button>
        <button className="btn small" disabled={done} onClick={() => setK(order.length)}>
          <L en="Fill all" zh="全部填完" />
        </button>
        <button className="btn small" onClick={() => setK(N)}>
          <L en="Reset" zh="重来" />
        </button>
        {done && (
          <span className="muted small" style={{ alignSelf: 'center' }}>
            {t(`Row 1 has period p(${n}) = ${rowPeriod(Lt, 1)}.`, `第 1 行的周期 p(${n}) = ${rowPeriod(Lt, 1)}。`)}
          </span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Periods of Laver tables: the slowest race                        */
/* ------------------------------------------------------------------ */
const cache = new Map<number, { L: Laver; ms: number }>()
const getTimed = (n: number) => {
  let x = cache.get(n)
  if (!x) {
    const t0 = performance.now()
    const L = laver(n)
    x = { L, ms: performance.now() - t0 }
    cache.set(n, x)
  }
  return x
}
const getLaver = (n: number) => getTimed(n).L

export function LaverPeriods() {
  const { t } = useLang()
  const [n, setN] = useState(6)
  const [row, setRow] = useState(3)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [periods, setPeriods] = useState<number[]>([])
  const Lt = getLaver(n)
  const ms = getTimed(n).ms
  useEffect(() => {
    const ps: number[] = []
    for (let m = 0; m <= n; m++) ps.push(rowPeriod(getLaver(m), 1))
    setPeriods(ps)
    setRow((r) => Math.min(r, 1 << n))
  }, [n])
  const ld = useMemo(() => checkLD(Lt), [Lt])
  const drawN = Math.min(n, 8)
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const D = getLaver(drawN)
    const N = D.N
    c.width = N
    c.height = N
    const ctx = c.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(N, N)
    for (let a = 1; a <= N; a++)
      for (let b = 1; b <= N; b++) {
        const v = D.at(a, b)
        const h = (v - 1) / N
        const i = ((a - 1) * N + (b - 1)) * 4
        // value → colour ramp (dark blue → cyan → gold)
        const r = Math.round(255 * Math.max(0, h * 1.6 - 0.6))
        const g = Math.round(60 + 170 * h)
        const bl = Math.round(120 + 120 * (1 - Math.abs(h - 0.5) * 2))
        img.data[i] = v === N ? 255 : r
        img.data[i + 1] = v === N ? 211 : g
        img.data[i + 2] = v === N ? 107 : bl
        img.data[i + 3] = 255
      }
    ctx.putImageData(img, 0, 0)
  }, [drawN])
  const pRow = rowPeriod(Lt, Math.min(row, Lt.N))
  const maxP = Math.max(1, ...periods)
  return (
    <div>
      <Slider value={n} min={0} max={11} onChange={setN} label={<M t="n" />} />
      <div className="c10-lp">
        <div className="c10-lp-left">
          <canvas
            ref={canvas}
            className="c10-heat"
            onClick={(e) => {
              const r = (e.target as HTMLCanvasElement).getBoundingClientRect()
              const frac = (e.clientY - r.top) / r.height
              const a = Math.floor(frac * (1 << drawN)) + 1
              setRow(Math.round(((a - 1) / (1 << drawN)) * Lt.N) + 1)
            }}
          />
          <div className="muted small">
            {n > 8
              ? t(`picture shows A₈; A_${n} has ${(Lt.N * Lt.N).toLocaleString()} entries`, `图中画的是 A₈；A_${n} 共有 ${(Lt.N * Lt.N).toLocaleString()} 个格子`)
              : t(`A_${n}: gold = 2ⁿ. Click a row.`, `A_${n}：金色 = 2ⁿ。点一行看看。`)}
          </div>
        </div>
        <div className="c10-lp-right">
          <div className="c10-stat3">
          <div className="stat">
            <span className="stat-label">
              <L en="size" zh="大小" />
            </span>
            <span className="stat-value">
              {Lt.N} × {Lt.N}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">
              <L en="period of row 1" zh="第 1 行周期" />
            </span>
            <span className="stat-value">p({n}) = {rowPeriod(Lt, 1)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">
              <L en={`period of row ${row}`} zh={`第 ${row} 行周期`} />
            </span>
            <span className="stat-value">{pRow}</span>
          </div>
          </div>
          <div className="muted small">
            {t(
              `computed in ${ms.toFixed(1)} ms · self-distributivity ${ld.ok ? 'verified' : 'FAILED'} on ${ld.checked.toLocaleString()} ${Lt.N <= 32 ? 'triples (all)' : 'random triples'}`,
              `用时 ${ms.toFixed(1)} 毫秒 · 自分配律在 ${ld.checked.toLocaleString()} 组${Lt.N <= 32 ? '（全部）' : '随机'}三元组上${ld.ok ? '验证通过' : '失败'}`,
            )}
          </div>
          <div className="c10-bars">
            {periods.map((p, m) => (
              <div key={m} className="c10-bar-col">
                <div className="c10-bar" style={{ height: `${(Math.log2(p) + 1) / (Math.log2(Math.max(maxP, 16)) + 1) * 90}px` }}>
                  <span>{p}</span>
                </div>
                <span className="c10-bar-x">{m}</span>
              </div>
            ))}
          </div>
          <div className="muted small">
            <L en="p(n), n = 0, 1, 2, … (bar height ∝ log p)" zh="p(n)，n = 0, 1, 2, …（柱高 ∝ log p）" />
          </div>
        </div>
      </div>
    </div>
  )
}
