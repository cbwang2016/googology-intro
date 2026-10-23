import { useMemo, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import {
  ONE,
  W,
  ZERO,
  add,
  cmp,
  epsPow,
  eq,
  expOf,
  fs,
  gamma,
  isLimit,
  isSucc,
  isZero,
  lfpGamma,
  lfpPhi,
  lt,
  mul,
  nat,
  parseOrd,
  phi,
  pred,
  succ,
  tex,
  wpow,
  eps,
  zeta,
  type Ord,
} from './ordinal'

/* ================================================================== */
/* 1. The fixed-point machine                                          */
/* ================================================================== */
type MapKey = 'one+' | 'w+' | 'w*' | 'w^' | 'eps' | 'zeta' | 'gam'
type MapDef = {
  key: MapKey
  label: string
  f: (x: Ord) => Ord
  lfp: (x: Ord) => Ord
  starts: { label: string; v: Ord }[]
  fps: { en: string; zh: string }
}
const W2 = wpow(nat(2))
const WW = wpow(W)
const MAPS: MapDef[] = [
  {
    key: 'one+',
    label: '\\alpha\\mapsto 1+\\alpha',
    f: (x) => add(ONE, x),
    lfp: (x) => (lt(x, W) ? W : x),
    starts: [{ label: '0', v: ZERO }],
    fps: { en: 'Fixed points: every α ≥ ω. Number β (from 0) is ω+β.', zh: '不动点：所有 α ≥ ω。第 β 个（从 0 数起）是 ω+β。' },
  },
  {
    key: 'w+',
    label: '\\alpha\\mapsto \\omega+\\alpha',
    f: (x) => add(W, x),
    lfp: (x) => (lt(x, W2) ? W2 : x),
    starts: [
      { label: '0', v: ZERO },
      { label: '5', v: nat(5) },
    ],
    fps: { en: 'Fixed points: every α ≥ ω². Number β is ω²+β.', zh: '不动点：所有 α ≥ ω²。第 β 个是 ω²+β。' },
  },
  {
    key: 'w*',
    label: '\\alpha\\mapsto \\omega\\cdot\\alpha',
    f: (x) => mul(W, x),
    lfp: (x) => {
      if (isZero(x)) return x
      const big = x.filter((t) => cmp(expOf(t), W) >= 0)
      return big.length === x.length ? x : add(big, WW)
    },
    starts: [
      { label: '1', v: ONE },
      { label: '\\omega+2', v: add(W, nat(2)) },
      { label: '\\omega^3\\cdot3+\\omega', v: parseOrd('w^3*3+w') },
    ],
    fps: { en: 'Non-zero fixed points: ω^ω·γ for γ ≥ 1 (and the trivial 0).', zh: '非零不动点：ω^ω·γ（γ ≥ 1），外加平凡的 0。' },
  },
  {
    key: 'w^',
    label: '\\alpha\\mapsto \\omega^{\\alpha}',
    f: (x) => wpow(x),
    lfp: (x) => lfpPhi(0, x),
    starts: [
      { label: '0', v: ZERO },
      { label: '\\omega+1', v: add(W, ONE) },
    ],
    fps: { en: 'Fixed points: the ε-numbers. Number β is ε_β.', zh: '不动点：ε 数。第 β 个就是 ε_β。' },
  },
  {
    key: 'eps',
    label: '\\alpha\\mapsto \\varepsilon_{\\alpha}',
    f: (x) => eps(x),
    lfp: (x) => lfpPhi(1, x),
    starts: [{ label: '0', v: ZERO }],
    fps: { en: 'Fixed points: the ζ-numbers. Number β is ζ_β.', zh: '不动点：ζ 数。第 β 个就是 ζ_β。' },
  },
  {
    key: 'zeta',
    label: '\\alpha\\mapsto \\zeta_{\\alpha}',
    f: (x) => zeta(x),
    lfp: (x) => lfpPhi(2, x),
    starts: [{ label: '0', v: ZERO }],
    fps: { en: 'Fixed points: the η-numbers. Number β is η_β.', zh: '不动点：η 数。第 β 个就是 η_β。' },
  },
  {
    key: 'gam',
    label: '\\alpha\\mapsto \\varphi(\\alpha,0)',
    f: (x) => phi(x, ZERO),
    lfp: (x) => lfpGamma(x),
    starts: [{ label: '0', v: ZERO }],
    fps: { en: 'Fixed points: Γ₀, Γ₁, … (Section 5 explains them).', zh: '不动点：Γ₀、Γ₁……（第 5 节解释）。' },
  },
]

type Run = { start: Ord; its: Ord[]; lim: Ord; already: boolean }
function makeRun(m: MapDef, s: Ord): Run {
  const its: Ord[] = [s]
  for (let i = 0; i < 4; i++) its.push(m.f(its[its.length - 1]))
  const lim = m.lfp(s)
  return { start: s, its, lim, already: eq(m.f(s), s) }
}

export function FixedPointMachine() {
  const [mk, setMk] = useState<MapKey>('w^')
  const [si, setSi] = useState(0)
  const m = MAPS.find((x) => x.key === mk)!
  const [runs, setRuns] = useState<Run[]>(() => [makeRun(m, m.starts[0].v)])
  const choose = (k: MapKey, s = 0) => {
    const mm = MAPS.find((x) => x.key === k)!
    setMk(k)
    setSi(s)
    setRuns([makeRun(mm, mm.starts[s].v)])
  }
  const jump = () => {
    const last = runs[runs.length - 1]
    setRuns([...runs, makeRun(m, succ(last.lim))].slice(-6))
  }
  const cur = runs[runs.length - 1]
  const dedup = (a: Ord[]) => {
    const out: Ord[] = []
    for (const x of a) if (!out.length || !eq(out[out.length - 1], x)) out.push(x)
    return out
  }
  const its = dedup(cur.its)
  return (
    <div>
      <div className="btn-row">
        {MAPS.map((x) => (
          <button key={x.key} className={`chip ${mk === x.key ? 'on' : ''}`} onClick={() => choose(x.key)}>
            <M t={x.label} />
          </button>
        ))}
      </div>
      {m.starts.length > 1 && (
        <div className="btn-row">
          <span className="muted small" style={{ alignSelf: 'center' }}>
            <L en="start at" zh="起点" />
          </span>
          {m.starts.map((s, i) => (
            <button key={i} className={`chip ${si === i ? 'on' : ''}`} onClick={() => choose(mk, i)}>
              <M t={s.label} />
            </button>
          ))}
        </div>
      )}
      <div className="c07-iter">
        {its.map((x, i) => (
          <span key={i} className="c07-iter-item">
            {i > 0 && <span className="c07-arrow">↦</span>}
            <M t={tex(x)} />
          </span>
        ))}
        {!cur.already && (
          <span className="c07-iter-item">
            <span className="c07-arrow">↦ ⋯</span>
          </span>
        )}
      </div>
      <div className="c07-limit">
        {cur.already ? (
          <L en={<>Already a fixed point: f(α) = α. Nothing to climb.</>} zh={<>已经是不动点：f(α) = α，无需再爬。</>} />
        ) : (
          <L en={<>sup of the iterates =</>} zh={<>迭代的上确界 =</>} />
        )}{' '}
        <b className="c07-fp">
          <M t={tex(cur.lim)} />
        </b>
        <span className="muted small">
          {' '}
          <L en={<>check: f(this) = this ✓</>} zh={<>验证：f(它) = 它 ✓</>} />
        </span>
      </div>
      <div className="btn-row">
        <button className="btn small" onClick={jump}>
          <L en="+1: jump out and iterate again" zh="+1：跳出去，再迭代" />
        </button>
        <button className="btn small" onClick={() => choose(mk, si)}>
          <L en="Reset" zh="重来" />
        </button>
      </div>
      <div className="c07-fplist">
        <span className="muted small">
          <L en="Fixed points found:" zh="已找到的不动点：" />
        </span>{' '}
        {dedup(runs.map((r) => r.lim)).map((x, i) => (
          <span key={i} className="c07-fpchip">
            <M t={tex(x)} />
          </span>
        ))}
      </div>
      <div className="muted small">
        <L {...m.fps} />
      </div>
    </div>
  )
}

/* ================================================================== */
/* 2. Two roads to ε₁                                                  */
/* ================================================================== */
export function TwoRoads() {
  const e0 = eps(ZERO)
  const items = useMemo(() => {
    const A: Ord[] = []
    for (let n = 0; n < 4; n++) A.push(fs(eps(ONE), n).v)
    const B: Ord[] = [ZERO]
    for (let n = 0; n < 4; n++) B.push(epsPow(e0, B[B.length - 1]))
    const alt: Record<number, string> = {}
    // nicer second names for road A, verified by the engine
    const cands: [Ord, string][] = [
      [mul(e0, W), '\\varepsilon_0\\cdot\\omega'],
      [epsPow(e0, W), '\\varepsilon_0^{\\,\\omega}'],
      [epsPow(e0, epsPow(e0, W)), '\\varepsilon_0^{\\,\\varepsilon_0^{\\omega}}'],
    ]
    A.forEach((a, i) => {
      for (const [v, s] of cands) if (eq(v, a)) alt[i] = s
    })
    const bTex = ['0', '1', '\\varepsilon_0', '\\varepsilon_0^{\\,\\varepsilon_0}', '\\varepsilon_0^{\\,\\varepsilon_0^{\\,\\varepsilon_0}}', '\\varepsilon_0^{\\,\\varepsilon_0^{\\,\\varepsilon_0^{\\,\\varepsilon_0}}}']
    const all = [
      ...A.map((v, i) => ({ v, road: 'A' as const, i, t: tex(v), alt: alt[i] })),
      ...B.map((v, i) => ({ v, road: 'B' as const, i, t: bTex[i], alt: undefined as string | undefined })),
    ]
    all.sort((x, y) => cmp(x.v, y.v))
    return all
  }, [e0])
  return (
    <div>
      <div className="c07-roads">
        {items.map((it, k) => (
          <div key={k} className={`c07-road c07-road-${it.road}`}>
            <span className="c07-road-tag">
              {it.road}
              <sub>{it.i}</sub>
            </span>
            <M t={it.t} />
            {it.alt && (
              <span className="muted">
                {' '}
                <M t={`=${it.alt}`} />
              </span>
            )}
          </div>
        ))}
        <div className="c07-road c07-road-top">
          <M t="\cdots\ \longrightarrow\ \varepsilon_1" />
        </div>
      </div>
      <div className="muted small">
        <L
          en="Sorted by size, computed exactly. Road A (cyan) is ε₁[n] = ω^ω^…^(ε₀+1); road B (pink) is 0, 1, ε₀, ε₀^ε₀, …. They zip together like the teeth of a zipper, so they have the same limit."
          zh="按大小排序，由程序精确比较。A 路（青色）是 ε₁[n] = ω^ω^…^(ε₀+1)，B 路（粉色）是 0, 1, ε₀, ε₀^ε₀, ……。两条路像拉链的齿一样交错咬合，所以极限相同。"
        />
      </div>
    </div>
  )
}

/* ================================================================== */
/* 3. Veblen grid                                                      */
/* ================================================================== */
const ROWS: [string, Ord][] = [
  ['0', ZERO],
  ['1', ONE],
  ['2', nat(2)],
  ['3', nat(3)],
  ['\\omega', W],
  ['\\Gamma_0', gamma(ZERO)],
]
const COLS: [string, Ord][] = [
  ['0', ZERO],
  ['1', ONE],
  ['\\omega', W],
  ['\\varepsilon_0', eps(ZERO)],
  ['\\zeta_0', zeta(ZERO)],
  ['\\varphi(\\omega,0)', phi(W, ZERO)],
  ['\\Gamma_0', gamma(ZERO)],
]

export function VeblenGrid() {
  const { t } = useLang()
  const [sel, setSel] = useState<[number, number]>([2, 1])
  const [raw, setRaw] = useState(false)
  const [ai, bi] = sel
  const a = ROWS[ai][1]
  const b = COLS[bi][1]
  const v = phi(a, b)
  const absorbed = eq(v, b) && !isZero(b)
  const terms = isLimit(v) ? [0, 1, 2, 3].map((n) => tex(fs(v, n).v, raw)) : []
  const kind = isZero(a) ? 'zero' : isSucc(a) ? 'succ' : 'lim'
  return (
    <div>
      <div className="scroll-x">
        <table className="grid c07-grid">
          <thead>
            <tr>
              <th className="c07-corner">
                <M t="\alpha\backslash\beta" />
              </th>
              {COLS.map(([s], j) => (
                <th key={j}>
                  <M t={s} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([rs, ra], i) => (
              <tr key={i}>
                <th>
                  <M t={rs} />
                </th>
                {COLS.map(([, cb], j) => {
                  const val = phi(ra, cb)
                  const abs = eq(val, cb) && !isZero(cb)
                  const on = i === ai && j === bi
                  return (
                    <td
                      key={j}
                      className={`c07-cell ${abs ? 'abs' : ''} ${on ? 'on' : ''}`}
                      onClick={() => setSel([i, j])}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSel([i, j])}
                    >
                      <M t={tex(val, raw)} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="readout c07-explain">
        <div className="c07-explain-head">
          <M t={`\\varphi(${ROWS[ai][0]},${COLS[bi][0]})=${tex(v, raw)}`} />
          <span className="c07-explain-chips">
            <button className={`chip ${raw ? '' : 'on'}`} onClick={() => setRaw(false)}>
              <L en="names (ω, ε, ζ, η)" zh="用名字（ω, ε, ζ, η）" />
            </button>
            <button className={`chip ${raw ? 'on' : ''}`} onClick={() => setRaw(true)}>
              <L en="raw φ" zh="全用 φ" />
            </button>
          </span>
        </div>
        <div className="small">
          {absorbed ? (
            <L
              en={<>β is already a fixed point of φ(α,·), so φ(α,β) = β. Pink cells are these "absorbed" ones: nothing new is created.</>}
              zh={<>β 本身已经是 φ(α,·) 的不动点，所以 φ(α,β) = β。粉色格子都是这种“被吸收”的情形：没有产生新序数。</>}
            />
          ) : kind === 'zero' ? (
            <L en={<>Row 0 is plain exponentiation: φ(0,β) = ω^β.</>} zh={<>第 0 行就是普通的乘方：φ(0,β) = ω^β。</>} />
          ) : kind === 'succ' ? (
            <L
              en={<>Successor row: fixed point number β (counting from 0) of the row above, ξ ↦ φ(α−1, ξ).</>}
              zh={<>后继行：上一行 ξ ↦ φ(α−1, ξ) 的第 β 个不动点（从 0 数起）。</>}
            />
          ) : (
            <L
              en={<>Limit row: fixed point number β of every row above at once (a common fixed point).</>}
              zh={<>极限行：同时是上面所有行的不动点（共同不动点），取第 β 个。</>}
            />
          )}
        </div>
        {terms.length > 0 && (
          <div className="small c07-fsline">
            {t('fundamental sequence: ', '基本列：')}
            {terms.map((s, i) => (
              <span key={i}>
                <M t={s} />
                {i < terms.length - 1 ? ', ' : ', …'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 4. FS explorer with countdown                                       */
/* ================================================================== */
const RULES: Record<string, { en: string; zh: string }> = {
  '1': { en: 'rule (1): a sum — expand only the last term', zh: '规则 (1)：和式——只展开最后一项' },
  '2a': { en: 'rule (2): ω^α, α limit → ω^(α[n])', zh: '规则 (2)：ω^α，α 为极限 → ω^(α[n])' },
  '2b': { en: 'rule (2): ω^(β+1)[n] = ω^β·n', zh: '规则 (2)：ω^(β+1)[n] = ω^β·n' },
  '3-4': { en: 'rules (3)(4): φ(α+1,0) — apply φ(α,·) to 0, n+1 times (course indexing)', zh: '规则 (3)(4)：φ(α+1,0)——从 0 开始作用 φ(α,·) 共 n+1 次（本课程的编号）' },
  '5-6': { en: 'rules (5)(6): φ(α+1,β+1) — start at φ(α+1,β)+1, apply φ(α,·) n times', zh: '规则 (5)(6)：φ(α+1,β+1)——从 φ(α+1,β)+1 出发，作用 φ(α,·) 共 n 次' },
  '7': { en: 'rule (7): φ(α,0), α limit → φ(α[n],0)', zh: '规则 (7)：φ(α,0)，α 为极限 → φ(α[n],0)' },
  '8': { en: 'rule (8): φ(α,β+1), α limit → φ(α[n], φ(α,β)+1)', zh: '规则 (8)：φ(α,β+1)，α 为极限 → φ(α[n], φ(α,β)+1)' },
  '9': { en: 'rule (9): φ(α,β), β limit → φ(α,β[n])', zh: '规则 (9)：φ(α,β)，β 为极限 → φ(α,β[n])' },
  Γ0: { en: 'Γ₀: apply α ↦ φ(α,0) to 0, n+1 times', zh: 'Γ₀：从 0 开始作用 α ↦ φ(α,0) 共 n+1 次' },
  'Γ+': { en: 'Γ_{β+1}: start at Γ_β+1, apply α ↦ φ(α,0) n times', zh: 'Γ_{β+1}：从 Γ_β+1 出发，作用 α ↦ φ(α,0) 共 n 次' },
  Γλ: { en: 'Γ_β, β limit → Γ_{β[n]}', zh: 'Γ_β，β 为极限 → Γ_{β[n]}' },
}
const PRESETS = ['e0', 'e1', 'e_w', 'z0', 'φ(2,1)', 'φ(w,0)', 'φ(w,1)', 'φ(e0,0)', 'G0', 'G1']

function countdown(x0: Ord, n: number, cap: number) {
  let x = x0
  let steps = 0
  const t0 = Date.now()
  while (!isZero(x) && steps < cap && Date.now() - t0 < 400) {
    x = isSucc(x) ? pred(x) : fs(x, n).v
    steps++
  }
  return { steps, done: isZero(x), last: x }
}

export function FSExplorer() {
  const { t } = useLang()
  const [text, setText] = useState('φ(w,1)')
  const [path, setPath] = useState<Ord[]>(() => [parseOrd('φ(w,1)')])
  const [err, setErr] = useState('')
  const [cd, setCd] = useState<null | { steps: number; done: boolean; n: number }>(null)
  const x = path[path.length - 1]
  const load = (s: string) => {
    try {
      const v = parseOrd(s)
      setPath([v])
      setErr('')
      setCd(null)
    } catch (e) {
      setErr(String((e as Error).message))
    }
  }
  const terms = isLimit(x) ? [0, 1, 2, 3].map((n) => fs(x, n)) : []
  const rule = terms[0]?.rule
  return (
    <div>
      <div className="btn-row">
        {PRESETS.map((p) => (
          <button
            key={p}
            className="chip"
            onClick={() => {
              setText(p)
              load(p)
            }}
          >
            <M t={tex(parseOrd(p))} />
          </button>
        ))}
      </div>
      <div className="row">
        <input
          className="c07-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(text)}
          aria-label={t('ordinal', '序数')}
          title={t('syntax: w, e_0, z_1, G0, phi(a,b), w^(..), +, *3', '语法：w, e_0, z_1, G0, phi(a,b), w^(..), +, *3')}
          placeholder="w, e_0, z_1, G0, phi(a,b), w^(..), +, *3"
        />
        <button className="btn small" onClick={() => load(text)}>
          <L en="Load" zh="载入" />
        </button>
      </div>
      {err && <div className="c07-err">{err}</div>}
      <div className="c07-crumbs">
        {path.map((p, i) => (
          <button key={i} className={`chip ${i === path.length - 1 ? 'on' : ''}`} onClick={() => setPath(path.slice(0, i + 1))}>
            <M t={tex(p)} />
          </button>
        ))}
      </div>
      <div className="readout c07-fsbox">
        {isZero(x) ? (
          <L en="0 — the bottom. Every path ends here." zh="0——到底了。每条路都在这里结束。" />
        ) : isSucc(x) ? (
          <div>
            <L en="A successor: no fundamental sequence. Step down by one:" zh="后继序数：没有基本列，只能减一：" />{' '}
            <button className="chip" onClick={() => setPath([...path, pred(x)])}>
              <M t={tex(pred(x))} />
            </button>
          </div>
        ) : (
          <div>
            <div className="small muted">{t(RULES[rule!].en, RULES[rule!].zh)}</div>
            {terms.map((r, n) => (
              <button key={n} className="c07-term" onClick={() => setPath([...path, r.v])}>
                <span className="c07-idx">[{n}]</span> <M t={tex(r.v)} />
              </button>
            ))}
            <div className="muted small">
              <L en="Click a term to zoom into it." zh="点击某一项，放大进去看。" />
            </div>
          </div>
        )}
      </div>
      <div className="btn-row">
        {[1, 2].map((n) => (
          <button key={n} className="btn small" disabled={isZero(x)} onClick={() => setCd({ ...countdown(x, n, 200000), n })}>
            <L en={`Countdown with n = ${n}`} zh={`用 n = ${n} 倒数到 0`} />
          </button>
        ))}
      </div>
      {cd && (
        <div className="small">
          {cd.done ? (
            <L
              en={<>Replace α by α[{cd.n}] (or α−1): reached 0 after <b>{cd.steps.toLocaleString()}</b> steps.</>}
              zh={<>反复把 α 换成 α[{cd.n}]（后继就减一）：<b>{cd.steps.toLocaleString()}</b> 步后到达 0。</>}
            />
          ) : (
            <L
              en={<>Still above 0 after {cd.steps.toLocaleString()} steps — it will get there (Chapter 3), just not today.</>}
              zh={<>走了 {cd.steps.toLocaleString()} 步还没到 0——它一定会到（第 3 章的定理），只是不是今天。</>}
            />
          )}
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/* 5. The Veblen odometer (finitely many arguments, natural entries)   */
/* ================================================================== */
function stripLead(v: (number | string)[]) {
  let i = 0
  while (i < v.length - 1 && (v[i] === 0 || v[i] === '0')) i++
  return v.slice(i)
}
function mvTex(v: (number | string)[]) {
  const s = stripLead(v)
  if (s.length === 1) {
    const a = s[0]
    if (a === 0 || a === '0') return '1'
    if (a === 1 || a === '1') return '\\omega'
    return `\\omega^{${a}}`
  }
  return `\\varphi(${s.join(',')})`
}
function mvFS(v: number[], n: number): string | null {
  const s = stripLead(v) as number[]
  if (s.length === 1) {
    const a = s[0]
    if (a === 0) return null
    const base = a - 1 === 0 ? '' : a - 1 === 1 ? '\\omega' : `\\omega^{${a - 1}}`
    if (n === 0) return '0'
    if (!base) return String(n)
    return n === 1 ? base : `${base}\\cdot ${n}`
  }
  const Lx = s.length - 1
  let p = Lx - 1
  while (p >= 0 && s[p] === 0) p--
  const build = (d: string) => {
    const arr: (number | string)[] = s.map((x) => x)
    arr[p] = s[p] - 1
    arr[p + 1] = d
    for (let i = p + 2; i <= Lx; i++) arr[i] = 0
    return mvTex(arr)
  }
  const beta = s[Lx]
  let X: string
  if (beta === 0) {
    X = '0'
    for (let i = 0; i <= n; i++) X = build(X)
  } else {
    const prev = s.map((x) => x)
    prev[Lx] = beta - 1
    X = mvTex(prev) + '+1'
    for (let i = 0; i < n; i++) X = build(X)
  }
  return X
}
function mvName(v: number[]): { en: string; zh: string } | null {
  const s = stripLead(v) as number[]
  const k = s.length
  const rest0 = s.slice(1).every((x) => x === 0)
  if (k === 2 && s[0] <= 3 && s[0] >= 1) {
    const g = ['', '\\varepsilon', '\\zeta', '\\eta'][s[0]]
    return { en: `$${g}_{${s[1]}}$`, zh: `$${g}_{${s[1]}}$` }
  }
  if (k === 3 && s[0] === 1 && s[1] === 0) return { en: `$\\Gamma_{${s[2]}}$`, zh: `$\\Gamma_{${s[2]}}$` }
  if (k === 4 && s[0] === 1 && rest0) return { en: 'the Ackermann ordinal', zh: 'Ackermann 序数' }
  if (k >= 5 && s[0] === 1 && rest0) return { en: `$\\varphi(1@${k - 1})$`, zh: `$\\varphi(1@${k - 1})$` }
  return null
}

export function Odometer() {
  const [v, setV] = useState<number[]>([0, 1, 0, 0])
  const s = stripLead(v) as number[]
  const name = mvName(v)
  const bump = (i: number, d: number) => {
    const nv = [...v]
    nv[i] = Math.max(0, Math.min(9, nv[i] + d))
    setV(nv)
  }
  const Lx = s.length - 1
  let p = Lx - 1
  while (p >= 0 && s[p] === 0) p--
  const off = v.length - s.length
  const fsTerms = [0, 1, 2].map((n) => mvFS(v, n))
  const atStr = s
    .map((x, i) => (x ? `${x}@${s.length - 1 - i}` : ''))
    .filter(Boolean)
    .join(',')
  return (
    <div>
      <div className="c07-dials">
        <div className="c07-dial ghost">
          <div className="c07-dial-pos">…</div>
          <div className="c07-dial-val">⋯</div>
          <div className="small muted">
            <L en="ω slots → SVO" zh="ω 个位置 → SVO" />
          </div>
        </div>
        {v.map((x, i) => {
          const pos = v.length - 1 - i
          const role = i - off === Lx && s.length > 1 ? 'count' : i - off === p && s.length > 1 ? 'level' : ''
          return (
            <div key={i} className={`c07-dial ${role}`}>
              <div className="c07-dial-pos">@{pos}</div>
              <button className="c07-dial-btn" onClick={() => bump(i, 1)} aria-label="+">
                ▲
              </button>
              <div className="c07-dial-val">{x}</div>
              <button className="c07-dial-btn" onClick={() => bump(i, -1)} aria-label="−">
                ▼
              </button>
            </div>
          )
        })}
      </div>
      <div className="btn-row">
        <button className="chip" disabled={v.length >= 7} onClick={() => setV([0, ...v])}>
          <L en="add a slot on the left" zh="左边加一个位置" />
        </button>
        <button className="chip" disabled={v.length <= 2} onClick={() => setV(v.slice(1))}>
          <L en="remove leftmost slot" zh="去掉最左边的位置" />
        </button>
        <button className="chip" onClick={() => setV(v.map((_, i) => (i === 0 ? 1 : 0)))}>
          <L en="1 followed by zeros" zh="1 后面全是 0" />
        </button>
      </div>
      <div className="readout">
        <div>
          <M t={`${mvTex(v)}`} />
          {s.length > 1 && (
            <span className="muted">
              {' '}
              <M t={`=\\varphi(${atStr || '0@0'})`} />
            </span>
          )}
          {name && (
            <span className="c07-fp">
              {' '}
              ={' '}
              {name.en.startsWith('$') ? <M t={name.en.slice(1, -1)} /> : <L en={name.en} zh={name.zh} />}
            </span>
          )}
        </div>
        {s.length > 1 && p >= 0 && (
          <div className="small">
            <L
              en={
                <>
                  <span className="c07-count">counter</span> = {s[Lx]}; <span className="c07-level">level</span> = {s[p]} at slot @{Lx - p}. This is fixed point number {s[Lx]} (from 0) of{' '}
                  <M t={`\\delta\\mapsto${mvTex(s.map((x, i) => (i === p ? x - 1 : i === p + 1 ? '\\delta' : i > p ? 0 : x)))}`} />.
                </>
              }
              zh={
                <>
                  <span className="c07-count">计数位</span> = {s[Lx]}；<span className="c07-level">层级位</span> = {s[p]}，在 @{Lx - p}。它是映射{' '}
                  <M t={`\\delta\\mapsto${mvTex(s.map((x, i) => (i === p ? x - 1 : i === p + 1 ? '\\delta' : i > p ? 0 : x)))}`} /> 的第 {s[Lx]} 个不动点（从 0 数起）。
                </>
              }
            />
          </div>
        )}
        {fsTerms[0] !== null && (
          <div className="small c07-fsline">
            {fsTerms.map((f, n) => (
              <div key={n}>
                <span className="c07-idx">[{n}]</span> <M t={f!} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
