import { useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { arrowSize, type Size } from '../../lib/arrows'
import { toTex } from '../../lib/huge'
import * as O from '../ch03/ordinal'
import { COL } from '../ch03/widgetsA'
import * as F from './fgh'

/* ================================================================== */
/* 1. Fundamental-sequence stepper with rule trace                      */
/* ================================================================== */
type TLine = { tex: string; rule: string }
const RULE: Record<string, { en: string; zh: string }> = {
  r1: { en: 'rule (1): ω[n] = n', zh: '规则 (1)：ω[n] = n' },
  r2: { en: 'rule (2): (α+β)[n] = α+β[n]', zh: '规则 (2)：(α+β)[n] = α+β[n]' },
  r3: { en: 'rule (3): ω^(α+1)[n] = ω^α·n', zh: '规则 (3)：ω^(α+1)[n] = ω^α·n' },
  r4: { en: 'rule (4): ω^λ[n] = ω^(λ[n])', zh: '规则 (4)：ω^λ[n] = ω^(λ[n])' },
  e0: { en: 'ε₀[n] = ω↑↑n', zh: 'ε₀[n] = ω↑↑n' },
  res: { en: 'normal form', zh: '化成标准型' },
}
const wTex = (b: O.Ord) => (O.eq(b, O.ONE) ? '\\omega' : `\\omega^{${O.tex(b)}}`)

function traceFS(a: O.Ord, n: number, wrap: (s: string) => string, out: TLine[]) {
  const last = a[a.length - 1]
  const rest: O.Ord = last.c > 1 ? [...a.slice(0, -1), { e: last.e, c: last.c - 1 }] : a.slice(0, -1)
  const pre = O.tex(rest)
  const join = (s: string) => (rest.length ? `${pre}+${s}` : s)
  const beta = last.e
  if (rest.length) out.push({ tex: wrap(join(`(${wTex(beta)})[${n}]`)), rule: 'r2' })
  if (O.isSucc(beta)) {
    const p = O.pred(beta)
    const body = n === 0 ? '0' : O.isZero(p) ? String(n) : `${wTex(p)}\\cdot ${n}`
    out.push({ tex: wrap(join(body)), rule: O.isZero(p) ? 'r1' : 'r3' })
  } else {
    out.push({ tex: wrap(join(`\\omega^{(${O.tex(beta)})[${n}]}`)), rule: 'r4' })
    traceFS(beta, n, (s) => wrap(join(`\\omega^{${s}}`)), out)
  }
}

const FS_PRESETS = ['w*2', 'w^2', 'w^w', 'w^(w+1)', 'w^(w^w)', 'w^(w^(w+1)*2)*3', 'e0']

export function FSStepper() {
  const { t } = useLang()
  const [src, setSrc] = useState('w^(w^(w+1)*2)*3')
  const [n, setN] = useState(2)
  const parsed = useMemo(() => {
    try {
      return { ok: true as const, a: F.parseIdx(src) }
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : String(e) }
    }
  }, [src])
  let lines: TLine[] = []
  let seq: string[] = []
  let succ = false
  if (parsed.ok) {
    const a = parsed.a
    if (F.isLim(a)) {
      if (a === 'e0') lines = [{ tex: `\\varepsilon_0[${n}]=\\omega\\uparrow\\uparrow ${n}=${O.tex(O.omegaTower(n))}`, rule: 'e0' }]
      else {
        traceFS(a, n, (s) => s, lines)
        lines.push({ tex: O.tex(O.fs(a, n)), rule: 'res' })
      }
      seq = Array.from({ length: 5 }, (_, i) => O.tex(F.fsIdx(a, i)))
    } else succ = true
  }
  const head = parsed.ok ? `${F.idxTex(parsed.a)}[${n}]` : ''
  return (
    <div>
      <div className="btn-row">
        {FS_PRESETS.map((p) => (
          <button key={p} className={`chip ${p === src ? 'on' : ''}`} onClick={() => setSrc(p)}>
            <M t={F.idxTex(F.parseIdx(p))} />
          </button>
        ))}
      </div>
      <div className="row">
        <label className="mono">
          α = <input type="text" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} style={{ width: 220 }} aria-label="alpha" />
        </label>
        <span className="muted small">{t('w = ω, e0 = ε₀', 'w 表示 ω，e0 表示 ε₀')}</span>
      </div>
      <Slider value={n} min={0} max={5} onChange={setN} label="n" />
      <div className="readout c04-trace">
        {!parsed.ok && <span style={{ color: COL.red }}>{parsed.err}</span>}
        {succ && <L en="This is a successor ordinal: it has no fundamental sequence (FGH iterates instead)." zh="这是一个后继序数：它没有基本列（FGH 对它做的是迭代）。" />}
        {lines.map((l, i) => (
          <div key={i} className="c04-tline">
            <span className="c04-eq">=</span>
            <M t={i === 0 ? `${head}=${l.tex.replace(/^\\varepsilon_0\[\d+\]=/, '')}` : l.tex} />
            <span className="c04-rule">{t(RULE[l.rule].en, RULE[l.rule].zh)}</span>
          </div>
        ))}
      </div>
      {seq.length > 0 && (
        <div className="c04-seq">
          {seq.map((s, i) => (
            <button key={i} className={`chip ${i === n ? 'on' : ''}`} onClick={() => setN(i)}>
              <span className="muted small">[{i}] </span>
              <M t={s} />
            </button>
          ))}
          <span className="muted">→ {parsed.ok ? <M t={F.idxTex(parsed.a)} /> : null}</span>
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/* 2. The FGH machine: unfold f_α(n) rule by rule                        */
/* ================================================================== */
const M_PRESETS: [string, number][] = [
  ['2', 3],
  ['3', 2],
  ['w', 2],
  ['w', 3],
  ['w+1', 2],
  ['w^w', 2],
  ['e0', 2],
]

export function FGHMachine() {
  const { t } = useLang()
  const [pi, setPi] = useState(2)
  const [sc, setSc] = useState(false)
  const start = useMemo<F.MState>(() => ({ stack: [{ a: F.parseIdx(M_PRESETS[pi][0]), k: 1n }], x: BigInt(M_PRESETS[pi][1]) }), [pi])
  const [hist, setHist] = useState<{ s: F.MState; rule: F.Rule }[]>([{ s: start, rule: 'done' }])
  const [count, setCount] = useState(0)
  useEffect(() => {
    setHist([{ s: start, rule: 'done' }])
    setCount(0)
  }, [start])
  const cur = hist[hist.length - 1].s
  const peek = F.mStep(cur, sc)
  const finished = peek.rule === 'done' || peek.rule === 'stuck'
  const advance = (k: number) => {
    let h = hist
    let c = count
    for (let i = 0; i < k; i++) {
      const r = F.mStep(h[h.length - 1].s, sc)
      if (r.rule === 'done' || r.rule === 'stuck') break
      h = [...h.slice(-30), r]
      c++
    }
    setHist(h)
    setCount(c)
  }
  const ruleText: Record<string, string> = {
    zero: t('f₀(x) = x+1', 'f₀(x) = x+1'),
    f0k: t('shortcut: f₀ᵏ(x) = x+k', '捷径：f₀ᵏ(x) = x+k'),
    f1: t('shortcut: f₁ᵏ(x) = x·2ᵏ', '捷径：f₁ᵏ(x) = x·2ᵏ'),
    f2: t('shortcut: f₂(x) = x·2ˣ', '捷径：f₂(x) = x·2ˣ'),
    succ: t('successor: f_(β+1)(x) = f_βˣ(x)', '后继：f_(β+1)(x) = f_βˣ(x)'),
    lim: t('limit: f_λ(x) = f_λ[x](x)', '极限：f_λ(x) = f_λ[x](x)'),
  }
  const shown = hist.slice(-6)
  const [pa, pn] = M_PRESETS[pi]
  return (
    <div>
      <div className="btn-row">
        {M_PRESETS.map(([a, n], i) => (
          <button key={i} className={`chip ${i === pi ? 'on' : ''}`} onClick={() => setPi(i)}>
            <M t={`f_{${F.idxTex(F.parseIdx(a))}}(${n})`} />
          </button>
        ))}
      </div>
      <div className="c04-machine">
        {shown.map((h, i) => (
          <div key={i} className={`c04-mline ${i === shown.length - 1 ? 'cur' : ''}`}>
            <M t={F.mTex(h.s)} />
            {h.rule !== 'done' && <span className="c04-rule">{ruleText[h.rule]}</span>}
          </div>
        ))}
      </div>
      <div className="btn-row">
        <button className="btn small" disabled={finished} onClick={() => advance(1)}>
          <L en="Step" zh="走一步" />
        </button>
        <button className="btn small" disabled={finished} onClick={() => advance(25)}>
          ×25
        </button>
        <button className="btn small" disabled={finished} onClick={() => advance(5000)}>
          <L en="Run" zh="一直算" />
        </button>
        <label className="chip" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={sc} onChange={(e) => setSc(e.target.checked)} />
          <L en="closed forms for f₀, f₁, f₂" zh="对 f₀、f₁、f₂ 用公式" />
        </label>
        <span className="muted small" style={{ alignSelf: 'center' }}>
          {t(`${count} steps`, `${count} 步`)}
        </span>
      </div>
      <div className="readout small c04-text">
        {peek.rule === 'done' ? (
          <b style={{ color: COL.gold }}>
            <M t={`f_{${F.idxTex(F.parseIdx(pa))}}(${pn})=${F.commas(cur.x)}`} />
          </b>
        ) : peek.rule === 'stuck' ? (
          <L
            en="Stuck: the next rule needs a number with hundreds of digits as an iteration count or sequence index. The value is still uniquely determined — no computer will ever finish it."
            zh="卡住了：下一步需要拿一个几百位的数当迭代次数或基本列的下标。值仍然唯一确定——只是没有任何计算机能把它算完。"
          />
        ) : (
          <L
            en="Each line follows from the previous by one rule, always applied to the innermost f. Ordinals in the stack only ever get smaller from outside in."
            zh="每一行都由上一行用一条规则得到，规则总是作用在最里层的 f 上。栈里的序数从外到内只会越来越小。"
          />
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 3. Ordinal countdown: ω^ω at n = 3                                   */
/* ================================================================== */
type CStep = { a: O.Ord; kind: 'L' | 'U' | 'S' }
function countdown(a0: O.Ord, n: number): CStep[] {
  const out: CStep[] = [{ a: a0, kind: 'S' }]
  let a = a0
  while (!O.isZero(a)) {
    if (O.isLimit(a)) a = O.fs(a, n)
    else a = O.pred(a)
    out.push({ a, kind: O.isLimit(out[out.length - 1].a) ? 'L' : 'U' })
  }
  return out
}

export function Countdown() {
  const { t } = useLang()
  const steps = useMemo(() => countdown(O.parse('w^w'), 3), [])
  const [k, setK] = useState(0)
  const timer = useRef<number | null>(null)
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])
  const play = () => {
    if (timer.current) clearInterval(timer.current)
    let i = 0
    setK(0)
    timer.current = window.setInterval(() => {
      i++
      setK(i)
      if (i >= steps.length - 1 && timer.current) clearInterval(timer.current)
    }, 230)
  }
  const W = 700
  const H = 150
  const bw = (W - 40) / steps.length
  const pending = steps.slice(1, k + 1).filter((s) => s.kind === 'U').length
  const cur = steps[k]
  const prev = k > 0 ? steps[k - 1] : null
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} role="img" aria-label={t('ordinal altimeter', '序数高度计')}>
        <line x1={20} y1={H - 14} x2={W - 20} y2={H - 14} stroke={COL.line} />
        {steps.map((s, i) => {
          const h = O.posW(s.a) * (H - 30)
          return (
            <rect
              key={i}
              x={20 + i * bw + 1}
              y={H - 14 - h}
              width={Math.max(bw - 2, 1)}
              height={h}
              fill={i > k ? '#1b2447' : s.kind === 'L' ? COL.violet : s.kind === 'U' ? COL.cyan : COL.gold}
              opacity={i === k ? 1 : 0.75}
            />
          )
        })}
        <text x={22} y={12} fill={COL.dim} fontSize={11}>
          {t('height = position of the innermost ordinal below ω^ω', '高度 = 最内层序数在 ω^ω 以下的位置')}
        </text>
      </svg>
      <div className="c04-cd">
        <M t={`f_{${O.tex(cur.a)}}(3)`} />
        {prev && (
          <span className="muted small">
            {cur.kind === 'L'
              ? t(`limit: take the 3rd term of the fundamental sequence of ${O.plain(prev.a)}`, `极限：取 ${O.plain(prev.a)} 的基本列第 3 项`)
              : t(`successor: f_(β+1)(3) = f_β(f_β(f_β(3))) — the two outer copies wait`, `后继：f_(β+1)(3) = f_β(f_β(f_β(3)))——外面两层先等着`)}
          </span>
        )}
      </div>
      <Slider value={k} min={0} max={steps.length - 1} onChange={setK} label={<L en="step" zh="步" />} />
      <div className="btn-row">
        <button className="btn small" onClick={play}>
          <L en="▶ Count down" zh="▶ 倒计时" />
        </button>
      </div>
      <div className="readout small c04-text">
        {k < steps.length - 1 ? (
          <L en={<>Innermost call so far; {pending} pairs of outer calls are waiting.</>} zh={<>这是当前最里层的调用；外面已有 {pending} 对调用在排队等待。</>} />
        ) : (
          <L
            en={<>Reached <M t="f_0(3)=4" /> after {steps.length - 1} steps, with {pending} pairs of calls still waiting. Each will now run with a bigger argument, and each run is another countdown — always finite, by the no-infinite-descent theorem.</>}
            zh={<>走了 {steps.length - 1} 步到达 <M t="f_0(3)=4" />，外面还有 {pending} 对调用在等。它们会带着更大的参数逐一运行，每一次又是一场倒计时——由“不存在无穷下降”定理，总会结束。</>}
          />
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 4. Sandwich: 2↑^m(n+1) ≤ f_{m+1}(n) ≤ 2↑^{m+1}(n+1)                    */
/* ================================================================== */
function slogSize(s: Size): number {
  switch (s.kind) {
    case 'exact':
      return F.slogBig(s.v)
    case 'approx':
      return F.slogHuge(s.v)
    case 'tower':
      return s.height.h === 0 ? s.height.x - 1.3 : Infinity
    default:
      return Infinity
  }
}
function texSize(s: Size, m: number, n: number): string {
  switch (s.kind) {
    case 'exact':
      return F.commas(s.v)
    case 'approx':
      return '\\approx ' + toTex(s.v)
    case 'tower':
      return `2\\uparrow\\uparrow ${toTex(s.height)}`
    default:
      return `2\\uparrow^{${m}}${n}`
  }
}
function fVal(m: number, n: number): { slog: number; tex: string } {
  const v = F.fValue(O.nat(m), n)
  if (v.kind === 'exact') return { slog: F.slogBig(v.v), tex: F.commas(v.v) }
  if (v.kind === 'approx') return { slog: F.slogHuge(v.v), tex: '\\approx ' + toTex(v.v) }
  return { slog: Infinity, tex: `f_{${m}}(${n})` }
}

export function Sandwich() {
  const { t } = useLang()
  const [m, setM] = useState(2)
  const [sel, setSel] = useState(3)
  const ns = [0, 1, 2, 3, 4, 5, 6, 7]
  const data = useMemo(
    () =>
      ns.map((n) => {
        const lo = arrowSize(2, m, n + 1)
        const up = arrowSize(2, m + 1, n + 1)
        const f = fVal(m + 1, n)
        return { n, lo: slogSize(lo), f: f.slog, up: slogSize(up), loT: texSize(lo, m, n + 1), upT: texSize(up, m + 1, n + 1), fT: f.tex }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [m],
  )
  const W = 700
  const H = 220
  const YMAX = 7
  const X = (n: number) => 50 + (n / 7) * (W - 90)
  const Y = (v: number) => H - 26 - (Math.min(v, YMAX) / YMAX) * (H - 46)
  const series: { key: 'lo' | 'f' | 'up'; col: string; name: string }[] = [
    { key: 'up', col: COL.pink, name: `2↑${m + 1 > 1 ? `^${m + 1}` : ''}(n+1)` },
    { key: 'f', col: COL.gold, name: `f${m + 1}(n)` },
    { key: 'lo', col: COL.cyan, name: `2↑${m > 1 ? `^${m}` : ''}(n+1)` },
  ]
  const d = data[sel]
  return (
    <div>
      <div className="btn-row">
        {[1, 2, 3].map((x) => (
          <button key={x} className={`chip ${x === m ? 'on' : ''}`} onClick={() => setM(x)}>
            <M t={`f_{${x + 1}}`} />
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} role="img" aria-label={t('tower heights', '塔高')}>
        {Array.from({ length: YMAX + 1 }, (_, i) => (
          <g key={i}>
            <line x1={46} x2={W - 30} y1={Y(i)} y2={Y(i)} stroke={COL.line} strokeOpacity={0.5} />
            <text x={40} y={Y(i) + 4} fill={COL.dim} fontSize={10} textAnchor="end">
              {i}
            </text>
          </g>
        ))}
        <text x={8} y={14} fill={COL.dim} fontSize={11}>
          {t('tower height (slog₁₀): how many times you must take log₁₀ to get below 1', '塔高（slog₁₀）：要取多少次 log₁₀ 才能降到 1 以下')}
        </text>
        {ns.map((n) => (
          <text key={n} x={X(n)} y={H - 8} fill={n === sel ? COL.gold : COL.dim} fontSize={11} textAnchor="middle">
            n={n}
          </text>
        ))}
        {series.map((s) => {
          const pts = data.filter((p) => Number.isFinite(p[s.key]) && p[s.key] <= YMAX)
          return (
            <g key={s.key}>
              <polyline points={pts.map((p) => `${X(p.n)},${Y(p[s.key])}`).join(' ')} fill="none" stroke={s.col} strokeWidth={2} />
              {data.map((p) =>
                p[s.key] <= YMAX ? (
                  <circle key={p.n} cx={X(p.n)} cy={Y(p[s.key])} r={3.5} fill={s.col} />
                ) : (
                  <text key={p.n} x={X(p.n) + (s.key === 'up' ? 6 : s.key === 'f' ? 0 : -6)} y={Y(YMAX) - 4} fill={s.col} fontSize={12} textAnchor="middle">
                    ↑
                  </text>
                ),
              )}
            </g>
          )
        })}
        {series.map((s, i) => (
          <text key={s.key} x={W - 34} y={34 + i * 16} fill={s.col} fontSize={12} textAnchor="end">
            {s.name}
          </text>
        ))}
        <rect x={X(sel) - 14} y={20} width={28} height={H - 40} fill="#fff" opacity={0.04} />
      </svg>
      <Slider value={sel} min={0} max={7} onChange={setSel} label="n" />
      <div className="readout c04-sand">
        <div style={{ color: COL.pink }}>
          <M t={`2\\uparrow^{${m + 1}}${sel + 1}=${d.upT}`} />
        </div>
        <div style={{ color: COL.gold }}>
          <M t={`f_{${m + 1}}(${sel})=${d.fT}`} />
        </div>
        <div style={{ color: COL.cyan }}>
          <M t={`2\\uparrow^{${m}}${sel + 1}=${d.loT}`} />
        </div>
      </div>
      <div className="muted small">
        <L
          en={<>↑ = off the chart. The gold curve hugs the cyan one while the pink one flies away: <M t={`f_{${m + 1}}`} /> is “{m} arrow{m > 1 ? 's' : ''}, plus a little,” nowhere near {m + 1} arrows.</>}
          zh={<>↑ 表示超出图表。金线紧贴青线，粉线一飞冲天：<M t={`f_{${m + 1}}`} /> 是“{m} 个箭头再多一点”，远远够不着 {m + 1} 个箭头。</>}
        />
      </div>
    </div>
  )
}
