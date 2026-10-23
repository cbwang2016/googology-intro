import { useMemo, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { closureLevels } from './bricks'
import { eps, nat, OMEGA, tex, type Ord } from './ordinal'

/* ================================================================== */
/* 1. Same ℕ, different orders: recursive well-orders                  */
/* ================================================================== */
type Rank = number[] // coefficients: rank[k] is the coefficient of ω^k
type Rule = {
  id: string
  name: { en: string; zh: string }
  code: string
  type: string // TeX order type
  rank: ((n: number) => Rank) | null // null: not a well-order
}
function v2(x: number) {
  let i = 0
  while (x % 2 === 0) {
    x /= 2
    i++
  }
  return [i, x]
}
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
const RULES: Rule[] = [
  { id: 'usual', name: { en: 'usual order', zh: '通常顺序' }, code: 'a ≺ b  ⇔  a < b', type: '\\omega', rank: (n) => [n] },
  {
    id: 'zero',
    name: { en: '0 goes last', zh: '0 排最后' },
    code: 'a ≺ b  ⇔  b = 0 ≠ a,  or  0 ≠ a < b',
    type: '\\omega+1',
    rank: (n) => (n === 0 ? [0, 1] : [n - 1]),
  },
  {
    id: 'even',
    name: { en: 'evens, then odds', zh: '先偶数，后奇数' },
    code: 'compare (a mod 2, a) with (b mod 2, b) lexicographically',
    type: '\\omega\\cdot 2',
    rank: (n) => (n % 2 === 0 ? [n / 2] : [(n - 1) / 2, 1]),
  },
  {
    id: 'v2',
    name: { en: 'by powers of 2 in n+1', zh: '按 n+1 中 2 的次数' },
    code: 'write n+1 = 2^i·(2j+1); compare (i, j) lexicographically',
    type: '\\omega^2',
    rank: (n) => {
      const [i, odd] = v2(n + 1)
      return [(odd - 1) / 2, i]
    },
  },
  {
    id: 'primes',
    name: { en: 'by prime exponents of n+1', zh: '按 n+1 的素因子指数' },
    code: 'n+1 = 2^a₀·3^a₁·5^a₂⋯ ↦ ⋯+ω²·a₂+ω·a₁+a₀; compare from the largest prime down',
    type: '\\omega^\\omega',
    rank: (n) => {
      let x = n + 1
      const r: number[] = []
      for (const p of PRIMES) {
        let a = 0
        while (x % p === 0) {
          x /= p
          a++
        }
        r.push(a)
        if (x === 1) break
      }
      return r
    },
  },
  { id: 'rev', name: { en: 'reversed (a trap)', zh: '倒过来（陷阱）' }, code: 'a ≺ b  ⇔  a > b', type: '\\text{—}', rank: null },
]
function rankTex(r: Rank): string {
  const parts: string[] = []
  for (let k = r.length - 1; k >= 0; k--) {
    const c = r[k]
    if (!c) continue
    const base = k === 0 ? '' : k === 1 ? '\\omega' : `\\omega^{${k}}`
    parts.push(k === 0 ? String(c) : c === 1 ? base : `${base}\\cdot ${c}`)
  }
  return parts.length ? parts.join('+') : '0'
}
function cmpRank(a: Rank, b: Rank) {
  const n = Math.max(a.length, b.length)
  for (let k = n - 1; k >= 0; k--) {
    const x = a[k] ?? 0
    const y = b[k] ?? 0
    if (x !== y) return x - y
  }
  return 0
}

export function RecursiveOrders() {
  const { t } = useLang()
  const [rid, setRid] = useState('even')
  const [N, setN] = useState(30)
  const rule = RULES.find((r) => r.id === rid)!
  const items = useMemo(() => {
    const xs = Array.from({ length: N }, (_, n) => n)
    if (!rule.rank) return xs.map((n) => ({ n, r: null as Rank | null, block: '' })).sort((a, b) => b.n - a.n)
    const f = rule.rank
    return xs
      .map((n) => {
        const r = f(n)
        return { n, r, block: rankTex([0, ...r.slice(1)]) }
      })
      .sort((a, b) => cmpRank(a.r!, b.r!))
  }, [rule, N])
  // group consecutive items with the same "block" (all but the finite coefficient)
  const groups: { block: string; xs: typeof items }[] = []
  for (const it of items) {
    const g = groups[groups.length - 1]
    if (g && g.block === it.block) g.xs.push(it)
    else groups.push({ block: it.block, xs: [it] })
  }
  return (
    <div>
      <div className="btn-row">
        {RULES.map((r) => (
          <button key={r.id} className={`chip ${r.id === rid ? 'on' : ''}`} onClick={() => setRid(r.id)}>
            <L {...r.name} />
          </button>
        ))}
      </div>
      <div className="readout mono small c08-code">{rule.code}</div>
      <Slider value={N} min={10} max={60} onChange={setN} label={<L en="show 0 … N−1, N =" zh="展示 0 … N−1，N =" />} />
      <div className="c08-blocks">
        {rule.rank ? (
          groups.map((g, i) => (
            <div key={i} className="c08-block">
              <span className="c08-block-label">
                <M t={g.block === '0' ? '0+\\cdots' : `${g.block}+\\cdots`} />
              </span>
              {g.xs.map((it) => (
                <span key={it.n} className="c08-num" title={t(`position ${rankTex(it.r!)}`, `位置 ${rankTex(it.r!)}`)}>
                  {it.n}
                </span>
              ))}
              <span className="muted">…</span>
            </div>
          ))
        ) : (
          <div className="c08-block">
            <span className="muted small">
              <L en="Who is first? Nobody:" zh="谁排第一？没有人：" />
            </span>{' '}
            {items.slice(0, 14).map((it, i) => (
              <span key={it.n}>
                <span className="c08-num bad">{it.n}</span>
                {i < 13 && <span className="muted"> ≺ </span>}
              </span>
            ))}
            <span className="muted"> … ≺ 2 ≺ 1 ≺ 0</span>
          </div>
        )}
      </div>
      <div className="readout">
        {rule.rank ? (
          <L
            en={<>Order type of the whole of ℕ under this program: <M t={rule.type} />. Each row is one copy of ω (only its first members are shown).</>}
            zh={<>整个 ℕ 在这个程序下的序型：<M t={rule.type} />。每一行是一份 ω（只画出了开头几个成员）。</>}
          />
        ) : (
          <L
            en={<>Decidable, but not a well-order: the descent 0 ≻ 1 ≻ 2 ≻ 3 ≻ … never ends, and ℕ has no least element. Rejected.</>}
            zh={<>可以判定，但不是良序：0 ≻ 1 ≻ 2 ≻ 3 ≻ …… 永远降不完，ℕ 没有最小元。淘汰。</>}
          />
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* 2. Brick closure C^n(α), book Def 5.3                               */
/* ================================================================== */
type AlphaOpt = { id: string; tex: string; alpha: Ord | null; closed: boolean; psi: string }
const ALPHAS: AlphaOpt[] = [
  { id: '0', tex: '0', alpha: nat(0), closed: false, psi: '\\varepsilon_0' },
  { id: '1', tex: '1', alpha: nat(1), closed: false, psi: '\\varepsilon_1' },
  { id: '2', tex: '2', alpha: nat(2), closed: false, psi: '\\varepsilon_2' },
  { id: 'w', tex: '\\omega', alpha: OMEGA, closed: true, psi: '\\varepsilon_\\omega' },
  { id: 'e0', tex: '\\varepsilon_0', alpha: eps(nat(0)), closed: true, psi: '\\varepsilon_{\\varepsilon_0}' },
  { id: 'big', tex: '\\zeta_0+1', alpha: null, closed: true, psi: '\\zeta_0\\ ?!' },
]

export function BrickBuilder() {
  const [aid, setAid] = useState('0')
  const [n, setN] = useState(1)
  const opt = ALPHAS.find((a) => a.id === aid)!
  const levels = useMemo(() => closureLevels(opt.alpha, 4, 3, opt.closed), [opt])
  const lv = levels[n]
  const showList = n <= 2
  return (
    <div>
      <div className="btn-row">
        <span className="muted small c08-lab">
          <L en="argument α =" zh="参数 α =" />
        </span>
        {ALPHAS.map((a) => (
          <button key={a.id} className={`chip ${a.id === aid ? 'on' : ''}`} onClick={() => setAid(a.id)}>
            <M t={a.tex} />
          </button>
        ))}
      </div>
      <Slider value={n} min={0} max={4} onChange={setN} label={<L en="stage n" zh="第 n 层" />} />
      <div className="c08-stage-head">
        <M t={`C^{${n}}(${opt.tex})`} />
        <span className="muted small">
          {lv.count > 0 ? (
            <L en={<> — {lv.count} ordinals</>} zh={<> —— 共 {lv.count} 个序数</>} />
          ) : (
            <L en=" — too many to list" zh=" —— 多到列不完" />
          )}
        </span>
      </div>
      {showList ? (
        <div className="c08-bricks">
          {lv.items.map((x) => {
            const s = tex(x)
            const isPsi = s.startsWith('\\varepsilon')
            return (
              <span key={s} className={`c08-brick ${isPsi ? 'psi' : ''}`}>
                <M t={s} />
              </span>
            )
          })}
        </div>
      ) : (
        <div className="c08-bricks muted small">
          <L en="(the set is listed only up to stage 2)" zh="（只列出到第 2 层）" />
        </div>
      )}
      <div className="c08-maxes">
        {levels.map((l, i) => (
          <div key={i} className={`c08-maxrow ${i === n ? 'on' : ''}`}>
            <span className="c08-maxn">
              <M t={`\\max C^{${i}}`} />
            </span>
            <M t={`= ${tex(l.max)}`} />
          </div>
        ))}
        <div className="c08-maxrow target">
          <span className="c08-maxn">
            <M t={`\\psi(${opt.tex})`} />
          </span>
          {opt.id === 'big' ? (
            <L
              en={<>the climb ε_ω, ε_ε_ω, … never reaches <M t="\zeta_0" />, so <M t="\psi(\zeta_0+1)=\zeta_0" />: the plateau.</>}
              zh={<>爬升 ε_ω, ε_ε_ω, …… 永远到不了 <M t="\zeta_0" />，所以 <M t="\psi(\zeta_0+1)=\zeta_0" />：平台期。</>}
            />
          ) : (
            <L en={<>the first ordinal never reached: <M t={opt.psi} /></>} zh={<>永远搭不到的第一个序数：<M t={opt.psi} /></>} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/* 3. The staircase: ψ climbs, sticks at ζ₀, Ω restarts it             */
/* ================================================================== */
type SP = { arg: string; val: string; note: { en: string; zh: string }; kind: 'climb' | 'flat' | 'jump' }
const STAIRS: SP[] = [
  { arg: '0', val: '\\varepsilon_0', kind: 'climb', note: { en: 'nothing but 0, 1, ω to build with', zh: '只有 0、1、ω 可用' } },
  { arg: '1', val: '\\varepsilon_1', kind: 'climb', note: { en: 'ψ(0) = ε₀ becomes a brick', zh: 'ψ(0) = ε₀ 成了砖块' } },
  { arg: '2', val: '\\varepsilon_2', kind: 'climb', note: { en: 'ψ(1) joins', zh: 'ψ(1) 加入' } },
  { arg: '\\omega', val: '\\varepsilon_\\omega', kind: 'climb', note: { en: 'limits pass through', zh: '极限直接穿过' } },
  { arg: '\\varepsilon_0', val: '\\varepsilon_{\\varepsilon_0}', kind: 'climb', note: { en: 'still ψ(α) = ε_α', zh: '仍然 ψ(α) = ε_α' } },
  { arg: '\\zeta_0', val: '\\zeta_0', kind: 'climb', note: { en: 'fixed point: ψ(ζ₀) = ε_ζ₀ = ζ₀', zh: '不动点：ψ(ζ₀) = ε_ζ₀ = ζ₀' } },
  { arg: '\\zeta_0+1', val: '\\zeta_0', kind: 'flat', note: { en: 'stuck: ζ₀ was never a brick, so the new allowance is useless', zh: '卡住：ζ₀ 从来不是砖块，多出来的额度用不上' } },
  { arg: '\\Gamma_0', val: '\\zeta_0', kind: 'flat', note: { en: 'stuck', zh: '卡住' } },
  { arg: '\\text{BHO}', val: '\\zeta_0', kind: 'flat', note: { en: 'stuck — any recursive argument is wasted', zh: '卡住——任何递归参数都白费' } },
  { arg: '\\Omega', val: '\\zeta_0', kind: 'flat', note: { en: 'still stuck: Ω is a brick, but ψ(Ω) is not yet allowed', zh: '还是卡住：Ω 是砖块，但 ψ(Ω) 还不许用' } },
  { arg: '\\Omega+1', val: '\\varepsilon_{\\zeta_0+1}', kind: 'jump', note: { en: 'Ω < Ω+1, so ψ(Ω) = ζ₀ becomes a brick!', zh: 'Ω < Ω+1，于是 ψ(Ω) = ζ₀ 成了砖块！' } },
  { arg: '\\Omega+2', val: '\\varepsilon_{\\zeta_0+2}', kind: 'climb', note: { en: 'climbing again', zh: '重新爬升' } },
  { arg: '\\Omega+\\omega', val: '\\varepsilon_{\\zeta_0+\\omega}', kind: 'climb', note: { en: 'ψ(Ω+α) = ε_{ζ₀+α}', zh: 'ψ(Ω+α) = ε_{ζ₀+α}' } },
  { arg: '\\Omega+\\zeta_0', val: '\\varepsilon_{\\zeta_0\\cdot 2}', kind: 'climb', note: { en: 'ζ₀ is a brick now, so it may be used inside', zh: 'ζ₀ 现在是砖块，可以放进去' } },
  { arg: '\\Omega+\\zeta_1', val: '\\zeta_1', kind: 'climb', note: { en: 'next fixed point of α ↦ ε_{ζ₀+α}', zh: 'α ↦ ε_{ζ₀+α} 的下一个不动点' } },
  { arg: '\\Omega+\\zeta_1+1', val: '\\zeta_1', kind: 'flat', note: { en: 'second plateau', zh: '第二个平台' } },
  { arg: '\\Omega\\cdot 2', val: '\\zeta_1', kind: 'flat', note: { en: 'still ζ₁', zh: '仍是 ζ₁' } },
  { arg: '\\Omega\\cdot 2+1', val: '\\varepsilon_{\\zeta_1+1}', kind: 'jump', note: { en: 'ψ(Ω·2) = ζ₁ is a brick: escape again', zh: 'ψ(Ω·2) = ζ₁ 成了砖块：再次逃出' } },
]
const VALS = Array.from(new Set(STAIRS.map((s) => s.val)))

export function Staircase() {
  const [i, setI] = useState(6)
  const W = 640
  const H = 250
  const x = (k: number) => 30 + (k * (W - 50)) / (STAIRS.length - 1)
  const y = (v: string) => H - 30 - (VALS.indexOf(v) * (H - 60)) / (VALS.length - 1)
  const cur = STAIRS[i]
  const omegaX = x(STAIRS.findIndex((s) => s.arg === '\\Omega'))
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="c08-stairs" role="img" aria-label="ψ staircase">
        <rect x={omegaX - 6} y={8} width={W - omegaX - 10} height={H - 30} fill="rgba(181,155,255,0.07)" />
        <text x={omegaX} y={20} fill="#b59bff" fontSize="12">
          Ω
        </text>
        {STAIRS.map((s, k) => {
          if (k === 0) return null
          const p = STAIRS[k - 1]
          const flat = s.val === p.val
          return <line key={k} x1={x(k - 1)} y1={y(p.val)} x2={x(k)} y2={y(s.val)} stroke={flat ? '#ff7ab6' : s.kind === 'jump' ? '#7dffa8' : '#6be4ff'} strokeWidth={flat ? 4 : 2} strokeDasharray={s.kind === 'jump' ? '5 4' : undefined} />
        })}
        {STAIRS.map((s, k) => (
          <circle key={k} cx={x(k)} cy={y(s.val)} r={k === i ? 7 : 4} fill={k === i ? '#ffd36b' : s.kind === 'flat' ? '#ff7ab6' : '#6be4ff'} style={{ cursor: 'pointer' }} onClick={() => setI(k)} />
        ))}
        <line x1={20} y1={H - 18} x2={W - 10} y2={H - 18} stroke="#2a3563" />
        <text x={24} y={H - 4} fill="#9aa3c7" fontSize="11">
          argument α →
        </text>
        <text x={6} y={16} fill="#9aa3c7" fontSize="11">
          ψ(α) ↑
        </text>
      </svg>
      <Slider value={i} min={0} max={STAIRS.length - 1} onChange={setI} label={<L en="step" zh="步" />} />
      <div className={`readout c08-stair-read ${cur.kind}`}>
        <M t={`\\psi(${cur.arg}) = ${cur.val}`} />
        <div className="small muted">
          <L {...cur.note} />
        </div>
      </div>
      <div className="muted small">
        <L
          en="Schematic: points are evenly spaced, not to scale. Pink = flat (stuck), green dashed = escape."
          zh="示意图：点等距排列，不按比例。粉色 = 平台（卡住），绿色虚线 = 逃出。"
        />
      </div>
    </div>
  )
}
