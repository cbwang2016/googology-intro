import { useMemo, useState } from 'react'
import { L, useLang } from '../../i18n'
import { embedding, flatten, longestBad, parseCanon, size, treesUpTo, type Tree } from './trees'

export const COLOURS = ['#ff6b6b', '#7dffa8', '#6be4ff']
const CNAME = [
  { en: 'red', zh: '红' },
  { en: 'green', zh: '绿' },
  { en: 'blue', zh: '蓝' },
]

/* ---------------- tree editing helpers (by pre-order index) ---------------- */
function mapAt(t: Tree, idx: number, f: (n: Tree) => Tree | null): Tree | null {
  let k = 0
  const rec = (n: Tree): Tree | null => {
    const my = k++
    if (my === idx) return f(n)
    const ch: Tree[] = []
    for (const c of n.ch) {
      const r = rec(c)
      if (r) ch.push(r)
    }
    return { c: n.c, ch }
  }
  return rec(t)
}
const addChild = (t: Tree, i: number, c: number) => mapAt(t, i, (n) => ({ c: n.c, ch: [...n.ch, { c, ch: [] }] }))!
const recolour = (t: Tree, i: number, c: number) => mapAt(t, i, (n) => ({ c, ch: n.ch }))!
const removeAt = (t: Tree, i: number) => (i === 0 ? t : mapAt(t, i, () => null)!)

/* ---------------- drawing ---------------- */
export function TreeView({
  tree,
  scale = 1,
  sel,
  onSel,
  marks,
  dim,
}: {
  tree: Tree
  scale?: number
  sel?: number
  onSel?: (i: number) => void
  marks?: (number | null)[] // label to draw next to node i
  dim?: boolean
}) {
  const f = flatten(tree)
  const n = f.c.length
  const xs: number[] = new Array(n).fill(0)
  let leafX = 0
  const place = (i: number) => {
    if (f.children[i].length === 0) xs[i] = leafX++
    else {
      f.children[i].forEach(place)
      const ch = f.children[i]
      xs[i] = (xs[ch[0]] + xs[ch[ch.length - 1]]) / 2
    }
  }
  place(0)
  const maxD = Math.max(...f.depth)
  const dx = 30 * scale
  const dy = 34 * scale
  const r = 9 * scale
  const pad = 14 * scale
  const Wd = Math.max(1, leafX) * dx + 2 * pad - dx + 2 * r
  const Ht = maxD * dy + 2 * pad + 2 * r
  const X = (i: number) => pad + r + xs[i] * dx
  const Y = (i: number) => Ht - pad - r - f.depth[i] * dy
  return (
    <svg width={Wd} height={Ht} viewBox={`0 0 ${Wd} ${Ht}`} style={{ opacity: dim ? 0.45 : 1, overflow: 'visible' }}>
      {f.parent.map((p, i) => (p >= 0 ? <line key={'e' + i} x1={X(p)} y1={Y(p)} x2={X(i)} y2={Y(i)} stroke="#8a93bd" strokeWidth={2 * scale} /> : null))}
      {f.c.map((c, i) => (
        <g key={i} onClick={onSel ? () => onSel(i) : undefined} style={{ cursor: onSel ? 'pointer' : 'default' }}>
          <circle cx={X(i)} cy={Y(i)} r={r} fill={COLOURS[c]} stroke={sel === i ? '#ffd36b' : '#0a0e1f'} strokeWidth={sel === i ? 3.5 : 1.5} />
          {marks && marks[i] !== null && marks[i] !== undefined && (
            <text x={X(i) + r + 2} y={Y(i) - r + 2} fill="#ffd36b" fontSize={12 * Math.max(scale, 0.8)} fontWeight="700">
              {marks[i]}
            </text>
          )}
        </g>
      ))}
      {i0Root(X(0), Y(0), r)}
    </svg>
  )
}
function i0Root(x: number, y: number, r: number) {
  return <line x1={x - r - 3} y1={y + r + 4} x2={x + r + 3} y2={y + r + 4} stroke="#6b7399" strokeWidth={2} />
}

/* ---------------- a compact editor ---------------- */
function Editor({
  tree,
  setTree,
  colours,
  sel,
  setSel,
  marks,
  maxSize = 12,
}: {
  tree: Tree
  setTree: (t: Tree) => void
  colours: number
  sel: number
  setSel: (i: number) => void
  marks?: (number | null)[]
  maxSize?: number
}) {
  const [col, setCol] = useState(0)
  const c = Math.min(col, colours - 1)
  const n = size(tree)
  return (
    <div className="c07-editor">
      <div className="c07-canvas">
        <TreeView tree={tree} sel={sel} onSel={setSel} marks={marks} />
      </div>
      <div className="btn-row">
        {colours > 1 &&
          Array.from({ length: colours }, (_, k) => (
            <button key={k} className={`chip c07-colchip ${c === k ? 'on' : ''}`} onClick={() => setCol(k)} style={{ borderColor: COLOURS[k] }} title={CNAME[k].en} aria-label={CNAME[k].en}>
              <span className="c07-dot" style={{ background: COLOURS[k] }} />
            </button>
          ))}
        <button className="btn small" disabled={n >= maxSize} onClick={() => setTree(addChild(tree, sel, c))}>
          <L en="add child" zh="加子节点" />
        </button>
        {colours > 1 && (
          <button className="btn small" onClick={() => setTree(recolour(tree, sel, c))}>
            <L en="recolour" zh="改颜色" />
          </button>
        )}
        <button
          className="btn small"
          disabled={sel === 0}
          onClick={() => {
            setTree(removeAt(tree, sel))
            setSel(0)
          }}
        >
          <L en="delete branch" zh="删掉这枝" />
        </button>
      </div>
    </div>
  )
}

/* ================================================================== */
/* Embedding checker                                                   */
/* ================================================================== */
const EMB_PRESETS: { name: { en: string; zh: string }; a: string; b: string }[] = [
  { name: { en: 'path into a longer path', zh: '短链嵌入长链' }, a: '0(0)', b: '0(0(0))' },
  { name: { en: 'cherry into a star', zh: '樱桃嵌入星形' }, a: '0(0,0)', b: '0(0,1,0(0))' },
  { name: { en: 'the meeting-point trap', zh: '“交汇点”陷阱' }, a: '2(0,0)', b: '2(0(0,0))' },
  { name: { en: 'skipped vertices can be any colour', zh: '被跳过的点颜色随意' }, a: '0(0)', b: '0(1(0))' },
  { name: { en: 'neither way', zh: '谁也嵌不进谁' }, a: '0(0(0))', b: '0(0,0,0)' },
]

export function EmbeddingChecker() {
  const [ai, setAi] = useState(2)
  const [A, setA] = useState<Tree>(() => parseCanon(EMB_PRESETS[2].a))
  const [B, setB] = useState<Tree>(() => parseCanon(EMB_PRESETS[2].b))
  const [sa, setSa] = useState(0)
  const [sb, setSb] = useState(0)
  const m = useMemo(() => embedding(A, B), [A, B])
  const back = useMemo(() => embedding(B, A), [A, B])
  const marksA = m ? m.map((_, i) => i + 1) : undefined
  const marksB = m ? (() => {
    const arr: (number | null)[] = new Array(size(B)).fill(null)
    m.forEach((v, i) => {
      if (v >= 0) arr[v] = i + 1
    })
    return arr
  })() : undefined
  return (
    <div>
      <div className="btn-row">
        {EMB_PRESETS.map((p, i) => (
          <button
            key={i}
            className={`chip ${ai === i ? 'on' : ''}`}
            onClick={() => {
              setAi(i)
              setA(parseCanon(p.a))
              setB(parseCanon(p.b))
              setSa(0)
              setSb(0)
            }}
          >
            <L {...p.name} />
          </button>
        ))}
      </div>
      <div className="c07-two">
        <div>
          <div className="c07-label">A</div>
          <Editor tree={A} setTree={(t) => { setA(t); setAi(-1) }} colours={3} sel={sa} setSel={setSa} marks={marksA} maxSize={8} />
        </div>
        <div>
          <div className="c07-label">B</div>
          <Editor tree={B} setTree={(t) => { setB(t); setAi(-1) }} colours={3} sel={sb} setSel={setSb} marks={marksB} maxSize={10} />
        </div>
      </div>
      <div className={`readout c07-verdict ${m ? 'yes' : 'no'}`}>
        {m ? (
          <L
            en={<>A embeds into B. Gold numbers show where each vertex of A goes; vertices of B without a number are “smoothed away”.</>}
            zh={<>A 可以嵌入 B。金色数字标出 A 的每个点被送到 B 的哪里；B 中没编号的点都被“抹掉”了。</>}
          />
        ) : (
          <L en={<>A does not embed into B.</>} zh={<>A 不能嵌入 B。</>} />
        )}{' '}
        <span className="muted">
          {back ? <L en="(B does embed into A.)" zh="（反过来 B 能嵌入 A。）" /> : <L en="(Nor does B embed into A.)" zh="（反过来 B 也嵌不进 A。）" />}
        </span>
      </div>
      {ai === 2 && (
        <div className="small muted">
          <L
            en="Trap: send A's blue root to B's root and the two red leaves to B's two red leaves. Every vertex keeps its colour and its ancestors — but the two leaves now meet at the red middle vertex, not at the image of the blue root. Friedman's rule forbids this."
            zh="陷阱：把 A 的蓝根送到 B 的根，两片红叶送到 B 的两片红叶。颜色、祖先关系都没破坏——可是这两片叶子在 B 中的交汇点变成了红色的中间点，而不是蓝根的像。Friedman 的规则不允许这样。"
          />
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/* TREE game                                                           */
/* ================================================================== */
type Mode = { kind: 'TREE' | 'tree'; n: number }
const MODES: Mode[] = [
  { kind: 'TREE', n: 1 },
  { kind: 'TREE', n: 2 },
  { kind: 'TREE', n: 3 },
  { kind: 'tree', n: 1 },
  { kind: 'tree', n: 2 },
  { kind: 'tree', n: 3 },
]

export function TreeGame() {
  const { t } = useLang()
  const [mi, setMi] = useState(1)
  const mode = MODES[mi]
  const colours = mode.kind === 'TREE' ? mode.n : 1
  const [seq, setSeq] = useState<Tree[]>([])
  const [draft, setDraft] = useState<Tree>({ c: 0, ch: [] })
  const [sel, setSel] = useState(0)
  const [msg, setMsg] = useState<null | { ok: boolean; en: string; zh: string }>(null)
  const k = seq.length + 1
  const bound = mode.kind === 'TREE' ? k : mode.n + k
  const conflict = useMemo(() => {
    for (let i = 0; i < seq.length; i++) {
      const e = embedding(seq[i], draft)
      if (e) return { i, e }
    }
    return null
  }, [seq, draft])
  const marks = useMemo(() => {
    if (!conflict) return undefined
    const arr: (number | null)[] = new Array(size(draft)).fill(null)
    conflict.e.forEach((v, i) => {
      if (v >= 0) arr[v] = i + 1
    })
    return arr
  }, [conflict, draft])
  const tooBig = size(draft) > bound
  const reset = (m = mi) => {
    setMi(m)
    setSeq([])
    setDraft({ c: 0, ch: [] })
    setSel(0)
    setMsg(null)
  }
  const play = () => {
    if (tooBig || conflict) return
    setSeq([...seq, draft])
    setMsg(null)
    setSel(0)
  }
  const legalMoves = () => {
    if (bound > 6 || (colours === 3 && bound > 5)) {
      setMsg({ ok: true, en: 'Too many candidate trees to list here — but you are certainly not stuck yet.', zh: '候选树太多，这里不逐一列举——但你肯定还没被困住。' })
      return
    }
    const legal = treesUpTo(bound, colours).filter((c) => !seq.some((s) => embedding(s, parseCanon(c))))
    if (legal.length === 0) {
      setMsg({
        ok: false,
        en: `No legal tree exists: every tree with at most ${bound} vertices contains an earlier one. Game over after ${seq.length} trees.`,
        zh: `已经没有合法的树：每一棵不超过 ${bound} 个点的树都包含前面的某一棵。游戏结束，共 ${seq.length} 棵。`,
      })
    } else {
      const pick = legal[legal.length - 1]
      setDraft(parseCanon(pick))
      setSel(0)
      setMsg({ ok: true, en: `${legal.length} legal tree(s) available. Loaded one into the editor.`, zh: `还有 ${legal.length} 棵合法的树。已把其中一棵放进编辑器。` })
    }
  }
  return (
    <div>
      <div className="btn-row">
        {MODES.map((m, i) => (
          <button key={i} className={`chip ${mi === i ? 'on' : ''}`} onClick={() => reset(i)}>
            {m.kind}({m.n})
          </button>
        ))}
      </div>
      <div className="small muted">
        {mode.kind === 'TREE'
          ? t(`Rule: tree number k has at most k vertices, ${colours} colour(s).`, `规则：第 k 棵树至多 k 个点，可用 ${colours} 种颜色。`)
          : t(`Rule: tree number k has at most ${mode.n}+k vertices, one colour.`, `规则：第 k 棵树至多 ${mode.n}+k 个点，只有一种颜色。`)}{' '}
        {t('No earlier tree may embed into a later one.', '前面的树不能嵌入后面的树。')}
      </div>
      <div className="c07-seq">
        {seq.map((s, i) => (
          <div key={i} className={`c07-seq-item ${conflict && conflict.i === i ? 'bad' : ''}`}>
            <TreeView tree={s} scale={0.6} />
            <div className="c07-seq-n">T{i + 1}</div>
          </div>
        ))}
        {seq.length === 0 && <span className="muted small">{t('(empty so far)', '（还没有树）')}</span>}
      </div>
      <div className="c07-game">
        <div>
          <div className="c07-label">
            T{k}{' '}
            <span className={tooBig ? 'c07-bad' : 'muted'}>
              ({size(draft)}/{bound} {t('vertices', '个点')})
            </span>
          </div>
          <Editor tree={draft} setTree={setDraft} colours={colours} sel={sel} setSel={setSel} marks={marks} maxSize={bound + 2} />
        </div>
        <div className="c07-game-side">
          {conflict ? (
            <div className="c07-bad">{t(`T${conflict.i + 1} embeds into this tree (gold numbers). Not allowed.`, `T${conflict.i + 1} 能嵌入这棵树（见金色编号），不行。`)}</div>
          ) : tooBig ? (
            <div className="c07-bad">{t('Too many vertices.', '点太多了。')}</div>
          ) : (
            <div className="c07-good">{t('Legal move.', '合法。')}</div>
          )}
          <div className="btn-row">
            <button className="btn small" disabled={!!conflict || tooBig} onClick={play}>
              <L en="Play this tree" zh="出这棵树" />
            </button>
            <button className="btn small" onClick={legalMoves}>
              <L en="Am I stuck?" zh="我被困住了吗？" />
            </button>
            <button
              className="btn small"
              disabled={seq.length === 0}
              onClick={() => {
                setSeq(seq.slice(0, -1))
                setMsg(null)
              }}
            >
              <L en="Undo" zh="悔一步" />
            </button>
            <button className="btn small" onClick={() => reset()}>
              <L en="Restart" zh="重来" />
            </button>
          </div>
          {msg && <div className={msg.ok ? 'small' : 'small c07-bad'}>{t(msg.en, msg.zh)}</div>}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/* Exhaustive search                                                   */
/* ================================================================== */
const SEARCHES: { label: string; k: number; bound: (i: number) => number }[] = [
  { label: 'TREE(1)', k: 1, bound: (i) => i },
  { label: 'TREE(2)', k: 2, bound: (i) => i },
  { label: 'tree(1)', k: 1, bound: (i) => 1 + i },
  { label: 'tree(2)', k: 1, bound: (i) => 2 + i },
]

export function ExhaustiveSearch() {
  const [res, setRes] = useState<null | { label: string; len: number; seq: string[]; nodes: number; ms: number }>(null)
  const run = (i: number) => {
    const s = SEARCHES[i]
    const t0 = performance.now()
    const r = longestBad(s.k, s.bound)
    setRes({ label: s.label, ...r, ms: Math.round(performance.now() - t0) })
  }
  return (
    <div>
      <div className="btn-row">
        {SEARCHES.map((s, i) => (
          <button key={i} className={`chip ${res?.label === s.label ? 'on' : ''}`} onClick={() => run(i)}>
            <L en={`search ${s.label}`} zh={`搜索 ${s.label}`} />
          </button>
        ))}
      </div>
      {res ? (
        <div>
          <div className="readout">
            <L
              en={<>Every possible sequence checked ({res.nodes.toLocaleString()} partial sequences, {res.ms} ms). Longest: <b className="c07-fp">{res.label} = {res.len}</b>. One optimal sequence:</>}
              zh={<>所有可能的序列都检查过了（{res.nodes.toLocaleString()} 个部分序列，用时 {res.ms} 毫秒）。最长的长度：<b className="c07-fp">{res.label} = {res.len}</b>。其中一条最优序列：</>}
            />
          </div>
          <div className="c07-seq">
            {res.seq.map((c, i) => (
              <div key={i} className="c07-seq-item">
                <TreeView tree={parseCanon(c)} scale={0.6} />
                <div className="c07-seq-n">T{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="muted small">
          <L en="Pick a search. It tries every tree at every step (trees counted up to re-ordering of children)." zh="选一个搜索。它在每一步尝试所有可能的树（子节点的顺序不计）。" />
        </div>
      )}
    </div>
  )
}

