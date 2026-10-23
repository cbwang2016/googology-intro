import { useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { arrowSize, type Size } from '../../lib/arrows'
import { toTex } from '../../lib/huge'
import * as O from '../ch03/ordinal'
import { COL } from '../ch03/widgetsA'
import * as F from './fgh'
import { eqT } from './widgetsA'

const ARW = (c: number) => (c <= 4 ? '\\uparrow'.repeat(c) + ' ' : `\\uparrow^{${c}}`)

/* ================================================================== */
/* 5. Graham vs FGH, layer by layer                                     */
/* ================================================================== */
export function GrahamDuel() {
  const { t, pick } = useLang()
  const [k, setK] = useState(6)
  const W = 700
  const H = 190
  const shownK = Math.min(k, 12)
  const bh = 10
  const blocks = (x: number, col: string, lead: number) =>
    Array.from({ length: shownK }, (_, i) => (
      <rect key={i} x={x} y={H - 30 - (i + 1) * (bh + 2) - lead} width={150} height={bh} rx={3} fill={col} opacity={0.35 + (0.65 * (i + 1)) / shownK} />
    ))
  const bTex = k === 0 ? 'G(0)=4' : k === 1 ? 'G(1)=3\\uparrow\\uparrow\\uparrow\\uparrow 3' : `G(${k})=3\\uparrow^{G(${k - 1})}3`
  const aTex = k === 0 ? 'a_0=64' : `a_{${k}}=f_\\omega(a_{${k - 1}})${k === 64 ? '=f_{\\omega+1}(64)' : ''}`
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} role="img" aria-label={t('two towers of layers', '两座逐层比较的塔')}>
        <line x1={60} x2={W - 60} y1={H - 30} y2={H - 30} stroke={COL.line} />
        {blocks(150, COL.cyan, 0)}
        {blocks(400, COL.gold, 6)}
        <text x={225} y={H - 10} fill={COL.cyan} fontSize={13} textAnchor="middle">
          {pick('Graham: bₖ = G(k)', 'Graham：bₖ = G(k)')}
        </text>
        <text x={475} y={H - 10} fill={COL.gold} fontSize={13} textAnchor="middle">
          {pick('FGH: aₖ = f_ω applied k times to 64', 'FGH：aₖ = 对 64 作用 k 次 f_ω')}
        </text>
        {k > 12 && (
          <text x={W / 2} y={30} fill={COL.dim} fontSize={12} textAnchor="middle">
            {t(`(${k} layers; 12 drawn)`, `（共 ${k} 层，只画了 12 层）`)}
          </text>
        )}
        <text x={W / 2} y={H - 42 - shownK * (bh + 2)} fill={COL.green} fontSize={13} textAnchor="middle">
          aₖ ≥ bₖ + 1
        </text>
      </svg>
      <Slider value={k} min={0} max={64} onChange={setK} label={<L en="layer k" zh="第 k 层" />} />
      <div className="readout c04-text">
        <div>
          <M t={`b_{${k}}: ${bTex}`} />
          {'　'}
          <M t={aTex} />
        </div>
        {k === 0 && <L en="Start: a₀ = 64 ≥ 4 + 1 = b₀ + 1." zh="起点：a₀ = 64 ≥ 4 + 1 = b₀ + 1。" />}
        {k === 1 && (
          <M t="a_1=f_\omega(64)\ \ge\ f_\omega(5)=f_5(5)\ \ge\ 2\uparrow\uparrow\uparrow\uparrow 6\ >\ 3\uparrow\uparrow\uparrow\uparrow 3=G(1)." />
        )}
        {k >= 2 && (
          <M
            t={`a_{${k}}=f_\\omega(a_{${k - 1}})\\ \\ge\\ f_\\omega(b_{${k - 1}}+1)\\ \\ge\\ 2\\uparrow^{b_{${k - 1}}}(b_{${k - 1}}+2)\\ \\ge\\ 2\\uparrow^{b_{${k - 1}}}6\\ >\\ 3\\uparrow^{b_{${k - 1}}}3=b_{${k}}.`}
          />
        )}
        {k === 64 && (
          <div style={{ color: COL.gold, marginTop: 4 }}>
            <L en={<>Layer 64: <M t="f_{\omega+1}(64)=f_\omega^{64}(64)>G(64)" />, Graham’s number.</>} zh={<>第 64 层：<M t="f_{\omega+1}(64)=f_\omega^{64}(64)>G(64)" />，即 Graham 数。</>} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 6. Small cases: where do the inequalities start to hold?             */
/* ================================================================== */
function sizeSlog(s: Size): number {
  if (s.kind === 'exact') return F.slogBig(s.v)
  if (s.kind === 'approx') return F.slogHuge(s.v)
  if (s.kind === 'tower') return s.height.h === 0 ? s.height.x - 1.3 : Infinity
  return Infinity
}
function sizeTex(s: Size, a: number, c: number, b: number): string {
  if (s.kind === 'exact') return F.commas(s.v)
  if (s.kind === 'approx') return '\\approx ' + toTex(s.v)
  if (s.kind === 'tower') return `${a}\\uparrow\\uparrow(${toTex(s.height)})`
  return `${a}${ARW(c)}${b}`
}
function less(a: Size, b: Size): boolean {
  if (a.kind === 'exact' && b.kind === 'exact') return a.v < b.v
  return sizeSlog(a) < sizeSlog(b)
}

export function SmallCases() {
  const { t } = useLang()
  const rowsE = useMemo(() => {
    const out: { c: number; b: number; l: string; r: string; ok: boolean }[] = []
    for (const [c, b] of [
      [1, 1],
      [1, 3],
      [1, 5],
      [2, 1],
      [2, 2],
      [2, 3],
      [3, 1],
      [3, 2],
    ]) {
      const L3 = arrowSize(3, c, b)
      const R2 = arrowSize(2, c, 2 * b)
      out.push({ c, b, l: sizeTex(L3, 3, c, b), r: sizeTex(R2, 2, c, 2 * b), ok: less(L3, R2) })
    }
    return out
  }, [])
  const f3 = useMemo(() => F.fValue(O.parse('w'), 3), [])
  return (
    <div className="scroll-x">
      <table className="grid c04-small">
        <thead>
          <tr>
            <th colSpan={3}>
              <L en={<>Lemma E: <M t="3\uparrow^{c}b<2\uparrow^{c}(2b)" /></>} zh={<>引理 E：<M t="3\uparrow^{c}b<2\uparrow^{c}(2b)" /></>} />
            </th>
          </tr>
        </thead>
        <tbody>
          {rowsE.map((r, i) => (
            <tr key={i}>
              <td>
                <M t={eqT(`3${ARW(r.c)}${r.b}`, r.l)} />
              </td>
              <td>
                <M t={eqT(`2${ARW(r.c)}${2 * r.b}`, r.r)} />
              </td>
              <td style={{ color: r.ok ? COL.green : COL.red }}>{r.ok ? '✓' : '✗'}</td>
            </tr>
          ))}
        </tbody>
        <thead>
          <tr>
            <th colSpan={3}>
              <L en={<>Lemma F: <M t="f_\omega(x+1)>3\uparrow^{x}3" /></>} zh={<>引理 F：<M t="f_\omega(x+1)>3\uparrow^{x}3" /></>} />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <M t="f_\omega(2)=8" />
            </td>
            <td>
              <M t="3\uparrow 3=27" />
            </td>
            <td style={{ color: COL.red }}>✗</td>
          </tr>
          <tr>
            <td>
              <M t={`f_\\omega(3)=f_3(3)${f3.kind === 'approx' ? '\\approx ' + toTex(f3.v) : ''}`} />
            </td>
            <td>
              <M t="3\uparrow\uparrow 3=7{,}625{,}597{,}484{,}987" />
            </td>
            <td style={{ color: COL.green }}>✓</td>
          </tr>
          <tr>
            <td>
              <M t="f_\omega(4)=f_4(4)\ge 2\uparrow\uparrow\uparrow 5=2\uparrow\uparrow(2\uparrow\uparrow 65536)" />
            </td>
            <td>
              <M t="3\uparrow\uparrow\uparrow 3=3\uparrow\uparrow(7.6\times10^{12})" />
            </td>
            <td style={{ color: COL.green }}>✓</td>
          </tr>
        </tbody>
      </table>
      <div className="muted small" style={{ marginTop: 6 }}>
        {t(
          'All entries computed live (exactly, or by tower height when too large). Lemma F fails at x = 1 and holds from x = 2 on; the proof only needs x ≥ 4.',
          '所有格子都是当场算的（能精确就精确，太大就比塔高）。引理 F 在 x = 1 时不成立，从 x = 2 起成立；证明里只需要 x ≥ 4。',
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 7. Tamper with the fundamental sequences                             */
/* ================================================================== */
export function TamperFS() {
  const { t } = useLang()
  const [weak, setWeak] = useState(false)
  const [strong, setStrong] = useState(false)
  const e0Cell = (n: number): string => {
    if (weak) return `f_{\\omega\\uparrow\\uparrow ${n + 1}}(${n})=f_0(${n})=${n + 1}`
    if (n === 0) return 'f_{1}(0)=0'
    if (n === 1) return 'f_{\\omega}(1)=2'
    if (n === 2) return 'f_{\\omega^\\omega}(2)>G(64)'
    return `f_{${O.tex(O.omegaTower(n))}}(${n})`
  }
  const e0Val = (n: number): string => (weak ? String(n + 1) : n === 0 ? '0' : n === 1 ? '2' : `f_{\\varepsilon_0}(${n})`)
  const wCell = (n: number): string => {
    if (!strong) {
      const v = F.fValue(O.nat(n), n)
      return `f_{${n}}(${n})${v.kind === 'exact' ? '=' + F.commas(v.v) : v.kind === 'approx' ? '\\approx ' + toTex(v.v) : ''}`
    }
    if (weak) {
      const v = F.fValue(O.nat(n + 1), n)
      return `f_{${n + 1}}(${n})${v.kind === 'exact' ? '=' + F.commas(v.v) : v.kind === 'approx' ? '\\approx ' + toTex(v.v) : ''}`
    }
    if (n === 0) return 'f_{0}(0)=1'
    if (n === 1) return 'f_{2}(1)=2'
    return `f_{${e0Val(n)}}(${n})>f_{\\varepsilon_0}(${n})`
  }
  return (
    <div>
      <div className="btn-row">
        <button className={`chip ${weak ? 'on' : ''}`} onClick={() => setWeak(!weak)}>
          <L en={<>weaken <M t="\varepsilon_0" />: pad every rung’s sequence with zeros</>} zh={<>削弱 <M t="\varepsilon_0" />：每一级梯子的基本列前面垫上 0</>} />
        </button>
        <button className={`chip ${strong ? 'on' : ''}`} onClick={() => setStrong(!strong)}>
          <L en={<>strengthen <M t="\omega" />: <M t="\omega[n]=f_{\varepsilon_0}(n)" /></>} zh={<>增强 <M t="\omega" />：令 <M t="\omega[n]=f_{\varepsilon_0}(n)" /></>} />
        </button>
      </div>
      <div className="scroll-x">
        <table className="grid c04-small">
          <thead>
            <tr>
              <th>n</th>
              <th>
                <M t="f_{\varepsilon_0}(n)" />
              </th>
              <th>
                <M t="f_{\omega}(n)" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3].map((n) => (
              <tr key={n}>
                <td>{n}</td>
                <td>
                  <M t={e0Cell(n)} />
                </td>
                <td>
                  <M t={wCell(n)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="readout small c04-text">
        {weak ? (
          <L
            en={<>Weakened: <M t="\varepsilon_0=\sup\{\omega,\omega^\omega,\ldots\}" /> with <M t="\varepsilon_0[n]=\omega\uparrow\uparrow(n+1)" />, and the rung <M t="\omega\uparrow\uparrow k" /> gets a sequence starting with <M t="k" /> zeros. Every ordinal is the same; <M t="f_{\varepsilon_0}" /> collapses to <M t="n+1" />.</>}
            zh={<>削弱版：<M t="\varepsilon_0=\sup\{\omega,\omega^\omega,\ldots\}" />，<M t="\varepsilon_0[n]=\omega\uparrow\uparrow(n+1)" />，而第 <M t="k" /> 级 <M t="\omega\uparrow\uparrow k" /> 的基本列开头垫了 <M t="k" /> 个 0。序数一个没变，<M t="f_{\varepsilon_0}" /> 却塌缩成了 <M t="n+1" />。</>}
          />
        ) : (
          <L en={<>Standard: <M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" /> and the rules of Def 3.6.</>} zh={<>标准版：<M t="\varepsilon_0[n]=\omega\uparrow\uparrow n" />，其余按定义 3.6。</>} />
        )}
        {strong && (
          <div style={{ marginTop: 4 }}>
            <L
              en={<>Strengthened: <M t="f_\omega(n)=f_{f_{\varepsilon_0}(n)}(n)\ge f_{\varepsilon_0}(n)+3" /> for <M t="n\ge2" />, since <M t="f_m(2)\ge m+3" />. The “ω” level now outruns <M t="f_{\varepsilon_0}" />.</>}
              zh={<>增强版：对 <M t="n\ge2" />，<M t="f_\omega(n)=f_{f_{\varepsilon_0}(n)}(n)\ge f_{\varepsilon_0}(n)+3" />（因为 <M t="f_m(2)\ge m+3" />）。“ω 层”现在跑得比 <M t="f_{\varepsilon_0}" /> 还快。</>}
            />
          </div>
        )}
      </div>
      <div className="muted small">{t(`${weak || strong ? 'Tampered' : 'Standard'} sequences.`, `${weak || strong ? '篡改后' : '标准'}的基本列。`)}</div>
    </div>
  )
}

/* ================================================================== */
/* 8. Hardy machine: one ordinal, one counter                            */
/* ================================================================== */
const H_PRESETS: [string, number, string][] = [
  ['w^2', 3, '2'],
  ['w^3', 2, '3'],
  ['w^w', 2, '\\omega'],
  ['w^2+w', 3, '?'],
  ['w^w', 3, '\\omega'],
]

export function HardyMachine() {
  const { t } = useLang()
  const [pi, setPi] = useState(1)
  const [st, setSt] = useState<{ a: O.Ord; n: number; steps: number; trail: number[] }>(() => ({ a: O.parse(H_PRESETS[1][0]), n: H_PRESETS[1][1], steps: 0, trail: [1] }))
  const [run, setRun] = useState(false)
  const [speed, setSpeed] = useState(2)
  const raf = useRef<number | null>(null)
  const reset = (i: number) => {
    setRun(false)
    setPi(i)
    const a = O.parse(H_PRESETS[i][0])
    setSt({ a, n: H_PRESETS[i][1], steps: 0, trail: [O.posW(a)] })
  }
  useEffect(() => {
    if (!run) return
    const per = Math.round(Math.pow(10, speed))
    const tick = () => {
      setSt((s) => {
        let { a, n, steps } = s
        const trail = [...s.trail]
        for (let i = 0; i < per && !O.isZero(a); i++) {
          ;[a, n] = F.hardyStep(a, n)
          steps++
          if (i % Math.max(1, Math.floor(per / 4)) === 0) trail.push(O.posW(a))
        }
        trail.push(O.posW(a))
        if (O.isZero(a)) setRun(false)
        return { a, n, steps, trail: trail.slice(-400) }
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [run, speed])
  const W = 700
  const H = 110
  const pts = st.trail.map((p, i) => `${20 + (i / Math.max(st.trail.length - 1, 1)) * (W - 40)},${H - 10 - p * (H - 24)}`).join(' ')
  const done = O.isZero(st.a)
  const [pa, pn, fIdx] = H_PRESETS[pi]
  return (
    <div>
      <div className="btn-row">
        {H_PRESETS.map(([a, n], i) => (
          <button key={i} className={`chip ${i === pi ? 'on' : ''}`} onClick={() => reset(i)}>
            <M t={`H_{${O.tex(O.parse(a))}}(${n})`} />
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} role="img" aria-label={t('ordinal altitude', '序数高度')}>
        <line x1={20} x2={W - 20} y1={H - 10} y2={H - 10} stroke={COL.line} />
        <polyline points={pts} fill="none" stroke={COL.gold} strokeWidth={1.6} />
        <text x={22} y={12} fill={COL.dim} fontSize={11}>
          {t('ordinal (position below ω^ω) — it only ever goes down', '序数（在 ω^ω 以下的位置）——它只会往下走')}
        </text>
      </svg>
      <div className="c04-hstate">
        <span>
          <M t={`H_{${O.tex(st.a)}}(${st.n})`} />
        </span>
        <span className="muted small">{t(`step ${st.steps.toLocaleString()}`, `第 ${st.steps.toLocaleString()} 步`)}</span>
      </div>
      <div className="btn-row">
        <button className="btn small" disabled={done} onClick={() => setRun(!run)}>
          {run ? <L en="Pause" zh="暂停" /> : <L en="▶ Run" zh="▶ 运行" />}
        </button>
        <button
          className="btn small"
          disabled={done || run}
          onClick={() => {
            const [a, n] = F.hardyStep(st.a, st.n)
            setSt({ a, n, steps: st.steps + 1, trail: [...st.trail, O.posW(a)].slice(-400) })
          }}
        >
          <L en="One step" zh="走一步" />
        </button>
        <button className="btn small" onClick={() => reset(pi)}>
          <L en="Reset" zh="重来" />
        </button>
      </div>
      <Slider value={speed} min={0} max={5} onChange={setSpeed} label={<L en="speed (log₁₀ steps per frame)" zh="速度（每帧步数的 log₁₀）" />} />
      <div className="readout small c04-text">
        {done ? (
          <>
            <b style={{ color: COL.gold }}>
              <M t={`H_{${O.tex(O.parse(pa))}}(${pn})=${st.n}`} />
            </b>
            {fIdx !== '?' && (
              <>
                {' '}
                <M t={`=f_{${fIdx}}(${pn})`} />
              </>
            )}
            {fIdx === '?' && (
              <>
                {' '}
                <M t={`=f_2(f_1(${pn}))`} />
              </>
            )}
          </>
        ) : (
          <L
            en="Each step either replaces a limit by its n-th rung or subtracts 1 from the ordinal and adds 1 to n. The ordinal strictly decreases, so the run must stop."
            zh="每一步要么把极限换成它的第 n 级，要么序数减 1、n 加 1。序数严格下降，所以运行必然停止。"
          />
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 9. Replace ω by n: slow-growing hierarchy and the hereditary shortcut */
/* ================================================================== */
const R_PRESETS = ['w^w', 'w^(w+1)*2+w^3', 'w^(w^2)+w*2', 'w*5']

export function ReplaceOmega() {
  const { t } = useLang()
  const [src, setSrc] = useState('w^w')
  const [n, setN] = useState(3)
  const res = useMemo(() => {
    try {
      const a = O.parse(src)
      const N = O.replaceOmega(a, BigInt(n), 3000)
      return { ok: true as const, a, N }
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : String(e) }
    }
  }, [src, n])
  let body = null
  if (res.ok) {
    const { a, N } = res
    const sub = O.tex(a).replace(/\\omega/g, `{\\color{#ffd36b}${n}}`)
    const small = O.maxInt(a) < n
    let desc = null
    if (O.isLimit(a) && N !== null) {
      const sigma = O.fsUntilSucc(a, n)
      const her = O.hereditary(N - 1n, BigInt(n))
      const same = O.eq(O.pred(sigma), her)
      desc = (
        <>
          <div>
            <L en={<>Take <M t={`[${n}]`} /> until a successor appears: </>} zh={<>反复取 <M t={`[${n}]`} />，直到出现后继序数：</>} />
            <M t={`${O.tex(sigma)}`} />
          </div>
          <div>
            <L en={<>Hereditary base {n} of <M t={`N-1=${F.commas(N - 1n)}`} />, with {n} → ω, plus 1: </>} zh={<><M t={`N-1=${F.commas(N - 1n)}`} /> 写成遗传 {n} 进制、把 {n} 换回 ω、再加 1：</>} />
            <M t={O.tex(O.succ(her))} />
            <b style={{ color: same ? COL.green : COL.red }}> {same ? '  ✓' : '  ✗'}</b>
          </div>
          {!small && (
            <div style={{ color: COL.pink }}>
              {t(`Some integer in the normal form is ≥ ${n}, so the shortcut is not guaranteed${same ? ' (it happens to work here)' : ' — and indeed it fails'}.`, `标准型里有不小于 ${n} 的整数，捷径不再有保证${same ? '（这里碰巧成立）' : '——果然失败了'}。`)}
            </div>
          )}
        </>
      )
    }
    body = (
      <>
        <div>
          <M t={`g_{\\alpha}(${n})=${sub}=${N === null ? '\\text{(too large)}' : F.commas(N)}`} />
        </div>
        {desc}
      </>
    )
  }
  return (
    <div>
      <div className="btn-row">
        {R_PRESETS.map((p) => (
          <button key={p} className={`chip ${p === src ? 'on' : ''}`} onClick={() => setSrc(p)}>
            <M t={O.tex(O.parse(p))} />
          </button>
        ))}
      </div>
      <div className="row">
        <label className="mono">
          α = <input type="text" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} style={{ width: 200 }} aria-label="alpha" />
        </label>
      </div>
      <Slider value={n} min={2} max={9} onChange={setN} label="n" />
      <div className="readout c04-text c04-rep">{res.ok ? body : <span style={{ color: COL.red }}>{res.err}</span>}</div>
    </div>
  )
}
