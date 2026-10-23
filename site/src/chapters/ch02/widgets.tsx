import { useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { arrowExact, arrowSize, type Size } from '../../lib/arrows'
import { fromNum, powConst, toTex, type Huge } from '../../lib/huge'

const ARROWS = (c: number) => (c <= 4 ? '\\uparrow'.repeat(c) : `\\uparrow^{${c}}`) + ' '
const commas = (v: bigint) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '{,}')

/* ------------------------------------------------------------------ */
/* Size description, shared                                            */
/* ------------------------------------------------------------------ */
export function SizeText({ s, a, c, b }: { s: Size; a: number; c: number; b: number }) {
  switch (s.kind) {
    case 'exact':
      return <M t={`= ${commas(s.v)}`} />
    case 'approx':
      return <M t={`\\approx ${toTex(s.v)}`} />
    case 'tower':
      return (
        <L
          en={<>a tower of {s.base}’s, <M t={`${toTex(s.height)}`} /> levels high</>}
          zh={<>一座由 {s.base} 组成、高 <M t={`${toTex(s.height)}`} /> 层的指数塔</>}
        />
      )
    case 'towers':
      return (
        <L
          en={
            <>
              a tower of {s.base}’s whose height is a tower whose height is … ({s.depth} nested “heights”), the innermost height being{' '}
              <M t={toTex(s.inner)} />
            </>
          }
          zh={
            <>
              一座指数塔，它的层数是一座塔，那座塔的层数又是一座塔……（共嵌套 {s.depth} 次“层数”），最里面的层数约为 <M t={toTex(s.inner)} />
            </>
          }
        />
      )
    case 'beyond':
      return (
        <L
          en={<>no simpler description: <M t={`${a}${ARROWS(c)}${b}`} /> is beyond “towers of towers”</>}
          zh={<>没有更简单的描述：<M t={`${a}${ARROWS(c)}${b}`} /> 已经超出了“塔的塔”</>}
        />
      )
  }
}

/* ------------------------------------------------------------------ */
/* 1. Operation ladder                                                 */
/* ------------------------------------------------------------------ */
export function OperationLadder() {
  const [level, setLevel] = useState(3)
  const [a, setA] = useState(3)
  const [b, setB] = useState(3)
  const names = [
    { en: 'addition', zh: '加法' },
    { en: 'multiplication', zh: '乘法' },
    { en: 'exponentiation', zh: '乘方' },
    { en: 'tetration (↑↑)', zh: '迭代幂次 (↑↑)' },
    { en: 'pentation (↑↑↑)', zh: '五级运算 (↑↑↑)' },
  ]
  const opTex = ['+', '\\times', '\\uparrow', '\\uparrow\\uparrow', '\\uparrow\\uparrow\\uparrow'][level - 1]
  const innerTex = ['+', '+', '\\times', '\\uparrow', '\\uparrow\\uparrow'][level - 1]
  const piece = level === 1 ? '1' : String(a)
  const copies = Math.min(b, 8)
  const parts = Array(copies).fill(piece).join(` ${innerTex} `) + (b > 8 ? ` ${innerTex} \\cdots` : '')
  const expanded = level === 1 ? `${a} ${innerTex} ${parts}` : parts
  const value: Size =
    level === 1 ? { kind: 'exact', v: BigInt(a + b) } : level === 2 ? { kind: 'exact', v: BigInt(a * b) } : arrowSize(a, level - 2, b)
  return (
    <div>
      <div className="btn-row">
        {names.map((n, i) => (
          <button key={i} className={`chip ${level === i + 1 ? 'on' : ''}`} onClick={() => setLevel(i + 1)}>
            <L {...n} />
          </button>
        ))}
      </div>
      <Slider value={a} min={1} max={10} onChange={setA} label="a" />
      <Slider value={b} min={0} max={10} onChange={setB} label="b" />
      <div className="readout ladder-readout">
        <M t={`${a} ${opTex} ${b} = ${b === 0 ? (level === 1 ? String(a) : level === 2 ? '0' : '1') : expanded}`} />
        <div className="muted small">
          {b > 0 && level > 1 && (
            <L
              en={<>{b} copies of {a}, joined by the operation one level down{level >= 3 ? ', evaluated from the right' : ''}.</>}
              zh={<>{b} 个 {a}，用低一级的运算连起来{level >= 3 ? '，从右往左算' : ''}。</>}
            />
          )}
          {b > 0 && level === 1 && <L en={<>Add one, {b} times.</>} zh={<>加一，加 {b} 次。</>} />}
        </div>
        <div style={{ marginTop: 6 }}>
          <SizeText s={value} a={a} c={Math.max(1, level - 2)} b={b} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Rewrite machine: unfold Def 2.11 step by step                    */
/* ------------------------------------------------------------------ */
type Expr = { k: 'num'; v: bigint } | { k: 'big'; v: Huge } | { k: 'op'; a: bigint; c: number; b: Expr }

function exprTex(e: Expr, depth = 0): string {
  if (e.k === 'num') return commas(e.v)
  if (e.k === 'big') return `\\left[\\approx ${toTex(e.v)}\\right]`
  if (depth > 10) return '\\cdots'
  const inner = exprTex(e.b, depth + 1)
  const wrapped = e.b.k === 'op' ? `\\left(${inner}\\right)` : inner
  return `${e.a}${ARROWS(e.c)}${wrapped}`
}

type StepResult = { e: Expr; rule: 'pow' | 'zero' | 'unfold' | 'stuck' | 'done' }

function step(e: Expr): StepResult {
  if (e.k !== 'op') return { e, rule: 'done' }
  if (e.b.k === 'op') {
    const r = step(e.b)
    return { e: { ...e, b: r.e }, rule: r.rule }
  }
  if (e.c === 1) {
    if (e.b.k === 'num') {
      const ex = arrowExact(e.a, 1, e.b.v)
      if (ex !== null) return { e: { k: 'num', v: ex }, rule: 'pow' }
      return { e: { k: 'big', v: powConst(Number(e.a), fromNum(Number(e.b.v))) }, rule: 'pow' }
    }
    return { e: { k: 'big', v: powConst(Number(e.a), e.b.v) }, rule: 'pow' }
  }
  if (e.b.k === 'big') return { e, rule: 'stuck' }
  if (e.b.v === 0n) return { e: { k: 'num', v: 1n }, rule: 'zero' }
  return { e: { k: 'op', a: e.a, c: e.c - 1, b: { k: 'op', a: e.a, c: e.c, b: { k: 'num', v: e.b.v - 1n } } }, rule: 'unfold' }
}

const PRESETS: [number, number, number][] = [
  [2, 2, 3],
  [3, 2, 3],
  [2, 3, 3],
  [2, 2, 5],
  [3, 3, 3],
  [3, 1, 4],
]

export function RewriteMachine() {
  const { t } = useLang()
  const [preset, setPreset] = useState(1)
  const start = useMemo<Expr>(() => {
    const [a, c, b] = PRESETS[preset]
    return { k: 'op', a: BigInt(a), c, b: { k: 'num', v: BigInt(b) } }
  }, [preset])
  const [hist, setHist] = useState<StepResult[]>([{ e: start, rule: 'done' }])
  useEffect(() => setHist([{ e: start, rule: 'done' }]), [start])
  const cur = hist[hist.length - 1]
  const next = step(cur.e)
  const finished = next.rule === 'done' || next.rule === 'stuck' || hist.length > 300
  const advance = (k: number) => {
    let h = hist
    for (let i = 0; i < k; i++) {
      const last = h[h.length - 1]
      const r = step(last.e)
      if (r.rule === 'done' || r.rule === 'stuck') break
      h = [...h, r]
      if (h.length > 300) break
    }
    setHist(h)
  }
  const ruleText: Record<string, string> = {
    unfold: t('rule (3): a↑ᶜ⁺¹(b+1) = a↑ᶜ(a↑ᶜ⁺¹b)', '规则 (3)：a↑ᶜ⁺¹(b+1) = a↑ᶜ(a↑ᶜ⁺¹b)'),
    zero: t('rule (2): a↑ᶜ0 = 1', '规则 (2)：a↑ᶜ0 = 1'),
    pow: t('rule (1): a↑¹b = aᵇ (compute the power)', '规则 (1)：a↑¹b = aᵇ（算出乘方）'),
  }
  const shown = hist.slice(-8)
  return (
    <div>
      <div className="btn-row">
        {PRESETS.map(([a, c, b], i) => (
          <button key={i} className={`chip ${i === preset ? 'on' : ''}`} onClick={() => setPreset(i)}>
            <M t={`${a}${ARROWS(c)}${b}`} />
          </button>
        ))}
      </div>
      <div className="rewrite">
        {hist.length > 8 && <div className="muted small">⋮ ({hist.length - 8} {t('earlier steps', '步之前的步骤')})</div>}
        {shown.map((h, i) => (
          <div key={hist.length - shown.length + i} className={`rw-line ${i === shown.length - 1 ? 'cur' : ''}`}>
            <span className="rw-eq">{hist.length - shown.length + i === 0 ? ' ' : '='}</span>
            <M t={exprTex(h.e)} />
            {h.rule !== 'done' && <span className="rw-rule">{ruleText[h.rule]}</span>}
          </div>
        ))}
      </div>
      <div className="btn-row">
        <button className="btn small" disabled={finished} onClick={() => advance(1)}>
          <L en="One step" zh="走一步" />
        </button>
        <button className="btn small" disabled={finished} onClick={() => advance(1000)}>
          <L en="Run to the end" zh="一直算到底" />
        </button>
        <button className="btn small" onClick={() => setHist([{ e: start, rule: 'done' }])}>
          <L en="Reset" zh="重来" />
        </button>
        <span className="muted small" style={{ alignSelf: 'center' }}>
          <L en={`steps: ${hist.length - 1}`} zh={`已走 ${hist.length - 1} 步`} />
        </span>
      </div>
      {next.rule === 'stuck' && (
        <div className="caution">
          <span className="caution-icon">⚠</span>
          <L
            en="Stuck: the next unfolding would need more steps than there are atoms in the universe. The definition still determines the answer exactly — we just cannot carry it out."
            zh="卡住了：下一步展开需要的步数比宇宙中的原子还多。定义仍然唯一地确定了答案——只是我们无法真的算完。"
          />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Dominoes (induction)                                             */
/* ------------------------------------------------------------------ */
export function Dominoes() {
  const N = 14
  const [fallen, setFallen] = useState(0)
  const timer = useRef<number | null>(null)
  const push = () => {
    if (timer.current) clearInterval(timer.current)
    setFallen(0)
    let k = 0
    timer.current = window.setInterval(() => {
      k++
      setFallen(k)
      if (k >= N && timer.current) clearInterval(timer.current)
    }, 160)
  }
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])
  return (
    <div>
      <svg viewBox={`0 0 ${N * 50 + 40} 120`} style={{ width: '100%' }}>
        <line x1={0} y1={100} x2={N * 50 + 40} y2={100} stroke="#2a3563" />
        {Array.from({ length: N }, (_, i) => {
          const down = i < fallen
          return (
            <g key={i} transform={`translate(${30 + i * 50},100) rotate(${down ? 62 : 0})`} style={{ transition: 'transform 0.25s' }}>
              <rect x={-6} y={-70} width={12} height={70} rx={2} fill={down ? '#ffd36b' : '#1b2447'} stroke="#6be4ff" />
            </g>
          )
        })}
        {Array.from({ length: N }, (_, i) => (
          <text key={i} x={30 + i * 50} y={116} fill="#9aa3c7" fontSize="12" textAnchor="middle">
            {i}
          </text>
        ))}
        <text x={N * 50 + 30} y={60} fill="#9aa3c7" fontSize="20">
          …
        </text>
      </svg>
      <div className="btn-row">
        <button className="btn small" onClick={push}>
          <L en="Push domino 0" zh="推倒第 0 块" />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. How big is it?                                                   */
/* ------------------------------------------------------------------ */
export function SizeExplorer() {
  const [a, setA] = useState(3)
  const [c, setC] = useState(3)
  const [b, setB] = useState(3)
  const s = arrowSize(a, c, b)
  return (
    <div>
      <Slider value={a} min={2} max={10} onChange={setA} label="a" />
      <Slider value={c} min={1} max={6} onChange={setC} label={<L en="arrows" zh="箭头数" />} />
      <Slider value={b} min={1} max={6} onChange={setB} label="b" />
      <div className="readout">
        <M t={`${a}${ARROWS(c)}${b}`} /> : <SizeText s={s} a={a} c={c} b={b} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Diagonal table                                                   */
/* ------------------------------------------------------------------ */
function cellTex(n: number, m: number): { tex: string; cls: string } {
  const s = arrowSize(n, m, n)
  if (s.kind === 'exact') {
    const str = s.v.toString()
    return { tex: str.length <= 9 ? commas(s.v) : `\\approx ${toTex({ h: 1, x: str.length - 1 + Math.log10(Number(str.slice(0, 15)) / 10 ** (Math.min(15, str.length) - 1)) })}`, cls: 'c0' }
  }
  if (s.kind === 'approx') return { tex: `\\approx ${toTex(s.v, 2)}`, cls: s.v.h >= 3 ? 'c2' : 'c1' }
  if (s.kind === 'tower') return { tex: `${n}\\uparrow\\uparrow(${toTex(s.height, 2)})`, cls: 'c3' }
  if (s.kind === 'towers') return { tex: `${n}${ARROWS(m)}${n}`, cls: 'c4' }
  return { tex: `${n}${ARROWS(m)}${n}`, cls: 'c5' }
}

export function DiagonalTable() {
  const { t } = useLang()
  const [row, setRow] = useState<number | null>(2)
  const ns = [2, 3, 4, 5, 6]
  const ms = [1, 2, 3, 4, 5]
  return (
    <div className="scroll-x">
      <table className="grid diag">
        <thead>
          <tr>
            <th></th>
            {ns.map((n) => (
              <th key={n}>n = {n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ms.map((m) => (
            <tr key={m} className={row === m ? 'row-on' : ''} onClick={() => setRow(m)}>
              <th>
                <M t={`n${ARROWS(m)}n`} />
              </th>
              {ns.map((n) => {
                const { tex, cls } = cellTex(n, m)
                const diag = n === m
                return (
                  <td key={n} className={`${cls} ${diag ? 'diag-cell' : ''}`}>
                    <M t={tex} />
                  </td>
                )
              })}
            </tr>
          ))}
          <tr className="diag-row">
            <th>
              <M t="n\uparrow^{n}n" />
            </th>
            {ns.map((n) => (
              <td key={n} className="diag-cell">
                <M t={`${n}${ARROWS(n)}${n}`} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="muted small" style={{ marginTop: 6 }}>
        {t(
          'Gold: the diagonal. Once the diagonal passes a row, every later diagonal entry beats that row. (Column n = 2 is all 4s.)',
          '金色是对角线。对角线越过某一行之后，每个对角元都胜过该行。（n = 2 一列全是 4。）',
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Graham's number                                                  */
/* ------------------------------------------------------------------ */
export function GrahamLayers() {
  const [k, setK] = useState(1)
  return (
    <div>
      <Slider value={k} min={1} max={64} onChange={setK} label={<L en="layer" zh="第几层" />} />
      <div className="graham-stack">
        {Array.from({ length: Math.min(k, 6) }, (_, i) => {
          const layer = k - Math.min(k, 6) + 1 + i
          return (
            <div key={layer} className={`graham-layer ${layer === k ? 'cur' : ''}`}>
              <span className="g-name">
                <M t={`G(${layer})`} />
              </span>
              <span className="g-expr">
                <M t={`= 3\\underbrace{\\uparrow\\uparrow\\cdots\\uparrow}_{${layer === 1 ? '4' : `G(${layer - 1})`}}3`} />
              </span>
            </div>
          )
        })}
      </div>
      <div className="readout prose small">
        {k === 1 ? (
          <L
            en={<>G(1) = 3↑↑↑↑3 = 3↑↑↑(3↑↑↑3): a tower-of-towers construction nested tritri times — already far beyond anything in the ancient arena.</>}
            zh={<>G(1) = 3↑↑↑↑3 = 3↑↑↑(3↑↑↑3)：把“塔的塔”嵌套 tritri 那么多次——已经远远超过古代擂台上的一切。</>}
          />
        ) : (
          <L
            en={<>The number of arrows in G({k}) is G({k - 1}). {k === 64 ? 'This is Graham’s number.' : `Keep going: Graham’s number is G(64).`}</>}
            zh={<>G({k}) 的箭头个数是 G({k - 1})。{k === 64 ? '这就是 Graham 数。' : '继续：Graham 数是 G(64)。'}</>}
          />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 7. Graham's problem on the 3-cube                                   */
/* ------------------------------------------------------------------ */
const V3 = Array.from({ length: 8 }, (_, i) => [(i >> 2) & 1, (i >> 1) & 1, i & 1])
const E3: [number, number][] = []
for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) E3.push([i, j])
const edgeIndex = (i: number, j: number) => E3.findIndex(([a, b]) => (a === Math.min(i, j) && b === Math.max(i, j)))
function coplanar(q: number[]) {
  const [p0, p1, p2, p3] = q.map((i) => V3[i])
  const u = p1.map((x, k) => x - p0[k])
  const v = p2.map((x, k) => x - p0[k])
  const w = p3.map((x, k) => x - p0[k])
  const det = u[0] * (v[1] * w[2] - v[2] * w[1]) - u[1] * (v[0] * w[2] - v[2] * w[0]) + u[2] * (v[0] * w[1] - v[1] * w[0])
  return det === 0
}
const PLANES: number[][] = []
for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) for (let c = b + 1; c < 8; c++) for (let d = c + 1; d < 8; d++) if (coplanar([a, b, c, d])) PLANES.push([a, b, c, d])
const PLANE_EDGES = PLANES.map((q) => {
  const es: number[] = []
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) es.push(edgeIndex(q[i], q[j]))
  return es
})

function monoPlanes(col: number[]) {
  return PLANE_EDGES.map((es, i) => ({ i, c: col[es[0]] })).filter(({ i, c }) => c >= 0 && PLANE_EDGES[i].every((e) => col[e] === c))
}

function safeColoring(): number[] {
  const col = Array(E3.length).fill(-1)
  const order = [...E3.keys()].sort(() => Math.random() - 0.5)
  const ok = () => monoPlanes(col).length === 0
  const rec = (k: number): boolean => {
    if (k === order.length) return true
    for (const c of Math.random() < 0.5 ? [0, 1] : [1, 0]) {
      col[order[k]] = c
      if (ok() && rec(k + 1)) return true
    }
    col[order[k]] = -1
    return false
  }
  rec(0)
  return col
}

export function CubeColoring() {
  const { t } = useLang()
  const [col, setCol] = useState<number[]>(() => Array(E3.length).fill(-1))
  const [ang, setAng] = useState(0.6)
  const drag = useRef<{ x: number; a: number } | null>(null)
  const mono = monoPlanes(col)
  const monoEdges = new Set(mono.flatMap((m) => PLANE_EDGES[m.i]))
  const proj = V3.map(([x, y, z]) => {
    const cx = x - 0.5
    const cy = y - 0.5
    const cz = z - 0.5
    const X = cx * Math.cos(ang) - cz * Math.sin(ang)
    const Z = cx * Math.sin(ang) + cz * Math.cos(ang)
    const tilt = 0.45
    const Y = cy * Math.cos(tilt) - Z * Math.sin(tilt)
    return [200 + X * 190, 150 - Y * 190]
  })
  const colors = ['#ff6b6b', '#6be4ff']
  const filled = col.filter((c) => c >= 0).length
  return (
    <div>
      <svg
        viewBox="0 0 400 300"
        style={{ width: '100%', maxWidth: 350, display: 'block', margin: '0 auto', touchAction: 'none' }}
        onPointerDown={(e) => (drag.current = { x: e.clientX, a: ang })}
        onPointerMove={(e) => drag.current && setAng(drag.current.a + (e.clientX - drag.current.x) / 120)}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        {E3.map(([i, j], k) => (
          <g key={k}>
            <line x1={proj[i][0]} y1={proj[i][1]} x2={proj[j][0]} y2={proj[j][1]} stroke={col[k] < 0 ? '#3a4680' : colors[col[k]]} strokeWidth={monoEdges.has(k) ? 5 : 2.2} opacity={col[k] < 0 ? 0.6 : 1} strokeDasharray={col[k] < 0 ? '4 4' : undefined} />
            <line
              x1={proj[i][0]}
              y1={proj[i][1]}
              x2={proj[j][0]}
              y2={proj[j][1]}
              stroke="transparent"
              strokeWidth={12}
              style={{ cursor: 'pointer' }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                const nc = [...col]
                nc[k] = nc[k] === -1 ? 0 : nc[k] === 0 ? 1 : -1
                setCol(nc)
              }}
            />
          </g>
        ))}
        {proj.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6} fill="#ffd36b" />
        ))}
      </svg>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <button className="chip" onClick={() => setCol(E3.map(() => (Math.random() < 0.5 ? 0 : 1)))}>
          <L en="random colouring" zh="随机涂色" />
        </button>
        <button className="chip" onClick={() => setCol(safeColoring())}>
          <L en="find a safe colouring" zh="找一种安全涂法" />
        </button>
        <button className="chip" onClick={() => setCol(Array(E3.length).fill(-1))}>
          <L en="clear" zh="清空" />
        </button>
      </div>
      <div className="muted small" style={{ textAlign: 'center' }}>
        {t(`${filled}/28 segments coloured · ${PLANES.length} planes through 4 corners · `, `已涂 ${filled}/28 条线段 · 共有 ${PLANES.length} 个平面恰好经过 4 个顶点 · `)}
        {mono.length > 0 ? (
          <b style={{ color: '#ff7ab6' }}>{t(`${mono.length} single-colour planar K₄ found (thick lines)!`, `发现 ${mono.length} 个同色共面 K₄（粗线）！`)}</b>
        ) : (
          t('no single-colour planar K₄', '没有同色共面 K₄')
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 8. The algorithm, as an actual program                              */
/* ------------------------------------------------------------------ */
export function ArrowProgram() {
  const [a, setA] = useState(2)
  const [c, setC] = useState(2)
  const [b, setB] = useState(4)
  const res = arrowExact(BigInt(a), c, BigInt(b))
  return (
    <div>
      <pre className="readout code">{`function arrow(a, c, b) {        // a ↑^c b
  if (c === 1) return a ** b       // rule (1)
  if (b === 0) return 1            // rule (2)
  return arrow(a, c - 1, arrow(a, c, b - 1))   // rule (3)
}`}</pre>
      <div className="row">
        <Slider value={a} min={1} max={5} onChange={setA} label="a" />
        <Slider value={c} min={1} max={4} onChange={setC} label="c" />
        <Slider value={b} min={0} max={5} onChange={setB} label="b" />
      </div>
      <div className="readout">
        arrow({a}, {c}, {b}) ={' '}
        {res !== null ? (
          <span className="mono">{res.toString().length > 200 ? res.toString().slice(0, 200) + '…' : res.toString()}</span>
        ) : (
          <span className="muted">
            <L en="(the program would run longer than the age of the universe)" zh="（这个程序要运行比宇宙年龄还长的时间）" />
          </span>
        )}
        {res !== null && res.toString().length > 200 && (
          <span className="muted small">
            {' '}
            <L en={`(${res.toString().length} digits)`} zh={`（共 ${res.toString().length} 位）`} />
          </span>
        )}
      </div>
    </div>
  )
}
