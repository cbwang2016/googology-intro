import { useMemo, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { clearTags, count, cut, height, leaves, OMEGA_LABEL, parse, ROOT, toBrackets, toPsi, type CutRule, type HNode } from './hydra'
import { A, annotate, classify, fs, Mu, N, O, OW, P, p, plain, pred, Pw, toTex, W, type E, type StepInfo } from './psi'

/* ================================================================== */
/* 4. The folding stepper                                              */
/* ================================================================== */
const Om = O(1)
const EPS1: E = { t: 'psi', m: 1, a: N(0), alias: '\\varepsilon_{\\Omega+1}' }
const PSI1_0: E = { t: 'psi', m: 1, a: N(0) }

export type Preset = { e: E; tex: string; name?: string }

/** Known values (MOCF), keyed by the plain TeX our engine prints. */
const KNOWN: [E, string][] = [
  [p(N(0)), '\\varepsilon_0'],
  [p(N(1)), '\\varepsilon_1'],
  [p(W), '\\varepsilon_\\omega'],
  [p(p(N(0))), '\\varepsilon_{\\varepsilon_0}'],
  [p(p(p(N(0)))), '\\varepsilon_{\\varepsilon_{\\varepsilon_0}}'],
  [p(Om), '\\zeta_0'],
  [p(A(Om, N(1))), '\\varepsilon_{\\zeta_0+1}'],
  [p(A(Om, p(Om))), '\\varepsilon_{\\zeta_0\\cdot 2}'],
  [p(A(Om, Om)), '\\zeta_1'],
  [p(Mu(Om, N(2))), '\\zeta_1'],
  [p(A(A(Om, Om), Om)), '\\zeta_2'],
  [p(Mu(Om, p(Om))), '\\zeta_{\\zeta_0}'],
  [p(Mu(Om, p(Mu(Om, p(Om))))), '\\zeta_{\\zeta_{\\zeta_0}}'],
  [p(Mu(Om, Om)), '\\eta_0'],
  [p(Pw(Om, N(2))), '\\eta_0'],
  [p(Pw(Om, N(3))), '\\varphi(4,0)'],
  [p(Pw(Om, W)), '\\varphi(\\omega,0)'],
  [p(Pw(Om, Om)), '\\Gamma_0'],
  [p(Pw(Om, p(Om))), '\\varphi(\\zeta_0,0)'],
  [p(Pw(Om, p(Pw(Om, p(Om))))), '\\varphi(\\varphi(\\zeta_0,0),0)'],
  [p(A(Pw(Om, Om), Om)), '\\varphi(2,\\Gamma_0+1)'],
  [p(A(Pw(Om, Om), Pw(Om, Om))), '\\Gamma_1'],
  [p(Mu(Pw(Om, Om), Om)), '\\varphi(1,1,0)'],
  [p(Pw(Om, A(Om, N(1)))), '\\varphi(1,1,0)'],
  [p(Pw(Om, Mu(Om, Om))), '\\varphi(1,0,0,0)'],
  [p(Pw(Om, Pw(Om, N(2)))), '\\varphi(1,0,0,0)'],
  [p(Pw(Om, Pw(Om, N(3)))), '\\varphi(1,0,0,0,0)'],
  [p(Pw(Om, Pw(Om, W))), '\\text{SVO}'],
  [p(Pw(Om, Pw(Om, Om))), '\\text{LVO}'],
  [p(EPS1), '\\text{BHO}'],
  [p(PSI1_0), '\\text{BHO}'],
  [p(OW), '\\text{BO}'],
]
const KNOWN_MAP = new Map(KNOWN.map(([e, v]) => [plain(e), v]))

export const PRESETS_ONE: Preset[] = [
  { e: p(Om), tex: '\\psi(\\Omega)' },
  { e: p(A(Om, Om)), tex: '\\psi(\\Omega\\cdot 2)' },
  { e: p(Mu(Om, Om)), tex: '\\psi(\\Omega^2)' },
  { e: p(Pw(Om, W)), tex: '\\psi(\\Omega^\\omega)' },
  { e: p(Pw(Om, Om)), tex: '\\psi(\\Omega^\\Omega)' },
  { e: p(Mu(Pw(Om, Om), Om)), tex: '\\psi(\\Omega^{\\Omega+1})' },
  { e: p(Pw(Om, Mu(Om, Om))), tex: '\\psi(\\Omega^{\\Omega^2})' },
  { e: p(Pw(Om, Pw(Om, W))), tex: '\\psi(\\Omega^{\\Omega^\\omega})' },
  { e: p(Pw(Om, Pw(Om, Om))), tex: '\\psi(\\Omega^{\\Omega^\\Omega})' },
  { e: p(EPS1), tex: '\\psi(\\varepsilon_{\\Omega+1})' },
]
export const PRESETS_MULTI: Preset[] = [
  { e: p(O(2)), tex: '\\psi(\\Omega_2)' },
  { e: p(P(1, O(2))), tex: '\\psi(\\psi_1(\\Omega_2))' },
  { e: p(P(1, Om)), tex: '\\psi(\\psi_1(\\Omega))' },
  { e: p(A(O(3), O(2))), tex: '\\psi(\\Omega_3+\\Omega_2)' },
  { e: p(Mu(O(3), P(1, O(3)))), tex: '\\psi(\\Omega_3\\cdot\\psi_1(\\Omega_3))' },
  { e: p(A(O(5), P(2, A(O(4), P(3, A(O(4), O(3))))))), tex: '\\psi(\\Omega_5+\\psi_2(\\Omega_4+\\psi_3(\\Omega_4+\\Omega_3)))' },
  { e: p(A(O(5), P(1, A(O(4), P(3, A(O(4), O(3))))))), tex: '\\psi(\\Omega_5+\\psi_1(\\Omega_4+\\psi_3(\\Omega_4+\\Omega_3)))' },
  { e: p(OW), tex: '\\psi(\\Omega_\\omega)' },
]

const SUBS = '₀₁₂₃₄₅₆₇₈₉'
const sub = (n: number) => String(n).split('').map((d) => SUBS[Number(d)]).join('')
const omN = (n: number) => (n === 1 ? 'Ω' : `Ω${sub(n)}`)
const psN = (m: number) => (m === 0 ? 'ψ' : `ψ${sub(m)}`)

function infoText(info: StepInfo, t: (en: string, zh: string) => string): string {
  switch (info.kind) {
    case 'omega':
      return t('A recursive limit (ω or Ω_ω) sits at the end: substitute k.', '末尾是递归极限（ω 或 Ω_ω）：代入 k。')
    case 'psi0':
      return t(`${psN(info.m)}(0) unfolds as a tower of ${info.m === 0 ? 'ω' : omN(info.m)}'s.`, `${psN(info.m)}(0) 展开成 ${info.m === 0 ? 'ω' : omN(info.m)} 的指数塔。`)
    case 'psiSucc':
      return t('Successor inside ψ: tower of the previous value.', 'ψ 里是后继：用前一个值搭指数塔。')
    case 'fold': {
      const { m, n } = info
      return n - 1 === m
        ? t(`Fold: ${omN(n)} finds the layer ${psN(m)} (the first subscript < ${n}); the copies are ${psN(n - 1)}.`, `折叠：${omN(n)} 找到层 ${psN(m)}（第一个下标 < ${n} 的层）；副本是 ${psN(n - 1)}。`)
        : t(
            `Fold: ${omN(n)} skips the ψ's with subscript ≥ ${n} and finds ${psN(m)}; the copies are renamed ${psN(n - 1)}.`,
            `折叠：${omN(n)} 跳过下标 ≥ ${n} 的 ψ，找到 ${psN(m)}；副本改名为 ${psN(n - 1)}。`,
          )
    }
  }
}

const norm = (x: string) => x.replace(/[{}\s]/g, '')

export function FoldStepper({ presets, maxK = 2 }: { presets: Preset[]; maxK?: number }) {
  const { t } = useLang()
  const [pi, setPi] = useState(0)
  const [hist, setHist] = useState<E[]>([presets[0].e])
  const choose = (i: number) => {
    setPi(i)
    setHist([presets[i].e])
  }
  const cur = hist[hist.length - 1]
  const cls = classify(cur)
  const terms = useMemo(() => {
    if (cls.c !== 'lim') return []
    const out: { r: E; info: StepInfo }[] = []
    for (let k = 0; k <= maxK; k++) {
      try {
        out.push(fs(cur, k))
      } catch {
        break
      }
    }
    return out
  }, [cur, cls.c, maxK])
  const known = KNOWN_MAP.get(plain(cur))
  return (
    <div>
      <div className="btn-row">
        {presets.map((pr, i) => (
          <button key={i} className={`chip ${i === pi ? 'on' : ''}`} onClick={() => choose(i)}>
            <M t={pr.tex} />
          </button>
        ))}
      </div>
      <div className="c08-cur scroll-x">
        {hist.length === 1 && cls.c === 'lim' && norm(plain(cur)) !== norm(presets[pi].tex) ? (
          <>
            <M t={presets[pi].tex} />
            <span className="muted small"> {t('= (last Ω split off)', '=（拆出最后一个 Ω）')} </span>
          </>
        ) : null}
        <M t={toTex(annotate(cur))} />
        {known && <M t={`\\;=\\;${known}`} />}
      </div>
      {cls.c === 'lim' && terms.length > 0 && (
        <>
          <div className="small c08-rule">{infoText(terms[0].info, t)}</div>
          <div className="c08-terms">
            {terms.map((x, k) => {
              const s = toTex(x.r)
              const nm = KNOWN_MAP.get(plain(x.r))
              return (
                <button key={k} className="c08-term" onClick={() => setHist([...hist, x.r])} title={t('zoom into this term', '进入这一项')}>
                  <span className="c08-k">[{k}]</span>
                  <span className="scroll-x c08-term-tex">{s.length > 900 ? <span className="muted">…</span> : <M t={s} />}</span>
                  {nm && (
                    <span className="c08-nm">
                      <M t={`=${nm}`} />
                    </span>
                  )}
                </button>
              )
            })}
            <div className="muted small c08-k">⋮ → <M t={plain(cur).length < 120 ? plain(cur) : '\\cdots'} /></div>
          </div>
        </>
      )}
      {cls.c === 'succ' && (
        <div className="readout small">
          <L en="A successor. Its predecessor is the next step down:" zh="这是一个后继，往下一步是它的前驱：" />{' '}
          <button
            className="btn small"
            onClick={() => {
              try {
                setHist([...hist, pred(cur)])
              } catch {
                /* not a simple successor */
              }
            }}
          >
            <L en="take predecessor" zh="取前驱" />
          </button>
        </div>
      )}
      {cls.c === 'zero' && (
        <div className="readout small">
          <L en="Reached 0." zh="到 0 了。" />
        </div>
      )}
      <div className="btn-row">
        <button className="btn small" disabled={hist.length < 2} onClick={() => setHist(hist.slice(0, -1))}>
          <L en="back" zh="返回" />
        </button>
        <span className="muted small" style={{ alignSelf: 'center' }}>
          <L en={`click a term to zoom in · depth ${hist.length - 1}`} zh={`点击某一项进入 · 深度 ${hist.length - 1}`} />
        </span>
      </div>
    </div>
  )
}

/* ================================================================== */
/* 5. Buchholz hydra                                                   */
/* ================================================================== */
const HYDRAS: { s: string; name: string }[] = [
  { s: '(+(0(0(0))))', name: '\\omega^\\omega' },
  { s: '(+(0(1)))', name: '\\varepsilon_0' },
  { s: '(+(0(1(1))))', name: '\\zeta_0' },
  { s: '(+(0(1(1(1)))))', name: '\\Gamma_0' },
  { s: '(+(0(2)))', name: '\\text{BHO}' },
  { s: '(+(0(ω)))', name: '\\text{BO}' },
]
const NAMES = new Map<string, string>([
  ['(+)', '0'],
  ['(+(0))', '1'],
  ['(+(0)(0))', '2'],
  ['(+(0(0)))', '\\omega'],
  ['(+(0(0)(0)))', '\\omega^2'],
  ['(+(0(0(0))))', '\\omega^\\omega'],
  ['(+(0(1)))', '\\varepsilon_0'],
  ['(+(0(1)(1)))', '\\varepsilon_1'],
  ['(+(0(1(0))))', '\\varepsilon_\\omega'],
  ['(+(0(1(1))))', '\\zeta_0'],
  ['(+(0(1(1(1)))))', '\\Gamma_0'],
  ['(+(0(1(1(1(0))))))', '\\text{SVO}'],
  ['(+(0(1(1(1(1))))))', '\\text{LVO}'],
  ['(+(0(2)))', '\\text{BHO}'],
  ['(+(0(ω)))', '\\text{BO}'],
])
const DRAW_LIMIT = 80
const HARD_LIMIT = 30000

type Pos = { x: number; y: number; n: HNode; path: number[]; parent?: { x: number; y: number } }
function layout(t: HNode): { pos: Pos[]; w: number; h: number } {
  const pos: Pos[] = []
  let leafX = 0
  const go = (n: HNode, depth: number, path: number[], parent?: { x: number; y: number }): number => {
    let x: number
    const me: Pos = { x: 0, y: depth, n, path, parent }
    pos.push(me)
    if (n.ch.length === 0) x = leafX++
    else {
      const xs = n.ch.map((c, i) => go(c, depth + 1, [...path, i], me))
      x = (xs[0] + xs[xs.length - 1]) / 2
    }
    me.x = x
    return x
  }
  go(t, 0, [])
  return { pos, w: Math.max(1, leafX), h: height(t) + 1 }
}

export function BuchholzHydra() {
  const { t } = useLang()
  const [start, setStart] = useState(1)
  const [tree, setTree] = useState<HNode>(() => parse(HYDRAS[1].s))
  const [round, setRound] = useState(1)
  const [last, setLast] = useState<CutRule | null>(null)
  const reset = (i: number) => {
    setStart(i)
    setTree(parse(HYDRAS[i].s))
    setRound(1)
    setLast(null)
  }
  const size = count(tree)
  const dead = tree.ch.length === 0
  const doCut = (path: number[]) => {
    if (dead) return
    const r = cut(tree, path, round)
    setTree(r.t)
    setRound(round + 1)
    setLast(r.rule)
  }
  const auto = (k: number) => {
    let tr = clearTags(tree)
    let n = round
    let rule: CutRule | null = last
    const t0 = performance.now()
    for (let j = 0; j < k; j++) {
      if (tr.ch.length === 0 || count(tr) > HARD_LIMIT || performance.now() - t0 > 400) break
      const ls = leaves(tr)
      const r = cut(tr, ls[ls.length - 1], n)
      tr = k > 1 ? clearTags(r.t) : r.t
      rule = r.rule
      n++
    }
    setTree(tr)
    setRound(n)
    setLast(rule)
  }
  const { pos, w, h } = useMemo(() => layout(tree), [tree])
  const drawable = size <= DRAW_LIMIT
  const VW = Math.max(320, w * 34 + 40)
  const VH = Math.max(120, h * 46 + 40)
  const px = (x: number) => 20 + (w <= 1 ? (VW - 40) / 2 : (x * (VW - 40)) / (w - 1))
  const py = (y: number) => VH - 22 - y * 46
  const br = toBrackets(tree)
  const nm = NAMES.get(br)
  const ruleText: Record<CutRule, { en: string; zh: string }> = {
    1: { en: 'rule 1: a 0-head on the root just dies', zh: '规则 1：长在根上的 0 号头直接死掉' },
    2: { en: `rule 1: 0-head — its parent τ (gold) regrows ${round - 1} copies (pink) one level down`, zh: `规则 1：0 号头——它的父节点 τ（金色）在下一层长出 ${round - 1} 个副本（粉色）` },
    3: { en: 'rule 2: u-head — first node below with a smaller label (gold) is the bad root; its subtree is copied in place of the head, relabelled u−1 and 0 (pink)', zh: '规则 2：u 号头——往下第一个标签更小的节点（金色）是坏根；把它的子树复制到头的位置，根改为 u−1，头改为 0（粉色）' },
    4: { en: `rule 3: an ω-head becomes ${round}`, zh: `规则 3：ω 号头变成 ${round}` },
  }
  return (
    <div>
      <div className="btn-row">
        {HYDRAS.map((hy, i) => (
          <button key={i} className={`chip ${i === start ? 'on' : ''}`} onClick={() => reset(i)}>
            <M t={hy.name} />
          </button>
        ))}
      </div>
      {drawable ? (
        <svg viewBox={`0 0 ${VW} ${VH}`} className="c08-hydra" style={{ maxHeight: 200 }}>
          {pos.map((q, i) =>
            q.parent ? <line key={'l' + i} x1={px(q.parent.x)} y1={py(q.parent.y)} x2={px(q.x)} y2={py(q.y)} stroke="#3a4680" strokeWidth={2} /> : null,
          )}
          {pos.map((q, i) => {
            const isRoot = q.n.label === ROOT
            const isHead = !isRoot && q.n.ch.length === 0
            const lab = isRoot ? '+' : q.n.label === OMEGA_LABEL ? 'ω' : String(q.n.label)
            const fill = q.n.tag === 'new' ? '#ff7ab6' : isRoot ? '#2a3563' : isHead ? '#6be4ff' : '#1b2447'
            return (
              <g key={i} onClick={() => isHead && doCut(q.path)} style={{ cursor: isHead ? 'pointer' : 'default' }}>
                <circle cx={px(q.x)} cy={py(q.y)} r={12} fill={fill} stroke={q.n.tag === 'found' ? '#ffd36b' : '#6be4ff'} strokeWidth={q.n.tag === 'found' ? 4 : 1.5} />
                <text x={px(q.x)} y={py(q.y) + 4} fontSize="12" textAnchor="middle" fill={isHead || q.n.tag === 'new' ? '#0a0e1f' : '#e6e9f5'} style={{ pointerEvents: 'none' }}>
                  {lab}
                </text>
              </g>
            )
          })}
        </svg>
      ) : (
        <div className="readout c08-bigmsg">
          {dead ? null : (
            <L
              en={<>The hydra has {size.toLocaleString()} nodes — too big to draw. It will still die… just not on this computer.</>}
              zh={<>九头蛇已有 {size.toLocaleString()} 个节点——画不下了。它终究会死……只是不在这台电脑上。</>}
            />
          )}
        </div>
      )}
      <div className="c08-stats small">
        {t('round n', '回合 n')} = <b>{round}</b> · {t('nodes', '节点数')} = <b>{size.toLocaleString()}</b> · {t('height', '高度')} = <b>{height(tree)}</b>
      </div>
      <div className="readout small">
        {dead ? (
          <L en={<>Dead after {round - 1} cuts. Hercules wins — he always does.</>} zh={<>砍了 {round - 1} 刀，九头蛇死了。赫拉克勒斯赢了——他总会赢。</>} />
        ) : last ? (
          <L {...ruleText[last]} />
        ) : (
          <L en="Click a head (a cyan leaf) to cut it." zh="点击一个头（青色叶子）砍掉它。" />
        )}
        {size <= 16 && (
          <div className="scroll-x c08-psi">
            <M t={`${toPsi(tree)}${nm ? `=${nm}` : ''}`} />
          </div>
        )}
      </div>
      <div className="btn-row">
        <button className="btn small" disabled={dead} onClick={() => auto(1)}>
          <L en="cut rightmost head" zh="砍最右边的头" />
        </button>
        <button className="btn small" disabled={dead} onClick={() => auto(100)}>
          ×100
        </button>
        <button className="btn small" disabled={dead} onClick={() => auto(10000)}>
          ×10000
        </button>
        <button className="btn small" onClick={() => reset(start)}>
          <L en="reset" zh="重来" />
        </button>
      </div>
    </div>
  )
}

/* ================================================================== */
/* 6. FGH vs SGH: the catch-up                                         */
/* ================================================================== */
const RULER = [
  '1', '2', '3', '4', '5', '\\omega', '\\omega{+}1', '\\omega\\cdot 2', '\\omega^\\omega', '\\omega^\\omega{+}1',
  '\\varepsilon_0', '\\zeta_0', '\\eta_0', '\\varphi(\\omega,0)', '\\Gamma_0', '\\text{SVO}', '\\text{LVO}', '\\text{BHO}',
  '\\psi(\\Omega_2)', '\\psi(\\psi_2(0))', '\\psi(\\Omega_3)', '\\cdots', '\\text{BO}',
]
const RULER_TXT = ['1', '2', '3', '4', '5', 'ω', 'ω+1', 'ω·2', 'ω^ω', 'ω^ω+1', 'ε₀', 'ζ₀', 'η₀', 'φ(ω,0)', 'Γ₀', 'SVO', 'LVO', 'BHO', 'ψ(Ω₂)', 'ψ(ψ₂(0))', 'ψ(Ω₃)', '⋯', 'BO']
type Pair = { f: string; g: string; fn: string; src: 'exact' | 'book' | 'girard' }
const PAIRS: Pair[] = [
  { f: '1', g: '\\omega\\cdot 2', fn: '2n', src: 'exact' },
  { f: '2', g: '\\omega^\\omega', fn: '\\approx 2^n\\ \\text{vs}\\ n^n', src: 'book' },
  { f: '3', g: '\\varepsilon_0', fn: 'n\\uparrow\\uparrow n', src: 'book' },
  { f: '4', g: '\\zeta_0', fn: 'n\\uparrow\\uparrow\\uparrow n', src: 'book' },
  { f: '5', g: '\\eta_0', fn: 'n\\uparrow^{4} n', src: 'book' },
  { f: '\\omega', g: '\\varphi(\\omega,0)', fn: 'n\\uparrow^{n} n', src: 'book' },
  { f: '\\omega{+}1', g: '\\Gamma_0', fn: '\\text{Graham-like}', src: 'book' },
  { f: '\\omega^\\omega', g: '\\text{SVO}', fn: '\\text{linear arrays}', src: 'book' },
  { f: '\\omega^\\omega{+}1', g: '\\text{LVO}', fn: '', src: 'book' },
  { f: '\\varepsilon_0', g: '\\text{BHO}', fn: '\\text{Goodstein / PA level}', src: 'girard' },
  { f: '\\zeta_0', g: '\\psi(\\Omega_2)', fn: '', src: 'book' },
  { f: '\\text{BHO}', g: '\\psi(\\psi_2(0))', fn: '', src: 'book' },
  { f: '\\psi(\\Omega_2)', g: '\\psi(\\Omega_3)', fn: '', src: 'book' },
  { f: '\\text{BO}', g: '\\text{BO}', fn: 'f_{\\text{BO}}(n-1)\\le g_{\\text{BO}}(n)\\le f_{\\text{BO}}(n+1)', src: 'girard' },
]

export function CatchUp() {
  const { t } = useLang()
  const [i, setI] = useState(0)
  const pr = PAIRS[i]
  const W0 = 660
  const step = (W0 - 40) / (RULER.length - 1)
  const X = (s: string) => 20 + RULER.indexOf(s) * step
  const fx = X(pr.f)
  const gx = X(pr.g)
  const gap = RULER.indexOf(pr.g) - RULER.indexOf(pr.f)
  return (
    <div>
      <svg viewBox={`0 0 ${W0} 190`} className="c08-race">
        <line x1={20} y1={34} x2={W0 - 20} y2={34} stroke="#6be4ff" strokeOpacity={0.4} strokeWidth={6} strokeLinecap="round" />
        <line x1={20} y1={160} x2={W0 - 20} y2={160} stroke="#ff7ab6" strokeOpacity={0.4} strokeWidth={6} strokeLinecap="round" />
        {RULER_TXT.map((s, k) => {
          const on = RULER[k] === pr.f || RULER[k] === pr.g
          return (
            <g key={k}>
              <line x1={20 + k * step} y1={40} x2={20 + k * step} y2={154} stroke="#2a3563" />
              <text x={20 + k * step} y={100} fontSize="11" fill={on ? '#ffd36b' : '#9aa3c7'} textAnchor="middle" transform={`rotate(-60 ${20 + k * step} 100)`}>
                {s}
              </text>
            </g>
          )
        })}
        <text x={20} y={18} fill="#6be4ff" fontSize="12">
          {t('fast-growing f_α', '快速增长 f_α')}
        </text>
        <text x={20} y={184} fill="#ff7ab6" fontSize="12">
          {t('slow-growing g_β', '慢速增长 g_β')}
        </text>
        <line x1={fx} y1={34} x2={gx} y2={160} stroke="#ffd36b" strokeDasharray="4 4" />
        <circle cx={fx} cy={34} r={9} fill="#6be4ff" />
        <circle cx={gx} cy={160} r={9} fill="#ff7ab6" />
      </svg>
      <Slider value={i} min={0} max={PAIRS.length - 1} onChange={setI} label={<L en="FGH level" zh="FGH 层级" />} />
      <div className="readout">
        <M t={`f_{${pr.f}}\\ \\approx\\ g_{${pr.g}}`} />
        {pr.fn && (
          <span className="muted">
            {' '}
            (<M t={pr.fn} />)
          </span>
        )}
        <div className="small muted">
          {gap > 0 ? (
            <L en={<>The slow hierarchy needs an index {gap} landmarks further up the ruler.</>} zh={<>慢速增长层次需要在尺子上再往上走 {gap} 个路标。</>} />
          ) : (
            <L en={<>Same index. The slow-growing hierarchy has caught up.</>} zh={<>下标相同。慢速增长层次追上来了。</>} />
          )}{' '}
          {pr.src === 'exact' ? (
            <L en="(exact)" zh="（精确相等）" />
          ) : pr.src === 'girard' ? (
            <L en="(theorem: Girard 1981, for suitable fundamental sequences)" zh="（定理：Girard 1981，在合适的基本列下）" />
          ) : (
            <L en="(the book's table; depends on the fundamental sequences)" zh="（书中的对照表；依赖基本列的选取）" />
          )}
        </div>
      </div>
    </div>
  )
}
