import { useMemo, useState, useSyncExternalStore } from 'react'
import { L, useLang, type Bi } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { readEn, readZh } from '../../lib/numberWords'
import { cmp, fromNum, mul, powConst, toTex, tower, type Huge } from '../../lib/huge'
import { braces, exhaustive, freeVars, len, natOf, parse, rank, satisfiers, tiles, TooExpensive, V_SIZE, type F, type SearchRow } from './lib'
import { AREAS, PROBLEMS, SEGMENTS, STAIRS, type Problem } from './data'

/* ------------------------------------------------------------------ */
/* 1. Berry's paradox: when does the phrase fit its own budget?         */
/* ------------------------------------------------------------------ */
const zhPhrase = (b: number) => `不能用${readZh(BigInt(b))}个字以内说出的最小自然数`
const enPhrase = (b: number) => `the smallest number that cannot be named in at most ${readEn(BigInt(b))} letters`
const zhLen = (s: string) => [...s].length
const enLen = (s: string) => (s.match(/[a-z]/gi) || []).length

export function BerryBudget() {
  const { mode } = useLang()
  const [lang, setLang] = useState<'zh' | 'en'>(mode === 'en' ? 'en' : 'zh')
  const [b, setB] = useState(12)
  const max = 80
  const phrase = lang === 'zh' ? zhPhrase(b) : enPhrase(b)
  const k = lang === 'zh' ? zhLen(phrase) : enLen(phrase)
  const paradox = k <= b
  const unitEn = lang === 'zh' ? 'characters' : 'letters'
  const unitZh = lang === 'zh' ? '个字' : '个字母'
  const alphabet = lang === 'zh' ? 3500 : 26
  const logCount = b * Math.log10(alphabet)
  const cells = Array.from({ length: max }, (_, i) => {
    const bb = i + 1
    const p = lang === 'zh' ? zhPhrase(bb) : enPhrase(bb)
    return (lang === 'zh' ? zhLen(p) : enLen(p)) <= bb
  })
  const first = cells.indexOf(true) + 1
  return (
    <div>
      <div className="btn-row">
        <button className={`chip ${lang === 'zh' ? 'on' : ''}`} onClick={() => setLang('zh')}>
          <L en="count Chinese characters" zh="按汉字计数" />
        </button>
        <button className={`chip ${lang === 'en' ? 'on' : ''}`} onClick={() => setLang('en')}>
          <L en="count English letters" zh="按英文字母计数" />
        </button>
      </div>
      <Slider value={b} min={1} max={max} onChange={setB} label={<L en="budget B" zh="预算 B" />} />
      <div className="c13-berry-strip" aria-hidden>
        {cells.map((c, i) => (
          <span key={i} className={`${c ? 'bad' : ''} ${i + 1 === b ? 'cur' : ''}`} />
        ))}
      </div>
      <div className="muted small">
        <L
          en={`Red cells: budgets for which the Berry phrase fits inside its own budget. They start at B = ${first}.`}
          zh={`红格：Berry 短语能塞进自己预算的那些 B。从 B = ${first} 开始。`}
        />
      </div>
      <ol className="c13-berry-steps">
        <li>
          <L
            en={<>Phrases of at most {b} {unitEn} are finitely many (fewer than about 10<sup>{Math.ceil(logCount)}</sup>), so they name finitely many numbers.</>}
            zh={<>不超过 {b} {unitZh}的短语只有有限多个（不到约 10<sup>{Math.ceil(logCount)}</sup> 个），所以它们只能说出有限多个数。</>}
          />
        </li>
        <li>
          <L en="So some number is not among them; let N be the smallest. N exists." zh="于是总有数不在其中；记其中最小的为 N。N 是存在的。" />
        </li>
        <li>
          <span className="c13-phrase">“{phrase}”</span>{' '}
          <span className="mono">
            = {k} <L en={unitEn} zh={unitZh} />
          </span>
        </li>
      </ol>
      <div className={`readout ${paradox ? 'c13-bad' : 'c13-ok'}`}>
        {paradox ? (
          <L
            en={<>{k} ≤ {b}: this phrase is itself within budget and names N — so N <b>is</b> nameable within {b} {unitEn}. Contradiction.</>}
            zh={<>{k} ≤ {b}：这句话本身就在预算之内，而且说出了 N——所以 N <b>能</b>在 {b} {unitZh}以内说出。矛盾！</>}
          />
        ) : (
          <L
            en={<>{k} &gt; {b}: the phrase is too long to count. No contradiction yet — N is simply named by a longer phrase.</>}
            zh={<>{k} &gt; {b}：这句话超出了预算，不算数。暂时没有矛盾——N 只是被一句更长的话说出来了而已。</>}
          />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shared formula state for the workbench and the evaluator             */
/* ------------------------------------------------------------------ */
export const PRESETS: { id: string; src: string; name: Bi<string> }[] = [
  { id: 'zero', src: '¬∃b(b∈a)', name: { en: 'names 0', zh: '命名 0' } },
  { id: 'one', src: '∃b(b∈a) ∧ ¬∃b(b∈a ∧ ∃c(c∈b))', name: { en: 'names 1', zh: '命名 1' } },
  { id: 'one-sugar', src: '∃b(b∈a) ∧ ∀b(b∈a → ∀c(c∉b))', name: { en: '1 with ∀ and →', zh: '用 ∀、→ 写的 1' } },
  { id: 'two', src: '∃b∃c(c∈b ∧ b∈a ∧ c∈a) ∧ ¬∃d∃b∃c(d∈c ∧ c∈b ∧ b∈a)', name: { en: 'names 2', zh: '命名 2' } },
  { id: 'three', src: '∃b∃c∃d(d∈c ∧ c∈b ∧ b∈a ∧ ¬∃e∃f∃g∃h(f∈e ∧ e∈a ∧ ¬(f∈a ∧ ¬(h∈g ∧ g∈f) ∧ d∈e)))', name: { en: 'names 3 (book)', zh: '命名 3（书中）' } },
  { id: 'lonely', src: '¬∃b(a∈b)', name: { en: '“belongs to nothing”', zh: '“不属于任何集合”' } },
  { id: 'mirage', src: '∃b∃c(a∈b ∧ c∈a)', name: { en: '“nonempty and belongs to something”', zh: '“非空且属于某个集合”' } },
  { id: 'univ', src: '∀b(b∈a)', name: { en: '“contains everything”', zh: '“包含一切”' } },
]

let current = PRESETS[0].src
const subs = new Set<() => void>()
function useFormula(): [string, (s: string) => void] {
  const v = useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => current,
  )
  return [
    v,
    (s: string) => {
      current = s
      subs.forEach((f) => f())
    },
  ]
}

function PresetChips({ src, set }: { src: string; set: (s: string) => void }) {
  return (
    <div className="btn-row">
      {PRESETS.map((p) => (
        <button key={p.id} className={`chip ${src === p.src ? 'on' : ''}`} onClick={() => set(p.src)}>
          <L {...p.name} />
        </button>
      ))}
    </div>
  )
}

function counts(f: F) {
  const c = { atom: 0, not: 0, and: 0, ex: 0 }
  const go = (g: F) => {
    if (g.k === 'in' || g.k === 'eq') c.atom++
    else if (g.k === 'not') (c.not++, go(g.a))
    else if (g.k === 'and') (c.and++, go(g.a), go(g.b))
    else (c.ex++, go(g.a))
  }
  go(f)
  return c
}

const tileClass = (s: string) =>
  s.startsWith('x') ? 'v' : s === '∈' || s === '=' ? 'r' : s === '¬' ? 'n' : s === '∧' ? 'a' : s === '∃' ? 'e' : 'p'

/* ------------------------------------------------------------------ */
/* 2. Workbench: parse, expand abbreviations, count symbols            */
/* ------------------------------------------------------------------ */
export function SymbolCounter() {
  const { t } = useLang()
  const [src, setSrc] = useFormula()
  const res = useMemo(() => parse(src), [src])
  return (
    <div>
      <PresetChips src={src} set={setSrc} />
      <input
        className="c13-input mono"
        value={src}
        spellCheck={false}
        onChange={(e) => setSrc(e.target.value)}
        aria-label={t('formula', '公式')}
      />
      <div className="muted small">
        <L
          en="Type ¬ ∧ ∃ ∈ = (or ~ & E in =); a = x₁ is the free variable, b = x₂, c = x₃, … Abbreviations ∀ ∨ → ↔ ∉ ≠ are allowed and get expanded."
          zh="可以输入 ¬ ∧ ∃ ∈ =（或 ~ & E in =）；a 即自由变元 x₁，b = x₂，c = x₃，……也可以用缩写 ∀ ∨ → ↔ ∉ ≠，它们会被展开。"
        />
      </div>
      {!res.ok ? (
        <div className="readout c13-bad">
          <L {...res.err} />
        </div>
      ) : (
        <SymbolTiles f={res.f} sugar={res.sugar} />
      )}
    </div>
  )
}

function SymbolTiles({ f, sugar }: { f: F; sugar: string[] }) {
  const tl = tiles(f)
  const c = counts(f)
  const total = len(f)
  return (
    <>
      <div className="c13-tiles">
        {tl.map((s, i) => (
          <span key={i} className={`c13-tile ${tileClass(s)}`}>
            {s}
          </span>
        ))}
      </div>
      <div className="row" style={{ alignItems: 'baseline' }}>
        <div className="stat">
          <span className="stat-label">
            <L en="length" zh="长度" />
          </span>
          <span className="stat-value" style={{ fontSize: '1.6em' }}>
            {total}
          </span>
        </div>
        <M t={`3\\cdot${c.atom}_{\\,\\text{atoms}}+3\\cdot${c.not}_{\\,{\\neg}}+3\\cdot${c.and}_{\\,{\\wedge}}+4\\cdot${c.ex}_{\\,{\\exists}}=${total}`} />
      </div>
      {sugar.length > 0 && (
        <div className="muted small" style={{ marginTop: 6 }}>
          <L
            en={<>Abbreviations expanded: {sugar.join(' ')}. Each ∀ costs +10 once unfolded to ¬∃¬, each ∨ costs +12, each → costs +9.</>}
            zh={<>已展开的缩写：{sugar.join(' ')}。每个 ∀ 展开成 ¬∃¬ 要多花 10 个符号，∨ 多花 12 个，→ 多花 9 个。</>}
          />
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Evaluate a formula in V_1 … V_4                                   */
/* ------------------------------------------------------------------ */
type Verdict = { kind: 'error'; msg: Bi<string> } | { kind: 'slow' } | { kind: 'ok'; sats: number[] }

function evalIn(f: F, k: number): Verdict {
  const fv = freeVars(f)
  for (const v of fv)
    if (v !== 1)
      return { kind: 'error', msg: { en: `x${v} is free; only x₁ may be free`, zh: `x${v} 是自由变元；只允许 x₁ 自由` } }
  try {
    return { kind: 'ok', sats: satisfiers(f, k) }
  } catch (e) {
    if (e instanceof TooExpensive) return { kind: 'slow' }
    throw e
  }
}

function verdictText(v: Verdict, k: number): Bi<string> {
  if (v.kind === 'error') return v.msg
  if (v.kind === 'slow') return { en: 'too many cases to check here', zh: '情形太多，这里不算了' }
  const s = v.sats
  if (s.length === 0) return { en: 'satisfied by nothing', zh: '没有集合满足' }
  if (s.length > 1 && s.length === V_SIZE[k]) return { en: 'satisfied by everything', zh: '所有集合都满足' }
  if (s.length > 1) return { en: `satisfied by ${s.length} sets`, zh: `有 ${s.length} 个集合满足` }
  const n = natOf(s[0])
  return n === null
    ? { en: `defines the single set ${braces(s[0])} (not a number)`, zh: `恰好定义了集合 ${braces(s[0])}（不是自然数）` }
    : { en: `names ${n}`, zh: `命名了 ${n}` }
}

function setLabel(code: number) {
  const n = natOf(code)
  return n !== null ? String(n) : braces(code)
}

export function VkEvaluator() {
  const { t } = useLang()
  const [src, setSrc] = useFormula()
  const [k, setK] = useState(4)
  const res = useMemo(() => parse(src), [src])
  const all = useMemo(() => (res.ok ? [1, 2, 3, 4].map((kk) => evalIn(res.f, kk)) : null), [res])
  const v = all?.[k - 1]
  const sats = v && v.kind === 'ok' ? new Set(v.sats) : new Set<number>()
  const byRank: number[][] = [[], [], [], []]
  for (let c = 0; c < V_SIZE[k]; c++) byRank[rank(c)].push(c)
  return (
    <div>
      <PresetChips src={src} set={setSrc} />
      <input className="c13-input mono" value={src} spellCheck={false} onChange={(e) => setSrc(e.target.value)} aria-label={t('formula', '公式')} />
      <div className="btn-row">
        {[1, 2, 3, 4].map((kk) => (
          <button key={kk} className={`chip ${k === kk ? 'on' : ''}`} onClick={() => setK(kk)}>
            <M t={`V_${kk}`} /> <span className="muted small">({V_SIZE[kk]})</span>
          </button>
        ))}
      </div>
      {!res.ok ? (
        <div className="readout c13-bad">
          <L {...res.err} />
        </div>
      ) : (
        <>
          <div className="c13-vk">
            {byRank.map((row, r) =>
              row.length ? (
                <div key={r} className="c13-vk-row">
                  <span className="c13-vk-rank">
                    <L en={`rank ${r}`} zh={`秩 ${r}`} />
                  </span>
                  {row.map((c) => (
                    <span key={c} className={`c13-set ${sats.has(c) ? 'on' : ''} ${natOf(c) !== null ? 'nat' : ''}`} title={braces(c)}>
                      {setLabel(c)}
                    </span>
                  ))}
                </div>
              ) : null,
            )}
          </div>
          <div className="readout">
            <M t={`V_${k}`} />: <L {...verdictText(v!, k)} />
          </div>
          <div className="c13-across">
            {all!.map((vv, i) => (
              <span key={i} className={`c13-across-cell ${i + 1 === k ? 'cur' : ''}`}>
                <M t={`V_${i + 1}`} />: <L {...verdictText(vv, i + 1)} />
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Exhaustive search over all short formulas                        */
/* ------------------------------------------------------------------ */
export function TinySearch() {
  const [maxL, setMaxL] = useState(17)
  const [rows, setRows] = useState<SearchRow[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [sel, setSel] = useState<number | null>(null)
  const run = () => {
    setBusy(true)
    setTimeout(() => {
      const r = exhaustive(maxL)
      setRows(r)
      setBusy(false)
      const firstHit = r.find((x) => x.namers.length > 0)
      setSel(firstHit ? firstHit.L : null)
    }, 30)
  }
  const shown = rows?.filter((r) => r.total > 0)
  const selRow = rows?.find((r) => r.L === sel)
  return (
    <div>
      <div className="row">
        <Slider value={maxL} min={9} max={19} onChange={setMaxL} label={<L en="search every length up to" zh="穷举到长度" />} />
        <button className="btn small" onClick={run} disabled={busy}>
          {busy ? <L en="searching…" zh="搜索中……" /> : <L en="Run the search" zh="开始穷举" />}
        </button>
      </div>
      {shown && (
        <div className="scroll-x">
          <table className="grid c13-search">
            <thead>
              <tr>
                <th>
                  <L en="length" zh="长度" />
                </th>
                <th>
                  <L en="formulas" zh="公式数" />
                </th>
                <th>
                  <L en="only x₁ free" zh="仅 x₁ 自由" />
                </th>
                <th>
                  <L en="unique in V₃" zh="在 V₃ 中唯一" />
                </th>
                <th>
                  <L en="…still unique in V₄" zh="……在 V₄ 中仍唯一" />
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const stable = r.namers.filter((n) => n.v4.length === 1 && n.v4[0] === n.v3).length
                return (
                  <tr key={r.L} className={`${r.L === sel ? 'row-on' : ''} ${r.namers.length ? 'c13-click' : ''}`} onClick={() => r.namers.length && setSel(r.L)}>
                    <td className="mono">{r.L}</td>
                    <td className="mono">{r.total.toLocaleString('en-US')}</td>
                    <td className="mono">{r.onlyX1.toLocaleString('en-US')}</td>
                    <td className="mono">{r.namers.length || '·'}</td>
                    <td className="mono">{r.namers.length ? stable : '·'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {selRow && (
        <div className="c13-namers">
          {selRow.namers.slice(0, 5).map((n, i) => {
            const stable = n.v4.length === 1 && n.v4[0] === n.v3
            return (
              <div key={i} className="mono small">
                {n.f}{' '}
                <span className={stable ? 'c13-good-t' : 'c13-bad-t'}>
                  {stable ? (
                    <L en={`→ ${setLabel(n.v3)} in V₃ and V₄`} zh={`→ 在 V₃、V₄ 中都是 ${setLabel(n.v3)}`} />
                  ) : (
                    <L en={`→ ${setLabel(n.v3)} in V₃, but ${n.v4.length} sets in V₄: a mirage`} zh={`→ 在 V₃ 中是 ${setLabel(n.v3)}，在 V₄ 中却有 ${n.v4.length} 个集合：海市蜃楼`} />
                  )}
                </span>
              </div>
            )
          })}
          {selRow.namers.length > 5 && <div className="muted small">… +{selRow.namers.length - 5}</div>}
        </div>
      )}
      {!rows && (
        <div className="muted small">
          <L
            en="Uses variables x₁, x₂, x₃ only — enough for every formula up to length 19 with x₁ as the only free variable."
            zh="只用变量 x₁、x₂、x₃——对长度不超过 19、只有 x₁ 自由的公式来说，三个变量已经足够。"
          />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. The staircase: best known lower bound for a given budget          */
/* ------------------------------------------------------------------ */
function bestBound(N: number): { tex: string; status: 'proved' | 'folklore' } {
  if (N < 10) return { tex: '\\mathrm{Rayo}(N)=0', status: 'proved' }
  if (N < 20) return { tex: '\\mathrm{Rayo}(N)=1', status: 'proved' }
  if (N < 30) return { tex: '\\mathrm{Rayo}(N)\\ge1', status: 'proved' }
  if (N < 56) return { tex: '\\mathrm{Rayo}(N)\\ge2', status: 'proved' }
  if (N < 88) return { tex: '\\mathrm{Rayo}(N)\\ge3', status: 'proved' }
  if (N >= 7339) return { tex: '\\mathrm{Rayo}(N)>S(2^{65536}-1)', status: 'folklore' }
  const lin = Math.floor((N - 34) / 20)
  const k = Math.floor((N - 260) / 20)
  if (k >= 3) {
    const t = k === 3 ? '16' : k === 4 ? '65536' : k === 5 ? '2^{65536}' : `2\\uparrow\\uparrow${k}`
    return { tex: `\\mathrm{Rayo}(N)>${t}`, status: 'folklore' }
  }
  if (lin > 3) return { tex: `\\mathrm{Rayo}(N)>${lin}`, status: 'folklore' }
  return { tex: '\\mathrm{Rayo}(N)\\ge4', status: 'proved' }
}

export function RayoStaircase() {
  const { t } = useLang()
  const [p, setP] = useState(2.0)
  const N = Math.round(Math.pow(10, p))
  const Ntex = p <= 6 ? N.toLocaleString('en-US').replace(/,/g, '{,}') : `10^{${p.toFixed(1)}}`
  const bb = bestBound(N)
  const W = 640
  const x = (q: number) => 20 + (q / 100) * (W - 40)
  const marks = STAIRS.filter((s) => s.at > 0)
  const cur = [...STAIRS].reverse().find((st) => st.at <= N)
  return (
    <div>
      <Slider value={p} min={0} max={100} step={0.1} onChange={setP} label={<M t="\log_{10}N" />} />
      <div className="scroll-x">
      <svg viewBox={`0 0 ${W} 120`} className="c13-stair-svg" role="img" aria-label={t('symbol budget on a log scale', '对数刻度上的符号预算')}>
        <line x1={20} y1={70} x2={W - 20} y2={70} stroke="var(--line)" strokeWidth={2} />
        <rect x={x(0)} y={62} width={x(Math.log10(7339)) - x(0)} height={16} fill="rgba(255,211,107,0.25)" />
        {marks.map((s, i) => {
          const q = Math.log10(s.at)
          return (
            <g key={i}>
              <line x1={x(q)} y1={58} x2={x(q)} y2={82} stroke="var(--gold)" strokeWidth={1.5} />
              {(s.at === 1e100 || s.at === 7339 || s.at === 10) && (
                <text x={x(q)} y={s.at === 7339 ? 100 : 50} fill="var(--muted)" fontSize={12} textAnchor={s.at === 1e100 ? 'end' : 'middle'}>
                  {s.n}
                </text>
              )}
            </g>
          )
        })}
        <circle cx={x(p)} cy={70} r={7} fill="var(--cyan)" />
        <text x={x(Math.min(p, 88))} y={22} fill="var(--cyan)" fontSize={13}>
          N
        </text>
        <text x={x(50)} y={112} fill="var(--dim)" fontSize={12} textAnchor="middle">
          {t('everything known is in the yellow sliver on the left', '已知的一切都挤在左边那一小段黄色里')}
        </text>
      </svg>
      </div>
      <div className="readout">
        <M t={`N=${Ntex}:\\quad ${bb.tex}`} />{' '}
        <span className={`status status-${bb.status}`}>
          {bb.status === 'proved' ? <L en="book: exhaustive / explicit" zh="书中：穷举或显式构造" /> : <L en="book: explicit formulas, community-checked" zh="书中：显式公式，社区验证" />}
        </span>
      </div>
      {cur && (
        <div className="muted small" style={{ margin: '6px 0' }}>
          <L {...cur.note} />
        </div>
      )}
      <div className="btn-row">
        {STAIRS.map((st, i) => (
          <button key={i} className={`chip c13-stair ${st.at <= N ? 'lit' : ''} ${st === cur ? 'on' : ''}`} onClick={() => setP(st.at === 0 ? 0 : Math.min(100, Math.log10(st.at)))}>
            {st.n}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Diagonal forge: one function beats any family you assemble        */
/* ------------------------------------------------------------------ */
type Val = { kind: 'h'; v: Huge } | { kind: 'beyond'; tex: string }
type Fn = { id: string; tex: string; rank: number; at: (n: number) => Val }

const h = (x: number): Val => ({ kind: 'h', v: fromNum(x) })
const f2 = (x: Huge): Huge => mul(x, powConst(2, x))
const FNS: Fn[] = [
  { id: 'succ', tex: 'n+1', rank: 0, at: (n) => h(n + 1) },
  { id: 'sq', tex: 'n^2', rank: 1, at: (n) => h(n * n) },
  { id: 'exp', tex: '2^n', rank: 2, at: (n) => h(2 ** n) },
  { id: 'fact', tex: 'n!', rank: 3, at: (n) => h([1, 1, 2, 6, 24, 120, 720][n]) },
  { id: 'tet', tex: '2\\uparrow\\uparrow n', rank: 4, at: (n) => ({ kind: 'h', v: tower(Array(n).fill(2)) }) },
  {
    id: 'ack', tex: '3\\uparrow^{n}3', rank: 5,
    at: (n) => (n === 1 ? h(27) : n === 2 ? h(7625597484987) : { kind: 'beyond', tex: `3\\uparrow^{${n}}3` }),
  },
  {
    id: 'fw', tex: 'f_\\omega(n)', rank: 6,
    at: (n) => (n === 1 ? h(2) : n === 2 ? h(8) : n === 3 ? { kind: 'h', v: f2(f2(f2(fromNum(3)))) } : { kind: 'beyond', tex: `f_{${n}}(${n})` }),
  },
  {
    id: 'bb', tex: 'S(n)', rank: 7,
    at: (n) => (n <= 5 ? h([0, 1, 6, 21, 107, 47176870][n]) : { kind: 'beyond', tex: `S(${n})` }),
  },
]
const COLS = [1, 2, 3, 4, 5, 6]

function valTex(v: Val) {
  return v.kind === 'h' ? toTex(v.v) : v.tex
}

export function DiagonalForge() {
  const [fam, setFam] = useState<string[]>(['bb', 'exp', 'succ', 'tet'])
  const rows = fam.map((id) => FNS.find((f) => f.id === id)!)
  const toggle = (id: string) => setFam((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 6 ? cur : [...cur, id]))
  // d(n) = 1 + max_{i < n} f_i(n): row i is beaten from column n = i+1 on.
  const diag = COLS.map((n) => {
    const used = rows.slice(0, n).map((f, i) => ({ i, v: f.at(n) }))
    if (used.length === 0) return { tex: '1', arg: -1 }
    const beyond = used.filter((u) => u.v.kind === 'beyond')
    if (beyond.length === 0) {
      let best = used[0]
      for (const u of used) if (cmp((u.v as { v: Huge }).v, (best.v as { v: Huge }).v) > 0) best = u
      const bv = (best.v as { v: Huge }).v
      return { tex: bv.h === 0 && bv.x < 1e15 ? String(bv.x + 1) : `1+${toTex(bv)}`, arg: best.i }
    }
    if (beyond.length === 1) return { tex: `1+${valTex(beyond[0].v)}`, arg: beyond[0].i }
    return { tex: `1+\\max\\{${beyond.map((u) => valTex(u.v)).join(',')}\\}`, arg: -2 }
  })
  return (
    <div>
      <div className="btn-row">
        {FNS.map((f) => (
          <button key={f.id} className={`chip ${fam.includes(f.id) ? 'on' : ''}`} onClick={() => toggle(f.id)}>
            <M t={f.tex} />
          </button>
        ))}
      </div>
      <div className="scroll-x">
        <table className="grid c13-forge">
          <thead>
            <tr>
              <th />
              {COLS.map((n) => (
                <th key={n}>
                  <M t={`n=${n}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((f, i) => (
              <tr key={f.id}>
                <th>
                  <M t={`f_{${i}}=${f.tex}`} />
                </th>
                {COLS.map((n) => {
                  const counted = i < n
                  const top = diag[n - 1].arg === i || (diag[n - 1].arg === -2 && counted && f.at(n).kind === 'beyond')
                  return (
                    <td key={n} className={`${counted ? 'c13-in' : 'c13-out'} ${top ? 'c13-top' : ''}`}>
                      <M t={valTex(f.at(n))} />
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr className="c13-drow">
              <th>
                <M t="g(n)" />
              </th>
              {diag.map((d, i) => (
                <td key={i}>
                  <M t={d.tex} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="muted small">
        <L
          en={<><M t="g(n)=1+\max_{i<n}f_i(n)" />. Shaded cells are the ones g looks at; row <M t="i" /> is beaten in every column <M t="n>i" />. Put the rows in any order — even with the uncomputable <M t="S(n)" /> on top, g still wins eventually.</>}
          zh={<><M t="g(n)=1+\max_{i<n}f_i(n)" />。有底色的格子是 g 要看的；第 <M t="i" /> 行在所有 <M t="n>i" /> 的列都被超过。行的顺序随便排——哪怕把不可计算的 <M t="S(n)" /> 放在最上面，g 最终也照赢不误。</>}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 7. The whole journey: a zoomable ruler                               */
/* ------------------------------------------------------------------ */
export function JourneyRuler() {
  const { t } = useLang()
  const [seg, setSeg] = useState<number | null>(null)
  const [pick, setPick] = useState<[number, number]>([5, 2])
  const W = 700
  const segW = (W - 60) / SEGMENTS.length
  const mark = SEGMENTS[pick[0]].marks[pick[1]]
  return (
    <div>
      <div className="btn-row">
        <button className={`chip ${seg === null ? 'on' : ''}`} onClick={() => setSeg(null)}>
          <L en="whole ruler" zh="整把尺子" />
        </button>
        {SEGMENTS.map((s, i) => (
          <button key={i} className={`chip ${seg === i ? 'on' : ''}`} onClick={() => setSeg(i)}>
            <L {...s.title} />
          </button>
        ))}
      </div>
      <div className="scroll-x">
      <svg viewBox={`0 0 ${W} 120`} className="c13-ruler-svg" role="img" aria-label={t('the ruler of growth', '增长之尺')}>
        <defs>
          <linearGradient id="c13-horizon" x1="0" x2="1">
            <stop offset="0" stopColor="var(--pink)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--pink)" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect x={W - 70} y={20} width={60} height={80} fill="url(#c13-horizon)" />
        <line x1={W - 14} y1={14} x2={W - 14} y2={106} stroke="var(--pink)" strokeDasharray="4 4" />
        <line x1={20} y1={60} x2={W - 14} y2={60} stroke="var(--line)" strokeWidth={2} />
        {seg === null
          ? SEGMENTS.map((s, i) => {
              const x0 = 20 + i * segW
              const n = s.marks.length
              return (
                <g key={i} className="c13-click" onClick={() => setSeg(i)}>
                  <rect x={x0 + 2} y={48} width={segW - 4} height={24} rx={6} fill={s.color} opacity={0.18} />
                  {s.marks.map((_m, j) => {
                    // squeeze marks towards the right end of each segment, like 1 − 2^{−j}
                    const xx = x0 + 6 + (segW - 12) * (1 - Math.pow(0.55, j + 0.6))
                    const on = pick[0] === i && pick[1] === j
                    return (
                      <g key={j} onClick={(e) => (e.stopPropagation(), setPick([i, j]))}>
                        <line x1={xx} y1={52} x2={xx} y2={68} stroke={s.color} strokeWidth={on ? 3 : 1.5} />
                        {j === n - 1 && (
                          <text x={xx} y={92} fontSize={11} fill="var(--muted)" textAnchor="middle">
                            Ch {s.ch}
                          </text>
                        )}
                      </g>
                    )
                  })}
                  <text x={x0 + segW / 2} y={36} fontSize={11.5} fill={s.color} textAnchor="middle">
                    {t(s.title.en, s.title.zh).split(' · ')[0]}
                  </text>
                </g>
              )
            })
          : SEGMENTS[seg].marks.map((_m, j) => {
              const n = SEGMENTS[seg].marks.length
              const xx = 60 + ((W - 160) * j) / Math.max(1, n - 1)
              const on = pick[0] === seg && pick[1] === j
              return (
                <g key={j} className="c13-click" onClick={() => setPick([seg, j])}>
                  <circle cx={xx} cy={60} r={on ? 11 : 8} fill={SEGMENTS[seg].color} opacity={on ? 1 : 0.6} />
                  <text x={xx} y={92} fontSize={12} fill="var(--text)" textAnchor="middle">
                    {j + 1}
                  </text>
                </g>
              )
            })}
        <text x={W - 16} y={118} fontSize={12} fill="var(--pink)" textAnchor="end">
          ω₁
        </text>
      </svg>
      </div>
      {seg !== null && (
        <div className="btn-row">
          {SEGMENTS[seg].marks.map((m, j) => (
            <button key={j} className={`chip ${pick[0] === seg && pick[1] === j ? 'on' : ''}`} onClick={() => setPick([seg, j])}>
              {j + 1}. <M t={m.tex} />
            </button>
          ))}
        </div>
      )}
      <div className="c13-mark-card" style={{ borderColor: SEGMENTS[pick[0]].color }}>
        <div className="c13-mark-tex">
          <M t={mark.tex} />
        </div>
        <div>
          <div>
            <b>
              <L {...mark.name} />
            </b>{' '}
            <span className="muted small">
              <L en={`Chapter ${mark.ch}`} zh={`第 ${mark.ch} 章`} />
            </span>
          </div>
          <div className="muted">
            <L {...mark.example} />
          </div>
        </div>
      </div>
      <div className="muted small">
        <L
          en="Not to scale — no scale exists past ω. Every mark is a countable ordinal; the pink band is the horizon ω₁."
          zh="不按比例——过了 ω 就没有“比例”可言。每个刻度都是可数序数；粉色的带子是地平线 ω₁。"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 8. Open problems across the whole course                             */
/* ------------------------------------------------------------------ */
const ACTS: { name: Bi<string>; chs: number[] }[] = [
  { name: { en: 'all', zh: '全部' }, chs: [] },
  { name: { en: 'Acts I–II (Ch 1–6)', zh: '第一、二幕（1–6 章）' }, chs: [1, 2, 3, 4, 5, 6] },
  { name: { en: 'Act III (Ch 7–9)', zh: '第三幕（7–9 章）' }, chs: [7, 8, 9] },
  { name: { en: 'Act IV (Ch 10)', zh: '第四幕（10 章）' }, chs: [10] },
  { name: { en: 'Act V (Ch 11–13)', zh: '第五幕（11–13 章）' }, chs: [11, 12, 13] },
]

export function OpenProblemExplorer() {
  const [act, setAct] = useState(0)
  const [area, setArea] = useState<Problem['area'] | null>(null)
  const list = PROBLEMS.filter((p) => (act === 0 || ACTS[act].chs.includes(p.ch)) && (area === null || p.area === area))
  const [sel, setSel] = useState(0)
  const cur = list[Math.min(sel, list.length - 1)]
  return (
    <div>
      <div className="btn-row">
        {ACTS.map((a, i) => (
          <button key={i} className={`chip ${act === i ? 'on' : ''}`} onClick={() => (setAct(i), setSel(0))}>
            <L {...a.name} />
          </button>
        ))}
      </div>
      <div className="btn-row">
        {AREAS.map((a) => (
          <button key={a.id} className={`chip ${area === a.id ? 'on' : ''}`} onClick={() => (setArea(area === a.id ? null : a.id), setSel(0))}>
            <L {...a.name} />
          </button>
        ))}
      </div>
      <div className="c13-op">
        <ul className="c13-op-list">
          {list.map((p, i) => (
            <li key={p.title.en}>
              <button className={p === cur ? 'on' : ''} onClick={() => setSel(i)}>
                <span className="c13-op-ch">{p.ch}</span>
                <L {...p.title} />
                {p.status === 'conjecture' && <span className="c13-op-conj">?</span>}
              </button>
            </li>
          ))}
        </ul>
        {cur ? (
          <div className="c13-op-card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <b>
                <L {...cur.title} />
              </b>
              <span className={`status status-${cur.status}`}>
                {cur.status === 'open' ? <L en="Open problem" zh="未解决" /> : <L en="Conjecture" zh="猜想" />}
              </span>
            </div>
            <p>
              <L {...cur.body} />
            </p>
            <div className="muted small">
              <L en={`From Chapter ${cur.ch}`} zh={`见第 ${cur.ch} 章`} />
            </div>
          </div>
        ) : (
          <div className="muted">
            <L en="Nothing in this corner." zh="这个角落里没有条目。" />
          </div>
        )}
      </div>
      <div className="muted small">
        <L en={`${list.length} of ${PROBLEMS.length} problems shown.`} zh={`显示 ${list.length} / ${PROBLEMS.length} 个问题。`} />
      </div>
    </div>
  )
}
