import { useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { Gauge, Mountain, SeqChips, TreeView } from './draw'
import {
  add,
  altitude,
  badRoot,
  eq,
  expandLimit,
  fs,
  isLegalShape,
  isStandard,
  nat,
  OMEGA,
  omPow,
  ONE,
  ordToSeq,
  seqToOrd,
  seqToTree,
  toTex,
  treeBrackets,
  type Ord,
  type Seq,
} from './ordinal.ts'

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
export function parseSeq(txt: string): Seq | null {
  const parts = txt.replace(/[()[\]（）]/g, ' ').split(/[\s,，]+/).filter(Boolean)
  if (parts.length > 40) return null
  const out: Seq = []
  for (const p of parts) {
    if (!/^\d+$/.test(p)) return null
    const v = Number(p)
    if (v > 20) return null
    out.push(v)
  }
  return out
}
const seqStr = (s: Seq) => `(${s.join(',')})`
const W2 = omPow(nat(2))
const W3 = omPow(nat(3))
const WW = omPow(OMEGA)

/** Piecewise scale through landmark ordinals, using `altitude` inside each gap (strictly increasing). */
export function makeScale(marks: Ord[]) {
  const alt = marks.map(altitude)
  return (a: Ord) => {
    const v = altitude(a)
    const last = marks.length - 1
    for (let i = last; i >= 0; i--) {
      if (v >= alt[i]) {
        if (i === last) return 1
        const f = (v - alt[i]) / (alt[i + 1] - alt[i])
        return (i + Math.min(0.92, f)) / last
      }
    }
    return 0
  }
}

/* ------------------------------------------------------------------ */
/* 1. Base-ω odometer: linear arrays (Def 2.13)                         */
/* ------------------------------------------------------------------ */
export function Odometer() {
  const { t } = useLang()
  const [d, setD] = useState<number[]>([0, 0, 0, 0]) // a3 a2 a1 a0
  const [last, setLast] = useState<'start' | 'iter' | number>('start')
  const ord: Ord = d.reduce<Ord>((acc, v, i) => (v ? add(acc, [{ e: nat(3 - i), c: v }]) : acc), [])
  const lead = d.findIndex((v) => v > 0)
  const shown = lead < 0 ? [0] : d.slice(lead)
  const idx = shown.join(',')
  const iterate = () => {
    const nd = [...d]
    nd[3]++
    setD(nd)
    setLast('iter')
  }
  const carry = (pos: number) => {
    const nd = d.map((v, i) => (i < pos ? v : i === pos ? v + 1 : 0))
    setD(nd)
    setLast(pos)
  }
  // the rule that defines the new index
  let rule = ''
  if (last === 'iter') {
    const prev = [...shown]
    prev[prev.length - 1]--
    rule = `F_{${idx}}(n)=F_{${prev.join(',')}}^{\\,n}(n)`
  } else if (typeof last === 'number') {
    const k = 3 - last // digit position from the right
    const prev = [...d]
    prev[last]--
    prev[last + 1] = -1 // placeholder for n
    const p0 = prev.findIndex((v) => v !== 0)
    const prevShown = prev.slice(p0 < 0 ? 0 : p0).map((v) => (v === -1 ? 'n' : String(v)))
    rule = k >= 1 ? `F_{${idx}}(n)=F_{${prevShown.join(',')}}(n)` : ''
  }
  const full = d[0] > 0
  return (
    <div>
      <div className="c05-odo">
        {d.map((v, i) => (
          <div key={i} className={`c05-wheel ${i < (lead < 0 ? 3 : lead) ? 'off' : ''}`}>
            <div className="c05-wheel-v">{v}</div>
            <div className="c05-wheel-l">
              <M t={3 - i === 0 ? '1' : 3 - i === 1 ? '\\omega' : `\\omega^{${3 - i}}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="readout c05-center">
        <M t={`F_{${idx}}(n)\\ \\sim\\ ${toTex(ord)}`} />
        {rule && (
          <div className="small muted" style={{ marginTop: 4 }}>
            <M t={rule} />
          </div>
        )}
      </div>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <button className="btn small" onClick={iterate}>
          <L en="iterate n times (+1)" zh="迭代 n 次（+1）" />
        </button>
        {[2, 1, 0].map((pos) => (
          <button key={pos} className="btn small" onClick={() => carry(pos)}>
            <L en={`diagonalize → carry into the ${['ω³', 'ω²', 'ω'][pos]} digit`} zh={`对角化 → 向 ${['ω³', 'ω²', 'ω'][pos]} 位进位`} />
          </button>
        ))}
        <button className="chip" onClick={() => (setD([0, 0, 0, 0]), setLast('start'))}>
          {t('reset', '归零')}
        </button>
      </div>
      <div className="small muted c05-center">
        {full ? (
          <L
            en={<>Four digits reach every ordinal below <M t="\omega^4" />. Arrays with any number of digits stop below <M t="\omega^\omega" /> — to name <M t="\omega^\omega" /> itself you need a new symbol.</>}
            zh={<>四位数阵能走到 <M t="\omega^4" /> 以下的所有序数；位数再多，也停在 <M t="\omega^\omega" /> 之下——要写出 <M t="\omega^\omega" /> 本身，必须发明新符号。</>}
          />
        ) : (
          <L
            en="Pressing “+1” forever never moves a higher wheel. Only a diagonalization (a carry) does — and a carry resets everything to its right to 0."
            zh="一直按“+1”，高位轮子永远不会动；只有对角化（进位）才行——而进位会把右边所有位清零。"
          />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shared editor for a sequence                                        */
/* ------------------------------------------------------------------ */
function SeqEditor({ s, setS, presets }: { s: Seq; setS: (s: Seq) => void; presets: Seq[] }) {
  const { t } = useLang()
  const [txt, setTxt] = useState(s.join(','))
  useEffect(() => setTxt(s.join(',')), [s])
  const parsed = parseSeq(txt)
  return (
    <div>
      <div className="btn-row">
        {presets.map((p, i) => (
          <button key={i} className={`chip mono ${p.join(',') === s.join(',') ? 'on' : ''}`} onClick={() => setS(p)}>
            {seqStr(p)}
          </button>
        ))}
      </div>
      <div className="row">
        <input
          className="c05-input mono"
          value={txt}
          aria-label={t('sequence', '序列')}
          onChange={(e) => {
            setTxt(e.target.value)
            const p = parseSeq(e.target.value)
            if (p) setS(p)
          }}
        />
        <button className="chip" onClick={() => setS([...s, 0])}>
          {t('append 0', '末尾加 0')}
        </button>
        <button className="chip" disabled={!s.length} onClick={() => setS([...s, s[s.length - 1] + 1])}>
          {t('append last+1', '末尾加“末项+1”')}
        </button>
        <button className="chip" disabled={!s.length} onClick={() => setS(s.slice(0, -1))}>
          {t('delete last', '删去末项')}
        </button>
        {!parsed && <span className="small" style={{ color: 'var(--red)' }}>{t('use digits 0–20, commas', '请输入 0–20 的数字，用逗号隔开')}</span>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Anatomy of one expansion (Def 2.16, rule 3)                       */
/* ------------------------------------------------------------------ */
export function Expander() {
  const { t } = useLang()
  const [s, setS] = useState<Seq>([0, 1, 2, 2, 1])
  const [n, setN] = useState(3)
  const shapeOk = isLegalShape(s)
  const lastV = s[s.length - 1]
  const r = s.length ? badRoot(s) : -1
  const kind = s.length === 0 ? 'empty' : lastV === 0 ? 'zero' : 'limit'
  const out = kind === 'limit' ? expandLimit(s, n) : s.slice(0, -1)
  const badLen = kind === 'limit' && r >= 0 ? s.length - 1 - r : 0
  const cls = (i: number) =>
    kind !== 'limit' ? (i === s.length - 1 ? 'last' : '') : i === s.length - 1 ? 'last' : i === r ? 'root' : i > r && r >= 0 ? 'bad' : 'good'
  const outCls = (i: number) => {
    if (kind !== 'limit' || r < 0 || i < r) return 'good'
    const k = Math.floor((i - r) / badLen)
    return k === 0 ? (i === r ? 'root' : 'bad') : k % 2 ? 'copy1' : 'copy2'
  }
  const a = shapeOk ? seqToOrd(s) : null
  const b = shapeOk ? seqToOrd(out) : null
  const viaFs = a && isStandard(s) ? fs(a, n) : null
  return (
    <div>
      <SeqEditor s={s} setS={setS} presets={[[0, 1], [0, 1, 1], [0, 1, 2], [0, 1, 2, 2, 1], [0, 1, 2, 3], [0, 1, 1, 0, 1, 0]]} />
      <Slider value={n} min={0} max={5} onChange={setN} label="n" />
      <div className="c05-anat">
        <div>
          <SeqChips s={s} cls={cls} after={<span className="mono">[{n}]</span>} />
        </div>
        <div className="c05-arrow">↓</div>
        <div>
          {kind === 'empty' ? (
            <span className="mono">{n + 1}</span>
          ) : kind === 'zero' ? (
            <SeqChips s={out} after={<span className="mono">{`^${n}[${n}]`}</span>} />
          ) : (
            <SeqChips s={out} cls={outCls} after={<span className="mono">[{n}]</span>} />
          )}
        </div>
      </div>
      <div className="small c05-legend">
        {kind === 'limit' && r >= 0 && (
          <>
            <span className="c05-term good">{t('good part', '好部')}</span>
            <span className="c05-term root">{t('bad root', '坏根')}</span>
            <span className="c05-term bad">{t('bad part', '坏部')}</span>
            <span className="c05-term last">{t('deleted', '删去')}</span>
            <span className="c05-term copy1">{t('copies', '复制')}</span>
            <span className="muted">
              {t(`the bad part appears ${n} times in total`, `坏部总共出现 ${n} 次`)}
            </span>
          </>
        )}
        {kind === 'zero' && <span className="muted">{t('Rule (2): last term 0 → drop it and iterate n times.', '规则 (2)：末项为 0 → 删去它，迭代 n 次。')}</span>}
        {kind === 'empty' && <span className="muted">{t('Rule (1): ()[n] = n+1.', '规则 (1)：()[n] = n+1。')}</span>}
      </div>
      {a && b && (
        <div className="readout small">
          {kind === 'limit' ? (
            <>
              <M t={`${toTex(a)}\\ \\longrightarrow\\ ${toTex(b)}`} />
              {viaFs && (
                <span className="muted">
                  {'   '}
                  {eq(viaFs, b) ? (
                    <L en={<>= <M t={`\\bigl(${toTex(a)}\\bigr)[${n}]`} /> by Def 3.6 ✓</>} zh={<>= <M t={`\\bigl(${toTex(a)}\\bigr)[${n}]`} />，与定义 3.6 一致 ✓</>} />
                  ) : (
                    '≠ FS'
                  )}
                </span>
              )}
            </>
          ) : kind === 'zero' ? (
            <M t={`${toTex(a)} = ${toTex(b)}+1`} />
          ) : (
            <M t="0" />
          )}
        </div>
      )}
      {!shapeOk && (
        <div className="small" style={{ color: 'var(--orange)' }}>
          {t('Legal but not of standard shape (Theorem 2.1): no ordinal label.', '可以展开，但不满足定理 2.1 的形状：不给序数标签。')}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Sequence ↔ mountain ↔ tree ↔ ordinal                              */
/* ------------------------------------------------------------------ */
export function MountainTree() {
  const { t } = useLang()
  const [s, setS] = useState<Seq>([0, 1, 2, 3, 1, 2, 2, 2, 0, 1, 2, 2, 1])
  const [hover, setHover] = useState<number | null>(null)
  const shapeOk = isLegalShape(s)
  const tree = useMemo(() => seqToTree(s), [s])
  // node ids in pre-order correspond to the terms
  const ids = useMemo(() => {
    const out: number[] = []
    const walk = (t: typeof tree) => t.ch.forEach((c) => (out.push(c.id), walk(c)))
    walk(tree)
    return out
  }, [tree])
  const blockCol = useMemo(() => {
    const pal = ['#6be4ff', '#ffd36b', '#ff7ab6', '#7dffa8', '#b59bff', '#ffa95e']
    let k = -1
    return s.map((v) => (v === 0 ? pal[++k % pal.length] : pal[Math.max(0, k) % pal.length]))
  }, [s])
  const colorOf = (id: number) => {
    const i = ids.indexOf(id)
    if (i < 0) return undefined
    return hover === i ? '#ffffff' : blockCol[i]
  }
  const std = shapeOk && isStandard(s)
  const ord = shapeOk ? seqToOrd(s) : null
  return (
    <div>
      <SeqEditor s={s} setS={setS} presets={[[0, 1, 2], [0, 1, 0, 1], [0, 1, 1, 2], [0, 1, 2, 3, 1, 2, 2, 2, 0, 1, 2, 2, 1], [0, 1, 2, 2, 0, 1, 2, 1, 1]]} />
      {shapeOk ? (
        <>
          <div className="c05-two">
            <div>
              <div className="small muted">{t('mountain: each term links to its parent', '山形图：每一项连向它的父项')}</div>
              <Mountain s={s} colors={blockCol} hover={hover} onHover={setHover} height={125} vbWidth={340} />
            </div>
            <div>
              <div className="small muted">{t('tree: the same links, root at the bottom', '树：同样的连线，根在下面')}</div>
              <TreeView tree={tree} colorOf={colorOf} height={125} vbWidth={340} />
            </div>
          </div>
          <div className="readout">
            <M t={`${seqStr(s)}\\;=\\;${toTex(ord!)}`} />
            <div className="small muted">
              {t('brackets: ', '括号写法：')}
              <span className="mono">{treeBrackets(tree)}</span>
            </div>
          </div>
          <div className="small">
            {std ? (
              <span style={{ color: 'var(--green)' }}>{t('Standard expression: at every node the branches are in non-increasing order.', '标准表达式：每个节点上，各分支从左到右不增。')}</span>
            ) : (
              <span style={{ color: 'var(--orange)' }}>
                {t('Not standard. It expands exactly like its standard form ', '不是标准表达式。它和它的标准形展开方式相同：')}
                <span className="mono">{seqStr(ordToSeq(ord!))}</span>
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="caution">
          <span className="caution-icon">⚠</span>
          {t('This sequence breaks Theorem 2.1 (start at 0, climb at most 1 per step), so it is not a mountain we can read as an ordinal.', '这个序列不满足定理 2.1（从 0 开始，每步至多升 1），无法读成序数。')}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Countdown in the Hardy shell, with an ordinal altimeter           */
/* ------------------------------------------------------------------ */
type CState = { s: Seq; x: bigint; final?: string; note?: Note }
type Note = 'zero' | 'zeros' | 'expand' | 'double' | 'last' | 'start'

const MARKS: Ord[] = [nat(0), nat(1), nat(2), OMEGA, add(OMEGA, OMEGA), W2, add(W2, W2), W3, WW, omPow(add(OMEGA, ONE))]
const MARK_TEXT = ['0', '1', '2', 'ω', 'ω·2', 'ω²', 'ω²·2', 'ω³', 'ω^ω', 'ω^(ω+1)']
const scale = makeScale(MARKS)

function hardyStep(st: CState, fast: boolean): CState | 'stuck' | null {
  const { s, x } = st
  if (s.length === 0 || st.final) return null
  if (s[s.length - 1] === 0) {
    if (!fast) return { s: s.slice(0, -1), x: x + 1n, note: 'zero' }
    let j = 0
    while (j < s.length && s[s.length - 1 - j] === 0) j++
    return { s: s.slice(0, -j), x: x + BigInt(j), note: j > 1 ? 'zeros' : 'zero' }
  }
  const r = badRoot(s)
  if (fast && s[s.length - 1] === 1 && r === s.length - 2) return { s: s.slice(0, -2), x: 2n * x, note: 'double' }
  if (fast && s.length >= 3 && s.slice(-3).join(',') === '0,1,1' && badRoot(s) === s.length - 3) {
    // (#,0,1,1)[x] = (#, (0,1)×x)[x] = (#)[x·2^x]
    const g = s.slice(0, -3)
    if (x <= 4096n) return { s: g, x: x * (1n << x), note: 'last' }
    if (g.length === 0) return { s: g, x, final: `${fmtBig(x)}\\cdot 2^{${fmtBig(x)}}`, note: 'last' }
    return 'stuck'
  }
  if (x * BigInt(s.length) > 600n) return 'stuck'
  return { s: expandLimit(s, Number(x)), x, note: 'expand' }
}
function fmtBig(v: bigint): string {
  const str = v.toString()
  if (str.length <= 12) return str.replace(/\B(?=(\d{3})+(?!\d))/g, '{,}')
  return `\\approx 10^{${str.length - 1}}`
}

export function Countdown() {
  const { t } = useLang()
  const presets: [Seq, number][] = [
    [[0, 1, 2], 2],
    [[0, 1, 2], 3],
    [[0, 1, 1, 0, 1], 3],
    [[0, 1, 2, 0, 1], 2],
  ]
  const [pi, setPi] = useState(0)
  const [fast, setFast] = useState(false)
  const start = (): CState => ({ s: presets[pi][0], x: BigInt(presets[pi][1]), note: 'start' })
  const [hist, setHist] = useState<CState[]>([start()])
  useEffect(() => setHist([start()]), [pi])
  const cur = hist[hist.length - 1]
  const nxt = hardyStep(cur, fast)
  const go = (k: number) => {
    let h = hist
    for (let i = 0; i < k; i++) {
      const r = hardyStep(h[h.length - 1], fast)
      if (!r || r === 'stuck') break
      h = [...h, r]
    }
    setHist(h)
  }
  const ordOf = (st: CState) => (st.final ? nat(0) : seqToOrd(st.s))
  const noteText: Record<Note, string> = {
    start: '',
    zero: t('last term 0: drop it, n+1', '末项为 0：删去，n+1'),
    zeros: t('drop all trailing 0s, add their count to n', '一次删去末尾所有的 0，n 加上它们的个数'),
    expand: t('expand: copy the bad part n times', '展开：坏部复制 n 次'),
    double: t('(…,0,1)[n] → (…,0,…,0)[n] → (…)[2n]  (n+1 steps at once)', '(…,0,1)[n] → (…,0,…,0)[n] → (…)[2n]（一次走 n+1 步）'),
    last: t('(…,0,1,1)[n] → (…,(0,1)×n)[n] → (…)[n·2ⁿ]', '(…,0,1,1)[n] → (…,(0,1)×n)[n] → (…)[n·2ⁿ]'),
  }
  const shown = hist.slice(-6)
  return (
    <div className="c05-count">
      <div className="c05-count-main">
        <div className="btn-row">
          {presets.map(([s, n], i) => (
            <button key={i} className={`chip mono ${i === pi ? 'on' : ''}`} onClick={() => setPi(i)}>
              {seqStr(s)}[{n}]
            </button>
          ))}
        </div>
        <label className="small muted">
          <input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} /> {t('fast-forward obvious runs', '快进显而易见的步骤')}
        </label>
        <div className="c05-trace">
          {hist.length > 6 && <div className="muted small">⋮</div>}
          {shown.map((h, i) => {
            const isCur = i === shown.length - 1
            return (
              <div key={hist.length - shown.length + i} className={`c05-line ${isCur ? 'cur' : ''}`}>
                {h.final ? (
                  <M t={`()\\,[${h.final}]`} />
                ) : (
                  <SeqChips s={h.s} max={34} after={<span className="mono c05-arg">[{h.x.toString().length > 14 ? `≈10^${h.x.toString().length - 1}` : h.x.toString()}]</span>} />
                )}
                <span className="c05-ordtag">
                  <M t={toTex(ordOf(h))} />
                </span>
                {h.note && h.note !== 'start' && <div className="c05-note">{noteText[h.note]}</div>}
              </div>
            )
          })}
        </div>
        <div className="btn-row">
          <button className="btn small" disabled={!nxt || nxt === 'stuck'} onClick={() => go(1)}>
            {t('one step', '走一步')}
          </button>
          <button className="btn small" disabled={!nxt || nxt === 'stuck'} onClick={() => go(400)}>
            {t('run to the end', '一直走到底')}
          </button>
          <button className="btn small" onClick={() => setHist([start()])}>
            {t('reset', '重来')}
          </button>
        </div>
        <div className="small">
          {!nxt && (
            <span style={{ color: 'var(--green)' }}>
              {cur.final ? (
                <L en={<>Done: the value is <M t={cur.final} />.</>} zh={<>结束：结果是 <M t={cur.final} />。</>} />
              ) : (
                <L en={`Done: the value is ${cur.x.toString().length > 30 ? 'a ' + cur.x.toString().length + '-digit number' : cur.x}.`} zh={`结束：结果是 ${cur.x.toString().length > 30 ? '一个 ' + cur.x.toString().length + ' 位数' : cur.x}。`} />
              )}
            </span>
          )}
          {nxt === 'stuck' && <span style={{ color: 'var(--orange)' }}>{t('The next expansion is too long to write out (turn on fast-forward).', '下一步展开太长，写不下了（打开快进）。')}</span>}
        </div>
      </div>
      <Gauge marks={MARKS.map((_, i) => ({ y: i / (MARKS.length - 1), text: MARK_TEXT[i] }))} value={scale(ordOf(cur))} trail={hist.map((h) => scale(ordOf(h)))} height={330} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Two shells, one core                                             */
/* ------------------------------------------------------------------ */
const CAP = 10n ** 60n
function fghShell(s: Seq, n: bigint, budget: { k: number }): bigint | null {
  if (--budget.k < 0) return null
  if (s.length === 0) return n + 1n
  if (s[s.length - 1] === 0) {
    let x = n
    for (let i = 0n; i < n; i++) {
      const r = fghShell(s.slice(0, -1), x, budget)
      if (r === null || r > CAP) return null
      x = r
    }
    return x
  }
  if (n * BigInt(s.length) > 400n) return null
  return fghShell(expandLimit(s, Number(n)), n, budget)
}
function hardyShell(s: Seq, n: bigint): bigint | null {
  let st: CState = { s, x: n }
  for (let i = 0; i < 2000; i++) {
    if (st.s.length === 0 && !st.final) return st.x > CAP ? null : st.x
    const r = hardyStep(st, true)
    if (!r || r === 'stuck' || r.final) return null
    st = r
  }
  return null
}
export function ShellTable() {
  const { t } = useLang()
  const pairs: [Seq, Seq][] = [
    [[], [0]],
    [[0], [0, 1]],
    [[0, 0], [0, 1, 1]],
    [[0, 0, 0], [0, 1, 1, 1]],
    [[0, 1], [0, 1, 2]],
  ]
  const ns = [1n, 2n, 3n]
  const [hl, setHl] = useState<string | null>(null)
  const cell = (v: bigint | null, k: string) => {
    const key = v === null ? null : v.toString()
    return (
      <td key={k} className={`mono ${key && key === hl ? 'c05-hl' : ''}`} onMouseEnter={() => setHl(key)} onClick={() => setHl(key)}>
        {v === null ? <span className="muted">{t('huge', '巨大')}</span> : v.toString().length > 12 ? `≈10^${v.toString().length - 1}` : v.toString()}
      </td>
    )
  }
  const table = (which: 0 | 1) => (
    <table className="grid c05-shell">
      <thead>
        <tr>
          <th colSpan={2}>{which === 0 ? <L en="FGH shell (book, Def 2.16)" zh="FGH 外壳（本书，定义 2.16）" /> : <L en="Hardy shell (original, Def 2.17)" zh="Hardy 外壳（原版，定义 2.17）" />}</th>
          <th>n=1</th>
          <th>n=2</th>
          <th>n=3</th>
        </tr>
      </thead>
      <tbody>
        {pairs.map((pr, i) => {
          const sq = pr[which]
          return (
            <tr key={i}>
              <td className="mono">{seqStr(sq)}</td>
              <td>
                <M t={toTex(seqToOrd(sq))} />
              </td>
              {ns.map((n) => cell(which === 0 ? fghShell(sq, n, { k: 200000 }) : hardyShell(sq, n), String(n)))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
  return (
    <div>
      <div className="c05-two c05-shells">
        <div className="scroll-x">{table(0)}</div>
        <div className="scroll-x">{table(1)}</div>
      </div>
      <div className="small muted" style={{ marginTop: 6 }}>
        {t('Hover or tap a number to light up every equal number. Row by row, the Hardy shell needs the ordinal ω^α to match the FGH shell at α.', '鼠标指向（或点击）一个数，所有相等的数都会亮起。逐行看：Hardy 外壳要用序数 ω^α 才追上 FGH 外壳的 α。')}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Break the rule                                                   */
/* ------------------------------------------------------------------ */
export function BrokenRule() {
  const { t } = useLang()
  const [k, setK] = useState(0)
  const timer = useRef<number | null>(null)
  const run = () => {
    if (timer.current) clearInterval(timer.current)
    setK(0)
    let i = 0
    timer.current = window.setInterval(() => {
      i++
      setK(i)
      if (i >= 14 && timer.current) clearInterval(timer.current)
    }, 450)
  }
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])
  // honest rule (Hardy shell) and broken rule, both from (0,1,2)[2]
  const good: CState[] = [{ s: [0, 1, 2], x: 2n }]
  while (good.length < 30) {
    const r = hardyStep(good[good.length - 1], false)
    if (!r || r === 'stuck') break
    good.push(r)
  }
  const broken: Seq[] = [[0, 1, 2]]
  for (let i = 0; i < 16; i++) broken.push(expandLimit(broken[broken.length - 1], 2, true))
  const g = good[Math.min(k, good.length - 1)]
  const b = broken[Math.min(k, broken.length - 1)]
  return (
    <div>
      <div className="c05-two">
        <div className="c05-panel">
          <div className="small">
            <b>{t('Real rule', '正确的规则')}</b> <span className="muted">{t('(copy up to, not including, the last term)', '（复制到末项之前，不含末项）')}</span>
          </div>
          <SeqChips s={g.s} after={<span className="mono">[{g.x.toString()}]</span>} />
          <div>
            <M t={toTex(seqToOrd(g.s))} />
          </div>
          <div className="small" style={{ color: k >= good.length - 1 ? 'var(--green)' : 'var(--muted)' }}>
            {k >= good.length - 1 ? t(`halts after ${good.length - 1} steps with value ${g.x}`, `${good.length - 1} 步后停机，结果为 ${g.x}`) : t('ordinal going down…', '序数在下降……')}
          </div>
        </div>
        <div className="c05-panel bad">
          <div className="small">
            <b>{t('Broken rule', '坏掉的规则')}</b> <span className="muted">{t('(copy the last term too)', '（连末项一起复制）')}</span>
          </div>
          <SeqChips s={b} max={30} after={<span className="mono">[2]</span>} />
          <div>
            <M t={toTex(seqToOrd(b))} />
          </div>
          <div className="small" style={{ color: 'var(--red)' }}>
            {k === 0 ? '' : t(`step ${k}: longer than ever, and the ordinal went UP`, `第 ${k} 步：比之前更长，序数反而升高了`)}
          </div>
        </div>
      </div>
      <div className="btn-row">
        <button className="btn small" onClick={run}>
          {t('run both on (0,1,2)[2]', '同时运行 (0,1,2)[2]')}
        </button>
      </div>
    </div>
  )
}

