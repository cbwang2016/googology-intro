import { useMemo, useState, type ReactNode } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { EXP_PRESETS, PSS_PRESETS, WALK_ROOTS, type Preset } from './data'
import {
  anatomy,
  bmsToPss,
  expand,
  expandCells,
  fmtMat,
  parentTable,
  parseMat,
  pssToBms,
  rows,
  standardIssues,
  valueTex,
  type Anatomy,
  type Cell,
  type Mat,
} from './lib'

/** Row colours (the book's Fig. 13.20 uses red, blue, pink, green for rows 1–4). */
export const ROWC = ['#ff6b6b', '#6be4ff', '#ff7ab6', '#7dffa8', '#ffa95e', '#b59bff', '#ffd36b', '#9aa3c7']
const COPYFILL = ['rgba(255,107,107,0.16)', 'rgba(107,228,255,0.16)', 'rgba(181,155,255,0.2)']
const copyFill = (k: number) => (k < 0 ? '#0b1128' : k === 0 ? COPYFILL[0] : COPYFILL[1 + ((k - 1) % 2)])
const copyStroke = (k: number) => (k < 0 ? '#2a3563' : k === 0 ? '#ff6b6b88' : k % 2 ? '#6be4ff88' : '#b59bff99')

/* ------------------------------------------------------------------ */
/* MatrixView: the SVG grid used by every widget                       */
/* ------------------------------------------------------------------ */
type Limit = Extract<Anatomy, { kind: 'limit' }>

export function MatrixView({
  S,
  stage = 0,
  an,
  cells,
  cw = 34,
  rh = 50,
  arcs = false,
  braces = false,
  maxRows,
}: {
  S: Mat
  stage?: number
  an?: Anatomy
  cells?: Cell[][]
  cw?: number
  rh?: number
  arcs?: boolean
  braces?: boolean
  maxRows?: number
}) {
  const { pick } = useLang()
  const X = S.length
  const Y = maxRows ?? rows(S)
  const P = useMemo(() => (arcs || stage > 0 ? parentTable(S) : null), [S, arcs, stage])
  const lim: Limit | null = an && an.kind === 'limit' ? an : null
  const padL = 26
  const padT = arcs || stage >= 1 ? 26 : 8
  const ch = 26
  const showDelta = !!lim && stage >= 4
  const W = padL + X * cw + (showDelta ? cw + 22 : 6)
  const H = padT + Y * rh - (rh - ch) + 22 + (braces ? 18 : 0)
  const cx = (x: number) => padL + x * cw + cw / 2
  const top = (y: number) => padT + y * rh
  const last = X - 1

  // ancestor chains of the last column, per row (rows ≤ t)
  const chainEdges = new Set<string>()
  if (P && lim && stage >= 2) {
    for (let y = 0; y <= lim.t; y++) for (let p = last, q = P[y][last]; q >= 0; p = q, q = P[y][q]) chainEdges.add(`${y}:${p}`)
  }

  const arcEls: ReactNode[] = []
  if (P && (arcs || stage >= 1)) {
    for (let y = 0; y < Y; y++)
      for (let x = 0; x < X; x++) {
        const p = P[y]?.[x] ?? -1
        if (p < 0) continue
        const onChain = chainEdges.has(`${y}:${x}`)
        const rootEdge = !!lim && stage >= 3 && x === last && y === lim.t
        const h = Math.min(rh - ch - 4, 7 + 3.2 * (x - p))
        const y0 = top(y)
        arcEls.push(
          <path
            key={`a${y}-${x}`}
            d={`M ${cx(x)} ${y0} Q ${(cx(x) + cx(p)) / 2} ${y0 - h * 2} ${cx(p)} ${y0}`}
            fill="none"
            stroke={rootEdge ? '#ffd36b' : ROWC[y % ROWC.length]}
            strokeWidth={rootEdge ? 3 : onChain ? 2.4 : 1.3}
            opacity={stage >= 2 && !onChain && lim ? 0.25 : rootEdge || onChain ? 1 : 0.6}
          />,
        )
      }
  }

  const cellEls: ReactNode[] = []
  for (let x = 0; x < X; x++)
    for (let y = 0; y < Y; y++) {
      const v = S[x][y] ?? 0
      let fill = '#0b1128'
      let stroke = '#2a3563'
      let sw = 1
      let dash: string | undefined
      let color = '#e6e9f5'
      let weight = 500
      if (cells) {
        const c = cells[x][y]
        fill = copyFill(c.copy)
        stroke = copyStroke(c.copy)
        if (c.lifted) {
          color = '#ffd36b'
          weight = 700
        }
        if (c.frozen) {
          stroke = '#ffa95e'
          sw = 2
          dash = '3 2'
        }
        if (c.forced) {
          stroke = '#ff3b3b'
          sw = 2.4
          color = '#ff9b9b'
        }
      } else if (lim && stage >= 3) {
        const r = lim.r
        if (x < r) color = '#9aa3c7'
        else if (x < last) {
          fill = COPYFILL[0]
          stroke = '#ff6b6b88'
        }
        if (x === r) {
          stroke = '#7dffa8'
          sw = 2.2
        }
        if (x === last) {
          color = '#6b7399'
          dash = '4 3'
        }
        if (stage >= 4 && x >= r && x < last && lim.delta[y] > 0 && !lim.mask[x - r][y]) {
          fill = 'rgba(154,163,199,0.16)'
          stroke = '#ffa95e'
          dash = '3 2'
          sw = 2
          color = '#9aa3c7'
        }
      }
      if (lim && stage >= 2 && x === last && y === lim.t) {
        stroke = '#ffd36b'
        sw = 2.6
        dash = undefined
        color = '#ffd36b'
      }
      cellEls.push(
        <g key={`c${x}-${y}`}>
          <rect x={cx(x) - cw / 2 + 2} y={top(y)} width={cw - 4} height={ch} rx={6} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />
          <text x={cx(x)} y={top(y) + 18} textAnchor="middle" fontSize={14} fill={color} fontWeight={weight} fontFamily="var(--mono)">
            {v}
          </text>
        </g>,
      )
    }

  // column labels and copy braces
  const footY = top(Y - 1) + ch + 14
  const labels: ReactNode[] = []
  for (let x = 0; x < X; x++)
    if (X <= 24 || x % 2 === 0)
      labels.push(
        <text key={`l${x}`} x={cx(x)} y={footY} textAnchor="middle" fontSize={10} fill={lim && stage >= 3 && x === lim.r ? '#7dffa8' : '#6b7399'}>
          {lim && stage >= 3 && x === lim.r ? pick('root', '坏根') : `c${x}`}
        </text>,
      )
  const braceEls: ReactNode[] = []
  if (braces && cells && X) {
    let s = 0
    for (let x = 1; x <= X; x++) {
      if (x === X || cells[x][0].copy !== cells[s][0].copy) {
        const k = cells[s][0].copy
        const x0 = cx(s) - cw / 2 + 3
        const x1 = cx(x - 1) + cw / 2 - 3
        const yb = footY + 8
        braceEls.push(
          <g key={`b${s}`}>
            <path d={`M ${x0} ${yb - 4} L ${x0} ${yb} L ${x1} ${yb} L ${x1} ${yb - 4}`} fill="none" stroke={k < 0 ? '#9aa3c7' : copyStroke(k)} />
            <text x={(x0 + x1) / 2} y={yb + 12} textAnchor="middle" fontSize={11} fill={k < 0 ? '#9aa3c7' : k === 0 ? '#ff9b9b' : k % 2 ? '#6be4ff' : '#b59bff'}>
              {k < 0 ? 'G' : `B${k === 0 ? '⁰' : k === 1 ? '¹' : k === 2 ? '²' : k === 3 ? '³' : '⁴'}`}
            </text>
          </g>,
        )
        s = x
      }
    }
  }

  return (
    <div className="scroll-x c09-mv">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={fmtMat(S)}>
        {Array.from({ length: Y }, (_, y) => (
          <text key={`r${y}`} x={8} y={top(y) + 18} fontSize={11} fill={ROWC[y % ROWC.length]} fontFamily="var(--mono)">
            {y}
          </text>
        ))}
        {arcEls}
        {cellEls}
        {labels}
        {braceEls}
        {showDelta && lim && (
          <g>
            <text x={cx(last) + cw / 2 + 10 + cw / 2} y={top(0) - 8} textAnchor="middle" fontSize={12} fill="#ffd36b">
              Δ
            </text>
            {lim.delta.map((d, y) => (
              <g key={`d${y}`}>
                <rect x={cx(last) + cw / 2 + 12} y={top(y)} width={cw - 4} height={ch} rx={6} fill="rgba(255,211,107,0.12)" stroke="#ffd36b" />
                <text x={cx(last) + cw / 2 + 10 + cw / 2} y={top(y) + 18} textAnchor="middle" fontSize={14} fill="#ffd36b" fontFamily="var(--mono)">
                  {d}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}

/** A value readout: TeX if known, otherwise an honest dash. */
export function Val({ S }: { S: Mat }) {
  const v = valueTex(S)
  return v ? <M t={v} /> : <span className="muted">—</span>
}

const fmtCol = (c: number[]) => `(${c.join(',')})`

/* ------------------------------------------------------------------ */
/* 1. The expander (centerpiece)                                       */
/* ------------------------------------------------------------------ */
const STAGES = [
  { en: 'Matrix', zh: '矩阵' },
  { en: 'Parents', zh: '父项' },
  { en: 'Last column', zh: '末列' },
  { en: 'Bad root', zh: '坏根' },
  { en: 'Δ & ascension', zh: 'Δ 与提升' },
  { en: 'Copy', zh: '复制' },
]

export function BmsExpander({ presets = EXP_PRESETS, initial = 0, startStage = 1 }: { presets?: Preset[]; initial?: number; startStage?: number }) {
  const { t } = useLang()
  const [src, setSrc] = useState(presets[initial].s)
  const [stage, setStage] = useState(startStage)
  const [n, setN] = useState(2)
  const [rule, setRule] = useState(true)
  const S = useMemo(() => parseMat(src), [src])
  const an = useMemo(() => (S ? anatomy(S) : null), [S])
  const cells = useMemo(() => (S && stage >= 5 ? expandCells(S, n, rule) : null), [S, stage, n, rule])
  const issues = S ? standardIssues(S) : []
  const lim = an && an.kind === 'limit' ? an : null
  const frozenCount = lim ? lim.mask.reduce((a, m) => a + m.filter((ok, y) => !ok && lim.delta[y] > 0).length, 0) : 0
  const pick = (s: string) => {
    setSrc(s)
    setStage(startStage)
  }

  let explain: ReactNode = null
  if (S && an) {
    const lastCol = S.length ? fmtCol(S[S.length - 1]) : ''
    if (an.kind === 'empty') explain = <L en="The empty matrix is 0." zh="空矩阵就是 0。" />
    else if (an.kind === 'succ')
      explain = (
        <L
          en={<>The last column {lastCol} has no parent in any row: this is a <b>successor</b>. S[n] simply deletes it; the value is (the rest) + 1.</>}
          zh={<>末列 {lastCol} 在任何一行都没有父项：这是<b>后继</b>情形。S[n] 直接删掉它，值等于（剩下的部分）+ 1。</>}
        />
      )
    else if (lim) {
      const X = S.length
      const r = lim.r
      const tt = lim.t
      const d = lim.delta.join(',')
      explain = [
        <L
          en="Each column is one term; read rows top to bottom. Step through the stages, or pick another matrix."
          zh="每一列是一项，行号从上往下数。逐步点下面的阶段，或者换一个矩阵试试。"
        />,
        <L
          en={<>Each arc joins an entry to its <b>parent</b>. Row 0: the nearest smaller entry to the left. Lower rows: the nearest smaller entry to the left <b>that sits under a parent-chain (ancestor) of the entry above</b>.</>}
          zh={<>每条弧把一个数连到它的<b>父项</b>。第 0 行：左边最近的更小的数。更下面的行：左边最近的、更小的、并且<b>正上方是“上一行祖先”</b>的那个数。</>}
        />,
        <L
          en={<>Last column {lastCol}. Its lowest entry that has a parent is in row t = {tt} (gold). Bold arcs: the last column’s ancestor chains in rows 0…{tt}.</>}
          zh={<>末列是 {lastCol}。它最下面那个有父项的数在第 t = {tt} 行（金色）。粗弧：末列在第 0…{tt} 行的祖先链。</>}
        />,
        <L
          en={<>Follow the gold arc: the parent of that entry is in column c{r} — the <b>bad root</b>. Good part G = c0…c{r - 1}{r === 0 ? ' (empty)' : ''}; bad part B = c{r}…c{X - 2} (red). The last column will be deleted.</>}
          zh={<>顺着金色的弧走：那个数的父项在 c{r} 列——这就是<b>坏根</b>。好部 G = c0…c{r - 1}{r === 0 ? '（空）' : ''}；坏部 B = c{r}…c{X - 2}（红色）。末列将被删掉。</>}
        />,
        <L
          en={<>Δ = last column − bad root, set to 0 from row t = {tt} down: Δ = ({d}). {frozenCount ? <>The {frozenCount} dashed entr{frozenCount > 1 ? 'ies do' : 'y does'} not have the bad root among {frozenCount > 1 ? 'their' : 'its'} ancestors, so by the <b>special rule</b> {frozenCount > 1 ? 'they stay' : 'it stays'} put.</> : <>Every bad-part entry in a row with Δ ≠ 0 descends from the bad root, so all of them ascend.</>}</>}
          zh={<>Δ = 末列 − 坏根，并把第 t = {tt} 行及以下设为 0：Δ = ({d})。{frozenCount ? <>虚线框的 {frozenCount} 个数的祖先里没有坏根，按<b>额外规则</b>它们原地不动。</> : <>坏部里凡是 Δ 不为 0 的行，每个数都是坏根的后代，所以全部提升。</>}</>}
        />,
        <L
          en={<>S[{n}] = G B⁰ B¹ … B{n === 0 ? '⁰' : 'ⁿ'}: copy k adds k·Δ to every ascending entry (gold). {rule ? 'Orange dashes: frozen by the special rule.' : 'Red outlines: entries that ascend only because the special rule is off.'}</>}
          zh={<>S[{n}] = G B⁰ B¹ … B{n === 0 ? '⁰' : 'ⁿ'}：第 k 份复制给每个要提升的数加上 k·Δ（金色）。{rule ? '橙色虚线：被额外规则冻结。' : '红框：只因为关掉了额外规则才被提升的数。'}</>}
        />,
      ][stage]
    }
  }

  return (
    <div className="c09-exp">
      {presets.length > 5 ? (
        <select className="c09-input c09-select" value={presets.some((p) => p.s === src) ? src : ''} onChange={(e) => e.target.value && pick(e.target.value)} aria-label={t('presets', '预设')}>
          {!presets.some((p) => p.s === src) && <option value="">{t('(your own matrix)', '（自定义矩阵）')}</option>}
          {presets.map((p) => (
            <option key={p.s} value={p.s}>
              {t(p.label.en, p.label.zh)} — {fmtMat(parseMat(p.s)!, true)}
            </option>
          ))}
        </select>
      ) : (
        <div className="btn-row">
          {presets.map((p) => (
            <button key={p.s} className={`chip ${p.s === src ? 'on' : ''}`} onClick={() => pick(p.s)}>
              <L {...p.label} />
            </button>
          ))}
        </div>
      )}
      <input
        className="c09-input"
        value={src}
        spellCheck={false}
        aria-label={t('BMS matrix', 'BMS 矩阵')}
        onChange={(e) => {
          setSrc(e.target.value)
        }}
      />
      {!S && <div className="caution small">{t('Write columns like (0,0)(1,1)(2,2).', '请按 (0,0)(1,1)(2,2) 的格式输入列。')}</div>}
      {S && issues.length > 0 && (
        <div className="muted small">
          {t(
            `Not standard: fails necessary condition ${issues.join(', ')} of Thm 13.1. The rules still run, but values are meaningless.`,
            `非标准表达式：不满足定理 13.1 的必要条件 ${issues.join('、')}。规则照样能运行，但值没有意义。`,
          )}
        </div>
      )}
      <div className="btn-row c09-stages" role="tablist">
        {STAGES.map((s, i) => (
          <button key={i} role="tab" aria-selected={stage === i} className={`chip ${stage === i ? 'on' : ''}`} onClick={() => setStage(i)} disabled={!lim && i >= 2 && i <= 4}>
            {i}. <L {...s} />
          </button>
        ))}
      </div>
      {S && S.length > 0 && <MatrixView S={S} stage={lim ? stage : Math.min(stage, 1)} an={an ?? undefined} rh={stage >= 5 ? 34 : 42} />}
      <div className="c09-explain">{explain}</div>
      {S && stage >= 5 && cells && (
        <>
          <div className="row">
            <Slider value={n} min={0} max={4} onChange={setN} label="n" />
            <label className="c09-toggle">
              <input type="checkbox" checked={rule} onChange={(e) => setRule(e.target.checked)} />
              <L en="special rule" zh="额外规则" />
            </label>
          </div>
          <MatrixView S={cells.map((c) => c.map((e) => e.v))} cells={cells} braces cw={cells.length > 20 ? 28 : 34} rh={cells[0] && cells[0].length > 3 ? 32 : 36} />
          <div className="c09-vals small">
            <span>
              <M t="S=" /> <Val S={S} />
            </span>
            <span>
              <M t={`S[${n}]=`} /> <Val S={expand(S, n, rule)} />
            </span>
            {cells.length <= 40 && (
              <button className="btn small" onClick={() => pick(fmtMat(expand(S, n, rule)))}>
                <L en="Continue from S[n]" zh="从 S[n] 继续" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Fundamental-sequence walker                                      */
/* ------------------------------------------------------------------ */
export function FsWalker({ roots = WALK_ROOTS, initial = 1 }: { roots?: typeof WALK_ROOTS; initial?: number }) {
  const [ri, setRi] = useState(initial)
  const [n, setN] = useState(3)
  const S = useMemo(() => parseMat(roots[ri].s)!, [roots, ri])
  const terms = useMemo(() => Array.from({ length: n + 1 }, (_, k) => expand(S, k)), [S, n])
  const cells = useMemo(() => expandCells(S, n), [S, n])
  return (
    <div>
      <div className="btn-row">
        {roots.map((r, i) => (
          <button key={r.s} className={`chip ${i === ri ? 'on' : ''}`} onClick={() => setRi(i)}>
            <L {...r.label} />
          </button>
        ))}
      </div>
      <Slider value={n} min={0} max={5} onChange={setN} label="n" />
      <MatrixView S={cells.map((c) => c.map((e) => e.v))} cells={cells} braces cw={30} rh={34} />
      <div className="c09-terms">
        {terms.map((tm, k) => (
          <div key={k} className={`c09-term ${k === n ? 'cur' : ''}`}>
            <span className="mono c09-term-k">[{k}]</span>
            <span className="mono c09-term-s">{fmtMat(tm, true)}</span>
            <span className="c09-term-v">
              <Val S={tm} />
            </span>
          </div>
        ))}
        <div className="c09-term lim">
          <span className="mono c09-term-k">sup</span>
          <span className="mono c09-term-s">{fmtMat(S, true)}</span>
          <span className="c09-term-v">
            <Val S={S} />
          </span>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. PSS hydra <-> 2-row BMS                                          */
/* ------------------------------------------------------------------ */
function pssColoured(S: Mat, colour: (x: number) => string | null): string {
  const P = parentTable(S)
  const kids: number[][] = S.map(() => [])
  const tops: number[] = []
  S.forEach((_, x) => (P[0][x] < 0 ? tops.push(x) : kids[P[0][x]].push(x)))
  const term = (x: number): string => {
    const head = `p_{${(S[x][1] ?? 0) + 1}}`
    const c = colour(x)
    const h = c ? `\\textcolor{${c}}{${head}}` : head
    return kids[x].length ? `${h}(${kids[x].map(term).join('+')})` : h
  }
  return tops.map(term).join('+')
}

export function PssTranslator() {
  const { t } = useLang()
  const [src, setSrc] = useState(PSS_PRESETS[4])
  const isBms = src.trim().startsWith('(')
  const S = useMemo(() => {
    const m = isBms ? parseMat(src) : pssToBms(src)
    if (!m || m.length === 0) return null
    if (rows(m) > 2 && m.some((c) => c.slice(2).some((v) => v !== 0))) return null
    return m.map((c) => [c[0], c[1] ?? 0])
  }, [src, isBms])
  const ok = S && bmsToPss(S) !== null
  const an = S ? anatomy(S) : null
  const lim = an && an.kind === 'limit' ? an : null
  const colour = (x: number) => (!S ? null : x === S.length - 1 ? '#ffd36b' : lim && x === lim.r ? '#7dffa8' : lim && x > lim.r ? '#ff7ab6' : null)
  const E = S && lim ? expand(S, 2) : null
  return (
    <div>
      <div className="btn-row c09-chips">
        {PSS_PRESETS.map((p) => (
          <button key={p} className={`chip mono ${p === src ? 'on' : ''}`} onClick={() => setSrc(p)}>
            {p}
          </button>
        ))}
      </div>
      <input className="c09-input" value={src} spellCheck={false} aria-label={t('matrix or PSS term', '矩阵或 PSS 表达式')} onChange={(e) => setSrc(e.target.value)} />
      {!ok && <div className="caution small">{t('Type a 2-row matrix like (0,0)(1,1)(2,2), or a PSS term like p1(p2(p3)). Depths must step by one.', '请输入双行矩阵，如 (0,0)(1,1)(2,2)；或 PSS 表达式，如 p1(p2(p3))。深度每次只能加一。')}</div>}
      {S && ok && (
        <>
          <MatrixView S={S} stage={lim ? 3 : 1} an={an ?? undefined} arcs rh={40} />
          <div className="c09-pss">
            <div>
              <span className="muted small">PSS</span> <M t={pssColoured(S, colour)} />
            </div>
            {E && (
              <div>
                <span className="muted small">[2]</span> <M t={pssColoured(E, () => null)} />
                <div className="mono small muted">= {fmtMat(E)}</div>
              </div>
            )}
          </div>
          <div className="muted small">
            {lim ? (
              <L
                en={<>Row 0 = bracket depth, row 1 = subscript − 1. The last term (gold) looks outward for the first enclosing term with a smaller subscript: the bad root (green). Green + pink gets copied.</>}
                zh={<>第 0 行 = 括号深度，第 1 行 = 下标 − 1。最后一项（金色）往外层找第一个下标更小的项：坏根（绿色）。绿色 + 粉色就是被复制的部分。</>}
              />
            ) : (
              <L en="The last term is p₁: a successor (+1)." zh="最后一项是 p₁：后继（+1）。" />
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Static anatomy figure (not interactive)                             */
/* ------------------------------------------------------------------ */
export function AnatomyFig({ s, n = 2, caption }: { s: string; n?: number; caption?: ReactNode }) {
  const S = parseMat(s)!
  const an = anatomy(S)
  const cells = expandCells(S, n)
  return (
    <figure className="c09-fig">
      <MatrixView S={S} stage={4} an={an} cw={34} rh={46} />
      <div className="c09-fig-arrow muted small">
        <M t={`\\Downarrow\\ [${n}]`} />
      </div>
      <MatrixView S={cells.map((c) => c.map((e) => e.v))} cells={cells} braces cw={34} rh={46} />
      {caption && <figcaption className="c09-fig-cap">{caption}</figcaption>}
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Special rule on / off, side by side                                 */
/* ------------------------------------------------------------------ */
const RULE_PRESETS = ['(0,0,0)(1,1,1)(2,0,0)(1,1,1)', '(0,0,0)(1,1,1)(2,1,0)(1,1,0)(2,2,1)(3,1,0)(2,2,1)', '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,2,0)']

export function RuleCompare() {
  const [src, setSrc] = useState(RULE_PRESETS[0])
  const [n, setN] = useState(2)
  const S = useMemo(() => parseMat(src)!, [src])
  const on = useMemo(() => expandCells(S, n, true), [S, n])
  const off = useMemo(() => expandCells(S, n, false), [S, n])
  const diff = on.reduce((a, c, x) => a + c.filter((e, y) => e.v !== off[x][y].v).length, 0)
  return (
    <div>
      <div className="btn-row c09-chips">
        {RULE_PRESETS.map((p) => (
          <button key={p} className={`chip mono ${p === src ? 'on' : ''}`} onClick={() => setSrc(p)}>
            {fmtMat(parseMat(p)!, true)}
          </button>
        ))}
      </div>
      <Slider value={n} min={1} max={3} onChange={setN} label="n" />
      <div className="small">
        <b className="c09-good">
          <L en="Rule on (BM4)" zh="有额外规则（BM4）" />
        </b>
      </div>
      <MatrixView S={on.map((c) => c.map((e) => e.v))} cells={on} braces cw={30} rh={31} />
      <div className="small">
        <b className="c09-bad">
          <L en="Rule off" zh="去掉额外规则" />
        </b>
      </div>
      <MatrixView S={off.map((c) => c.map((e) => e.v))} cells={off} braces cw={30} rh={31} />
      <div className="muted small">
        {diff === 0 ? (
          <L en="No difference here: in every row where Δ ≠ 0, all bad-part entries descend from the bad root." zh="这里没有区别：在 Δ 不为 0 的每一行，坏部的数都是坏根的后代。" />
        ) : (
          <L
            en={<>{diff} entries differ. Orange dashes: frozen by the rule. Red: lifted only because the rule is off.</>}
            zh={<>有 {diff} 个数不同。橙色虚线：被规则冻结；红色：只因去掉规则才被提升。</>}
          />
        )}
      </div>
    </div>
  )
}
