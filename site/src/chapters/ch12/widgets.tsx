import { useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { CHAMPIONS, HALT, Sim, formatTM, history, parseTM, stateName, type Machine, type Row, type Trans } from '../ch11/tm'
import { SpaceTime, StLegend, TableEditor, stateColor } from '../ch11/tmui'

const fmt = (v: number | bigint) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

/* ------------------------------------------------------------------ */
/* Shared: a tape strip drawn from a history row                         */
/* ------------------------------------------------------------------ */
function RowTape({ r, width = 25 }: { r: Row; width?: number }) {
  const half = width >> 1
  const cells = []
  for (let p = r.pos - half; p <= r.pos + half; p++) {
    const k = p - r.lo
    const v = k >= 0 && k < r.cells.length ? r.cells[k] : 0
    const head = p === r.pos
    cells.push(
      <div key={p} className={`c11-cell ${v ? 'one' : ''} ${head ? 'head' : ''}`} style={head ? { borderColor: stateColor(r.state) } : undefined}>
        {v}
        {head && (
          <span className="c11-headtag" style={{ background: stateColor(r.state) }}>
            {stateName(r.state)}
          </span>
        )}
      </div>,
    )
  }
  return <div className="c11-tape">{cells}</div>
}

/* ------------------------------------------------------------------ */
/* 1. Beat the beaver                                                    */
/* ------------------------------------------------------------------ */
const RECORD: Record<number, { S: number; sigma: number }> = { 2: { S: 6, sigma: 4 }, 3: { S: 21, sigma: 6 }, 4: { S: 107, sigma: 13 } }
const START: Record<number, string> = { 2: '1RB---_------', 3: '1RB---_------_------', 4: '1RB---_------_------_------' }

function randomMachine(n: number): Machine {
  const t: (Trans | null)[][] = Array.from({ length: n }, () => [null, null])
  const cells: [number, number][] = []
  for (let s = 0; s < n; s++) for (const y of [0, 1]) cells.push([s, y])
  const haltAt = 1 + Math.floor(Math.random() * (cells.length - 1))
  cells.forEach(([s, y], i) => {
    if (i === 0) t[s][y] = { w: 1, m: 1, s: 1 }
    else if (i === haltAt) t[s][y] = { w: 1, m: 1, s: HALT }
    else t[s][y] = { w: Math.random() < 0.5 ? 0 : 1, m: Math.random() < 0.5 ? -1 : 1, s: Math.floor(Math.random() * n) }
  })
  return { n, t }
}
function score(Mc: Machine, n: number) {
  const sim = new Sim(Mc)
  sim.run(RECORD[n].S + 1)
  return { halted: sim.halted, steps: sim.steps, ones: sim.ones }
}

export function BeatTheBeaver() {
  const { t } = useLang()
  const [n, setN] = useState(2)
  const [mach, setMach] = useState<Machine>(() => parseTM(START[2])!)
  const [best, setBest] = useState<Record<number, { steps: number; ones: number; code: string }>>({})
  const [search, setSearch] = useState<null | { tried: number; halting: number; best: number; bestCode: string; hitS: number }>(null)
  const res = useMemo(() => score(mach, n), [mach, n])
  const rows = useMemo(() => history(mach, Math.min(res.steps, 110)).rows, [mach, res.steps])
  useEffect(() => {
    if (!res.halted) return
    const b = best[n]
    if (!b || res.steps > b.steps || (res.steps === b.steps && res.ones > b.ones)) setBest({ ...best, [n]: { steps: res.steps, ones: res.ones, code: formatTM(mach) } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res, n])
  const pickN = (k: number) => {
    setN(k)
    setMach(parseTM(START[k])!)
    setSearch(null)
  }
  const rec = RECORD[n]
  const randomSearch = () => {
    let tried = 0
    let halting = 0
    let bestS = 0
    let bestCode = ''
    let hitS = 0
    for (let i = 0; i < 20000; i++) {
      const Mc = randomMachine(n)
      const r = score(Mc, n)
      tried++
      if (!r.halted) continue
      halting++
      if (r.steps === rec.S) hitS++
      if (r.steps > bestS) {
        bestS = r.steps
        bestCode = formatTM(Mc)
      }
    }
    setSearch({ tried, halting, best: bestS, bestCode, hitS })
  }
  return (
    <div>
      <div className="btn-row">
        {[2, 3, 4].map((k) => (
          <button key={k} className={`chip ${k === n ? 'on' : ''}`} onClick={() => pickN(k)}>
            {t(`${k} states`, `${k} 个状态`)}
          </button>
        ))}
        <button className="chip" onClick={() => setMach(randomMachine(n))}>
          <L en="random machine" zh="随机一台" />
        </button>
      </div>
      <div className="c12-beat">
        <div>
          <TableEditor M={mach} onChange={setMach} />
          <div className="mono small c11-codeshow" style={{ display: 'inline-block', marginTop: 4 }}>
            {formatTM(mach)}
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <div className="stat">
              <span className="stat-label">{t('your machine', '你的机器')}</span>
              <span className="stat-value">
                {res.halted ? t(`${res.steps} steps · ${res.ones} ones`, `${res.steps} 步 · ${res.ones} 个 1`) : t('never halts', '永不停机')}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">{t('record S / Σ', '纪录 S / Σ')}</span>
              <span className="stat-value">
                {rec.S} / {rec.sigma}
              </span>
            </div>
            {best[n] && (
              <div className="stat">
                <span className="stat-label">{t('your best', '你的最好成绩')}</span>
                <span className="stat-value">
                  {best[n].steps} / {best[n].ones}
                </span>
              </div>
            )}
          </div>
          {!res.halted && (
            <div className="small muted" style={{ marginTop: 6 }}>
              <L
                en={<>It ran past <M t={`S(${n})=${rec.S}`} /> steps without halting. Since no halting {n}-state machine runs longer, it provably never halts.</>}
                zh={<>它跑过了 <M t={`S(${n})=${rec.S}`} /> 步还没停。既然没有哪台会停的 {n} 状态机器能跑得更久，它就一定永不停机。</>}
              />
            </div>
          )}
          {res.halted && res.steps === rec.S && (
            <div className="small c11-ok" style={{ marginTop: 6 }}>
              <L en="You tied the all-time record. Nobody can beat it — that is a theorem." zh="你追平了历史纪录。没有人能打破它——这是一条定理。" />
            </div>
          )}
        </div>
        <div>
          <SpaceTime rows={rows} maxH={235} />
          <StLegend n={n} />
        </div>
      </div>
      <div className="btn-row">
        <button className="btn small" onClick={randomSearch}>
          <L en="Try 20,000 random machines" zh="随机试 20,000 台机器" />
        </button>
        {search && (
          <span className="small">
            {t(
              `${fmt(search.halting)} of ${fmt(search.tried)} halted; best ${search.best} steps; ${search.hitS} hit the record ${rec.S}.`,
              `${fmt(search.tried)} 台中有 ${fmt(search.halting)} 台停机；最长 ${search.best} 步；${search.hitS} 台达到纪录 ${rec.S}。`,
            )}{' '}
            {search.best > 0 && (
              <button className="chip" onClick={() => setMach(parseTM(search.bestCode)!)}>
                <L en="load the best" zh="载入最好的那台" />
              </button>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Champion runner                                                    */
/* ------------------------------------------------------------------ */
const CHAMPS = [
  { key: 'bb1', code: CHAMPIONS.bb1, name: { en: 'BB(1)', zh: 'BB(1)' } },
  { key: 'bb2', code: CHAMPIONS.bb2, name: { en: 'BB(2) = Σ(2)', zh: 'BB(2) = Σ(2)' } },
  { key: 's3', code: CHAMPIONS.s3, name: { en: 'S(3) champion', zh: 'S(3) 冠军' } },
  { key: 'sigma3', code: CHAMPIONS.sigma3, name: { en: 'Σ(3) champion', zh: 'Σ(3) 冠军' } },
  { key: 'bb4', code: CHAMPIONS.bb4, name: { en: 'BB(4) = Σ(4)', zh: 'BB(4) = Σ(4)' } },
]

export function ChampionRunner() {
  const { t } = useLang()
  const [ci, setCi] = useState(2)
  const c = CHAMPS[ci]
  const mach = useMemo(() => parseTM(c.code)!, [c])
  const rows = useMemo(() => history(mach, 1000).rows, [mach])
  const [k, setK] = useState(0)
  const [play, setPlay] = useState(true)
  useEffect(() => {
    setK(0)
    setPlay(true)
  }, [ci])
  useEffect(() => {
    if (!play) return
    if (k >= rows.length - 1) {
      setPlay(false)
      return
    }
    const id = window.setTimeout(() => setK((x) => Math.min(rows.length - 1, x + 1)), rows.length > 60 ? 45 : 260)
    return () => clearTimeout(id)
  }, [k, play, rows.length])
  const r = rows[k]
  const ones = r.cells.reduce((s, v) => s + v, 0)
  return (
    <div>
      <div className="btn-row">
        {CHAMPS.map((q, i) => (
          <button key={q.key} className={`chip ${i === ci ? 'on' : ''}`} onClick={() => setCi(i)}>
            {q.name.en}
          </button>
        ))}
      </div>
      <div className="row">
        <span className="mono small c11-codeshow">{c.code}</span>
        <Slider value={k} min={0} max={rows.length - 1} onChange={(v) => { setPlay(false); setK(v) }} label={<L en="step" zh="步" />} />
        <button className="chip" onClick={() => { if (k >= rows.length - 1) setK(0); setPlay(!play) }}>
          {play ? t('pause', '暂停') : t('play', '播放')}
        </button>
      </div>
      <RowTape r={r} />
      <div className="c12-champ">
        <SpaceTime rows={rows.slice(0, k + 1)} maxH={235} />
        <div className="c12-champ-stats">
          <div className="stat">
            <span className="stat-label">{t('steps', '步数')}</span>
            <span className="stat-value">{k}</span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('ones', '1 的个数')}</span>
            <span className="stat-value">{ones}</span>
          </div>
          <div className="stat">
            <span className="stat-label">{t('state', '状态')}</span>
            <span className="stat-value" style={{ color: stateColor(r.state) }}>
              {r.state === HALT ? t('Z — halted', 'Z——停机') : stateName(r.state)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. BB(5) raw run with Collatz landmarks                               */
/* ------------------------------------------------------------------ */
type Leg = { x: number; r: number; next: number | null; legSteps: bigint; cum: bigint; onesAtHalt?: number }
function orbit(x0: number, maxIter = 60): { legs: Leg[]; halted: boolean } {
  const legs: Leg[] = []
  let x = BigInt(x0)
  let cum = 0n
  for (let i = 0; i < maxIter; i++) {
    const n = x / 3n
    const r = Number(x % 3n)
    let d: bigint
    let nx: bigint | null
    if (r === 0) {
      d = 5n * n * n + 19n * n + 15n
      nx = 5n * n + 6n
    } else if (r === 1) {
      d = 5n * n * n + 25n * n + 27n
      nx = 5n * n + 9n
    } else {
      d = 6n * n + 12n
      nx = null
    }
    cum += d
    legs.push({ x: Number(x), r, next: nx === null ? null : Number(nx), legSteps: d, cum, onesAtHalt: nx === null ? Number(n) + 4 : undefined })
    if (nx === null) return { legs, halted: true }
    x = nx
  }
  return { legs, halted: false }
}

export function BB5Run() {
  const { t } = useLang()
  const marks = useMemo(() => {
    const o = orbit(0).legs
    const m: { x: number; at: number }[] = [{ x: 0, at: 0 }]
    o.forEach((l) => l.next !== null && m.push({ x: l.next, at: Number(l.cum) }))
    return { m, total: Number(o[o.length - 1].cum) }
  }, [])
  const simRef = useRef<Sim | null>(null)
  const [steps, setSteps] = useState(0)
  const [verified, setVerified] = useState<boolean[]>([])
  const [running, setRunning] = useState(false)
  const [ms, setMs] = useState(0)
  const [final, setFinal] = useState<null | { ones: number; cells: number; tape: number[] }>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const stop = useRef(false)
  useEffect(() => () => {
    stop.current = true
  }, [])
  const start = () => {
    const sim = new Sim(parseTM(CHAMPIONS.bb5)!, 1 << 15)
    simRef.current = sim
    stop.current = false
    setVerified([])
    setFinal(null)
    setRunning(true)
    const t0 = performance.now()
    let mi = 1
    const ver: boolean[] = [true]
    const tick = () => {
      if (stop.current) return
      const until = performance.now() + 30
      while (performance.now() < until && !sim.halted) {
        const target = mi < marks.m.length ? marks.m[mi].at : marks.total + 10
        sim.run(Math.min(target - sim.steps, 2_000_000))
        if (mi < marks.m.length && sim.steps === marks.m[mi].at) {
          const x = marks.m[mi].x
          let ok = sim.state === 0 && sim.read(sim.pos) === 0 && sim.ones === x
          for (let i = 1; ok && i <= x; i++) ok = sim.read(sim.pos + i) === 1
          ver.push(ok)
          mi++
        }
      }
      setSteps(sim.steps)
      setVerified([...ver])
      setMs(performance.now() - t0)
      if (sim.halted) {
        const tape = sim.window(sim.minPos, sim.maxPos)
        setFinal({ ones: sim.ones, cells: sim.maxPos - sim.minPos + 1, tape })
        setRunning(false)
      } else window.setTimeout(tick, 0)
    }
    tick()
  }
  useEffect(() => {
    const cv = canvas.current
    if (!cv || !final) return
    const W = 128
    const H = Math.ceil(final.tape.length / W)
    const s = 4
    cv.width = W * s
    cv.height = H * s
    const g = cv.getContext('2d')!
    g.fillStyle = '#0b1128'
    g.fillRect(0, 0, cv.width, cv.height)
    g.fillStyle = '#ffd36b'
    final.tape.forEach((v, i) => v && g.fillRect((i % W) * s, Math.floor(i / W) * s, s - 1, s - 1))
  }, [final])
  const pct = Math.min(100, (steps / marks.total) * 100)
  return (
    <div>
      <div className="row">
        <span className="mono small c11-codeshow">{CHAMPIONS.bb5}</span>
        <button className="btn small" disabled={running} onClick={start}>
          {final ? <L en="Run again" zh="再跑一次" /> : <L en="Run all 47,176,870 steps" zh="跑完全部 47,176,870 步" />}
        </button>
      </div>
      <div className="c12-bar">
        <div className="c12-bar-fill" style={{ width: `${pct}%` }} />
        {marks.m.map((m, i) => (
          <div key={i} className={`c12-bar-tick ${verified[i] ? 'ok' : ''}`} style={{ left: `${(m.at / marks.total) * 100}%` }} />
        ))}
      </div>
      <div className="small muted">
        {t(`${fmt(steps)} steps`, `${fmt(steps)} 步`)}
        {ms > 0 && t(` · ${(ms / 1000).toFixed(2)} s in your browser`, ` · 你的浏览器用了 ${(ms / 1000).toFixed(2)} 秒`)}
      </div>
      <div className="c12-marks">
        {marks.m.map((m, i) => (
          <div key={i} className={`c12-mark ${verified[i] ? 'ok' : ''}`}>
            <span className="mono">g({fmt(m.x)})</span>
            <span className="small muted">@{fmt(m.at)}</span>
            {verified[i] && <span className="c11-ok">✓</span>}
          </div>
        ))}
        <div className={`c12-mark halt ${final ? 'ok' : ''}`}>
          <span className="mono">HALT</span>
          <span className="small muted">@{fmt(marks.total)}</span>
          {final && <span className="c11-ok">✓</span>}
        </div>
      </div>
      {final && (
        <div className="c12-final">
          <canvas ref={canvas} className="c12-final-cv" />
          <div className="small">
            <L
              en={<>Halted. {fmt(final.ones)} ones on a stretch of {fmt(final.cells)} visited cells (shown wrapped, 128 cells per row). Each landmark g(x) — blank tape except x ones, head in state A just left of them — was checked against the raw run.</>}
              zh={<>停机。走过 {fmt(final.cells)} 个格子，留下 {fmt(final.ones)} 个 1（按每行 128 格折行显示）。每个路标 g(x)——纸带上只有 x 个连续的 1，读头处于状态 A、位于它们左边一格——都与原始运行逐一核对过。</>}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. The Collatz-like map                                               */
/* ------------------------------------------------------------------ */
export function CollatzOrbit() {
  const { t } = useLang()
  const [x0, setX0] = useState(0)
  const { legs, halted } = useMemo(() => orbit(x0, 40), [x0])
  const ruleTex = ['g(3n)\\to g(5n+6)', 'g(3n+1)\\to g(5n+9)', 'g(3n+2)\\to\\text{HALT}']
  const last = legs[legs.length - 1]
  return (
    <div>
      <Slider value={x0} min={0} max={120} onChange={setX0} label={<L en="start x" zh="起点 x" />} />
      <div className="c12-orbit scroll-x">
        <table className="grid">
          <thead>
            <tr>
              <th>x</th>
              <th>x mod 3</th>
              <th>{t('rule', '规则')}</th>
              <th>{t('steps for this leg', '这一段的步数')}</th>
              <th>{t('total steps', '累计步数')}</th>
            </tr>
          </thead>
          <tbody>
            {legs.map((l, i) => (
              <tr key={i} className={l.r === 2 ? 'c12-haltrow' : ''}>
                <td className="mono">{fmt(l.x)}</td>
                <td>{l.r}</td>
                <td>
                  <M t={ruleTex[l.r]} />
                </td>
                <td className="mono">{fmt(l.legSteps)}</td>
                <td className="mono">{fmt(l.cum)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="readout small c11-prose">
        {halted ? (
          <L
            en={`From g(${x0}): ${legs.length} legs, then halt after ${fmt(last.cum)} steps with ${fmt(last.onesAtHalt!)} ones.${x0 === 0 ? ' This is the real run from a blank tape.' : ''}`}
            zh={`从 g(${x0}) 出发：走 ${legs.length} 段后停机，共 ${fmt(last.cum)} 步，留下 ${fmt(last.onesAtHalt!)} 个 1。${x0 === 0 ? '这正是从空白纸带出发的真实运行。' : ''}`}
          />
        ) : (
          <L en={`Still going after 40 legs (x now has ${String(legs[legs.length - 1].next).length} digits).`} zh={`走了 40 段仍未停机（x 已有 ${String(legs[legs.length - 1].next).length} 位）。`} />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. The proof pipeline                                                 */
/* ------------------------------------------------------------------ */
type Stage = { key: string; name: { en: string; zh: string }; nonhalt: number; halt: number; text: { en: string; zh: string }; example?: string; exLabel?: { en: string; zh: string } }
const STAGES: Stage[] = [
  {
    key: 'loops',
    name: { en: 'Loops', zh: '循环检测' },
    nonhalt: 126_994_099,
    halt: 48_379_711,
    text: {
      en: 'Simulate for a while. Machines that halt are recorded; machines whose configuration repeats exactly, or repeats shifted at the edge of the tape (cyclers and translated cyclers), are proved non-halting.',
      zh: '先模拟一阵。停机的记下来；格局完全重复、或在纸带边缘平移重复的（循环机与平移循环机）被证明永不停机。',
    },
    example: '1RB0LA_1LA---',
    exLabel: { en: 'a translated cycler (2 states)', zh: '一台平移循环机（二状态）' },
  },
  {
    key: 'ngram',
    name: { en: 'NGramCPS', zh: 'NGramCPS（n 元组闭合位置集）' },
    nonhalt: 6_005_142,
    halt: 0,
    text: {
      en: 'Over-approximate what the tape can look like by the set of short words (n-grams) that can ever appear near the head. If that finite set is closed under steps and never lets the machine halt, it is an invariant in the sense of Chapter 11.',
      zh: '用“读头附近可能出现的短词（n 元组）”这个有限集合去过度近似纸带的样子。如果这个集合在走步之下封闭、且不允许停机，它就是第 11 章意义下的不变量。',
    },
  },
  {
    key: 'repwl',
    name: { en: 'RepWL', zh: 'RepWL（重复词名单）' },
    nonhalt: 6_577,
    halt: 0,
    text: {
      en: 'Compress long repetitions on the tape (like 1111… as “1 repeated many times”), then run the same closed-set search on the compressed tapes.',
      zh: '先把纸带上的长重复压缩（比如把 1111… 记成“1 重复很多次”），再在压缩后的纸带上做同样的封闭集合搜索。',
    },
  },
  {
    key: 'far',
    name: { en: 'FAR + WFAR', zh: 'FAR + WFAR（有限自动机约化）' },
    nonhalt: 40,
    halt: 0,
    text: {
      en: 'Search for a finite automaton (weighted, for WFAR) that recognises a closed set of configurations — the regular closed-tape-language method of Chapter 11, found by computer. FAR settled 23 machines, WFAR 17.',
      zh: '搜索一个有限自动机（WFAR 用带权的），使它识别的格局集合是封闭的——这正是第 11 章的“正则封闭磁带语言”方法，只不过由计算机去找。FAR 判定了 23 台，WFAR 判定了 17 台。',
    },
    example: '1RB0LA_1LA---',
    exLabel: { en: 'Chapter 11’s invariant example', zh: '第 11 章的不变量例子' },
  },
  {
    key: 'long',
    name: { en: 'Long halters', zh: '长时间停机者' },
    nonhalt: 0,
    halt: 183,
    text: {
      en: 'Machines that halt, but only after many steps: simulated to the end. The champion takes all 47,176,870 steps.',
      zh: '会停机、但要走很久的机器：一直模拟到停。冠军要走满 47,176,870 步。',
    },
    example: CHAMPIONS.bb5,
    exLabel: { en: 'the BB(5) champion, first steps', zh: 'BB(5) 冠军的开头' },
  },
  {
    key: 'sporadic',
    name: { en: 'Sporadic machines', zh: '零散机器' },
    nonhalt: 13,
    halt: 0,
    text: {
      en: 'Thirteen machines no general decider could handle, each with its own hand-made proof formalised in Coq — among them Skelet #1 (a translated cycler whose cycle starts only after about 5.42 × 10⁵¹ steps, period 8,468,569,863), Skelet #10 (two Fibonacci-base counters) and Skelet #17 (a Gray-code counter, the last one solved).',
      zh: '十三台任何通用判定器都搞不定的机器，各有一份手工证明并在 Coq 中形式化——其中有 Skelet #1（一台平移循环机，但要约 5.42 × 10⁵¹ 步后才进入周期，周期 8,468,569,863）、Skelet #10（两个 Fibonacci 进制计数器）和 Skelet #17（Gray 码计数器，最后被解决的一台）。',
    },
    example: '1RB---_0LC1RE_0LD1LC_1RA1LB_0RB0RA',
    exLabel: { en: 'Skelet #17, first steps', zh: 'Skelet #17 的开头' },
  },
  {
    key: '1rb',
    name: { en: '1RB reduction', zh: '1RB 约化' },
    nonhalt: 24,
    halt: 0,
    text: {
      en: 'Tree Normal Form fixes the first transition to 1RB. A short argument handles the remaining machines whose first move is different.',
      zh: '树标准形把第一条转移固定为 1RB。剩下第一步不同的机器，用一段简短的论证处理。',
    },
  },
]

export function Pipeline() {
  const { t } = useLang()
  const [sel, setSel] = useState(0)
  const [steps, setSteps] = useState(150)
  const s = STAGES[sel]
  const total = STAGES.reduce((a, b) => a + b.nonhalt + b.halt, 0)
  const maxLog = Math.log10(STAGES[0].nonhalt + STAGES[0].halt)
  const rows = useMemo(() => (s.example ? history(parseTM(s.example)!, steps).rows : []), [s, steps])
  return (
    <div>
      <div className="c12-funnel">
        {STAGES.map((st, i) => {
          const n = st.nonhalt + st.halt
          const w = Math.max(4, (Math.log10(n) / maxLog) * 100)
          return (
            <button key={st.key} className={`c12-funnel-row ${i === sel ? 'on' : ''}`} onClick={() => setSel(i)}>
              <span className="c12-funnel-name">
                <L {...st.name} />
              </span>
              <span className="c12-funnel-bar">
                <span style={{ width: `${w}%` }}>
                  {st.halt > 0 && <i className="h" style={{ width: `${(st.halt / n) * 100}%` }} />}
                </span>
              </span>
              <span className="c12-funnel-n mono">{fmt(n)}</span>
            </button>
          )
        })}
      </div>
      <div className="small muted">
        {t(
          `Log-scale bars; gold = halting. Total ${fmt(total)} (133,005,895 never halt, 48,379,894 halt).`,
          `条形按对数画；金色 = 停机。合计 ${fmt(total)} 台（133,005,895 台永不停机，48,379,894 台停机）。`,
        )}
      </div>
      <div className="c12-stage">
        <div className="readout small c11-prose">
          <b>
            <L {...s.name} />
          </b>{' '}
          — <L {...s.text} />
        </div>
        {s.example && (
          <div>
            <div className="row small">
              <L {...s.exLabel!} />
              <span className="mono c11-codeshow">{s.example}</span>
              <Slider value={steps} min={50} max={3000} step={50} onChange={setSteps} label={<L en="steps" zh="步数" />} />
            </div>
            <SpaceTime rows={rows} maxH={95} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Antihydra                                                          */
/* ------------------------------------------------------------------ */
export function Antihydra() {
  const { t } = useLang()
  const [iters, setIters] = useState(2000)
  const [verify, setVerify] = useState<null | string[]>(null)
  const data = useMemo(() => {
    let a = 0
    let b = 4n
    const as: number[] = [a]
    let minA = Infinity
    let evens = 0
    let halted = -1
    for (let i = 0; i < iters; i++) {
      if (b % 2n === 0n) {
        a += 2
        b = (3n * b) / 2n + 2n
        evens++
      } else if (a === 0) {
        halted = i
        break
      } else {
        a -= 1
        b = (3n * (b - 1n)) / 2n + 3n
      }
      as.push(a)
      if (i > 0) minA = Math.min(minA, a)
    }
    return { as, a, bDigits: b.toString().length, minA, evens, halted }
  }, [iters])
  const W = 600
  const H = 140
  const maxA = Math.max(...data.as, 10)
  const pts = data.as
    .filter((_, i) => i % Math.max(1, Math.floor(data.as.length / 600)) === 0)
    .map((v, i, arr) => `${((i / Math.max(1, arr.length - 1)) * W).toFixed(1)},${(H - (v / maxA) * (H - 10)).toFixed(1)}`)
    .join(' ')
  const lg = data.a * Math.log10((Math.sqrt(5) - 1) / 2)
  const runRaw = () => {
    const sim = new Sim(parseTM(CHAMPIONS.antihydra)!, 1 << 14)
    const out: string[] = []
    let guard = 0
    while (out.length < 8 && guard++ < 2_000_000) {
      sim.step()
      if (sim.state !== 4 || sim.read(sim.pos) !== 0) continue
      let bb = 0
      while (sim.read(sim.pos - 1 - bb) === 1) bb++
      if (sim.read(sim.pos - 1 - bb) !== 0) continue
      let aa = 0
      while (sim.read(sim.pos - 2 - bb - aa) === 1) aa++
      if (aa + bb !== sim.ones) continue
      out.push(`A(${aa},${bb}) @ ${fmt(sim.steps)}`)
    }
    setVerify(out)
  }
  return (
    <div>
      <Slider value={iters} min={100} max={20000} step={100} onChange={setIters} label={<L en="rule steps" zh="规则步数" />} />
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="c12-ah">
        <line x1={0} y1={H} x2={W} y2={H} stroke="#ff6b6b" strokeDasharray="4 4" />
        <text x={4} y={H + 15} fill="#ff6b6b" fontSize="12">
          {t('a = 0: halts if b is odd here', 'a = 0：此时若 b 为奇数则停机')}
        </text>
        <line x1={0} y1={H} x2={W} y2={H - ((data.as.length - 1) / 2 / maxA) * (H - 10)} stroke="#9aa3c7" strokeDasharray="2 5" />
        <polyline points={pts} fill="none" stroke="#6be4ff" strokeWidth={1.5} />
        <text x={W - 4} y={14} fill="#9aa3c7" fontSize="12" textAnchor="end">
          {t(`max a = ${maxA}`, `a 的最大值 = ${maxA}`)}
        </text>
      </svg>
      <div className="row">
        <div className="stat">
          <span className="stat-label">a</span>
          <span className="stat-value">{data.a}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('digits of b', 'b 的位数')}</span>
          <span className="stat-value">{fmt(data.bDigits)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('even b / all', '偶数 b / 总数')}</span>
          <span className="stat-value">
            {fmt(data.evens)} / {fmt(data.as.length - 1)}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('heuristic halting chance', '启发式停机概率')}</span>
          <span className="stat-value">
            <M t={`\\approx 10^{${lg.toFixed(1)}}`} />
          </span>
        </div>
      </div>
      <div className="small muted">
        {data.halted >= 0
          ? t(`Halted at rule step ${data.halted}!`, `在第 ${data.halted} 个规则步停机！`)
          : t(
              `No halt. The dotted grey line is the average drift a ≈ k/2. Lowest a after the start: ${data.minA}.`,
              `没有停机。灰色虚线是平均漂移 a ≈ k/2。起步之后 a 的最小值：${data.minA}。`,
            )}
      </div>
      <div className="btn-row">
        <button className="btn small" onClick={runRaw}>
          <L en="Check the rules against the raw 6-state machine" zh="用原始的六状态机器核对这些规则" />
        </button>
      </div>
      {verify && <div className="readout small">{verify.join('   ')}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 7. The independence timeline                                          */
/* ------------------------------------------------------------------ */
const ZF = [
  { n: 7918, d: 2016.37, who: 'Yedidia–Aaronson' },
  { n: 1919, d: 2016.38, who: "O'Rear" },
  { n: 748, d: 2016.45, who: "O'Rear" },
  { n: 745, d: 2023.54, who: 'Riebel' },
  { n: 643, d: 2024.54, who: 'Ridenour' },
  { n: 636, d: 2024.66, who: 'Ridenour' },
  { n: 588, d: 2025.53, who: 'Wade' },
  { n: 549, d: 2025.54, who: 'Wade' },
  { n: 432, d: 2025.63, who: 'Wade' },
  { n: 254, d: 2026.78, who: 'Mira, Ketchersid' },
  { n: 230, d: 2026.8, who: 'Glazer' },
]
const CONJ = [
  { n: 744, en: 'Riemann hypothesis', zh: '黎曼猜想' },
  { n: 25, en: 'Goldbach', zh: 'Goldbach 猜想' },
  { n: 15, en: 'Erdős (powers of 2 in base 3)', zh: 'Erdős（2 的幂的三进制）' },
]

export function IndependenceChart() {
  const { t } = useLang()
  const [hover, setHover] = useState<number | null>(10)
  const W = 640
  const H = 250
  const x0 = 2015.8
  const x1 = 2027
  const X = (d: number) => 50 + ((d - x0) / (x1 - x0)) * (W - 70)
  const Y = (n: number) => 20 + (1 - Math.log10(n) / 4) * (H - 50)
  const path = ZF.map((p, i) => `${i ? 'L' : 'M'}${X(p.d).toFixed(1)},${Y(p.n).toFixed(1)}`).join(' ')
  const h = hover !== null ? ZF[hover] : null
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="c12-chart" role="img" aria-label={t('state counts of ZF-independent machines over time', 'ZF 独立机器的状态数随时间变化')}>
        {[1, 10, 100, 1000, 10000].map((v) => (
          <g key={v}>
            <line x1={50} x2={W - 20} y1={Y(v)} y2={Y(v)} stroke="#2a3563" />
            <text x={44} y={Y(v) + 4} fill="#9aa3c7" fontSize="11" textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        {[2016, 2018, 2020, 2022, 2024, 2026].map((y) => (
          <text key={y} x={X(y)} y={H - 8} fill="#9aa3c7" fontSize="11" textAnchor="middle">
            {y}
          </text>
        ))}
        <rect x={50} y={Y(5)} width={W - 70} height={Y(1) - Y(5)} fill="rgba(125,255,168,0.12)" />
        <text x={56} y={Y(5) + 14} fill="#7dffa8" fontSize="11">
          {t('BB(1)…BB(5) known', 'BB(1)…BB(5) 已知')}
        </text>
        {CONJ.map((c) => (
          <g key={c.n}>
            <line x1={50} x2={W - 20} y1={Y(c.n)} y2={Y(c.n)} stroke="#b59bff" strokeDasharray="3 4" opacity={0.6} />
            <text x={W - 22} y={c.n > 500 ? Y(c.n) + 13 : Y(c.n) - 3} fill="#b59bff" fontSize="10.5" textAnchor="end">
              {t(c.en, c.zh)} · {c.n}
            </text>
          </g>
        ))}
        <path d={path} fill="none" stroke="#ffd36b" strokeWidth={2} />
        {ZF.map((p, i) => (
          <circle
            key={i}
            cx={X(p.d)}
            cy={Y(p.n)}
            r={hover === i ? 7 : 4.5}
            fill={i === 8 ? '#ff7ab6' : '#ffd36b'}
            stroke="#0b1128"
            tabIndex={0}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onClick={() => setHover(i)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </svg>
      <div className="readout small c11-prose">
        {h && (
          <L
            en={<>{h.n} states — {h.who}, {Math.floor(h.d)}{hover === 8 ? ' (the figure in the book)' : ''}{hover === 10 ? ' (current record as of October 2026)' : ''}.</>}
            zh={<>{h.n} 个状态——{h.who}，{Math.floor(h.d)} 年{hover === 8 ? '（书中给出的数字）' : ''}{hover === 10 ? '（截至 2026 年 10 月的纪录）' : ''}。</>}
          />
        )}{' '}
        <L en="Gold: machines that halt iff ZF is inconsistent. Violet: machines that halt iff a famous conjecture fails (the book’s figures)." zh="金色：当且仅当 ZF 不一致时停机的机器。紫色：当且仅当某个著名猜想不成立时停机的机器（书中的数字）。" />
      </div>
    </div>
  )
}
