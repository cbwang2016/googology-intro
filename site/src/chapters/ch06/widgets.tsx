import { useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { TreeView } from '../ch05/draw'
import { makeScale } from '../ch05/widgets'
import { add, nat, newTree, OMEGA, omPow, seqToOrd, toTex, treeOrd, treeToSeq, type Ord, type Tree } from '../ch05/ordinal.ts'
import {
  chop,
  goodsteinSkip,
  goodsteinStep,
  heads,
  heredLog10,
  heredSize,
  heredToOrd,
  heredValue,
  killCount,
  pickHead,
  sizeOf,
  straightHydra,
  toHered,
  wormNext,
  wormToSeq,
  type GState,
  type Hered,
  type Strategy,
} from './games.ts'

const commas = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, '{,}')

/** TeX for a hereditary representation with a given base symbol. */
function heredTex(h: Hered, base: string, budget = { n: 60 }): string {
  if (h.length === 0) return '0'
  const parts: string[] = []
  for (const t of h) {
    if (budget.n-- <= 0) {
      parts.push('\\cdots')
      break
    }
    const c = t.c.toString().length > 12 ? `[${t.c.toString().length}\\text{-digit}]` : commas(t.c.toString())
    if (t.e.length === 0) {
      parts.push(c)
      continue
    }
    const isOne = t.e.length === 1 && t.e[0].e.length === 0 && t.e[0].c === 1n
    const pow = isOne ? base : `${base}^{${heredTex(t.e, base, budget)}}`
    parts.push(t.c === 1n ? pow : `${c}\\cdot ${pow}`)
  }
  return parts.join('+')
}
const baseTex = (b: bigint) => (b.toString().length > 9 ? 'b' : b.toString())

/* ------------------------------------------------------------------ */
/* 1. Hereditary base and the bump                                     */
/* ------------------------------------------------------------------ */
export function HereditaryBump() {
  const [n, setN] = useState(100)
  const [b, setB] = useState(2)
  const h = toHered(BigInt(n), BigInt(b))
  const bumped = heredValue(h, BigInt(b + 1))
  const plain = BigInt(n)
    .toString(b)
    .split('')
    .reverse()
    .map((d, i) => (d === '0' ? null : `${parseInt(d, b) === 1 ? '' : parseInt(d, b) + '\\cdot '}${b}^{${i}}`))
    .filter(Boolean)
    .reverse()
    .join('+')
  return (
    <div>
      <Slider value={n} min={1} max={300} onChange={setN} label="n" />
      <Slider value={b} min={2} max={5} onChange={setB} label={<L en="base b" zh="底 b" />} />
      <div className="readout c06-rows">
        <div>
          <span className="c06-k">
            <L en="ordinary base" zh="普通进制" />
          </span>
          <M t={`${n}=${plain}`} />
        </div>
        <div>
          <span className="c06-k">
            <L en="hereditary" zh="遗传记法" />
          </span>
          <M t={`${n}=${heredTex(h, String(b))}`} />
        </div>
        <div>
          <span className="c06-k">
            <L en={`replace ${b} by ${b + 1}`} zh={`把 ${b} 换成 ${b + 1}`} />
          </span>
          <M t={`${heredTex(h, String(b + 1))}=${bumped === null ? '\\text{(huge)}' : commas(bumped.toString())}`} />
        </div>
        <div>
          <span className="c06-k">
            <L en="replace by ω" zh="换成 ω" />
          </span>
          <M t={toTex(heredToOrd(h)!)} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Goodstein stepper with its ordinal shadow                        */
/* ------------------------------------------------------------------ */
const G_MARKS: Ord[] = [nat(0), nat(2), OMEGA, add(OMEGA, OMEGA), omPow(nat(2)), add(omPow(nat(2)), omPow(nat(2))), omPow(nat(3)), omPow(OMEGA), omPow(omPow(OMEGA))]
const gScale = makeScale(G_MARKS)

export function GoodsteinStepper() {
  const { t } = useLang()
  const starts = [3, 4, 5, 8, 16]
  const [n0, setN0] = useState(4)
  const init = (n: number): GState => ({ h: toHered(BigInt(n), 2n), b: 2n, k: 0n })
  const [hist, setHist] = useState<GState[]>([init(4)])
  const [blocked, setBlocked] = useState(false)
  useEffect(() => {
    setHist([init(n0)])
    setBlocked(false)
  }, [n0])
  const cur = hist[hist.length - 1]
  const done = cur.h.length === 0
  const go = (mode: 'step' | 'skip', times: number) => {
    let h = hist
    for (let i = 0; i < times; i++) {
      const last = h[h.length - 1]
      if (last.h.length === 0) break
      if (last.b > 10n ** 40n) {
        setBlocked(true)
        break
      }
      const nx = mode === 'step' ? goodsteinStep(last) : goodsteinSkip(last)
      if (!nx || heredSize(nx.h) > 3000) {
        setBlocked(true)
        break
      }
      h = [...h, nx]
    }
    setHist(h.length > 400 ? [h[0], ...h.slice(-399)] : h)
  }
  const val = heredValue(cur.h, cur.b, 400)
  const lg = heredLog10(cur.h, cur.b)
  const ord = heredToOrd(cur.h)
  // chart data
  const pts = hist.map((s) => ({ lg: Math.max(0, heredLog10(s.h, s.b)), alt: (() => {
    const o = heredToOrd(s.h)
    return o ? gScale(o) : 1
  })() }))
  const maxLg = Math.max(1, ...pts.map((p) => (isFinite(p.lg) ? p.lg : 0)))
  const W = 600
  const H = 110
  const X = (i: number) => 10 + (i * (W - 20)) / Math.max(1, pts.length - 1)
  const line = (f: (p: (typeof pts)[0]) => number) => pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${(H - 8 - f(p) * (H - 20)).toFixed(1)}`).join(' ')
  return (
    <div>
      <div className="btn-row">
        {starts.map((s) => (
          <button key={s} className={`chip ${s === n0 ? 'on' : ''}`} onClick={() => setN0(s)}>
            G₀ = {s}
          </button>
        ))}
      </div>
      <div className="row small">
        <span className="stat">
          <span className="stat-label">{t('step k', '第 k 步')}</span>
          <span className="stat-value">{cur.k.toString().length > 12 ? `≈10^${cur.k.toString().length - 1}` : cur.k.toString()}</span>
        </span>
        <span className="stat">
          <span className="stat-label">{t('base', '底')}</span>
          <span className="stat-value">{cur.b.toString().length > 12 ? `≈10^${cur.b.toString().length - 1}` : cur.b.toString()}</span>
        </span>
        <span className="stat">
          <span className="stat-label">{t('value', '数值')}</span>
          <span className="stat-value">{val !== null && val.toString().length <= 16 ? val.toString() : isFinite(lg) ? t(`≈ ${Math.floor(lg) + 1} digits`, `约 ${Math.floor(lg) + 1} 位`) : t('beyond floats', '超出浮点范围')}</span>
        </span>
      </div>
      <div className="readout c06-rows">
        <div>
          <span className="c06-k">
            G<sub>k</sub>
          </span>
          <M t={done ? '0' : heredTex(cur.h, baseTex(cur.b))} />
        </div>
        <div>
          <span className="c06-k">
            <L en="shadow" zh="影子" />
          </span>
          <M t={ord ? toTex(ord) : '\\cdots'} />
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="c06-chart" role="img">
        <path d={line((p) => (isFinite(p.lg) ? p.lg / maxLg : 1))} stroke="#ffd36b" fill="none" strokeWidth={2} />
        <path d={line((p) => p.alt)} stroke="#7dffa8" fill="none" strokeWidth={2} />
        <text x={14} y={14} fontSize="12" fill="#ffd36b">
          {t('digits of Gₖ (scaled)', 'Gₖ 的位数（缩放）')}
        </text>
        <text x={W - 14} y={14} fontSize="12" fill="#7dffa8" textAnchor="end">
          {t('ordinal shadow (altimeter)', '序数影子（高度计）')}
        </text>
      </svg>
      <div className="btn-row">
        <button className="btn small" disabled={done || blocked} onClick={() => go('step', 1)}>
          {t('one step', '一步')}
        </button>
        <button className="btn small" disabled={done || blocked} onClick={() => go('step', 25)}>
          {t('25 steps', '25 步')}
        </button>
        <button className="btn small" disabled={done || blocked} onClick={() => go('skip', 1)}>
          {t('skip the countdown of the last digit', '跳过末位的倒数')}
        </button>
        <button className="btn small" disabled={done || blocked} onClick={() => go('skip', 60)}>
          {t('skip ×60', '跳过 ×60')}
        </button>
        <button className="chip" onClick={() => (setHist([init(n0)]), setBlocked(false))}>
          {t('reset', '重来')}
        </button>
      </div>
      <div className="small">
        {done && <span style={{ color: 'var(--green)' }}>{t(`Reached 0 after ${cur.k} steps: G(${n0}) = ${cur.k}.`, `第 ${cur.k} 步到达 0：G(${n0}) = ${cur.k}。`)}</span>}
        {blocked && !done && (
          <span style={{ color: 'var(--orange)' }}>
            {t('The numbers no longer fit in this browser. The shadow is still finite and still falling; it reaches 0 eventually.', '数已经大到浏览器装不下了。影子仍是有限的序数，仍在下降，终将到达 0。')}
          </span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. The hydra game                                                   */
/* ------------------------------------------------------------------ */
const ids = (t: Tree, out = new Set<number>()) => {
  out.add(t.id)
  t.ch.forEach((c) => ids(c, out))
  return out
}
function bushy(): Tree {
  // ((())(()())) : a forked hydra
  return newTree([newTree([newTree()]), newTree([newTree(), newTree()]), newTree([newTree([newTree()])])])
}
export function HydraGame() {
  const { t } = useLang()
  const starts: { label: string; make: () => Tree }[] = [
    { label: t('height 2', '高 2'), make: () => straightHydra(2) },
    { label: t('height 3', '高 3'), make: () => straightHydra(3) },
    { label: t('height 4', '高 4'), make: () => straightHydra(4) },
    { label: t('forked', '分叉'), make: bushy },
  ]
  const [si, setSi] = useState(1)
  const [tree, setTree] = useState<Tree>(() => straightHydra(3))
  const [m, setM] = useState(0)
  const [glow, setGlow] = useState<Set<number>>(new Set())
  const [strat, setStrat] = useState<Strategy>('rightmost')
  const [playing, setPlaying] = useState(false)
  const st = useRef({ tree, m })
  st.current = { tree, m }
  const reset = (i: number) => {
    setSi(i)
    const tr = starts[i].make()
    setTree(tr)
    setM(0)
    setGlow(new Set())
    setPlaying(false)
  }
  const doChop = (path: number[]) => {
    const { tree: cur, m: mm } = st.current
    if (sizeOf(cur) > 700) return
    const before = ids(cur)
    const nt = chop(cur, path, mm + 1)
    const g = new Set<number>()
    ids(nt).forEach((id) => !before.has(id) && g.add(id))
    setTree(nt)
    setM(mm + 1)
    setGlow(g)
  }
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      const { tree: cur } = st.current
      if (cur.ch.length === 0 || sizeOf(cur) > 700) {
        setPlaying(false)
        return
      }
      doChop(pickHead(cur, strat)!)
    }, 260)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, strat])
  const big = sizeOf(tree) > 700
  const dead = tree.ch.length === 0
  const seq = treeToSeq(tree)
  return (
    <div>
      <div className="btn-row">
        {starts.map((s, i) => (
          <button key={i} className={`chip ${i === si ? 'on' : ''}`} onClick={() => reset(i)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="c06-hydra">
        <TreeView tree={tree} height={250} onLeaf={dead || big ? undefined : (p) => doChop(p)} glow={glow} />
      </div>
      <div className="row small">
        <span className="stat">
          <span className="stat-label">{t('chops so far', '已砍')}</span>
          <span className="stat-value">{m}</span>
        </span>
        <span className="stat">
          <span className="stat-label">{t('heads', '头数')}</span>
          <span className="stat-value">{heads(tree).length}</span>
        </span>
        <span className="stat" style={{ minWidth: 160 }}>
          <span className="stat-label">{t('ordinal', '序数')}</span>
          <span className="stat-value">
            <M t={toTex(treeOrd(tree))} />
          </span>
        </span>
      </div>
      <div className="small muted mono c06-seq">
        {t('as a primitive sequence: ', '读作初等序列：')}({seq.length > 60 ? seq.slice(0, 60).join(',') + ',…' : seq.join(',')})
      </div>
      <div className="btn-row">
        <select className="c06-select" value={strat} onChange={(e) => setStrat(e.target.value as Strategy)} aria-label={t('strategy', '策略')}>
          <option value="rightmost">{t('rightmost head (book)', '最右边的头（本书）')}</option>
          <option value="deepest">{t('deepest head', '最深的头')}</option>
          <option value="random">{t('random head', '随机的头')}</option>
        </select>
        <button className="btn small" disabled={dead || big} onClick={() => setPlaying(!playing)}>
          {playing ? t('pause', '暂停') : t('auto-chop', '自动砍')}
        </button>
        <button className="btn small" disabled={dead || big || playing} onClick={() => doChop(pickHead(tree, strat)!)}>
          {t('one chop', '砍一刀')}
        </button>
      </div>
      <div className="small">
        {dead && <span style={{ color: 'var(--green)' }}>{t(`Dead after ${m} chops.`, `砍了 ${m} 刀，九头蛇死了。`)}</span>}
        {big && <span style={{ color: 'var(--orange)' }}>{t('Too big to draw any more — yet its ordinal is still falling, so it will die.', '已经大到画不下了——但它的序数仍在下降，所以它终将死去。')}</span>}
        {!dead && !big && <span className="muted">{t(`Click a green head. This is chop number ${m + 1}, so ${m + 1} cop${m === 0 ? 'y' : 'ies'} will regrow (if the head is not on the root).`, `点击一个绿色的头。这是第 ${m + 1} 刀，所以会长出 ${m + 1} 份拷贝（若被砍的头不直接长在根上）。`)}</span>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Strategy race                                                    */
/* ------------------------------------------------------------------ */
export function StrategyRace() {
  const { t } = useLang()
  const [rows, setRows] = useState<{ name: string; vals: (number | null)[] }[] | null>(null)
  const run = () => {
    const hydras: { name: string; make: () => Tree }[] = [
      { name: '((()))', make: () => straightHydra(2) },
      { name: '(((())))', make: () => straightHydra(3) },
      { name: '((()())(()))', make: () => newTree([newTree([newTree(), newTree()]), newTree([newTree()])]) },
      { name: '((((()))))', make: () => straightHydra(4) },
    ]
    const out = hydras.map((h) => {
      const r = killCount(h.make(), 'rightmost', 20000, 1500)
      const d = killCount(h.make(), 'deepest', 20000, 1500)
      const rs: number[] = []
      for (let i = 0; i < 12; i++) {
        const v = killCount(h.make(), 'random', 20000, 1500)
        if (v !== null) rs.push(v)
      }
      return { name: h.name, vals: [r, d, rs.length === 12 ? Math.min(...rs) : null, rs.length === 12 ? Math.max(...rs) : null] }
    })
    setRows(out)
  }
  return (
    <div>
      <button className="btn small" onClick={run}>
        {t('race the strategies', '让各种策略比一比')}
      </button>
      {rows && (
        <div className="scroll-x">
          <table className="grid c06-race">
            <thead>
              <tr>
                <th>{t('hydra', '九头蛇')}</th>
                <th>{t('rightmost', '最右')}</th>
                <th>{t('deepest', '最深')}</th>
                <th>{t('random: fewest', '随机：最少')}</th>
                <th>{t('random: most', '随机：最多')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td className="mono">{r.name}</td>
                  {r.vals.map((v, i) => (
                    <td key={i} className="mono">
                      {v === null ? <span className="muted">{t('enormous', '极大')}</span> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="small muted">{t('Random columns: 12 runs each. Strategies change the time a lot — never the outcome.', '随机策略各跑 12 次。策略对用时影响巨大——但从不影响结局。')}</div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Worm                                                             */
/* ------------------------------------------------------------------ */
export function WormSim() {
  const { t } = useLang()
  const starts = [[1], [2], [1, 1], [3]]
  const [si, setSi] = useState(1)
  const [w, setW] = useState<number[]>([2])
  const [m, setM] = useState(0)
  const reset = (i: number) => {
    setSi(i)
    setW(starts[i])
    setM(0)
  }
  const step = (k: number) => {
    let ww = w
    let mm = m
    for (let i = 0; i < k && ww.length && ww.length < 400; i++) {
      mm++
      ww = wormNext(ww, mm)
    }
    setW(ww)
    setM(mm)
  }
  const maxV = Math.max(1, ...w, ...starts[si])
  const n = w.length
  const W = 600
  const H = 120
  const cw = Math.min(30, (W - 20) / Math.max(1, n))
  const dead = w.length === 0
  const ord = seqToOrd(wormToSeq(w))
  return (
    <div>
      <div className="btn-row">
        {starts.map((s, i) => (
          <button key={i} className={`chip mono ${i === si ? 'on' : ''}`} onClick={() => reset(i)}>
            [{s.join(',')}]
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="c06-worm" role="img">
        {w.map((v, i) => {
          const h = 10 + (v / maxV) * (H - 30)
          return <rect key={i} x={10 + i * cw} y={H - 10 - h} width={Math.max(0.4, cw > 4 ? cw - 1.5 : cw * 0.8)} height={h} rx={Math.min(6, cw / 3)} fill={`hsl(${140 + v * 50}, 70%, 62%)`} />
        })}
        {dead && (
          <text x={W / 2} y={H / 2} textAnchor="middle" fill="#7dffa8" fontSize="16">
            {t('the worm is gone', '虫子消失了')}
          </text>
        )}
      </svg>
      <div className="row small">
        <span className="stat">
          <span className="stat-label">{t('round m', '第 m 轮')}</span>
          <span className="stat-value">{m}</span>
        </span>
        <span className="stat">
          <span className="stat-label">{t('length', '长度')}</span>
          <span className="stat-value">{w.length}</span>
        </span>
        <span className="stat" style={{ minWidth: 150 }}>
          <span className="stat-label">{t('ordinal', '序数')}</span>
          <span className="stat-value">
            <M t={toTex(ord)} />
          </span>
        </span>
      </div>
      <div className="small mono muted c06-seq">[{w.length > 50 ? w.slice(0, 50).join(',') + ',…' : w.join(',')}]</div>
      <div className="btn-row">
        <button className="btn small" disabled={dead || w.length >= 400} onClick={() => step(1)}>
          {t('one round', '一轮')}
        </button>
        <button className="btn small" disabled={dead || w.length >= 400} onClick={() => step(100000)}>
          {t('run', '一直跑')}
        </button>
      </div>
      <div className="small">
        {dead && <span style={{ color: 'var(--green)' }}>{t(`Worm([${starts[si].join(',')}]) = ${m} rounds.`, `从 [${starts[si].join(',')}] 出发共 ${m} 轮。`)}</span>}
        {!dead && w.length >= 400 && <span style={{ color: 'var(--orange)' }}>{t('Longer than 400 — we stop drawing. It still dies.', '长度超过 400，不再绘制。它仍然会死。')}</span>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Fusible numbers                                                  */
/* ------------------------------------------------------------------ */
function fusibles(K: number, top: number): number[] {
  const D = 2 ** K
  const set = new Set<number>([0])
  let changed = true
  while (changed) {
    changed = false
    const L = [...set].sort((a, b) => a - b)
    for (let i = 0; i < L.length; i++) {
      for (let j = i; j < L.length; j++) {
        const a = L[i]
        const b = L[j]
        if (b - a >= D) break
        const z = a + b + D
        if (z % 2 === 0) {
          const v = z / 2
          if (v <= top * D && !set.has(v)) {
            set.add(v)
            changed = true
          }
        }
      }
    }
  }
  return [...set].sort((a, b) => a - b).map((v) => v / D)
}
export function FuseLine() {
  const { t } = useLang()
  const pts = useMemo(() => fusibles(12, 2), [])
  const [lo, setLo] = useState(0)
  const [zoom, setZoom] = useState(0)
  const width = 2 / 2 ** zoom
  const a = Math.min(lo, 2 - width)
  const b = a + width
  const W = 600
  const X = (v: number) => 10 + ((v - a) / (b - a)) * (W - 20)
  const shown = pts.filter((v) => v >= a && v <= b)
  const next1 = pts.find((v) => v > 1)
  return (
    <div>
      <svg viewBox={`0 0 ${W} 90`} className="c06-fuse" role="img">
        <line x1={10} y1={50} x2={W - 10} y2={50} stroke="#2a3563" strokeWidth={2} />
        {shown.map((v, i) => (
          <line key={i} x1={X(v)} y1={36} x2={X(v)} y2={64} stroke={v >= 1 ? '#6be4ff' : '#ffd36b'} strokeWidth={1} opacity={0.8} />
        ))}
        {[0, 0.5, 1, 1.5, 2].filter((v) => v >= a && v <= b).map((v) => (
          <text key={v} x={X(v)} y={82} fontSize="11" fill="#9aa3c7" textAnchor="middle">
            {v}
          </text>
        ))}
      </svg>
      <Slider value={zoom} min={0} max={8} onChange={setZoom} label={<L en="zoom" zh="放大" />} />
      <Slider value={lo} min={0} max={1.99} step={0.01} onChange={setLo} label={<L en="left end" zh="左端" />} />
      <div className="small muted">
        {t(
          `${pts.length} fusible numbers in [0,2] with denominator ≤ 2¹². Below 1 they are 0, 1/2, 3/4, 7/8, …; the first one above 1 is ${next1 === 1.125 ? '9/8' : next1}. Zoom in just below 2 to see clusters of clusters.`,
          `[0,2] 中分母不超过 2¹² 的可熔数共 ${pts.length} 个。1 以下是 0, 1/2, 3/4, 7/8, …；1 之后的第一个是 ${next1 === 1.125 ? '9/8' : next1}。在 2 的左边放大，能看到“聚点的聚点”。`,
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 7. What a theory can see                                            */
/* ------------------------------------------------------------------ */
type Theory = { name: string; ord: string; rank: number; note: { en: string; zh: string }; ch?: number }
const THEORIES: Theory[] = [
  { name: 'IΔ₀', ord: '\\omega^2', rank: 1, note: { en: 'Induction only for bounded formulas. Cannot even prove that 2ˣ is total.', zh: '只对有界公式做归纳，连 2ˣ 处处有定义都证明不了。' } },
  { name: 'IΣ₁ ≈ PRA ≈ RCA₀', ord: '\\omega^\\omega', rank: 2, note: { en: 'Provably total functions: exactly the primitive recursive ones (Parsons, Mints, Takeuti), i.e. those below f_ω — H_α with α < ω^ω.', zh: '可证全函数恰好是原始递归函数（Parsons、Mints、Takeuti），即 f_ω 以下——Hardy 刻度 α < ω^ω。' } },
  { name: 'IΣ₂', ord: '\\omega^{\\omega^\\omega}', rank: 3, note: { en: 'Proves f_α total for every α < ω^ω (Hardy: α < ω^{ω^ω}).', zh: '能证明 α < ω^ω 的每个 f_α 处处有定义（Hardy 刻度：α < ω^{ω^ω}）。' } },
  { name: 'IΣₙ₊₁', ord: '\\omega\\uparrow\\uparrow(n+2)', rank: 4, note: { en: 'Each extra quantifier alternation allowed in induction buys one more storey of the ω-tower.', zh: '归纳公式每多允许一层量词交替，就多换来一层 ω 塔。' } },
  { name: 'PA = ⋃ IΣₙ', ord: '\\varepsilon_0', rank: 5, note: { en: 'Proves TI(α) for every α < ε₀ but not TI(ε₀) (Gentzen 1943). Provably total functions: those dominated by some f_α, α < ε₀ (Wainer 1970). Goodstein, hydra and worm all sit exactly at the ceiling.', zh: '能证明每个 α < ε₀ 的 TI(α)，但证明不了 TI(ε₀)（Gentzen 1943）。可证全函数：被某个 f_α（α < ε₀）控制的函数（Wainer 1970）。Goodstein、九头蛇和 Worm 正好卡在天花板上。' } },
  { name: 'ATR₀', ord: '\\Gamma_0', rank: 6, ch: 7, note: { en: 'Predicative analysis; Kruskal’s theorem is out of reach. Chapter 7.', zh: '直谓分析；证明不了 Kruskal 定理。第 7 章。' } },
  { name: 'KP, ID₁', ord: '\\text{BHO}', rank: 7, ch: 8, note: { en: 'The Bachmann–Howard ordinal. Chapter 8.', zh: 'Bachmann–Howard 序数。第 8 章。' } },
  { name: 'Π¹₁-CA₀', ord: '\\psi(\\Omega_\\omega)', rank: 8, ch: 8, note: { en: 'Chapter 8 (Buchholz’s ψ).', zh: '第 8 章（Buchholz 的 ψ）。' } },
  { name: 'Z₂', ord: '\\psi_\\Omega(I_\\omega)', rank: 9, ch: 10, note: { en: 'Full second-order arithmetic: the current frontier of ordinal analysis (Arai). Chapter 10.', zh: '完整的二阶算术：序数分析目前的前沿（Arai）。第 10 章。' } },
  { name: 'ZFC', ord: '?', rank: 10, ch: 10, note: { en: 'Unknown. Nobody can write down a notation for PTO(ZFC).', zh: '未知。没有人能写出 PTO(ZFC) 的记号。' } },
]
export function PtoLadder() {
  const { pick } = useLang()
  const [sel, setSel] = useState(4)
  const [h, setH] = useState(3)
  const H = 330
  const Y = (rank: number) => H - 16 - ((rank - 1) / 9) * (H - 40)
  // hydra-height marker sits between IΣ ranks, always under ε₀ (rank 5)
  const hy = 2 + Math.min(2.9, (h - 2) * 0.55 + (1 - 1 / h) * 0.3)
  const th = THEORIES[sel]
  return (
    <div className="c06-pto">
      <svg viewBox={`0 0 260 ${H}`} className="c06-pto-svg" role="img">
        <rect x={70} y={Y(5)} width={14} height={H - 16 - Y(5)} fill="rgba(107,228,255,0.15)" />
        <line x1={77} y1={10} x2={77} y2={H - 10} stroke="#2a3563" strokeWidth={4} />
        <line x1={60} y1={Y(5)} x2={86} y2={Y(5)} stroke="#ffd36b" strokeDasharray="4 3" />
        <text x={250} y={Y(5) - 6} fontSize="10" fill="#ffd36b" textAnchor="end">ε₀</text>
        {THEORIES.map((th, i) => (
          <g key={i} style={{ cursor: 'pointer' }} onClick={() => setSel(i)}>
            <circle cx={77} cy={Y(th.rank)} r={i === sel ? 7 : 5} fill={i === sel ? '#ffd36b' : th.rank > 5 ? '#b59bff' : '#6be4ff'} />
            <text x={92} y={Y(th.rank) + 4} fontSize="12" fill={i === sel ? '#ffd36b' : '#e6e9f5'}>
              {th.name}
            </text>
            <rect x={0} y={Y(th.rank) - 11} width={260} height={22} fill="transparent" />
          </g>
        ))}
        <polygon points={`62,${Y(hy) - 6} 70,${Y(hy)} 62,${Y(hy) + 6}`} fill="#ff7ab6" />
        <text x={58} y={Y(hy) + 4} fontSize="11" fill="#ff7ab6" textAnchor="end">
          {`h=${h}`}
        </text>
      </svg>
      <div className="c06-pto-side">
        <div className="readout">
          <b>{th.name}</b> &nbsp; <M t={`\\mathrm{PTO}=${th.ord}`} />
          <div className="small" style={{ marginTop: 4 }}>
            {pick(th.note.en, th.note.zh)}
          </div>
        </div>
        <Slider value={h} min={2} max={12} onChange={setH} label={<L en="hydra height h" zh="九头蛇高度 h" />} />
        <div className="small">
          <div>
            <span style={{ color: 'var(--green)' }}>✓</span>{' '}
            <L
              en={<>PA proves: “every hydra of height ≤ {h} dies” — its ordinals stay below <M t={`\\omega\\uparrow\\uparrow ${h}`} />, and PA proves TI there.</>}
              zh={<>PA 能证明：“高度 ≤ {h} 的九头蛇都会死”——它们的序数都在 <M t={`\\omega\\uparrow\\uparrow ${h}`} /> 之下，而 PA 能证明那里的超限归纳。</>}
            />
          </div>
          <div style={{ marginTop: 4 }}>
            <span style={{ color: 'var(--red)' }}>✗</span>{' '}
            <L
              en={<>PA does not prove: “for every h, every hydra of height h dies” — that needs all of <M t="\varepsilon_0" />.</>}
              zh={<>PA 证明不了：“对每个 h，高度为 h 的九头蛇都会死”——这需要整个 <M t="\varepsilon_0" />。</>}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

