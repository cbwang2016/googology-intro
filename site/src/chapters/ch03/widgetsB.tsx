import { useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import * as O from './ordinal'
import { COL } from './widgetsA'

/* ================================================================== */
/* 5. Descent game: start at ω^ω, every move goes strictly down         */
/* ================================================================== */
type DState = number[] | 'ww' // coefficient vector (index = exponent) or ω^ω

const vecOrd = (v: number[]): O.Ord => {
  const out: O.Ord = []
  for (let i = v.length - 1; i >= 0; i--) if (v[i] > 0) out.push({ e: O.nat(i), c: v[i] })
  return out
}
const stTex = (s: DState) => (s === 'ww' ? '\\omega^{\\omega}' : O.tex(vecOrd(s)))
const stPos = (s: DState) => (s === 'ww' ? 1 : O.posW(vecOrd(s)))
const trim = (v: number[]) => {
  const w = [...v]
  while (w.length > 1 && w[w.length - 1] === 0) w.pop()
  return w
}
const isZeroState = (s: DState) => s !== 'ww' && s.every((c) => c === 0)

function lessThan(a: number[], b: DState): boolean {
  if (b === 'ww') return true
  const n = Math.max(a.length, b.length)
  for (let i = n - 1; i >= 0; i--) {
    const x = a[i] ?? 0
    const y = b[i] ?? 0
    if (x !== y) return x < y
  }
  return false
}

function greedy(s: DState, N: number): DState {
  if (s === 'ww') {
    const v = Array(N + 1).fill(0)
    v[N] = 1
    return v
  }
  const v = [...s]
  const p = v.findIndex((c) => c > 0)
  if (p < 0) return v
  v[p] -= 1
  for (let i = 0; i < p; i++) v[i] = N
  return trim(v)
}

/** Exact number of greedy moves left (each move: lower the lowest nonzero digit, fill below with N). */
function movesLeft(s: DState, N: number): bigint {
  const Mi: bigint[] = [1n]
  const len = s === 'ww' ? N + 1 : s.length
  let sum = 1n
  for (let i = 1; i < len; i++) {
    Mi.push(1n + BigInt(N) * sum)
    sum += Mi[i]
  }
  if (s === 'ww') return 1n + Mi[N]
  return s.reduce((acc, c, i) => acc + BigInt(c) * Mi[i], 0n)
}

const fmtBig = (b: bigint) => {
  const s = b.toString()
  return s.length <= 15 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : `${s.slice(0, 4)}… (${s.length} digits)`
}

export function DescentGame() {
  const { t } = useLang()
  const [game, setGame] = useState<{ hist: DState[]; count: number }>({ hist: ['ww'], count: 0 })
  const hist = game.hist
  const cur = hist[hist.length - 1]
  const D = cur === 'ww' ? 5 : Math.max(cur.length - 1, 0)
  const [draft, setDraft] = useState<string[]>(() => ['0', '0', '0', '0', '0', '1'])
  const [msg, setMsg] = useState<{ en: string; zh: string } | null>(null)
  const [N, setN] = useState(3)
  const [auto, setAuto] = useState(false)
  const push = (states: DState[]) =>
    setGame((g) => {
      const h = [...g.hist, ...states]
      return { hist: h.length > 4000 ? h.slice(-3000) : h, count: g.count + states.length }
    })
  const restart = () => {
    setAuto(false)
    setGame({ hist: ['ww'], count: 0 })
  }
  useEffect(() => {
    setDraft(cur === 'ww' ? ['0', '0', '0', '0', '0', '1'] : Array.from({ length: D + 1 }, (_, i) => String(cur[i] ?? 0)))
    if (isZeroState(cur)) setAuto(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.count])
  useEffect(() => {
    if (!auto) return
    const id = window.setInterval(() => {
      setGame((g) => {
        let next = g.hist[g.hist.length - 1]
        const add: DState[] = []
        const per = g.count > 200 ? 25 : 1
        for (let i = 0; i < per && !isZeroState(next); i++) {
          next = greedy(next, N)
          add.push(next)
        }
        if (add.length === 0) return g
        const h = [...g.hist, ...add]
        return { hist: h.length > 4000 ? h.slice(-3000) : h, count: g.count + add.length }
      })
    }, 60)
    return () => clearInterval(id)
  }, [auto, N])
  const move = () => {
    const v = draft.map((s) => Math.floor(Number(s)))
    if (v.some((x) => !Number.isFinite(x) || x < 0 || x > 1e9)) {
      setMsg({ en: 'Coefficients must be whole numbers from 0 to 10⁹.', zh: '系数必须是 0 到 10⁹ 之间的整数。' })
      return
    }
    if (!lessThan(v, cur)) {
      setMsg({ en: 'That is not smaller than the current ordinal. Compare from the highest power of ω down.', zh: '这并不比当前序数小。从 ω 的最高次幂开始往下比。' })
      return
    }
    setMsg(null)
    push([trim(v)])
  }
  const W = 700
  const Hh = 120
  const shown = hist.slice(-300)
  const pts = shown.map((s, i) => `${20 + (i / Math.max(shown.length - 1, 1)) * (W - 40)},${Hh - 10 - stPos(s) * (Hh - 24)}`).join(' ')
  const left = movesLeft(cur, N)
  const over = isZeroState(cur)
  return (
    <div>
      <div className="c03-descent-cur">
        <span className="muted small">{t(`move ${game.count}`, `第 ${game.count} 步`)}</span>
        <M t={stTex(cur)} />
      </div>
      <svg viewBox={`0 0 ${W} ${Hh}`} style={{ width: '100%', display: 'block' }} role="img" aria-label={t('altitude of the ordinal', '序数的高度')}>
        <line x1={20} y1={Hh - 10} x2={W - 20} y2={Hh - 10} stroke={COL.line} />
        <text x={22} y={12} fill={COL.dim} fontSize={11}>
          {t('altitude (position below ω^ω)', '高度（在 ω^ω 以下的位置）')}
        </text>
        <polyline points={pts} fill="none" stroke={COL.gold} strokeWidth={1.6} />
      </svg>
      {!over ? (
        <>
          <div className="c03-coeffs">
            {Array.from({ length: draft.length }, (_, j) => draft.length - 1 - j).map((i) => (
              <label key={i} className="c03-coeff">
                <input
                  type="number"
                  min={0}
                  value={draft[i]}
                  aria-label={`coefficient of ω^${i}`}
                  onChange={(e) => {
                    const d = [...draft]
                    d[i] = e.target.value
                    setDraft(d)
                  }}
                />
                <span>
                  <M t={i === 0 ? '\\cdot 1' : i === 1 ? '\\cdot\\omega' : `\\cdot\\omega^{${i}}`} />
                </span>
              </label>
            ))}
          </div>
          <div className="btn-row">
            <button className="btn small" onClick={move}>
              <L en="Move down to this ordinal" zh="走到这个序数" />
            </button>
            <button className="btn small" onClick={() => push([greedy(cur, N)])}>
              <L en="Greedy move" zh="贪心一步" />
            </button>
            <button className="btn small" onClick={() => setAuto(!auto)}>
              {auto ? <L en="Pause" zh="暂停" /> : <L en="Auto-play greedily" zh="自动贪心下降" />}
            </button>
            <button
              className="btn small"
              onClick={restart}
            >
              <L en="Restart" zh="重来" />
            </button>
          </div>
          <Slider value={N} min={1} max={9} onChange={setN} label={<L en="greedy fill-in N" zh="贪心填入的 N" />} />
          {msg && (
            <div className="small" style={{ color: COL.red }}>
              <L {...msg} />
            </div>
          )}
          <div className="readout small c03-text">
            <L
              en={<>Greedy rule: lower the last nonzero coefficient by 1 and set everything below it to N. From here this strategy needs exactly <b style={{ color: COL.gold }}>{fmtBig(left)}</b> more moves — finite, however you choose N.</>}
              zh={<>贪心规则：把最低的非零系数减 1，并把它下面的所有系数都填成 N。按这个策略，从这里出发恰好还要走 <b style={{ color: COL.gold }}>{fmtBig(left)}</b> 步——不管 N 取多大，都是有限步。</>}
            />
          </div>
        </>
      ) : (
        <div className="readout c03-text">
          <b style={{ color: COL.gold }}>{t(`You hit 0 after ${game.count} moves.`, `走了 ${game.count} 步，你撞到了 0。`)}</b>{' '}
          <L en="Every possible game ends this way — that is the theorem in the next scene." zh="每一局都会这样结束——这正是下一幕要证明的定理。" />
          <div className="btn-row">
            <button className="btn small" onClick={restart}>
              <L en="Play again" zh="再来一局" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/* 6. CNF calculator and comparer                                       */
/* ================================================================== */
const CNF_PRESETS: [string, string][] = [
  ['1+w', 'w+1'],
  ['2*w', 'w*2'],
  ['(w+1)*2', 'w*2+2'],
  ['2^(w+1)', 'w*2'],
  ['w*(w+1)', '(w+1)*w'],
  ['(w+1)^2', 'w^2+1'],
  ['2^(w^2)', 'w^w'],
  ['w^w+w^100', 'w^w*2'],
]

function safe(s: string): { ok: true; v: O.Ord } | { ok: false; err: string } {
  try {
    return { ok: true, v: O.parse(s) }
  } catch (e) {
    return { ok: false, err: e instanceof Error ? e.message : String(e) }
  }
}
function safeOp(f: () => O.Ord): string {
  try {
    return O.tex(f())
  } catch {
    return '\\text{(too large)}'
  }
}

export function CNFCalc() {
  const { t } = useLang()
  const [a, setA] = useState('1+w')
  const [b, setB] = useState('w+1')
  const A = useMemo(() => safe(a), [a])
  const Bv = useMemo(() => safe(b), [b])
  const both = A.ok && Bv.ok
  const c = both ? O.cmp(A.v, Bv.v) : 0
  return (
    <div>
      <div className="btn-row">
        {CNF_PRESETS.map(([x, y], i) => (
          <button
            key={i}
            className={`chip ${x === a && y === b ? 'on' : ''}`}
            onClick={() => {
              setA(x)
              setB(y)
            }}
          >
            <span className="mono">
              {x} ? {y}
            </span>
          </button>
        ))}
      </div>
      <div className="c03-cnf-inputs">
        <label>
          A = <input type="text" value={a} onChange={(e) => setA(e.target.value)} aria-label="A" spellCheck={false} />
        </label>
        <label>
          B = <input type="text" value={b} onChange={(e) => setB(e.target.value)} aria-label="B" spellCheck={false} />
        </label>
      </div>
      <div className="muted small">{t('Write w for ω; use + * ^ and parentheses.', '用 w 表示 ω；可用 + * ^ 和括号。')}</div>
      <div className="readout c03-cnf-out">
        <div>
          A = {A.ok ? <M t={O.tex(A.v)} /> : <span style={{ color: COL.red }}>{A.err}</span>}
        </div>
        <div>
          B = {Bv.ok ? <M t={O.tex(Bv.v)} /> : <span style={{ color: COL.red }}>{Bv.err}</span>}
        </div>
        {both && (
          <>
            <div className="c03-cmp">
              <M t={`A ${c < 0 ? '<' : c > 0 ? '>' : '='} B`} />
            </div>
            <div className="c03-ops">
              <span>
                <M t={`A+B=${safeOp(() => O.add(A.v, Bv.v))}`} />
              </span>
              <span>
                <M t={`B+A=${safeOp(() => O.add(Bv.v, A.v))}`} />
              </span>
              <span>
                <M t={`A\\cdot B=${safeOp(() => O.mul(A.v, Bv.v))}`} />
              </span>
              <span>
                <M t={`B\\cdot A=${safeOp(() => O.mul(Bv.v, A.v))}`} />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 7. Hilbert's hotel                                                    */
/* ================================================================== */
type Scenario = 'one' | 'bus' | 'buses'
type Guest = { bus: number; k: number }
const ROOMS = 16
const pair = (j: number, k: number) => ((j + k) * (j + k + 1)) / 2 + k

function roomOf(s: Scenario, g: Guest): number {
  if (s === 'one') return g.bus === 0 ? g.k + 1 : 0
  if (s === 'bus') return g.bus === 0 ? 2 * g.k : 2 * g.k + 1
  return pair(g.bus, g.k)
}

export function HilbertHotel() {
  const { t } = useLang()
  const [s, setS] = useState<Scenario>('one')
  const [moved, setMoved] = useState(false)
  const guests: Guest[] = useMemo(() => {
    const g: Guest[] = []
    for (let k = 0; k < 22; k++) g.push({ bus: 0, k })
    if (s === 'one') g.push({ bus: 1, k: 0 })
    else if (s === 'bus') for (let k = 0; k < 9; k++) g.push({ bus: 1, k })
    else for (let j = 1; j <= 3; j++) for (let k = 0; k < 7; k++) g.push({ bus: j, k })
    return g
  }, [s])
  const W = 700
  const rw = (W - 20) / ROOMS
  const busCol = [COL.cyan, COL.gold, COL.pink, COL.green]
  const pos = (g: Guest): { x: number; y: number; vis: boolean } => {
    if (moved) {
      const r = roomOf(s, g)
      return { x: 10 + rw * (r + 0.5), y: 40, vis: r < ROOMS }
    }
    if (g.bus === 0) return { x: 10 + rw * (g.k + 0.5), y: 40, vis: g.k < ROOMS }
    return { x: 40 + g.k * 34, y: 70 + g.bus * 26, vis: true }
  }
  const order = { one: '\\omega+1', bus: '\\omega\\cdot 2', buses: '\\omega\\cdot\\omega=\\omega^{2}' }[s]
  return (
    <div>
      <div className="btn-row">
        {(['one', 'bus', 'buses'] as Scenario[]).map((x) => (
          <button
            key={x}
            className={`chip ${s === x ? 'on' : ''}`}
            onClick={() => {
              setS(x)
              setMoved(false)
            }}
          >
            {x === 'one' ? <L en="1 new guest" zh="来了 1 位客人" /> : x === 'bus' ? <L en="a bus with ω guests" zh="一辆载着 ω 位客人的大巴" /> : <L en="ω buses" zh="ω 辆大巴" />}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} 170`} style={{ width: '100%', display: 'block' }} role="img" aria-label={t('Hilbert’s hotel', '希尔伯特旅馆')}>
        {Array.from({ length: ROOMS }, (_, r) => (
          <g key={r}>
            <rect x={10 + rw * r + 2} y={22} width={rw - 4} height={36} rx={5} fill="#0b1128" stroke={COL.line} />
            <text x={10 + rw * (r + 0.5)} y={16} fill={COL.dim} fontSize={10} textAnchor="middle">
              {r}
            </text>
          </g>
        ))}
        <text x={W - 6} y={44} fill={COL.dim} fontSize={14} textAnchor="end">
          …
        </text>
        {!moved && s !== 'one' && (
          <text x={W - 10} y={120} fill={COL.dim} fontSize={14} textAnchor="end">
            …
          </text>
        )}
        {guests.map((g, i) => {
          const p = pos(g)
          return (
            <circle
              key={i}
              r={8}
              fill={busCol[g.bus]}
              style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: 'transform 1.1s cubic-bezier(.5,0,.3,1), opacity 1s', opacity: p.vis ? 0.95 : 0 }}
            />
          )
        })}
        {!moved && (
          <text x={10} y={160} fill={COL.muted} fontSize={12}>
            {s === 'one' ? t('waiting at the door', '在门口等着') : s === 'bus' ? t('waiting in the bus', '在大巴上等着') : t('waiting in buses 1, 2, 3, … (old guests count as bus 0)', '在第 1、2、3……辆大巴上等着（老住客算第 0 辆）')}
          </text>
        )}
      </svg>
      <div className="btn-row">
        <button className="btn small" onClick={() => setMoved(!moved)}>
          {moved ? <L en="Undo" zh="撤回" /> : <L en="Announce the room change" zh="广播：换房间！" />}
        </button>
      </div>
      <div className="readout small c03-text">
        {s === 'one' && <L en={<>Rule: the guest in room n moves to room n+1; the newcomer takes room 0.</>} zh={<>规则：n 号房的客人搬到 n+1 号房；新客人住进 0 号房。</>} />}
        {s === 'bus' && <L en={<>Rule: the guest in room n moves to room 2n; bus passenger k takes room 2k+1.</>} zh={<>规则：n 号房的客人搬到 2n 号房；大巴上第 k 位乘客住进 2k+1 号房。</>} />}
        {s === 'buses' && (
          <L
            en={<>Rule: passenger k of bus j takes room (j+k)(j+k+1)/2 + k — walk the diagonals of the (bus, seat) grid.</>}
            zh={<>规则：第 j 辆车的第 k 位乘客住进 (j+k)(j+k+1)/2 + k 号房——沿着“（车号，座号）”表格的斜线逐条数。</>}
          />
        )}
        <div style={{ marginTop: 4 }}>
          <L en={<>In order of arrival the guests form a line of type <M t={order} />. After the move, every guest has a room and no room is double-booked.</>} zh={<>按到达顺序排队，客人的序型是 <M t={order} />。换房之后，人人有房，没有哪间房住两个人。</>} />
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/* 8. Cantor's diagonal argument                                        */
/* ================================================================== */
const COLS = 14
function seeded(n: number): number[][] {
  let x = 12345
  const rnd = () => {
    x = (x * 1103515245 + 12345) % 2147483648
    return x / 2147483648
  }
  return Array.from({ length: n }, () => Array.from({ length: COLS }, () => (rnd() < 0.5 ? 0 : 1)))
}

export function CantorDiagonal() {
  const [rows, setRows] = useState<number[][]>(() => seeded(8))
  const [k, setK] = useState(0) // how many diagonal digits flipped so far
  const [check, setCheck] = useState<number | null>(null)
  const timer = useRef<number | null>(null)
  const n = rows.length
  const diag = rows.map((r, i) => 1 - r[i])
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])
  const run = () => {
    if (timer.current) clearInterval(timer.current)
    setK(0)
    setCheck(null)
    let i = 0
    timer.current = window.setInterval(() => {
      i++
      setK(i)
      if (i >= n && timer.current) clearInterval(timer.current)
    }, 260)
  }
  const done = k >= n
  return (
    <div>
      <div className="scroll-x">
        <table className="c03-diag">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={check === i ? 'chk' : ''} onClick={() => done && setCheck(i)}>
                <th>s{sub(i)}</th>
                {r.map((b, j) => (
                  <td
                    key={j}
                    className={`${i === j ? 'dg' : ''} ${i === j && i < k ? 'hit' : ''} ${check === i && j === i ? 'mis' : ''}`}
                    onClick={(e) => {
                      if (done) return
                      e.stopPropagation()
                      const nr = rows.map((x) => [...x])
                      nr[i][j] = 1 - nr[i][j]
                      setRows(nr)
                      setK(0)
                    }}
                  >
                    {b}
                  </td>
                ))}
                <td className="dots">…</td>
              </tr>
            ))}
            <tr className="new">
              <th>d</th>
              {Array.from({ length: COLS }, (_, j) => (
                <td key={j} className={`${j < k && j < n ? 'got' : ''} ${check !== null && j === check ? 'mis' : ''}`}>
                  {j < k && j < n ? diag[j] : j < n ? '·' : '…'}
                </td>
              ))}
              <td className="dots">…</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="btn-row">
        <button className="btn small" onClick={run}>
          <L en="Build the diagonal sequence d" zh="构造对角序列 d" />
        </button>
        <button
          className="btn small"
          disabled={!done || n >= 12}
          onClick={() => {
            setRows([...rows, [...diag.slice(0, n), ...Array.from({ length: COLS - n }, (_, j) => (j % 3 === 0 ? 1 : 0))]])
            setK(0)
            setCheck(null)
          }}
        >
          <L en="Patch the list: add d as a new row" zh="补救：把 d 加进清单" />
        </button>
        <button
          className="btn small"
          onClick={() => {
            setRows(seeded(8))
            setK(0)
            setCheck(null)
          }}
        >
          <L en="Reset" zh="重来" />
        </button>
      </div>
      <div className="readout small c03-text">
        {!done ? (
          <L en="Click digits to make your own list (each row s₀, s₁, … continues forever). Then build d: its k-th digit is the flip of row k’s k-th digit." zh="点击数字可以自己改清单（每一行 s₀、s₁…… 都无限延续）。然后构造 d：它的第 k 位是第 k 行第 k 位取反。" />
        ) : check === null ? (
          <L en="Done. Click any row to see why d is not that row." zh="完成。点击任意一行，看看 d 为什么不是它。" />
        ) : (
          <L
            en={<>d differs from s{sub(check)} at digit {check}: s{sub(check)} has {rows[check][check]} there, d has {diag[check]}. The same holds for every row of every list, however long.</>}
            zh={<>d 和 s{sub(check)} 在第 {check} 位不同：s{sub(check)} 那一位是 {rows[check][check]}，d 是 {diag[check]}。无论清单多长，每一行都是如此。</>}
          />
        )}
      </div>
    </div>
  )
}
const SUBS = '₀₁₂₃₄₅₆₇₈₉'
const sub = (i: number) => String(i).split('').map((d) => SUBS[Number(d)]).join('')
