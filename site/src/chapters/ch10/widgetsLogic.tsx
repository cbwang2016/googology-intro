import { useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import {
  freeVars,
  levels,
  matrixStructure,
  ordinalStructure,
  parseFormula,
  prefixClass,
  primitive,
  sat,
  show,
  trace,
  varTex,
  vStructure,
  type Env,
  type F,
  type Structure,
} from './lib'

/* ------------------------------------------------------------------ */
/* Shared: class badge for a formula                                   */
/* ------------------------------------------------------------------ */
export function classOf(f: F): { tex: string; en: string; zh: string } {
  const { s, p } = levels(f)
  if (s === 0 && p === 0) return { tex: '\\Delta_0', en: 'only bounded quantifiers', zh: '只有有界量词' }
  if (s < p) return { tex: `\\Sigma_{${s}}`, en: `begins with ∃; ${s} alternating block${s > 1 ? 's' : ''}`, zh: `以 ∃ 开头，${s} 个交替量词块` }
  if (p < s) return { tex: `\\Pi_{${p}}`, en: `begins with ∀; ${p} alternating block${p > 1 ? 's' : ''}`, zh: `以 ∀ 开头，${p} 个交替量词块` }
  return { tex: `\\Sigma_{${s}}\\cap\\Pi_{${s}}`, en: `a combination: can be written both ways`, zh: '组合式：两种写法都行' }
}

/* ------------------------------------------------------------------ */
/* 1. Formula lab: Tarski satisfaction on small structures             */
/* ------------------------------------------------------------------ */
type StructKey = 'v3' | 'v4' | 'ord5' | 'loop' | 'custom'

const PRESETS: { en: string; zh: string; src: string }[] = [
  { en: 'x₁ is empty', zh: 'x₁ 是空集', src: '¬∃x2(x2∈x1)' },
  { en: 'x₁ is the numeral 1', zh: 'x₁ 是数 1', src: '(∃x2(x2∈x1) ∧ ¬∃x2(x2∈x1 ∧ ∃x3(x3∈x2)))' },
  { en: 'x₁ is an ordinal', zh: 'x₁ 是序数', src: '∀x2∈x1 ∀x3∈x2 (x3∈x1) ∧ ∀x2∈x1 ∀x3∈x1 (x2∈x3 ∨ x2=x3 ∨ x3∈x2)' },
  { en: 'pairing axiom', zh: '对集公理', src: '∀x1 ∀x2 ∃x3 (x1∈x3 ∧ x2∈x3)' },
  { en: 'extensionality', zh: '外延公理', src: '∀x1 ∀x2 (∀x3 (x3∈x1 ↔ x3∈x2) → x1=x2)' },
  { en: 'foundation', zh: '正则公理', src: '∀x1 (∃x2(x2∈x1) → ∃x2(x2∈x1 ∧ ¬∃x3(x3∈x2 ∧ x3∈x1)))' },
  { en: 'Russell’s set exists', zh: 'Russell 集存在', src: '∃x1 ∀x2 (x2∈x1 ↔ ¬x2∈x2)' },
]

const SYMS = ['∈', '=', '¬', '∧', '∨', '→', '↔', '∃', '∀', '(', ')']

export function FormulaLab() {
  const { t } = useLang()
  const [sk, setSk] = useState<StructKey>('v4')
  const [custom, setCustom] = useState<boolean[][]>([
    [false, true, false],
    [false, false, true],
    [true, false, false],
  ])
  const [src, setSrc] = useState(PRESETS[2].src)
  const [prim, setPrim] = useState(false)
  const [env, setEnv] = useState<Env>({})
  const inputRef = useRef<HTMLInputElement>(null)

  const S: Structure = useMemo(() => {
    if (sk === 'v3') return vStructure(3)
    if (sk === 'v4') return vStructure(4)
    if (sk === 'ord5') return ordinalStructure(5)
    if (sk === 'loop') return matrixStructure(['a'], [[true]])
    return matrixStructure(['a', 'b', 'c'], custom)
  }, [sk, custom])

  let f: F | null = null
  let err = ''
  try {
    f = parseFormula(src)
  } catch (e) {
    err = (e as Error).message
  }
  const fv = f ? freeVars(f) : []
  const envFull: Env = {}
  fv.forEach((v) => (envFull[v] = Math.min(env[v] ?? 0, S.size - 1)))
  const truth = f && S.size > 0 ? sat(S, f, envFull) : null
  const defined = f && fv.length === 1 ? Array.from({ length: S.size }, (_, x) => sat(S, f as F, { [fv[0]]: x })) : null
  const tr = f && S.size > 0 ? trace(S, f, envFull) : []
  const cls = f ? classOf(f) : null

  const insert = (s: string) => {
    const el = inputRef.current
    if (!el) return setSrc(src + s)
    const a = el.selectionStart ?? src.length
    const b = el.selectionEnd ?? src.length
    const next = src.slice(0, a) + s + src.slice(b)
    setSrc(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(a + s.length, a + s.length)
    })
  }

  const structs: [StructKey, string][] = [
    ['v3', 'V₃'],
    ['v4', 'V₄'],
    ['ord5', t('ordinal 5', '序数 5')],
    ['loop', 'a ∈ a'],
    ['custom', t('your own', '自己画')],
  ]

  return (
    <div className="c10-lab">
      <div className="btn-row">
        <span className="muted small c10-lbl">
          <L en="Structure:" zh="结构：" />
        </span>
        {structs.map(([k, name]) => (
          <button key={k} className={`chip ${sk === k ? 'on' : ''}`} onClick={() => setSk(k)}>
            {name}
          </button>
        ))}
      </div>
      <div className="c10-domain">
        {Array.from({ length: S.size }, (_, x) => (
          <span key={x} className={`c10-elem ${defined ? (defined[x] ? 'yes' : 'no') : ''}`}>
            {S.label(x)}
          </span>
        ))}
        {sk === 'custom' && (
          <div className="c10-matrix">
            {['a', 'b', 'c'].map((r, i) =>
              ['a', 'b', 'c'].map((c, j) => (
                <button
                  key={`${i}${j}`}
                  className={`c10-cell ${custom[i][j] ? 'on' : ''}`}
                  onClick={() => setCustom(custom.map((row, ii) => row.map((v, jj) => (ii === i && jj === j ? !v : v))))}
                >
                  {r}
                  {custom[i][j] ? '∈' : '∉'}
                  {c}
                </button>
              )),
            )}
          </div>
        )}
      </div>
      <div className="btn-row">
        {PRESETS.map((p) => (
          <button key={p.src} className={`chip small ${src === p.src ? 'on' : ''}`} onClick={() => setSrc(p.src)}>
            <L en={p.en} zh={p.zh} />
          </button>
        ))}
      </div>
      <input ref={inputRef} className="c10-input mono" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} aria-label="formula" />
      <div className="btn-row c10-syms">
        {SYMS.map((s) => (
          <button key={s} className="chip small" onClick={() => insert(s)}>
            {s}
          </button>
        ))}
        <button className={`chip small ${prim ? 'on' : ''}`} onClick={() => setPrim(!prim)}>
          <L en="only ¬ ∧ ∃" zh="只用 ¬ ∧ ∃" />
        </button>
      </div>
      {err ? (
        <div className="readout c10-err">{t(`Cannot parse: ${err}`, `无法解析：${err}`)}</div>
      ) : (
        f && (
          <>
            <div className="readout c10-formula">
              {prim ? show(primitive(f), false) : show(f)}
              <div className="c10-meta">
                <span>
                  <L en="free variables: " zh="自由变元：" />
                  {fv.length ? fv.map(varTex).join(', ') : t('none (a sentence)', '无（这是一个语句）')}
                </span>
                {cls && (
                  <span>
                    <M t={cls.tex} /> <span className="muted">· {t(cls.en, cls.zh)}</span>
                  </span>
                )}
              </div>
            </div>
            {fv.length > 0 && (
              <div className="btn-row">
                {fv.map((v) => (
                  <label key={v} className="c10-assign">
                    {varTex(v)} ↦{' '}
                    <select value={envFull[v]} onChange={(e) => setEnv({ ...env, [v]: Number(e.target.value) })}>
                      {Array.from({ length: S.size }, (_, x) => (
                        <option key={x} value={x}>
                          {S.label(x)}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            )}
            <div className={`c10-verdict ${truth ? 'yes' : 'no'}`}>
              {fv.length === 0 ? (
                truth ? <L en="TRUE in this structure" zh="在这个结构中为真" /> : <L en="FALSE in this structure" zh="在这个结构中为假" />
              ) : (
                <>
                  {truth ? <L en="satisfied by this assignment" zh="这个赋值满足它" /> : <L en="not satisfied by this assignment" zh="这个赋值不满足它" />}
                  {defined && (
                    <span className="c10-defset">
                      {' · '}
                      <L en="it defines the set " zh="它定义的集合是 " />
                      {'{ '}
                      {defined.map((d, x) => (d ? S.label(x) : null)).filter((x) => x !== null).join(', ') || '∅'}
                      {' }'}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="c10-trace mono small">
              {tr.map((l, i) => (
                <div key={i} style={{ paddingLeft: l.depth * 14 }} className={l.ok ? 'ok' : 'bad'}>
                  {l.ok ? '✓ ' : '✗ '}
                  {l.text
                    .replace('no witness / 无见证', t('no witness', '无见证'))
                    .replace('every value works / 每个值都成立', t('every value works', '每个值都成立'))
                    .replace('(witness / 见证)', t('(witness)', '（见证）'))
                    .replace('(counterexample / 反例)', t('(counterexample)', '（反例）'))}
                </div>
              ))}
            </div>
          </>
        )
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Quantifier classes of famous statements                          */
/* ------------------------------------------------------------------ */
type Famous = { name: { en: string; zh: string }; q: string[]; body: { en: string; zh: string }; status: { en: string; zh: string } }
const FAMOUS: Famous[] = [
  {
    name: { en: 'TREE(3) is finite', zh: 'TREE(3) 有限' },
    q: ['∃'],
    body: { en: '∃N: every tree sequence of length N (a finite list to check) breaks the rule', zh: '∃N：长度为 N 的每个树序列（有限个，可逐一检查）都违规' },
    status: { en: 'true — and therefore provable even in weak arithmetic, by a proof of unimaginable length', zh: '为真——因此连很弱的算术都能证明它，只是证明长得难以想象' },
  },
  {
    name: { en: 'program e halts', zh: '程序 e 停机' },
    q: ['∃'],
    body: { en: '∃t: e has halted after t steps', zh: '∃t：e 在 t 步内停机' },
    status: { en: 'if true, a finite run proves it', zh: '若为真，跑一遍就能证明' },
  },
  {
    name: { en: 'Goldbach', zh: '哥德巴赫猜想' },
    q: ['∀'],
    body: { en: '∀n: n ≤ 2, or n is odd, or ∃p,q < n primes with p+q = n (bounded)', zh: '∀n：n ≤ 2，或 n 为奇数，或存在素数 p,q < n 使 p+q = n（有界）' },
    status: { en: 'open; if false, a single counterexample settles it', zh: '未解决；若为假，一个反例即可推翻' },
  },
  {
    name: { en: 'Con(ZFC)', zh: 'Con(ZFC)' },
    q: ['∀'],
    body: { en: '∀p: p is not a ZFC-proof of 0 = 1 (checking a proof is bounded)', zh: '∀p：p 不是 ZFC 中 0 = 1 的证明（检查证明是有界的）' },
    status: { en: 'believed true; unprovable in ZFC (Gödel II)', zh: '普遍相信为真；ZFC 证不了它（哥德尔第二定理）' },
  },
  {
    name: { en: 'Goodstein’s theorem', zh: 'Goodstein 定理' },
    q: ['∀', '∃'],
    body: { en: '∀n ∃k: the k-th Goodstein term of n is 0', zh: '∀n ∃k：n 的第 k 个 Goodstein 项为 0' },
    status: { en: 'true; unprovable in PA (Kirby–Paris, Ch. 6)', zh: '为真；PA 证不了（Kirby–Paris，第 6 章）' },
  },
  {
    name: { en: 'twin primes', zh: '孪生素数猜想' },
    q: ['∀', '∃'],
    body: { en: '∀n ∃p > n: p and p+2 are both prime', zh: '∀n ∃p > n：p 和 p+2 都是素数' },
    status: { en: 'open; no single finite check can refute it', zh: '未解决；没有任何一次有限检查能推翻它' },
  },
  {
    name: { en: 'P ≠ NP', zh: 'P ≠ NP' },
    q: ['∀', '∀', '∃'],
    body: { en: '∀ program M ∀ degree k ∃ input x: M fails to solve SAT on x within |x|ᵏ+k steps', zh: '∀ 程序 M ∀ 次数 k ∃ 输入 x：M 无法在 |x|ᵏ+k 步内正确解出 x 上的 SAT' },
    status: { en: 'open', zh: '未解决' },
  },
]

export function QuantifierClasses() {
  const { t } = useLang()
  const [pick, setPick] = useState(0)
  const [q, setQ] = useState<string[]>(FAMOUS[0].q)
  const [custom, setCustom] = useState(false)
  const fam = FAMOUS[pick]
  const pc = prefixClass(q)
  const choose = (i: number) => {
    setPick(i)
    setQ(FAMOUS[i].q)
    setCustom(false)
  }
  const meaning: Record<string, [string, string]> = {
    Δ0: ['A finite check: decidable by a computer.', '有限次检查：计算机可判定。'],
    Σ1: ['If true, a single finite witness proves it. Every true Σ₁ sentence is provable in PA.', '若为真，一个有限的见证就能证明它。每个真的 Σ₁ 语句都能在 PA 中证明。'],
    Π1: ['If false, a single finite counterexample refutes it. Truth may be unprovable.', '若为假，一个有限反例就能推翻它。真却可能无法证明。'],
    Σ2: ['“Eventually always”: ∃ a point after which ∀ … holds.', '“从某处起总是”：∃ 一个位置，此后 ∀ 都成立。'],
    Π2: ['“Always eventually”: every input has an answer — totality of a function.', '“对每个都终将”：每个输入都有答案——函数的全定义性。'],
  }
  const key = `${pc.kind}${pc.n}`
  const m = meaning[key] ?? [
    `Each extra alternation is a strictly stronger level: no Σ${pc.n} formula is equivalent to every Π${pc.n} formula.`,
    `每多一次交替，层级就严格变强：Σ${pc.n} 公式不能表达所有 Π${pc.n} 公式。`,
  ]
  return (
    <div>
      <div className="btn-row">
        {FAMOUS.map((x, i) => (
          <button key={i} className={`chip small ${!custom && pick === i ? 'on' : ''}`} onClick={() => choose(i)}>
            <L {...x.name} />
          </button>
        ))}
      </div>
      <div className="c10-prefix">
        {pc.blocks.map((b, i) => (
          <span key={i} className={`c10-block ${b[0] === '∃' ? 'ex' : 'all'}`}>
            {b.join(' ')}
          </span>
        ))}
        <span className="c10-block body">{custom ? t('Δ₀ body', 'Δ₀ 主体') : t(fam.body.en, fam.body.zh)}</span>
      </div>
      <div className="c10-classline">
        <span className="c10-bigclass">
          <M t={pc.kind === 'Δ' ? '\\Delta_0' : `\\${pc.kind === 'Σ' ? 'Sigma' : 'Pi'}_{${pc.n}}`} />
        </span>
        <span>{t(m[0], m[1])}</span>
      </div>
      {!custom && (
        <div className="muted small">
          <L en={<>Status: {fam.status.en}</>} zh={<>现状：{fam.status.zh}</>} />
        </div>
      )}
      <div className="btn-row" style={{ marginTop: 10 }}>
        <span className="muted small c10-lbl">
          <L en="Build your own prefix:" zh="自己拼一个量词前缀：" />
        </span>
        {['∃', '∀'].map((s) => (
          <button
            key={s}
            className="chip"
            disabled={q.length >= 8}
            onClick={() => {
              setCustom(true)
              setQ([...q, s])
            }}
          >
            + {s}
          </button>
        ))}
        <button
          className="chip"
          onClick={() => {
            setCustom(true)
            setQ(q.slice(0, -1))
          }}
        >
          ⌫
        </button>
      </div>
      <div className="muted small">
        <L
          en="Adjacent quantifiers of the same kind merge into one block (∃x∃y says the same as ∃ one pair). Only alternations count."
          zh="相邻的同种量词合并成一个块（∃x∃y 和“∃ 一对数”说的是一回事）。只有交替才算数。"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. V versus L                                                        */
/* ------------------------------------------------------------------ */
const STAGES: { label: string; v: { en: string; zh: string }; l: { en: string; zh: string }; same: boolean; note: { en: string; zh: string } }[] = [
  { label: '0', v: { en: '0', zh: '0' }, l: { en: '0', zh: '0' }, same: true, note: { en: 'Both start from nothing.', zh: '两者都从空无开始。' } },
  { label: '1', v: { en: '1', zh: '1' }, l: { en: '1', zh: '1' }, same: true, note: { en: 'Only ∅.', zh: '只有 ∅。' } },
  { label: '2', v: { en: '2', zh: '2' }, l: { en: '2', zh: '2' }, same: true, note: { en: '∅ and {∅}.', zh: '∅ 和 {∅}。' } },
  { label: '3', v: { en: '4', zh: '4' }, l: { en: '4', zh: '4' }, same: true, note: { en: 'Every subset of a finite set is definable (list its elements).', zh: '有限集合的每个子集都可定义（把元素列出来就行）。' } },
  { label: '4', v: { en: '16', zh: '16' }, l: { en: '16', zh: '16' }, same: true, note: { en: 'Still identical.', zh: '依然相同。' } },
  { label: '5', v: { en: '65536', zh: '65536' }, l: { en: '65536', zh: '65536' }, same: true, note: { en: '2↑↑4 sets — the growth is a tower (Ch. 1).', zh: '2↑↑4 个集合——增长是一座指数塔（第 1 章）。' } },
  { label: 'ω', v: { en: 'ℵ₀ (countable)', zh: 'ℵ₀（可数）' }, l: { en: 'ℵ₀ (countable)', zh: 'ℵ₀（可数）' }, same: true, note: { en: 'V_ω = L_ω: the hereditarily finite sets — the playground of Ch. 13.', zh: 'V_ω = L_ω：所有遗传有限集合——第 13 章的游乐场。' } },
  {
    label: 'ω+1',
    v: { en: '2^ℵ₀ (uncountable)', zh: '2^ℵ₀（不可数）' },
    l: { en: 'ℵ₀ (countable)', zh: 'ℵ₀（可数）' },
    same: false,
    note: {
      en: 'The split. V takes ALL subsets of V_ω (uncountably many, by Cantor). L takes only those defined by a formula with parameters — and there are only countably many formulas.',
      zh: '分岔点。V 取 V_ω 的全部子集（由 Cantor 定理，不可数个）；L 只取能被带参数公式定义的子集——而公式只有可数个。',
    },
  },
  {
    label: 'α',
    v: { en: 'grows by power sets', zh: '靠幂集增长' },
    l: { en: '|L_α| = |α| for infinite α', zh: '无穷 α 时 |L_α| = |α|' },
    same: false,
    note: {
      en: 'Both contain every ordinal (L_α ∩ Ord = α). Gödel (1938): ZFC + V = L is consistent if ZFC is; Cohen (1963): so is V ≠ L.',
      zh: '两者都包含所有序数（L_α ∩ Ord = α）。Gödel（1938）：若 ZFC 一致，则 ZFC + V = L 一致；Cohen（1963）：V ≠ L 也一致。',
    },
  },
]

export function UniverseVL() {
  const { t, pick } = useLang()
  const [k, setK] = useState(7)
  const s = STAGES[k]
  const W = 360
  const H = 230
  const cx = W / 2
  const y = (i: number) => H - 14 - i * 22
  const vHalf = (i: number) => (i <= 6 ? 6 + i * 7 : 6 + 6 * 7 + (i - 6) * 34)
  const lHalf = (i: number) => (i <= 6 ? vHalf(i) - 1 : vHalf(6) - 1 + (i - 6) * 4)
  const pts = (half: (i: number) => number) => {
    const left: string[] = []
    const right: string[] = []
    for (let i = 0; i < STAGES.length; i++) {
      left.push(`${cx - half(i)},${y(i)}`)
      right.unshift(`${cx + half(i)},${y(i)}`)
    }
    return [...left, ...right].join(' ')
  }
  return (
    <div>
      <div className="c10-vl">
        <svg viewBox={`0 0 ${W} ${H}`} className="c10-vl-svg" role="img" aria-label="V and L">
          <polygon points={pts(vHalf)} fill="rgba(255,122,182,0.12)" stroke="#ff7ab6" />
          <polygon points={pts(lHalf)} fill="rgba(107,228,255,0.16)" stroke="#6be4ff" />
          <line x1={cx} y1={y(0)} x2={cx} y2={y(STAGES.length - 1) - 6} stroke="#ffd36b" strokeDasharray="3 3" />
          {STAGES.map((st, i) => (
            <g key={i} onClick={() => setK(i)} style={{ cursor: 'pointer' }}>
              <line x1={cx - vHalf(i)} x2={cx + vHalf(i)} y1={y(i)} y2={y(i)} stroke={i === k ? '#ffd36b' : 'rgba(154,163,199,0.25)'} strokeWidth={i === k ? 2 : 1} />
              <text x={8} y={y(i) + 4} fill={i === k ? '#ffd36b' : '#9aa3c7'} fontSize="11">
                {st.label}
              </text>
            </g>
          ))}
          <text x={cx + vHalf(STAGES.length - 1) - 8} y={y(STAGES.length - 1) - 4} fill="#ff7ab6" fontSize="14" textAnchor="end">
            V
          </text>
          <text x={cx + lHalf(STAGES.length - 1) - 6} y={y(STAGES.length - 1) + 14} fill="#6be4ff" fontSize="14" textAnchor="end">
            L
          </text>
          <text x={cx + 4} y={y(STAGES.length - 1) - 10} fill="#ffd36b" fontSize="10">
            Ord
          </text>
        </svg>
        <div className="c10-vl-panel">
          <div className="stat">
            <span className="stat-label">
              |V<sub>{s.label}</sub>|
            </span>
            <span className="stat-value">{pick(s.v.en, s.v.zh)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">
              |L<sub>{s.label}</sub>|
            </span>
            <span className="stat-value" style={{ color: s.same ? undefined : 'var(--cyan)' }}>
              {pick(s.l.en, s.l.zh)}
            </span>
          </div>
          <p className="small">{t(s.note.en, s.note.zh)}</p>
        </div>
      </div>
      <div className="btn-row">
        <span className="muted small c10-lbl">
          <L en="stage α:" zh="第 α 层：" />
        </span>
        {STAGES.map((st, i) => (
          <button key={i} className={`chip ${i === k ? 'on' : ''}`} onClick={() => setK(i)}>
            {st.label}
          </button>
        ))}
      </div>
    </div>
  )
}
