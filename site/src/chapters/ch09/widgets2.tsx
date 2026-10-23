import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { LADDER, MOUNTAIN_PRESETS } from './data'
import { anatomy, chainA, cmpLex, eqMat, expand, expandCells, fmtMat, parentTable, parseMat, reach, rows, zeroY, type Mat } from './lib'
import { MatrixView, ROWC, Val } from './widgets'

/* ------------------------------------------------------------------ */
/* 4. Strength ladder                                                  */
/* ------------------------------------------------------------------ */
export function StrengthLadder() {
  const { t } = useLang()
  const [sel, setSel] = useState(8)
  const r = LADDER[sel]
  const S = useMemo(() => parseMat(r.s)!, [r])
  const oy = useMemo(() => zeroY(S)[0], [S])
  const an = useMemo(() => anatomy(S), [S])
  return (
    <div className="c09-ladder">
      <ol className="c09-rungs" aria-label={t('landmarks', '地标')}>
        <li className="c09-rung top">
          <span className="c09-rung-name">SHO</span>
          <span className="mono small muted">(0,0,0,…)(1,1,1,…)</span>
        </li>
        {[...LADDER].reverse().map((g) => {
          const i = LADDER.indexOf(g)
          const beyond = g.ch >= 10
          return (
            <li key={g.s}>
              <button className={`c09-rung ${i === sel ? 'on' : ''} ${beyond ? 'beyond' : ''}`} onClick={() => setSel(i)}>
                <span className="c09-rung-name">{g.name}</span>
                <span className="mono small c09-rung-s">{fmtMat(parseMat(g.s)!, true)}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="c09-rung-detail">
        <div className="c09-rung-title">
          <b>{r.name}</b> · <L {...r.full} />
        </div>
        <div className="small muted">
          {r.ch >= 10 ? (
            <L en="Name only — Chapter 10 explains the reflection ideas behind it." zh="这里只给名字——第 10 章会解释它背后的“反射”思想。" />
          ) : (
            <L en={<>Met in Chapter {r.ch}.</>} zh={<>第 {r.ch} 章已经见过。</>} />
          )}
        </div>
        <MatrixView S={S} an={an} stage={an.kind === 'limit' ? 3 : 1} cw={30} rh={36} />
        <div className="small">
          <L en="rows" zh="行数" />: <b>{rows(S)}</b> · <L en="columns" zh="列数" />: <b>{S.length}</b> · 0-Y: <span className="mono">({oy.join(',')})</span>
        </div>
        <div className="c09-terms">
          {[1, 2, 3].map((k) => {
            const E = expand(S, k)
            return (
              <div key={k} className="c09-term">
                <span className="mono c09-term-k">[{k}]</span>
                <span className="mono c09-term-s">{fmtMat(E, true)}</span>
                <span className="c09-term-v">
                  <Val S={E} />
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. The infinite descending chain without the special rule           */
/* ------------------------------------------------------------------ */
type Frame = { S: Mat; n: number | null; k: number }

export function DescentChain() {
  const { t } = useLang()
  const KMAX = 4
  // full sequence of frames A_0 → … → A_KMAX (rule off), computed once
  const frames = useMemo(() => {
    const out: Frame[] = [{ S: chainA(0), n: null, k: 0 }]
    for (let k = 0; k < KMAX; k++) {
      const path = reach(chainA(k), chainA(k + 1), false) ?? []
      let s = chainA(k)
      for (const n of path) {
        s = expand(s, n, false)
        out.push({ S: s, n, k: eqMat(s, chainA(k + 1)) ? k + 1 : -1 })
      }
    }
    return out
  }, [])
  const milestones = useMemo(() => frames.map((f, i) => (f.k >= 0 ? i : -1)).filter((i) => i >= 0), [frames])
  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)
  useEffect(() => {
    if (!playing) return
    timer.current = window.setInterval(() => setPos((p) => (p + 1 < frames.length ? p + 1 : p)), 60)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [playing, frames.length])
  useEffect(() => {
    if (pos >= frames.length - 1) setPlaying(false)
  }, [pos, frames.length])
  const f = frames[pos]
  const nextM = milestones.find((m) => m > pos)
  const lastK = [...milestones].reverse().find((m) => m <= pos)!
  const kNow = frames[lastK].k
  const ruleOn = expand(chainA(0), 1, true)
  const ruleOff = expand(chainA(0), 1, false)
  const prev = pos > 0 ? frames[pos - 1].S : null
  return (
    <div>
      <div className="c09-chain-head">
        <span className="stat">
          <span className="stat-label">{t('FS steps taken', '已走基本列步数')}</span>
          <span className="stat-value">{pos}</span>
        </span>
        <span className="stat">
          <span className="stat-label">{t('last milestone', '最近的里程碑')}</span>
          <span className="stat-value">
            A<sub>{kNow}</sub>
          </span>
        </span>
        <span className="stat">
          <span className="stat-label">{t('this step', '这一步')}</span>
          <span className="stat-value">{f.n === null ? '—' : f.n === 0 ? t('[0]: delete', '[0]：删末列') : `[${f.n}]`}</span>
        </span>
        <span className="stat">
          <span className="stat-label">{t('smaller than before?', '比上一步小？')}</span>
          <span className="stat-value">{prev ? (cmpLex(f.S, prev) < 0 ? t('yes', '是') : t('no', '否')) : '—'}</span>
        </span>
      </div>
      <MatrixView S={f.S} cells={f.S.map((c, x) => c.map((v) => ({ v, copy: x < 6 ? -1 : 1, lifted: false, frozen: false, forced: false })))} cw={f.S.length > 22 ? 25 : 30} rh={30} />
      <div className="btn-row">
        <button className="btn small" disabled={pos >= frames.length - 1} onClick={() => setPos(pos + 1)}>
          <L en="One FS step" zh="走一步" />
        </button>
        <button className="btn small" disabled={nextM === undefined} onClick={() => nextM !== undefined && setPos(nextM)}>
          <L en={<>Jump to A<sub>{kNow + 1}</sub></>} zh={<>跳到 A<sub>{kNow + 1}</sub></>} />
        </button>
        <button className="btn small" disabled={pos >= frames.length - 1} onClick={() => setPlaying(!playing)}>
          {playing ? <L en="Pause" zh="暂停" /> : <L en="Play" zh="播放" />}
        </button>
        <button className="btn small" onClick={() => (setPlaying(false), setPos(0))}>
          <L en="Reset" zh="重来" />
        </button>
      </div>
      <div className="c09-milestones small">
        {milestones.filter((m) => m <= (nextM ?? pos)).map((m) => (
          <div key={m} className={`mono ${m <= pos ? '' : 'muted'}`}>
            A<sub>{frames[m].k}</sub> = …{fmtMat(frames[m].S.slice(6))} <span className="muted">({t(`step ${m}`, `第 ${m} 步`)})</span>
          </div>
        ))}
      </div>
      <div className="c09-ruleon small">
        <L
          en={<>With the rule back on, the very first expansion differs: A₀[1] ends in <span className="mono c09-good">{fmtMat(ruleOn.slice(-3))}</span> instead of <span className="mono c09-bad">{fmtMat(ruleOff.slice(-3))}</span>, and the self-copying pattern never starts.</>}
          zh={<>把规则打开，第一次展开就不同了：A₀[1] 的结尾是 <span className="mono c09-good">{fmtMat(ruleOn.slice(-3))}</span>，而不是 <span className="mono c09-bad">{fmtMat(ruleOff.slice(-3))}</span>，自我复制的模式根本启动不了。</>}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. 0-Y mountain                                                     */
/* ------------------------------------------------------------------ */
export function Mountain() {
  const { t } = useLang()
  const [src, setSrc] = useState(MOUNTAIN_PRESETS[1])
  const [n, setN] = useState(0)
  const base = useMemo(() => parseMat(src)!, [src])
  const S = useMemo(() => (n === 0 ? base : expand(base, n)), [base, n])
  const cells = useMemo(() => (n === 0 ? null : expandCells(base, n)), [base, n])
  const V = useMemo(() => zeroY(S), [S])
  const P = useMemo(() => parentTable(S), [S])
  const Y = rows(S)
  const X = S.length
  const cw = X > 14 ? 40 : 48
  const lh = 40
  const W = 30 + X * cw
  const H = 24 + (Y + 1) * lh
  const cx = (x: number) => 30 + x * cw + cw / 2
  const cy = (lvl: number) => H - 22 - lvl * lh
  const els: ReactNode[] = []
  for (let y = 0; y < Y; y++)
    for (let x = 0; x < X; x++) {
      if (S[x][y] === 0) continue
      const p = P[y][x]
      // right leg: the difference above down to its entry; left leg: down to the entry's parent
      els.push(<line key={`r${x}-${y}`} x1={cx(x)} y1={cy(y + 1)} x2={cx(x)} y2={cy(y)} stroke={ROWC[y % ROWC.length]} strokeWidth={1.6} opacity={0.85} />)
      els.push(<line key={`l${x}-${y}`} x1={cx(x)} y1={cy(y + 1)} x2={cx(p)} y2={cy(y)} stroke={ROWC[y % ROWC.length]} strokeWidth={1.6} opacity={0.55} strokeDasharray="4 3" />)
    }
  const nodes: ReactNode[] = []
  for (let lvl = 0; lvl <= Y; lvl++)
    for (let x = 0; x < X; x++) {
      const isTop = lvl === Y
      const copy = cells ? cells[x][0].copy : -1
      nodes.push(
        <g key={`n${x}-${lvl}`}>
          <circle cx={cx(x)} cy={cy(lvl)} r={13} fill={lvl === 0 ? 'rgba(255,211,107,0.15)' : '#0b1128'} stroke={lvl === 0 ? '#ffd36b' : copy > 0 ? '#6be4ff' : '#2a3563'} />
          <text x={cx(x)} y={cy(lvl) + 4.5} textAnchor="middle" fontSize={V[lvl][x] > 99 ? 10 : 12.5} fill={lvl === 0 ? '#ffd36b' : isTop ? '#6b7399' : '#e6e9f5'} fontFamily="var(--mono)">
            {V[lvl][x]}
          </text>
        </g>,
      )
    }
  return (
    <div>
      <div className="btn-row">
        {MOUNTAIN_PRESETS.map((p) => (
          <button key={p} className={`chip mono ${p === src ? 'on' : ''}`} onClick={() => (setSrc(p), setN(0))}>
            0-Y({zeroY(parseMat(p)!)[0].join(',')})
          </button>
        ))}
      </div>
      <Slider value={n} min={0} max={3} onChange={setN} label={t('expand [n]', '展开 [n]')} />
      <div className="scroll-x">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('0-Y mountain', '0-Y 山脉')}>
          {Array.from({ length: Y + 1 }, (_, l) => (
            <text key={l} x={4} y={cy(l) + 4} fontSize={10} fill="#6b7399">
              {l === 0 ? '0-Y' : `S${l}`}
            </text>
          ))}
          {els}
          {nodes}
        </svg>
      </div>
      <div className="c09-pair small">
        <div>
          <span className="muted">BMS</span> <span className="mono">{fmtMat(S, true)}</span>
        </div>
        <div>
          <span className="muted">0-Y</span> <span className="mono c09-gold">({V[0].join(',')})</span>
        </div>
      </div>
      <div className="muted small">
        <L
          en={<>Bottom row: the 0-Y sequence. Each node above an entry is the difference “entry − its parent”: solid leg down to the entry, dashed leg to its parent. Same parent structure as the BMS matrix, drawn upside down.</>}
          zh={<>最底行就是 0-Y 序列。每个数正上方的节点是“这个数 − 它的父项”：实线腿连到这个数，虚线腿连到它的父项。父项结构和 BMS 矩阵完全一样，只是上下颠倒。</>}
        />{' '}
        {n > 0 && <M t={`\\text{0-Y}(${zeroY(base)[0].join(',')})[${n}]`} />}
      </div>
    </div>
  )
}
