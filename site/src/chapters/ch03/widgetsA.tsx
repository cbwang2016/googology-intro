import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import * as O from './ordinal'

export const COL = {
  gold: '#ffd36b',
  cyan: '#6be4ff',
  pink: '#ff7ab6',
  green: '#7dffa8',
  red: '#ff6b6b',
  violet: '#b59bff',
  orange: '#ffa95e',
  muted: '#9aa3c7',
  dim: '#6b7399',
  line: '#2a3563',
}

/* ================================================================== */
/* 1. The race: runners finishing at 1/2, 3/4, 7/8, … and at 1         */
/* ================================================================== */
type Runner = { t: number; place: O.Ord; wave: number }

function runners(two: boolean): Runner[] {
  const out: Runner[] = []
  for (let k = 0; k < 40; k++) out.push({ t: 1 - Math.pow(2, -(k + 1)), place: O.nat(k), wave: 0 })
  out.push({ t: 1, place: O.OMEGA, wave: 1 })
  if (two) {
    for (let k = 0; k < 40; k++) out.push({ t: 2 - Math.pow(2, -(k + 1)), place: O.add(O.OMEGA, O.nat(k + 1)), wave: 2 })
    out.push({ t: 2, place: O.parse('w*2'), wave: 3 })
  }
  return out
}

export function Race() {
  const { t: tr } = useLang()
  const [two, setTwo] = useState(false)
  const T = two ? 2 : 1
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const raf = useRef<number | null>(null)
  const rs = useMemo(() => runners(two), [two])
  useEffect(() => {
    if (!playing) return
    const start = performance.now()
    const t0 = time >= T ? 0 : time
    const tick = (now: number) => {
      const t = Math.min(T, t0 + ((now - start) / 4500) * T)
      setTime(t)
      if (t < T) raf.current = requestAnimationFrame(tick)
      else setPlaying(false)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, T])
  const W = 700
  const x = (t: number) => 30 + (t / T) * (W - 70)
  const done = rs.filter((r) => r.t <= time + 1e-12)
  // finished count in the first wave is unbounded as time → 1
  const firstWave = time >= 1 ? Infinity : Math.max(0, Math.floor(-Math.log2(1 - time)))
  const last = done[done.length - 1]
  const countText =
    firstWave === Infinity
      ? tr('all of 0, 1, 2, … (infinitely many)', '0、1、2、……全部（无穷多个）')
      : String(firstWave)
  const placeLabel = (r: Runner) => O.plain(r.place)
  return (
    <div>
      <svg viewBox={`0 0 ${W} 130`} style={{ width: '100%', display: 'block' }} role="img" aria-label={tr('race timeline', '比赛时间轴')}>
        <line x1={x(0)} y1={70} x2={x(T)} y2={70} stroke={COL.line} strokeWidth={2} />
        {Array.from({ length: T + 1 }, (_, i) => (
          <g key={i}>
            <line x1={x(i)} y1={64} x2={x(i)} y2={76} stroke={COL.dim} />
            <text x={x(i)} y={98} fill={COL.dim} fontSize={12} textAnchor="middle">
              t = {i}
            </text>
          </g>
        ))}
        {rs.map((r, i) => {
          const fin = r.t <= time + 1e-12
          const big = r.wave === 1 || r.wave === 3
          return (
            <circle
              key={i}
              cx={x(r.t)}
              cy={70}
              r={big ? 7 : Math.max(1.2, 5 * Math.pow(0.86, i % 41))}
              fill={fin ? (big ? COL.gold : r.wave === 2 ? COL.pink : COL.cyan) : 'transparent'}
              stroke={big ? COL.gold : r.wave === 2 ? COL.pink : COL.cyan}
              strokeWidth={big ? 2 : 1}
              opacity={fin ? 1 : 0.35}
            />
          )
        })}
        {rs
          .filter((r) => r.wave === 0 || r.wave === 2)
          .filter((_, i) => i % 41 < 3)
          .map((r, i) => (
            <text key={i} x={x(r.t)} y={52} fill={COL.muted} fontSize={12} textAnchor="middle">
              {placeLabel(r)}
            </text>
          ))}
        {rs
          .filter((r) => r.wave === 1 || r.wave === 3)
          .map((r, i) => (
            <text key={i} x={x(r.t)} y={40} fill={revealed ? COL.gold : COL.dim} fontSize={16} fontWeight={700} textAnchor="middle">
              {revealed ? placeLabel(r) : '?'}
            </text>
          ))}
        <text x={x(time)} y={122} fill={COL.green} fontSize={12} textAnchor="middle">
          ▲ {tr('now', '此刻')}
        </text>
      </svg>
      <Slider value={Math.round(time * 1000) / 1000} min={0} max={T} step={0.001} onChange={(v) => setTime(v)} label={<L en="time" zh="时间" />} />
      <div className="btn-row">
        <button className="btn small" onClick={() => setPlaying(true)} disabled={playing}>
          <L en="▶ Run the race" zh="▶ 开跑" />
        </button>
        <button className={`chip ${!two ? 'on' : ''}`} onClick={() => (setTwo(false), setTime(0))}>
          <L en="one wave" zh="一批选手" />
        </button>
        <button className={`chip ${two ? 'on' : ''}`} onClick={() => (setTwo(true), setTime(0))}>
          <L en="two waves" zh="两批选手" />
        </button>
        <button className="chip" onClick={() => setRevealed(!revealed)}>
          {revealed ? <L en="hide the places" zh="隐藏名次" /> : <L en="reveal the gold places" zh="揭晓金色选手的名次" />}
        </button>
      </div>
      <div className="readout small c03-text">
        <L en="finished in the first wave: " zh="第一批已到达：" />
        <b style={{ color: COL.cyan }}>{countText}</b>
        {last && (
          <>
            {'  ·  '}
            <L en="latest finisher’s place: " zh="最新到达者的名次：" />
            <b style={{ color: COL.gold }}>{last.wave % 2 === 1 && !revealed ? '?' : placeLabel(last)}</b>
          </>
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 2. Accumulating points: build ω, ω+1, ω·2, ω², …, ω^ω on [0,1)      */
/* ================================================================== */
type Pt = { a: O.Ord; x: number; rank: number }

const STAGES: { key: string; src: string; tex: string }[] = [
  { key: 'w', src: 'w', tex: '\\omega' },
  { key: 'w+1', src: 'w+1', tex: '\\omega+1' },
  { key: 'w2', src: 'w*2', tex: '\\omega\\cdot2' },
  { key: 'w3', src: 'w*3', tex: '\\omega\\cdot3' },
  { key: 'ww', src: 'w^2', tex: '\\omega^2' },
  { key: 'w2+w', src: 'w^2+w', tex: '\\omega^2+\\omega' },
  { key: 'www', src: 'w^3', tex: '\\omega^3' },
  { key: 'wtw', src: 'w^w', tex: '\\omega^\\omega' },
]

const rankOf = (a: O.Ord) => (a.length === 0 ? 0 : O.isSucc(a) ? 0 : Math.min(3, O.natVal(a[a.length - 1].e)))

/** Generate the points prefix + β (β < ω^K) mapped to offset + scale·P_K(β), pruned by pixel size. */
function gen(K: number, offset: number, scale: number, prefix: O.Ord, view: [number, number], pxPerUnit: number, out: Pt[], cStart = 0) {
  const [v0, v1] = view
  if (K === 1) {
    for (let n = cStart; n < 4000; n++) {
      const xx = offset + scale * (1 - Math.pow(2, -n))
      if (xx > v1) break
      if (scale * Math.pow(2, -n) * pxPerUnit < 0.6) break
      if (xx >= v0) {
        const a = O.add(prefix, O.nat(n))
        out.push({ a, x: xx, rank: rankOf(a) })
      }
    }
    return
  }
  for (let c = cStart; c < 4000; c++) {
    const lo = offset + scale * (1 - Math.pow(2, -c))
    const w = scale * Math.pow(2, -c - 1)
    if (lo > v1) break
    if (scale * Math.pow(2, -c) * pxPerUnit < 0.6) break
    if (lo + w < v0) continue
    gen(K - 1, lo, w, O.add(prefix, O.wpow(O.nat(K - 1), c)), view, pxPerUnit, out)
  }
}

function stagePoints(S: O.Ord, view: [number, number], pxPerUnit: number): { pts: Pt[]; xs: number } {
  const out: Pt[] = []
  const d = O.degree(S)
  if (d === Infinity) {
    gen(1, 0, 0.5, O.ZERO, view, pxPerUnit, out)
    for (let k = 1; k < 60; k++) {
      const B = Math.pow(2, -k)
      const A = 1 - B - B / 2
      if (1 - B > view[1]) break
      if (B * pxPerUnit < 0.6) break
      gen(k + 1, A, B, O.ZERO, view, pxPerUnit, out, 1)
    }
    return { pts: out, xs: 1 }
  }
  const K = d + 1
  const xs = O.posK(S, K)
  gen(K, 0, 1, O.ZERO, [view[0], Math.min(view[1], xs)], pxPerUnit, out)
  return { pts: out.filter((p) => p.x < xs - 1e-15), xs }
}

export function AccumLine() {
  const { t } = useLang()
  const [stage, setStage] = useState(0)
  const S = useMemo(() => O.parse(STAGES[stage].src), [stage])
  const [zoom, setZoom] = useState<{ c: number; w: number } | null>(null)
  const [hover, setHover] = useState<Pt | null>(null)
  const W = 700
  const PAD = 24
  const full = useMemo(() => {
    const d = O.degree(S)
    return d === Infinity ? 1 : O.posK(S, d + 1)
  }, [S])
  const v0 = zoom ? zoom.c - zoom.w / 2 : 0
  const v1 = zoom ? zoom.c + zoom.w / 2 : full
  const pxPerUnit = (W - 2 * PAD) / (v1 - v0)
  const X = (x: number) => PAD + (x - v0) * pxPerUnit
  const { pts, xs } = useMemo(() => stagePoints(S, [v0, v1], pxPerUnit), [S, v0, v1, pxPerUnit])
  // labels: greedy, high rank first
  const labels = useMemo(() => {
    const cand = [...pts, { a: S, x: xs, rank: 4 }].filter((p) => p.x >= v0 && p.x <= v1 + 1e-12)
    cand.sort((a, b) => b.rank - a.rank || a.x - b.x)
    const placed: Pt[] = []
    for (const p of cand) {
      const px = X(p.x)
      const need = Math.max(30, O.plain(p.a).length * 7.5)
      if (placed.every((q) => Math.abs(X(q.x) - px) >= need)) placed.push(p)
      if (placed.length > 40) break
    }
    return placed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pts, S, xs, v0, v1])
  const onClick = (e: MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const x = v0 + (px - PAD) / pxPerUnit
    const w = (v1 - v0) / 4
    setZoom({ c: Math.min(Math.max(x, v0 + w / 2), v1 - w / 2), w })
  }
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    let best: Pt | null = null
    let bd = 12
    for (const p of [...pts, { a: S, x: xs, rank: 4 }]) {
      const d = Math.abs(X(p.x) - px)
      if (d < bd) {
        bd = d
        best = p
      }
    }
    setHover(best)
  }
  const tickH = [10, 20, 30, 40, 26]
  const tickC = [COL.cyan, COL.violet, COL.pink, COL.orange, COL.gold]
  const mag = zoom ? full / zoom.w : 1
  return (
    <div>
      <div className="btn-row">
        {STAGES.map((s, i) => (
          <button
            key={s.key}
            className={`chip ${i === stage ? 'on' : ''}`}
            onClick={() => {
              setStage(i)
              setZoom(null)
            }}
          >
            <M t={s.tex} />
          </button>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${W} 120`}
        style={{ width: '100%', display: 'block', cursor: 'zoom-in', touchAction: 'manipulation' }}
        onClick={onClick}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={t('ordinals as points on a line', '序数排成一条线上的点')}
      >
        <line x1={PAD} y1={80} x2={W - PAD} y2={80} stroke={COL.line} strokeWidth={1.5} />
        {pts.map((p, i) => (
          <line key={i} x1={X(p.x)} x2={X(p.x)} y1={80} y2={80 - tickH[p.rank]} stroke={tickC[p.rank]} strokeWidth={p.rank > 0 ? 1.6 : 1} opacity={0.9} />
        ))}
        {xs >= v0 && xs <= v1 + 1e-12 && <circle cx={X(xs)} cy={80} r={6} fill={COL.gold} />}
        {labels.map((p, i) => (
          <text key={i} x={X(p.x)} y={p.rank >= 1 ? 80 - tickH[Math.min(p.rank, 4)] - 6 : 100} fill={p.rank === 4 ? COL.gold : p.rank > 0 ? tickC[p.rank] : COL.muted} fontSize={p.rank > 0 ? 13 : 11} textAnchor="middle">
            {O.plain(p.a)}
          </text>
        ))}
        {hover && <line x1={X(hover.x)} x2={X(hover.x)} y1={30} y2={86} stroke="#fff" strokeOpacity={0.5} strokeDasharray="2 2" />}
      </svg>
      <div className="btn-row">
        <button className="btn small" disabled={!zoom} onClick={() => setZoom(null)}>
          <L en="Reset zoom" zh="复原" />
        </button>
        <span className="muted small" style={{ alignSelf: 'center' }}>
          {t(`magnification ×${mag < 1e6 ? Math.round(mag) : mag.toExponential(1)} · ${pts.length} points drawn`, `放大 ×${mag < 1e6 ? Math.round(mag) : mag.toExponential(1)} · 已画 ${pts.length} 个点`)}
        </span>
      </div>
      <div className="readout small c03-text">
        {hover ? (
          <>
            <L en="pointer at: " zh="指针处：" />
            <M t={O.tex(hover.a)} />
            {O.isLimit(hover.a) && <span style={{ color: COL.pink }}>{t('  — a limit: no immediate predecessor', '  ——极限序数：没有紧挨着的前一个')}</span>}
          </>
        ) : (
          <L
            en={<>Gold dot = <M t={STAGES[stage].tex} />. Every point to its left is a smaller ordinal. Click anywhere to zoom ×4; hover to read a point.</>}
            zh={<>金点就是 <M t={STAGES[stage].tex} />，它左边的每一个点都是更小的序数。点击任意处放大 4 倍；把指针移到点上查看名字。</>}
          />
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 3. Sticks: ordinal addition and multiplication as concatenation      */
/* ================================================================== */
type Seg = { kind: '1' | 'w'; col: number; pair?: boolean }
const PALETTE = [COL.cyan, COL.pink, COL.green, COL.orange, COL.violet, COL.gold, COL.red]

type Elem = { seg: number; idx: number; col: string }

function normalizeSegs(segs: Seg[]): { kind: '1' | 'w'; elems: Elem[] }[] {
  // a finite run of single sticks directly before an ω-run is absorbed into it
  const out: { kind: '1' | 'w'; elems: Elem[] }[] = []
  let pending: Elem[] = []
  segs.forEach((s, si) => {
    if (s.kind === '1') pending.push({ seg: si, idx: 0, col: PALETTE[s.col % PALETTE.length] })
    else {
      const elems: Elem[] = [...pending]
      for (let k = 0; k < 18; k++) elems.push({ seg: si, idx: k, col: PALETTE[s.col % PALETTE.length] })
      out.push({ kind: 'w', elems })
      pending = []
    }
  })
  for (const p of pending) out.push({ kind: '1', elems: [p] })
  return out
}

function segTexts(segs: Seg[]): string {
  return segs.map((s) => (s.kind === '1' ? '1' : '\\omega')).join('+') || '0'
}

const STICK_PRESETS: { name: string; tex: string; build: () => { segs: Seg[]; ord: O.Ord; expr: string } }[] = [
  { name: '1+w', tex: '1+\\omega', build: () => ({ segs: [{ kind: '1', col: 1 }, { kind: 'w', col: 0 }], ord: O.parse('1+w'), expr: '1+\\omega' }) },
  { name: 'w+1', tex: '\\omega+1', build: () => ({ segs: [{ kind: 'w', col: 0 }, { kind: '1', col: 1 }], ord: O.parse('w+1'), expr: '\\omega+1' }) },
  { name: '2w', tex: '2\\cdot\\omega', build: () => ({ segs: [{ kind: 'w', col: 0, pair: true }], ord: O.parse('2*w'), expr: '2\\cdot\\omega' }) },
  { name: 'w2', tex: '\\omega\\cdot 2', build: () => ({ segs: [{ kind: 'w', col: 0 }, { kind: 'w', col: 1 }], ord: O.parse('w*2'), expr: '\\omega\\cdot2' }) },
  {
    name: '(w+1)2',
    tex: '(\\omega+1)\\cdot 2',
    build: () => ({
      segs: [
        { kind: 'w', col: 0 },
        { kind: '1', col: 1 },
        { kind: 'w', col: 2 },
        { kind: '1', col: 3 },
      ],
      ord: O.parse('(w+1)*2'),
      expr: '(\\omega+1)\\cdot2',
    }),
  },
]

export function Sticks() {
  const { t } = useLang()
  const [st, setSt] = useState(() => STICK_PRESETS[0].build())
  const [preset, setPreset] = useState(0)
  const segs = st.segs
  const W = 700
  // layout source row
  const unitW = (s: Seg) => (s.kind === '1' ? 26 : 120)
  const total = segs.reduce((a, s) => a + unitW(s), 0) + 14 * segs.length
  const scale = Math.min(1, (W - 40) / Math.max(total, 1))
  const srcPos = new Map<string, number>()
  let cx = 20
  const srcDraw: { x: number; h: number; col: string; key: string }[] = []
  const limitMarks: number[] = []
  segs.forEach((s, si) => {
    const col = PALETTE[s.col % PALETTE.length]
    if (s.kind === '1') {
      srcDraw.push({ x: cx + 6 * scale, h: 34, col, key: `${si}:0` })
      srcPos.set(`${si}:0`, cx + 6 * scale)
      cx += (26 + 14) * scale
    } else {
      const w = 120 * scale
      for (let k = 0; k < 18; k++) {
        const xx = cx + w * (1 - Math.pow(0.78, k))
        const c = s.pair && k % 2 === 1 ? '#ffffff' : col
        srcDraw.push({ x: xx, h: 34 * Math.pow(0.93, k), col: c, key: `${si}:${k}` })
        srcPos.set(`${si}:${k}`, xx)
      }
      limitMarks.push(cx + w)
      cx += w + 14 * scale
    }
  })
  const norm = normalizeSegs(segs)
  const nTotal = norm.reduce((a, s) => a + (s.kind === '1' ? 26 : 120), 0) + 14 * norm.length
  const nscale = Math.min(1, (W - 40) / Math.max(nTotal, 1))
  let nx = 20
  const dstDraw: { x: number; h: number; col: string; key: string }[] = []
  const dstLimit: number[] = []
  for (const s of norm) {
    if (s.kind === '1') {
      const e = s.elems[0]
      dstDraw.push({ x: nx + 6 * nscale, h: 34, col: e.col, key: `${e.seg}:${e.idx}` })
      nx += (26 + 14) * nscale
    } else {
      const w = 120 * nscale
      s.elems.forEach((e, k) => {
        const seg = segs[e.seg]
        const c = seg.pair && seg.kind === 'w' && e.idx % 2 === 1 ? '#ffffff' : e.col
        dstDraw.push({ x: nx + w * (1 - Math.pow(0.78, k)), h: 34 * Math.pow(0.93, k), col: c, key: `${e.seg}:${e.idx}` })
      })
      dstLimit.push(nx + w)
      nx += w + 14 * nscale
    }
  }
  const links = dstDraw.filter((d) => {
    const [, idx] = d.key.split(':').map(Number)
    return idx < 3 && srcPos.has(d.key)
  })
  const absorbed = segs.length !== norm.reduce((a, s) => a + (s.kind === 'w' ? 1 : s.elems.length), 0)
  const apply = (op: '+1' | '+w' | 'x2' | '2x') => {
    if (segs.length >= 8 && op !== '2x') return
    setPreset(-1)
    setSt((p) => {
      const nextCol = p.segs.length
      if (op === '+1') return { segs: [...p.segs, { kind: '1', col: nextCol }], ord: O.add(p.ord, O.ONE), expr: p.expr === '0' ? '1' : `${p.expr}+1` }
      if (op === '+w') return { segs: [...p.segs, { kind: 'w', col: nextCol }], ord: O.add(p.ord, O.OMEGA), expr: p.expr === '0' ? '\\omega' : `${p.expr}+\\omega` }
      if (op === 'x2') return { segs: [...p.segs, ...p.segs.map((s) => ({ ...s, col: s.col + p.segs.length }))], ord: O.mul(p.ord, O.nat(2)), expr: `(${p.expr})\\cdot2` }
      const segs2: Seg[] = []
      p.segs.forEach((s) => {
        if (s.kind === '1') segs2.push({ ...s }, { ...s, col: s.col + 3 })
        else segs2.push({ ...s, pair: true })
      })
      return { segs: segs2, ord: O.mul(O.nat(2), p.ord), expr: `2\\cdot(${p.expr})` }
    })
  }
  return (
    <div>
      <div className="btn-row">
        {STICK_PRESETS.map((p, i) => (
          <button
            key={p.name}
            className={`chip ${preset === i ? 'on' : ''}`}
            onClick={() => {
              setPreset(i)
              setSt(p.build())
            }}
          >
            <M t={p.tex} />
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} 190`} style={{ width: '100%', display: 'block' }} role="img" aria-label={t('order types as sticks', '用小棍表示序型')}>
        <text x={6} y={14} fill={COL.dim} fontSize={11}>
          {t('as built', '拼出来的样子')}
        </text>
        <text x={6} y={120} fill={COL.dim} fontSize={11}>
          {t('the same line, relabelled', '同一条队伍，重新编号')}
        </text>
        {links.map((d, i) => (
          <line key={i} x1={srcPos.get(d.key)!} y1={62} x2={d.x} y2={130} stroke={d.col} strokeOpacity={0.35} />
        ))}
        {srcDraw.map((d, i) => (
          <line key={i} x1={d.x} x2={d.x} y1={60} y2={60 - d.h} stroke={d.col} strokeWidth={3} strokeLinecap="round" />
        ))}
        {limitMarks.map((x, i) => (
          <line key={i} x1={x} x2={x} y1={20} y2={64} stroke={COL.dim} strokeDasharray="3 3" />
        ))}
        {dstDraw.map((d, i) => (
          <line key={i} x1={d.x} x2={d.x} y1={170} y2={170 - d.h} stroke={d.col} strokeWidth={3} strokeLinecap="round" />
        ))}
        {dstLimit.map((x, i) => (
          <line key={i} x1={x} x2={x} y1={130} y2={174} stroke={COL.dim} strokeDasharray="3 3" />
        ))}
      </svg>
      <div className="btn-row">
        <button className="btn small" onClick={() => apply('+1')}>
          + 1
        </button>
        <button className="btn small" onClick={() => apply('+w')}>
          + ω
        </button>
        <button className="btn small" onClick={() => apply('x2')}>
          <L en="· 2 (two copies)" zh="· 2（复制一份接在后面）" />
        </button>
        <button className="btn small" onClick={() => apply('2x')}>
          <L en="2 · (double every stick)" zh="2 ·（每根小棍变成两根）" />
        </button>
        <button
          className="btn small"
          onClick={() => {
            setPreset(-1)
            setSt({ segs: [], ord: O.ZERO, expr: '0' })
          }}
        >
          <L en="Clear" zh="清空" />
        </button>
      </div>
      <div className="readout c03-text">
        <M t={`${st.expr}${st.expr !== segTexts(segs) && segs.length < 6 ? `=${segTexts(segs)}` : ''}=${O.tex(st.ord)}`} />
        {absorbed && (
          <div className="small" style={{ color: COL.pink, marginTop: 4 }}>
            {t('Some finite sticks stood just before an ω-run and were swallowed by it.', '有几根小棍正好排在一整串 ω 之前，被它“吞掉”了。')}
          </div>
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 4. Fixed-point machine: iterate from 0, take the sup                 */
/* ================================================================== */
type FP = {
  key: string
  fTex: string
  steps: string[]
  supTex: string
  why: { en: string; zh: string }
}

function fpData(): FP[] {
  const iter = (f: (a: O.Ord) => O.Ord, k: number) => {
    const out: string[] = []
    let a = O.ZERO
    for (let i = 0; i < k; i++) {
      out.push(O.tex(a))
      a = f(a)
    }
    return out
  }
  return [
    {
      key: '1+a',
      fTex: '\\alpha\\mapsto 1+\\alpha',
      steps: iter((a) => O.add(O.ONE, a), 6),
      supTex: '\\omega',
      why: { en: '1+ω = sup{1+n} = sup{n+1} = ω', zh: '1+ω = sup{1+n} = sup{n+1} = ω' },
    },
    {
      key: '2^a',
      fTex: '\\alpha\\mapsto 2^{\\alpha}',
      steps: ['0', '1', '2', '4', '16', '65536', '2^{65536}'],
      supTex: '\\omega',
      why: { en: '2^ω = sup{2ⁿ} = ω — the tower 2, 4, 16, 65536, … still only climbs to ω', zh: '2^ω = sup{2ⁿ} = ω——2、4、16、65536……这座塔也只爬到 ω' },
    },
    {
      key: 'w+a',
      fTex: '\\alpha\\mapsto \\omega+\\alpha',
      steps: iter((a) => O.add(O.OMEGA, a), 6),
      supTex: '\\omega^2',
      why: { en: 'ω+ω² = sup{ω+ω·n} = sup{ω·(n+1)} = ω²', zh: 'ω+ω² = sup{ω+ω·n} = sup{ω·(n+1)} = ω²' },
    },
    {
      key: 'w^a',
      fTex: '\\alpha\\mapsto \\omega^{\\alpha}',
      steps: iter((a) => O.wpow(a), 6),
      supTex: '\\varepsilon_0',
      why: { en: 'ω^ε₀ = sup{ω^(ω↑↑n)} = sup{ω↑↑(n+1)} = ε₀', zh: 'ω^ε₀ = sup{ω^(ω↑↑n)} = sup{ω↑↑(n+1)} = ε₀' },
    },
  ]
}

export function FixedPointMachine() {
  const data = useMemo(fpData, [])
  const [which, setWhich] = useState(3)
  const [k, setK] = useState(1)
  const d = data[which]
  const n = d.steps.length
  const showSup = k > n
  return (
    <div>
      <div className="btn-row">
        {data.map((x, i) => (
          <button
            key={x.key}
            className={`chip ${i === which ? 'on' : ''}`}
            onClick={() => {
              setWhich(i)
              setK(1)
            }}
          >
            <M t={x.fTex} />
          </button>
        ))}
      </div>
      <div className="c03-fp">
        {d.steps.slice(0, Math.min(k, n)).map((s, i) => (
          <div key={i} className="c03-fp-step" style={{ opacity: 0.55 + (0.45 * (i + 1)) / n }}>
            {i > 0 && <span className="c03-fp-arrow">→</span>}
            <M t={s} />
          </div>
        ))}
        {k > 1 && k <= n && <span className="c03-fp-arrow muted">→ …</span>}
        {showSup && (
          <div className="c03-fp-step c03-fp-sup">
            <span className="c03-fp-arrow">⇒ sup =</span>
            <M t={d.supTex} />
          </div>
        )}
      </div>
      <div className="btn-row">
        <button className="btn small" disabled={k > n} onClick={() => setK(k + 1)}>
          <L en="Apply f once more" zh="再作用一次 f" />
        </button>
        <button className="btn small" disabled={showSup} onClick={() => setK(n + 1)}>
          <L en="Jump to the supremum" zh="直接跳到上确界" />
        </button>
        <button className="btn small" onClick={() => setK(1)}>
          <L en="Reset" zh="重来" />
        </button>
      </div>
      <div className="readout small c03-text" style={{ minHeight: '2.6em' }}>
        {showSup ? (
          <>
            <L en="Apply f to the supremum: " zh="把 f 作用在上确界上：" />
            <b style={{ color: COL.gold }}>
              <L {...d.why} />
            </b>
            <L en=" — it does not move. A fixed point." zh="——纹丝不动。这就是不动点。" />
          </>
        ) : (
          <L en="Start at 0 and keep applying f. Each value is bigger than the last…" zh="从 0 出发，不断作用 f。每一步都比上一步大……" />
        )}
      </div>
    </div>
  )
}
