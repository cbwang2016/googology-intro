import { useMemo, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { groupBy, readEn, readZh, roman } from '../../lib/numberWords'
import { cmp, digitCount, iterLog, log10, toTex, tower, type Huge } from '../../lib/huge'
import { CHAMPIONS, HUAYAN, LANDMARKS } from './data'

/* ------------------------------------------------------------------ */
/* 2. Tally vs Roman vs place value                                    */
/* ------------------------------------------------------------------ */
function Tally({ n }: { n: number }) {
  const shown = Math.min(n, 120)
  const groups = Math.floor(shown / 5)
  const rest = shown % 5
  const items: React.ReactElement[] = []
  const W = 26
  for (let g = 0; g < groups + (rest ? 1 : 0); g++) {
    const k = g < groups ? 5 : rest
    const x0 = (g % 12) * W + 4
    const y0 = Math.floor(g / 12) * 30 + 4
    for (let j = 0; j < Math.min(k, 4); j++)
      items.push(<line key={`${g}-${j}`} x1={x0 + j * 5} y1={y0} x2={x0 + j * 5} y2={y0 + 22} stroke="#ffd36b" strokeWidth="2" />)
    if (k === 5) items.push(<line key={`${g}-x`} x1={x0 - 3} y1={y0 + 18} x2={x0 + 19} y2={y0 + 4} stroke="#ff7ab6" strokeWidth="2" />)
  }
  const rows = Math.ceil((groups + (rest ? 1 : 0)) / 12) || 1
  return (
    <svg width={12 * W + 8} height={rows * 30 + 6} style={{ maxWidth: '100%' }}>
      {items}
    </svg>
  )
}

export function NotationCost() {
  const [n, setN] = useState(37)
  const tallyLen = n
  const romanStr = roman(n)
  const dec = String(n)
  const max = Math.max(tallyLen, 1)
  const bar = (len: number, color: string) => (
    <div className="cost-bar">
      <div style={{ width: `${Math.max(2, (len / max) * 100)}%`, background: color }} />
      <span className="mono">{len}</span>
    </div>
  )
  return (
    <div>
      <Slider value={n} min={1} max={3999} onChange={setN} label={<L en="number" zh="数" />} />
      <div className="cost-grid">
        <div className="cost-name">
          <L en="Tally marks" zh="结绳 / 划记" />
        </div>
        <div>
          <Tally n={n} />
          {n > 120 && (
            <span className="muted">
              {' '}
              <L en={`… and ${n - 120} more`} zh={`……还有 ${n - 120} 笔`} />
            </span>
          )}
        </div>
        <div className="cost-name">
          <L en="Roman numerals" zh="罗马数字" />
        </div>
        <div className="mono roman">{romanStr}</div>
        <div className="cost-name">
          <L en="Place value" zh="位值制（阿拉伯数字）" />
        </div>
        <div className="mono roman">{dec}</div>
      </div>
      <div className="muted" style={{ marginTop: 8 }}>
        <L en="Symbols needed:" zh="需要的符号个数：" />
      </div>
      <div className="cost-bars">
        <span>
          <L en="tally" zh="划记" />
        </span>
        {bar(tallyLen, '#ffd36b')}
        <span>
          <L en="Roman" zh="罗马" />
        </span>
        {bar(romanStr.length, '#ff7ab6')}
        <span>
          <L en="digits" zh="数字" />
        </span>
        {bar(dec.length, '#6be4ff')}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. 数位顺序表 / place-value chart, with both groupings              */
/* ------------------------------------------------------------------ */
const ZH_POS = ['个', '十', '百', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿', '万亿', '十万亿', '百万亿', '千万亿']
const ZH_LEVEL = ['个级', '万级', '亿级', '万亿级']
const EN_POS = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions', 'ten millions', 'hundred millions', 'billions', 'ten billions', 'hundred billions', 'trillions', 'ten trillions', 'hundred trillions', 'quadrillions']
const EN_PERIOD = ['ones', 'thousands', 'millions', 'billions', 'trillions', 'quadrillions']

export function PlaceValueChart() {
  const { mode } = useLang()
  const [s, setS] = useState('1342497')
  const digits = s.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 16) || '0'
  const n = BigInt(digits)
  const len = digits.length
  const showZh = mode !== 'en'
  const showEn = mode !== 'zh'
  const set = (v: bigint) => setS(v < 10n ** 16n ? v.toString() : s)
  const cells = Array.from({ length: len }, (_, i) => len - 1 - i) // place index, high → low
  return (
    <div>
      <div className="row">
        <input type="text" value={s} onChange={(e) => setS(e.target.value)} style={{ flex: 1, minWidth: 180 }} />
        <button className="chip" onClick={() => set(n + 1n)}>+1</button>
        <button className="chip" onClick={() => set(n * 10n)}>×10</button>
        <button className="chip" onClick={() => set(n / 10n)}>÷10</button>
        <button
          className="chip"
          onClick={() => {
            const k = 5 + Math.floor(Math.random() * 11)
            let r = String(1 + Math.floor(Math.random() * 9))
            for (let i = 1; i < k; i++) r += Math.random() < 0.3 ? '0' : String(Math.floor(Math.random() * 10))
            setS(r)
          }}
        >
          <L en="random" zh="随机" />
        </button>
      </div>
      <div className="scroll-x">
        <div className="pv" style={{ gridTemplateColumns: `repeat(${len}, minmax(46px, 1fr))` }}>
          {showZh &&
            cells.map((p) =>
              p % 4 === 3 || p === len - 1 ? (
                <div key={`zl${p}`} className="pv-level zh" style={{ gridColumn: `span ${Math.min(p % 4, p) + 1}` }}>
                  {ZH_LEVEL[Math.floor(p / 4)]}
                </div>
              ) : null,
            )}
          {showZh &&
            cells.map((p) => (
              <div key={`zp${p}`} className={`pv-pos zh lvl${Math.floor(p / 4) % 2}`}>
                {ZH_POS[p]}位
              </div>
            ))}
          {cells.map((p) => (
            <div key={`d${p}`} className={`pv-digit ${digits[len - 1 - p] === '0' ? 'zero' : ''}`}>
              {digits[len - 1 - p]}
            </div>
          ))}
          {showEn &&
            cells.map((p) => (
              <div key={`ep${p}`} className={`pv-pos en lvl${Math.floor(p / 3) % 2}`}>
                {EN_POS[p]}
              </div>
            ))}
          {showEn &&
            cells.map((p) =>
              p % 3 === 2 || p === len - 1 ? (
                <div key={`el${p}`} className="pv-level en" style={{ gridColumn: `span ${Math.min(p % 3, p) + 1}` }}>
                  {EN_PERIOD[Math.floor(p / 3)]} period
                </div>
              ) : null,
            )}
        </div>
      </div>
      {showZh && (
        <div className="pv-read">
          <span className="mono">{groupBy(digits, 4, ' ')}</span>
          <span className="pv-words">读作：{readZh(n)}</span>
        </div>
      )}
      {showEn && (
        <div className="pv-read">
          <span className="mono">{groupBy(digits, 3, ',')}</span>
          <span className="pv-words">reads: {readEn(n)}</span>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Avatamsaka ladder                                                */
/* ------------------------------------------------------------------ */
export function HuayanLadder() {
  const { pick } = useLang()
  const [k, setK] = useState(3)
  const exp = 7n * 2n ** BigInt(k - 1)
  const expStr = exp.toString()
  const recent = Array.from({ length: Math.min(k, 6) }, (_, i) => k - Math.min(k, 6) + 1 + i)
  return (
    <div>
      <Slider value={k} min={1} max={123} onChange={setK} label={<L en="unit number" zh="第几个单位" />} />
      <div className="huayan-name">{HUAYAN[k - 1]}</div>
      <div style={{ textAlign: 'center' }}>
        <M t={`= 10^{${expStr.length > 12 ? groupBy(expStr, 3, '{,}') : expStr.replace(/\B(?=(\d{3})+(?!\d))/g, '{,}')}}`} />
      </div>
      <div className="row" style={{ justifyContent: 'center', marginTop: 8 }}>
        <div className="stat">
          <span className="stat-label">
            <L en="digits" zh="位数" />
          </span>
          <span className="stat-value">{(exp + 1n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
        </div>
        <div className="stat">
          <span className="stat-label">
            <L en="digits of the digit count" zh="“位数”本身的位数" />
          </span>
          <span className="stat-value">{(exp + 1n).toString().length}</span>
        </div>
      </div>
      <div className="huayan-chain">
        {recent.map((j) => (
          <span key={j} className={j === k ? 'cur' : ''}>
            {j > 1
              ? pick(`${HUAYAN[j - 2]} ${HUAYAN[j - 2]} make one ${HUAYAN[j - 1]}`, `${HUAYAN[j - 2]}${HUAYAN[j - 2]}为一${HUAYAN[j - 1]}`)
              : pick(`a hundred 洛叉 (10⁵) make one ${HUAYAN[0]}`, `一百洛叉为一${HUAYAN[0]}`)}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Chessboard                                                       */
/* ------------------------------------------------------------------ */
export function Chessboard() {
  const [k, setK] = useState(10)
  const total = 2n ** BigInt(k) - 1n
  const last = k > 0 ? 2n ** BigInt(k - 1) : 0n
  // ~0.025 g per grain; world rice (paddy) production ≈ 7.8e8 t/yr ≈ 3.1e16 grains/yr
  const years = Number(total) / 3.1e16
  return (
    <div>
      <Slider value={k} min={0} max={64} onChange={setK} label={<L en="squares filled" zh="已放的格子" />} />
      <div className="chess-wrap c01-chess">
        <svg viewBox="0 0 8 8" className="chess">
          {Array.from({ length: 64 }, (_, i) => {
            const r = Math.floor(i / 8)
            const c = i % 8
            const filled = i < k
            const intensity = filled ? 0.15 + 0.85 * (i / 63) : 0
            return (
              <rect
                key={i}
                x={c}
                y={7 - r}
                width={1}
                height={1}
                fill={filled ? `rgba(255,211,107,${intensity})` : (r + c) % 2 ? '#1b2447' : '#121a3a'}
                stroke="#0a0e1f"
                strokeWidth={0.03}
              />
            )
          })}
        </svg>
        <div className="chess-stats">
          <div className="stat">
            <span className="stat-label">
              <L en={`grains on square ${k}`} zh={`第 ${k} 格的米粒`} />
            </span>
            <span className="stat-value">{last.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
          </div>
          <div className="stat">
            <span className="stat-label">
              <L en="total so far" zh="累计" />
            </span>
            <span className="stat-value">{total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
          </div>
          <div className="stat">
            <span className="stat-label">
              <L en="≈ years of world rice harvest" zh="≈ 全世界几年的稻谷产量" />
            </span>
            <span className="stat-value">{years < 0.01 ? '< 0.01' : years < 10 ? years.toFixed(2) : Math.round(years).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Hall of champions                                                */
/* ------------------------------------------------------------------ */
export function Arena({ upTo, note = true }: { upTo: number; note?: boolean }) {
  const list = CHAMPIONS.slice(0, upTo)
  const maxBar = 4
  return (
    <div className="arena c01-arena">
      {list.map((c, i) => {
        const off = c.slog > maxBar
        return (
          <div key={i} className="arena-row">
            <div className="arena-who">
              <b>
                <L {...c.who} />
              </b>
              <span className="muted arena-era">
                <L {...c.era} />
              </span>
              <div className="muted arena-trick">
                <L {...c.trick} />
              </div>
            </div>
            <div className="arena-bar">
              <div className={`arena-fill ${off ? 'off' : ''}`} style={{ width: off ? '100%' : `${(c.slog / maxBar) * 100}%` }} />
              <div className="arena-val">
                <M t={c.tex} />
                {off && (
                  <span className="arena-off">
                    <L en=" off the chart →" zh=" 冲出图表 →" />
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      {note && <div className="muted arena-note">
        <L
          en="Bar length = how many times you must take “number of digits” before the number shrinks to about 1 (a super-logarithm). Each extra unit of bar is an extra layer of “digits of digits”."
          zh="条形长度 = 要连续取多少次“位数”，这个数才缩到 1 左右（超对数）。条形每长一格，就多了一层“位数的位数”。"
        />
      </div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 7. Tower builder and comparer                                       */
/* ------------------------------------------------------------------ */
function TowerTex(bases: number[]) {
  let s = String(bases[bases.length - 1])
  for (let i = bases.length - 2; i >= 0; i--) s = `${bases[i]}^{${s}}`
  return s
}

function describe(v: Huge) {
  // returns a list: value, digits, digits of digits, ...
  const out: string[] = []
  let cur = v
  for (let i = 0; i < 4; i++) {
    out.push(toTex(cur))
    if (cur.h === 0 && cur.x < 10) break
    cur = digitCount(cur)
  }
  return out
}

export function TowerBuilder() {
  const { t } = useLang()
  const [bases, setBases] = useState<number[]>([10, 10, 10])
  const v = useMemo(() => tower(bases), [bases])
  const levels = describe(v)
  const names = [t('value', '数值'), t('digits', '位数'), t('digits of digits', '位数的位数'), t('digits³', '位数的位数的位数')]
  return (
    <div>
      <div className="tower-stack c01-tower">
        {bases
          .map((b, i) => (
            <div key={i} className="tower-layer" style={{ marginLeft: i * 18 }}>
              <input
                type="number"
                min={1}
                max={1000}
                value={b}
                onChange={(e) => {
                  const nb = [...bases]
                  nb[i] = Math.max(1, Math.min(1000, Math.floor(Number(e.target.value) || 1)))
                  setBases(nb)
                }}
              />
              <span className="muted">{i === 0 ? t('base (bottom)', '底') : i === bases.length - 1 ? t('top — computed first', '顶——最先算') : ''}</span>
            </div>
          ))
          .reverse()}
      </div>
      <div className="btn-row">
        <button className="chip" onClick={() => bases.length < 8 && setBases([...bases, bases[bases.length - 1]])}>
          <L en="+ layer" zh="+ 加一层" />
        </button>
        <button className="chip" onClick={() => bases.length > 1 && setBases(bases.slice(0, -1))}>
          <L en="− layer" zh="− 减一层" />
        </button>
        {[
          [2, 2, 2, 2],
          [3, 3, 3],
          [10, 10, 10, 10],
          [2, 2, 2, 2, 2, 2],
        ].map((p, i) => (
          <button key={i} className="chip" onClick={() => setBases(p)}>
            <M t={TowerTex(p)} />
          </button>
        ))}
      </div>
      <div className="readout" style={{ marginTop: 8 }}>
        <M t={TowerTex(bases)} />
        {levels.map((l, i) => (
          <div key={i}>
            <span className="muted">{names[i]}: </span>
            <M t={i === 0 ? `\\approx ${l}` : `\\approx ${l}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function TowerDuel() {
  const presets: [number[], number[]][] = [
    [[2, 2, 2, 2, 2], [10, 10, 10]],
    [[3, 3, 3, 3], [10, 10, 10]],
    [[9, 9, 9], [10, 10, 10]],
    [[100, 100, 100], [10, 10, 10, 10]],
    [[2, 2, 2, 2, 2, 2], [10, 10, 10, 10]],
  ]
  const [i, setI] = useState(0)
  const [a, b] = presets[i]
  const va = tower(a)
  const vb = tower(b)
  const c = cmp(va, vb)
  // compare after taking logs: show log^k for k = 2
  const la = iterLog(va, 2)
  const lb = iterLog(vb, 2)
  return (
    <div>
      <div className="btn-row">
        {presets.map((p, j) => (
          <button key={j} className={`chip ${j === i ? 'on' : ''}`} onClick={() => setI(j)}>
            <M t={`${TowerTex(p[0])}\\ \\text{vs}\\ ${TowerTex(p[1])}`} />
          </button>
        ))}
      </div>
      <div className="duel-towers">
        <div className={c > 0 ? 'win' : ''}>
          <M t={TowerTex(a)} />
          <div className="muted">
            <M t={`\\approx ${toTex(va)}`} />
          </div>
          <div className="muted small">
            <L en="log of log:" zh="取两次对数：" /> {la === null ? '—' : la === Infinity ? '∞' : la.toPrecision(5)}
          </div>
        </div>
        <div className="vs">{c > 0 ? '>' : c < 0 ? '<' : '≈'}</div>
        <div className={c < 0 ? 'win' : ''}>
          <M t={TowerTex(b)} />
          <div className="muted">
            <M t={`\\approx ${toTex(vb)}`} />
          </div>
          <div className="muted small">
            <L en="log of log:" zh="取两次对数：" /> {lb === null ? '—' : lb === Infinity ? '∞' : lb.toPrecision(5)}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 8. Zoom out: replace each number by its number of digits            */
/* ------------------------------------------------------------------ */
const RANGES = [1000, 120, 120, 40, 12]
export function ZoomOut() {
  const { t } = useLang()
  const [k, setK] = useState(1)
  const max = RANGES[k]
  const W = 760
  const pad = 30
  const pts = LANDMARKS.map((lm) => {
    const pos = iterLog(lm.v, k)
    return { lm, pos }
  })
  // stagger labels into rows to limit overlap
  const placed = pts
    .map((p, i) => ({ ...p, i }))
    .filter((p) => p.pos !== null)
    .map((p) => {
      const val = p.pos as number
      const off = val > max
      const xv = off ? W - pad : pad + (Math.max(0, val) / max) * (W - 2 * pad)
      return { ...p, off, xv }
    })
  const rowsEnd: number[] = []
  const offs = placed.filter((p) => p.off)
  const shown = [...placed.filter((p) => !p.off), ...(offs.length ? [offs[0]] : [])]
  const withRow = shown.map((p) => {
    const endA = p.off || p.xv > W - 280
    const start = p.off ? p.xv - 300 : endA ? p.xv - 260 : p.xv
    let r = 0
    while (rowsEnd[r] !== undefined && rowsEnd[r] > start - 6) r++
    rowsEnd[r] = endA ? p.xv : p.xv + 120
    return { ...p, row: r, endA }
  })
  const tooSmall = pts.filter((p) => p.pos === null).length
  const nRows = Math.max(1, ...withRow.map((p) => p.row + 1))
  const H = 70 + nRows * 22
  const axisLabel = [
    t('the number itself', '数本身'),
    t('number of digits ≈ log₁₀', '位数 ≈ log₁₀'),
    t('digits of digits', '位数的位数'),
    t('digits³', '位数的位数的位数'),
    t('digits⁴', '再取一次位数'),
  ][k]
  return (
    <div>
      <div className="btn-row">
        {[0, 1, 2, 3, 4].map((j) => (
          <button key={j} className={`chip ${j === k ? 'on' : ''}`} onClick={() => setK(j)}>
            {j === 0 ? t('no zoom', '不缩放') : `log${['', '', '²', '³', '⁴'][j]}`}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        <line x1={pad} y1={40} x2={W - pad} y2={40} stroke="#6b7399" />
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={pad + f * (W - 2 * pad)} y1={36} x2={pad + f * (W - 2 * pad)} y2={44} stroke="#6b7399" />
            <text x={pad + f * (W - 2 * pad)} y={30} fill="#9aa3c7" fontSize="12" textAnchor="middle">
              {Math.round(f * max)}
            </text>
          </g>
        ))}
        <text x={W - pad} y={14} fill="#9aa3c7" fontSize="12" textAnchor="end">
          {axisLabel} →
        </text>
        {withRow.map((p) => (
          <g key={p.i}>
            <circle cx={p.xv} cy={40} r={4} fill={p.off ? '#ff7ab6' : '#ffd36b'} />
            <line x1={p.xv} y1={44} x2={p.xv} y2={58 + p.row * 22} stroke="#2a3563" />
            <text x={p.endA ? p.xv - 4 : p.xv + 3} y={62 + p.row * 22} fill={p.off ? '#ff7ab6' : '#e6e9f5'} fontSize="12.5" textAnchor={p.endA ? 'end' : 'start'}>
              {p.off ? t(`${offs.length} more beyond →`, `另有 ${offs.length} 个在右边 →`) : t(p.lm.name.en, p.lm.name.zh)}
            </text>
          </g>
        ))}
      </svg>
      <div className="muted small">
        {tooSmall > 0 && <L en={`${tooSmall} small numbers have shrunk below 1 and dropped off the left end. `} zh={`有 ${tooSmall} 个较小的数已经缩到 1 以下，从左端掉出去了。`} />}
        <L en="Pink = still beyond the right end." zh="粉色 = 仍然超出右端。" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 9. Sequences race: what “far ahead” means                           */
/* ------------------------------------------------------------------ */
export function Race() {
  const { t } = useLang()
  const [n, setN] = useState(3)
  const rows = [
    { name: t('tally: n', '划记：n'), tex: 'n', v: { h: 0, x: n } as Huge },
    { name: t('place value: 10ⁿ', '位值制：10ⁿ'), tex: '10^n', v: tower([10, n]) },
    { name: t('10^(10ⁿ)', '10 的 10ⁿ 次方'), tex: '10^{10^n}', v: tower([10, 10, n]) },
    { name: t('tower of n tens', 'n 层 10 的指数塔'), tex: '10\\uparrow\\uparrow n', v: tower(Array(n).fill(10)) },
  ]
  return (
    <div>
      <Slider value={n} min={1} max={7} onChange={setN} label="n" />
      <table className="grid">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ textAlign: 'left' }}>{r.name}</td>
              <td>
                <M t={r.tex} />
              </td>
              <td style={{ textAlign: 'left' }}>
                <M t={toTex(r.v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="muted small" style={{ marginTop: 6 }}>
        <L
          en="Raise n by one in the bottom row: the new number’s digit count is the old number. No constant factor in a lower row can ever catch that."
          zh="把最下面一行的 n 加 1：新数的位数就是旧数本身。上面几行再乘多大的常数，也追不上这一步。"
        />
      </div>
    </div>
  )
}

export { log10 }
