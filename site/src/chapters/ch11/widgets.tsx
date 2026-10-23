import { useEffect, useMemo, useRef, useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { HALT, Sim, classify, enumerateTNF, formatTM, history, parseTM, stateName, type Kind, type Machine, type Row } from './tm'
import { CodeField, SpaceTime, StLegend, TableEditor, TapeView, stateColor, useRunner } from './tmui'

/* ------------------------------------------------------------------ */
/* 1. Workbench: edit and run a machine                                 */
/* ------------------------------------------------------------------ */
const ADDER = '---0RB_0RC0RZ_---0RZ'
const DOUBLER = '---0RB_0RZ0RC_0RD1RC_1RE1RD_1LF---_0LG1LF_0RB1LG'
type Preset = { key: string; code: string; name: { en: string; zh: string }; inputs: number }
const PRESETS: Preset[] = [
  { key: 'champ', code: '1RB1LB_1LA1RZ', name: { en: '2-state champion', zh: '二状态冠军' }, inputs: 0 },
  { key: 'add', code: ADDER, name: { en: 'adder', zh: '加法器' }, inputs: 2 },
  { key: 'dbl', code: DOUBLER, name: { en: 'doubler', zh: '倍增器' }, inputs: 1 },
  { key: 'own', code: '1RB---_------', name: { en: 'blank: build your own', zh: '空白：自己造一台' }, inputs: 0 },
]

const unary = (k: number) => Array(k + 1).fill(1)

export function TMWorkbench() {
  const { t } = useLang()
  const [pi, setPi] = useState(0)
  const [mach, setMach] = useState<Machine>(() => parseTM(PRESETS[0].code)!)
  const [a, setA] = useState(2)
  const [b, setB] = useState(3)
  const [speed, setSpeed] = useState(1)
  const p = PRESETS[pi]
  const input = p.inputs === 2 ? [...unary(a), 0, ...unary(b)] : p.inputs === 1 ? unary(a) : []
  const R = useRunner(mach, input, speed)
  const choose = (i: number) => {
    setPi(i)
    setMach(parseTM(PRESETS[i].code)!)
  }
  const resize = (d: number) => {
    const n = Math.max(1, Math.min(7, mach.n + d))
    const tt = Array.from({ length: n }, (_, s) => (s < mach.n ? mach.t[s].map((x) => (x && x.s >= n ? null : x)) : [null, null]))
    setMach({ n, t: tt })
  }
  const sim = R.sim
  if (!sim) return null
  const expect = p.key === 'add' ? a + b : p.key === 'dbl' ? 2 * a : null
  return (
    <div>
      <div className="btn-row">
        {PRESETS.map((q, i) => (
          <button key={q.key} className={`chip ${i === pi ? 'on' : ''}`} onClick={() => choose(i)}>
            <L {...q.name} />
          </button>
        ))}
      </div>
      {p.inputs > 0 && (
        <div className="row">
          <Slider value={a} min={0} max={6} onChange={setA} label={p.inputs === 2 ? 'a' : 'n'} />
          {p.inputs === 2 && <Slider value={b} min={0} max={6} onChange={setB} label="b" />}
          <span className="muted small">
            {p.inputs === 2
              ? t(`input: ${a + 1} ones, a blank, ${b + 1} ones`, `输入：${a + 1} 个 1、一个空格、${b + 1} 个 1`)
              : t(`input: ${a + 1} ones`, `输入：${a + 1} 个 1`)}
          </span>
        </div>
      )}
      <div className="c11-wb">
        <div className="c11-wb-table">
          <TableEditor M={mach} onChange={setMach} active={R.last} />
          <div className="row" style={{ marginTop: 6 }}>
            <CodeField M={mach} onChange={setMach} />
            <button className="chip" onClick={() => resize(-1)} disabled={mach.n <= 1} aria-label={t('remove a state', '减少一个状态')}>
              −
            </button>
            <span className="small muted">{t(`${mach.n} states`, `${mach.n} 个状态`)}</span>
            <button className="chip" onClick={() => resize(1)} disabled={mach.n >= 7} aria-label={t('add a state', '增加一个状态')}>
              +
            </button>
          </div>
        </div>
      </div>
      <TapeView sim={sim} />
      <div className="btn-row">
        <button className="btn small" disabled={sim.halted} onClick={() => R.step(1)}>
          <L en="Step" zh="走一步" />
        </button>
        <button className="btn small" disabled={sim.halted} onClick={() => R.setRunning(!R.running)}>
          {R.running ? <L en="Pause" zh="暂停" /> : <L en="Run" zh="运行" />}
        </button>
        <button className="btn small" disabled={sim.halted} onClick={() => R.step(100000)}>
          <L en="Skip to the end" zh="直接跑完" />
        </button>
        <button className="btn small" onClick={R.reset}>
          <L en="Reset" zh="重置" />
        </button>
        <label className="small muted c11-speed">
          <L en="speed" zh="速度" />
          <input type="range" min={1} max={20} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </label>
      </div>
      <div className="row">
        <div className="stat">
          <span className="stat-label">{t('steps', '步数')}</span>
          <span className="stat-value">{sim.steps.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('ones on tape', '纸带上的 1')}</span>
          <span className="stat-value">{sim.ones}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('state', '状态')}</span>
          <span className="stat-value" style={{ color: stateColor(sim.halted ? HALT : sim.state) }}>
            {sim.halted ? t('Z (halted)', 'Z（已停机）') : stateName(sim.state)}
          </span>
        </div>
        {sim.halted && expect !== null && (
          <span className={`small ${sim.ones === expect ? 'c11-ok' : 'c11-bad'}`}>
            {sim.ones === expect
              ? t(`output ${sim.ones} = ${p.key === 'add' ? `${a}+${b}` : `2×${a}`} ✓`, `输出 ${sim.ones} = ${p.key === 'add' ? `${a}+${b}` : `2×${a}`} ✓`)
              : t(`output ${sim.ones}, expected ${expect}`, `输出 ${sim.ones}，应为 ${expect}`)}
          </span>
        )}
        {!sim.halted && sim.steps >= 100000 && <span className="small c11-bad">{t('still running after 100,000 steps…', '跑了 100,000 步还没停……')}</span>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Space-time gallery                                                */
/* ------------------------------------------------------------------ */
type Gal = { key: string; code: string; input?: number[]; name: { en: string; zh: string }; text: { en: string; zh: string } }
const GALLERY: Gal[] = [
  {
    key: 'halt',
    code: DOUBLER,
    input: unary(6),
    name: { en: 'halts (doubler, n = 6)', zh: '停机（倍增器，n = 6）' },
    text: {
      en: 'A zig-zag that shuttles one 1 at a time from the input block (left) to the output block (right), then stops. Halting is easy to certify: just watch it happen.',
      zh: '读头来回穿梭，每趟把左边输入块的一个 1 搬成右边输出块的两个 1，然后停下。停机很容易确认：看着它停就行。',
    },
  },
  {
    key: 'cycler',
    code: '1RB0RB_0LA---',
    name: { en: 'cycler', zh: '循环机' },
    text: {
      en: 'The whole configuration (tape, head, state) repeats exactly every 4 steps. Once a configuration repeats, the future is a loop: proof of non-halting by pigeonhole.',
      zh: '整个格局（纸带、读头位置、状态）每 4 步完全重复一次。格局一旦重复，未来就是死循环——这就是不停机的证明。',
    },
  },
  {
    key: 'translated',
    code: '1RB0LA_1LA---',
    name: { en: 'translated cycler', zh: '平移循环机' },
    text: {
      en: 'The same local pattern repeats, but shifted one cell to the left each time, marching off into fresh blank tape forever. The undefined transition B1 is never used.',
      zh: '同一个局部图案不断重复，只是每次向左平移一格，永远走向新的空白纸带。未定义的转移 B1 从来用不上。',
    },
  },
  {
    key: 'bouncer',
    code: '1RB0LC_0LA0RA_1LA---',
    name: { en: 'bouncer', zh: '弹跳机' },
    text: {
      en: 'The head sweeps back and forth across a growing region. Each sweep is longer than the last, so the run time grows quadratically with the width — the classic “bouncer” shape.',
      zh: '读头在一片不断变宽的区域里来回扫。每一趟都比上一趟长，宽度只按平方根增长——这是典型的“弹跳机”形状。',
    },
  },
  {
    key: 'counter',
    code: '1RB---_0LB1RC_1LB0RC',
    name: { en: 'binary counter', zh: '二进制计数器' },
    text: {
      en: 'Look at the left edge: the tape is a binary number being incremented, with carries rippling outward. The used region grows only logarithmically — after 2ᵏ increments it is about k cells wide.',
      zh: '看左侧：纸带上是一个不断加一的二进制数，进位一层层向外传播。用到的区域只按对数增长——加 2ᵏ 次之后大约只有 k 格宽。',
    },
  },
]

export function BehaviourGallery() {
  const [gi, setGi] = useState(3)
  const [steps, setSteps] = useState(400)
  const g = GALLERY[gi]
  const data = useMemo(() => {
    const Mc = parseTM(g.code)!
    const sim = new Sim(Mc).load(g.input ?? [])
    const rows: Row[] = []
    const snap = () => {
      const lo = Math.min(sim.minPos, 0) - 1
      const hi = sim.maxPos + 1
      rows.push({ cells: Uint8Array.from(sim.window(lo, hi)), lo, pos: sim.pos, state: sim.halted ? HALT : sim.state })
    }
    snap()
    while (!sim.halted && sim.steps < steps) {
      sim.step()
      snap()
    }
    return { rows, sim, n: Mc.n }
  }, [g, steps])
  return (
    <div>
      <div className="btn-row">
        {GALLERY.map((q, i) => (
          <button key={q.key} className={`chip ${i === gi ? 'on' : ''}`} onClick={() => setGi(i)}>
            <L {...q.name} />
          </button>
        ))}
      </div>
      <div className="row">
        <span className="mono small c11-codeshow">{g.code}</span>
        <Slider value={steps} min={20} max={1500} step={20} onChange={setSteps} label={<L en="steps" zh="步数" />} />
      </div>
      <SpaceTime rows={data.rows} maxH={165} />
      <StLegend n={data.n} />
      <div className="readout small c11-prose">
        <L {...g.text} />
        {data.sim.halted && <L en={` (halted after ${data.sim.steps} steps)`} zh={`（${data.sim.steps} 步后停机）`} />}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. The paradox game                                                   */
/* ------------------------------------------------------------------ */
type Verdict = 'halts' | 'loops' | 'silent'
export function ParadoxGame() {
  const { t } = useLang()
  const [round, setRound] = useState(1)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [shown, setShown] = useState(0)
  const [spin, setSpin] = useState(0)
  const timer = useRef<number | null>(null)
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])
  const H = round === 1 ? 'HALT' : `HALT${round}`
  const Tn = round === 1 ? 'TROLL' : `TROLL${round}`
  const play = (v: Verdict) => {
    setVerdict(v)
    setShown(0)
    setSpin(0)
    if (timer.current) clearInterval(timer.current)
    let k = 0
    timer.current = window.setInterval(() => {
      k++
      setShown(k)
      if (k > 6) setSpin((x) => x + 1)
      if (k > 40 && timer.current) clearInterval(timer.current)
    }, 420)
  }
  const lines: { en: string; zh: string; cls?: string }[] = []
  if (verdict) {
    lines.push({ en: `${Tn} starts. Its input x is its own source code ⟨${Tn}⟩.`, zh: `${Tn} 启动。它的输入 x 正是它自己的源代码 ⟨${Tn}⟩。` })
    lines.push({ en: `${Tn} asks ${H}: “does machine x halt on input x?” — that is, does ${Tn} halt on ⟨${Tn}⟩?`, zh: `${Tn} 问 ${H}：“机器 x 在输入 x 上停机吗？”——也就是：${Tn} 在 ⟨${Tn}⟩ 上停机吗？` })
    if (verdict === 'silent') {
      lines.push({ en: `${H} thinks… and thinks… and never answers.`, zh: `${H} 想啊想……一直不回答。`, cls: 'warn' })
      lines.push({
        en: `So ${H} is not a decider: a decider must answer every question in finite time. ${Tn} hangs forever waiting for you.`,
        zh: `那 ${H} 就不是判定器了：判定器必须对每个问题都在有限时间内给出答案。${Tn} 只好永远等下去。`,
        cls: 'bad',
      })
    } else {
      lines.push({ en: `${H} answers: “${verdict === 'halts' ? 'it halts' : 'it runs forever'}.”`, zh: `${H} 回答：“${verdict === 'halts' ? '会停机' : '永远不停'}。”` })
      lines.push(
        verdict === 'halts'
          ? { en: `${Tn} reads the answer “halts” and does the opposite: it enters an infinite loop.`, zh: `${Tn} 读到“会停机”，于是反着干：进入死循环。`, cls: 'warn' }
          : { en: `${Tn} reads the answer “runs forever” and does the opposite: it halts immediately.`, zh: `${Tn} 读到“永远不停”，于是反着干：立刻停机。`, cls: 'warn' },
      )
      lines.push(
        verdict === 'halts'
          ? { en: `${H} said ${Tn} halts on ⟨${Tn}⟩. It never halts. ${H} is wrong.`, zh: `${H} 说 ${Tn} 在 ⟨${Tn}⟩ 上会停，可它永远不停。${H} 答错了。`, cls: 'bad' }
          : { en: `${H} said ${Tn} runs forever on ⟨${Tn}⟩. It just halted. ${H} is wrong.`, zh: `${H} 说 ${Tn} 在 ⟨${Tn}⟩ 上永远不停，可它刚刚停了。${H} 答错了。`, cls: 'bad' },
      )
    }
  }
  const done = verdict !== null && shown >= lines.length
  return (
    <div>
      <div className="c11-paradox">
        <pre className="readout c11-code-block">{`${Tn}(x):                       ${t('// x is any machine code', '// x 是任意一台机器的代码')}
  r = ${H}(x, x)               ${t('// ask the oracle about x run on x', '// 问神谕：x 在输入 x 上停不停')}
  if r == "halts":  loop forever
  else:             halt`}</pre>
        <div className="c11-paradox-q">
          <L
            en={<>You are <b>{H}</b>{round > 1 ? ' (patched)' : ''}. Your claim: you can tell, for every machine and input, whether it halts. Question: <b>does {Tn} halt on its own code?</b></>}
            zh={<>你是 <b>{H}</b>{round > 1 ? '（打过补丁）' : ''}。你声称：对任何机器、任何输入，都能判断它停不停。问题来了：<b>{Tn} 以自己的代码为输入时，停不停？</b></>}
          />
        </div>
        <div className="btn-row">
          <button className="btn small" onClick={() => play('halts')}>
            <L en="“It halts”" zh="“会停”" />
          </button>
          <button className="btn small" onClick={() => play('loops')}>
            <L en="“It runs forever”" zh="“永远不停”" />
          </button>
          <button className="btn small" onClick={() => play('silent')}>
            <L en="(refuse to answer)" zh="（拒绝回答）" />
          </button>
        </div>
      </div>
      <div className="c11-log" aria-live="polite">
        {lines.slice(0, shown).map((l, i) => (
          <div key={i} className={`c11-logline ${l.cls ?? ''}`}>
            <span className="c11-lognum">{i + 1}</span>
            <L en={l.en} zh={l.zh} />
            {i === 3 && l.cls === 'warn' && verdict === 'halts' && <span className="c11-spin"> ⟳ {spin}</span>}
          </div>
        ))}
      </div>
      {done && verdict !== 'silent' && (
        <div className="btn-row">
          <button
            className="btn small"
            onClick={() => {
              setRound(round + 1)
              setVerdict(null)
              setShown(0)
            }}
          >
            <L en={`Patch ${H}: hard-code the right answer for ${Tn}`} zh={`给 ${H} 打补丁：把 ${Tn} 的正确答案写死`} />
          </button>
        </div>
      )}
      {round > 1 && verdict === null && (
        <div className="small muted">
          <L
            en={`You patched the oracle into ${H}. It now answers correctly about the old troll. But ${Tn} is built from ${H} in exactly the same way — the patch itself is what the new troll consults.`}
            zh={`你把神谕升级成了 ${H}，它现在能答对旧的 troll。但 ${Tn} 是用同样的方法从 ${H} 造出来的——新 troll 咨询的正是打过补丁的你。`}
          />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. The diagonal halting table                                         */
/* ------------------------------------------------------------------ */
const isPrime = (n: number) => {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}
type Cell = 'H' | 'L' | '?'
type Prog = { name: { en: string; zh: string }; f: (x: number) => Cell; why: { en: string; zh: string } }
const collatzHalts = (x: number): Cell => {
  if (x === 0) return 'L'
  let y = x
  for (let i = 0; i < 1000; i++) {
    if (y === 1) return 'H'
    y = y % 2 ? 3 * y + 1 : y / 2
  }
  return '?'
}
const PROGS: Prog[] = [
  { name: { en: 'halt at once', zh: '立刻停机' }, f: () => 'H', why: { en: 'Trivial.', zh: '显然。' } },
  { name: { en: 'loop forever', zh: '死循环' }, f: () => 'L', why: { en: 'Trivial.', zh: '显然。' } },
  {
    name: { en: 'while x ≠ 0: x ← x − 2', zh: '当 x ≠ 0：x ← x − 2' },
    f: (x) => (x % 2 ? 'L' : 'H'),
    why: { en: 'Halts iff x is even (odd x jumps over 0 into the negatives forever).', zh: '当且仅当 x 为偶数时停机（奇数会跳过 0，一直减下去）。' },
  },
  {
    name: { en: 'search for a prime > x', zh: '寻找大于 x 的素数' },
    f: () => 'H',
    why: { en: 'Always halts: Euclid proved there are infinitely many primes.', zh: '总会停：欧几里得证明了素数有无穷多个。' },
  },
  {
    name: { en: 'Collatz from x until reaching 1', zh: '从 x 出发做 Collatz 直到 1' },
    f: collatzHalts,
    why: { en: 'n ↦ n/2 or 3n+1. From 0 it is stuck at 0; from 1–7 it reaches 1 (computed). For all x ≥ 1? That is the Collatz conjecture.', zh: 'n ↦ n/2 或 3n+1。从 0 出发永远停在 0；从 1–7 出发都会到 1（已计算）。对所有 x ≥ 1 都成立吗？这就是 Collatz 猜想。' },
  },
  {
    name: { en: 'search for y with y·y = x', zh: '寻找满足 y·y = x 的 y' },
    f: (x) => (Number.isInteger(Math.sqrt(x)) ? 'H' : 'L'),
    why: { en: 'Halts iff x is a perfect square — once y·y > x the search can never succeed, though the program keeps trying.', zh: '当且仅当 x 是完全平方数时停机——一旦 y·y > x 就再也不可能成功，但程序会一直试下去。' },
  },
  {
    name: { en: 'search for twin primes p, p+2 > x', zh: '寻找大于 x 的孪生素数 p, p+2' },
    f: (x) => {
      for (let p = x + 1; p < 10000; p++) if (isPrime(p) && isPrime(p + 2)) return 'H'
      return '?'
    },
    why: { en: 'Halts for every x anyone has tried. Halts for all x ⇔ the twin prime conjecture (open).', zh: '对试过的每个 x 都会停。对所有 x 都停 ⇔ 孪生素数猜想（未解决）。' },
  },
  {
    name: { en: 'search for an even n ≥ 4 that is not a sum of two primes', zh: '寻找不能写成两个素数之和的偶数 n ≥ 4' },
    f: () => '?',
    why: { en: 'Halts ⇔ Goldbach’s conjecture is false. Checked up to 4·10¹⁸ without halting; nobody knows.', zh: '停机 ⇔ Goldbach 猜想不成立。验证到 4·10¹⁸ 都没停；没有人知道答案。' },
  },
]

export function HaltingTable() {
  const { t } = useLang()
  const [sel, setSel] = useState<number | null>(2)
  const N = PROGS.length
  const flip = (c: Cell): Cell => (c === 'H' ? 'L' : c === 'L' ? 'H' : '?')
  const sym = (c: Cell) => (c === 'H' ? '■' : c === 'L' ? '∞' : '?')
  return (
    <div>
      <div className="scroll-x">
        <table className="grid c11-ht">
          <thead>
            <tr>
              <th className="c11-ht-name">{t('program \\ input x', '程序 \\ 输入 x')}</th>
              {Array.from({ length: N }, (_, x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROGS.map((p, i) => (
              <tr key={i} className={sel === i ? 'on' : ''} onClick={() => setSel(i)}>
                <th className="c11-ht-name">
                  <span className="mono">P{i}</span> <L {...p.name} />
                </th>
                {Array.from({ length: N }, (_, x) => {
                  const c = p.f(x)
                  return (
                    <td key={x} className={`c11-ht-${c} ${x === i ? 'diag' : ''} ${sel === i && x === i ? 'clash' : ''}`}>
                      {sym(c)}
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr className="c11-ht-troll">
              <th className="c11-ht-name">
                <span className="mono">TROLL</span> <L en="flip the diagonal" zh="把对角线反过来" />
              </th>
              {PROGS.map((p, x) => {
                const c = flip(p.f(x))
                return (
                  <td key={x} className={`c11-ht-${c} ${sel === x ? 'clash' : ''}`}>
                    {sym(c)}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="small muted">
        ■ <L en="halts" zh="停机" /> · ∞ <L en="runs forever" zh="永不停机" /> · ? <L en="unknown to anyone" zh="无人知晓" />
      </div>
      {sel !== null && (
        <div className="readout small c11-prose">
          <b>P{sel}:</b> <L {...PROGS[sel].why} />{' '}
          {PROGS[sel].f(sel) === '?' ? (
            <L
              en="Its diagonal entry is unknown, so even writing down TROLL’s entry here would require solving an open problem. A halting decider would have to do this for every row."
              zh="它的对角元无人知晓，所以连写出 TROLL 在这一格的值都需要解决一个公开难题。一个停机判定器必须对每一行都做到这件事。"
            />
          ) : (
            <L
              en={`TROLL disagrees with P${sel} at input ${sel}: P${sel}(${sel}) ${PROGS[sel].f(sel) === 'H' ? 'halts' : 'runs forever'}, TROLL(${sel}) ${PROGS[sel].f(sel) === 'H' ? 'runs forever' : 'halts'}. So TROLL ≠ P${sel}. The same holds for every row.`}
              zh={`TROLL 在输入 ${sel} 处与 P${sel} 不同：P${sel}(${sel}) ${PROGS[sel].f(sel) === 'H' ? '停机' : '不停'}，TROLL(${sel}) ${PROGS[sel].f(sel) === 'H' ? '不停' : '停机'}。所以 TROLL ≠ P${sel}。每一行都是如此。`}
            />
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. All 2-state machines in Tree Normal Form                          */
/* ------------------------------------------------------------------ */
const KIND_NAME: Record<Kind, { en: string; zh: string }> = {
  halt: { en: 'halts', zh: '停机' },
  cycler: { en: 'cycler', zh: '循环' },
  translated: { en: 'translated cycler', zh: '平移循环' },
  bouncer: { en: 'bouncer', zh: '弹跳' },
  counter: { en: 'counter', zh: '计数器' },
  unknown: { en: 'unknown', zh: '未知' },
}
const KIND_COLOR: Record<Kind, string> = { halt: '#ffd36b', cycler: '#b59bff', translated: '#6be4ff', bouncer: '#ff7ab6', counter: '#7dffa8', unknown: '#9aa3c7' }

export function TNFExplorer() {
  const { t } = useLang()
  const all = useMemo(
    () =>
      enumerateTNF(2).map((l) => {
        const c = classify(l.M)
        return { code: formatTM(l.M), M: l.M, kind: c.kind, steps: c.steps, ones: c.ones }
      }),
    [],
  )
  const [filter, setFilter] = useState<Kind | 'all'>('all')
  const [pick, setPick] = useState<string>('1RB1LB_1LA1RZ')
  const [three, setThree] = useState<null | { leaves: number; halting: number; S: number; sigma: number }>(null)
  const counts = useMemo(() => {
    const c: Partial<Record<Kind, number>> = {}
    all.forEach((m) => (c[m.kind] = (c[m.kind] ?? 0) + 1))
    return c
  }, [all])
  const list = all.filter((m) => filter === 'all' || m.kind === filter).sort((x, y) => (x.kind === 'halt' && y.kind === 'halt' ? y.steps - x.steps || y.ones - x.ones : x.kind < y.kind ? -1 : 1))
  const cur = all.find((m) => m.code === pick) ?? all[0]
  const rows = useMemo(() => history(cur.M, 36).rows, [cur])
  return (
    <div>
      <div className="btn-row">
        <button className={`chip ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>
          {t(`all ${all.length}`, `全部 ${all.length}`)}
        </button>
        {(Object.keys(counts) as Kind[]).map((k) => (
          <button key={k} className={`chip ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>
            <i className="c11-dot" style={{ background: KIND_COLOR[k] }} /> <L {...KIND_NAME[k]} /> {counts[k]}
          </button>
        ))}
      </div>
      <div className="c11-tnf">
        <div className="c11-tnf-list" role="listbox" aria-label={t('machines', '机器列表')}>
          {list.map((m) => (
            <button key={m.code} role="option" aria-selected={m.code === pick} className={`c11-tnf-item ${m.code === pick ? 'on' : ''}`} onClick={() => setPick(m.code)}>
              <i className="c11-dot" style={{ background: KIND_COLOR[m.kind] }} />
              <span className="mono">{m.code}</span>
              {m.kind === 'halt' && (
                <span className="c11-tnf-score">
                  {m.steps}/{m.ones}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="c11-tnf-view">
          <div className="mono small">{cur.code}</div>
          <div className="small" style={{ color: KIND_COLOR[cur.kind] }}>
            <L {...KIND_NAME[cur.kind]} />
            {cur.kind === 'halt' && <L en={` · ${cur.steps} steps, ${cur.ones} ones`} zh={` · ${cur.steps} 步，${cur.ones} 个 1`} />}
          </div>
          <SpaceTime rows={rows} maxH={250} />
        </div>
      </div>
      <div className="small muted">
        <L en="Halting machines show steps/ones. Sorted by steps." zh="停机的机器标注“步数/1 的个数”，按步数排序。" />
      </div>
      <div className="btn-row">
        <button
          className="btn small"
          onClick={() => {
            const L3 = enumerateTNF(3, 400)
            const h = L3.filter((l) => l.halted)
            setThree({ leaves: L3.length, halting: h.length, S: Math.max(...h.map((l) => l.steps)), sigma: Math.max(...h.map((l) => l.ones)) })
          }}
        >
          <L en="Now enumerate all 3-state TNF machines" zh="现在枚举所有三状态 TNF 机器" />
        </button>
        {three && (
          <span className="small">
            {t(
              `${three.leaves.toLocaleString()} machines, ${three.halting.toLocaleString()} halt; longest halting run ${three.S} steps; most ones ${three.sigma}.`,
              `共 ${three.leaves.toLocaleString()} 台，其中 ${three.halting.toLocaleString()} 台停机；停机者最多走 ${three.S} 步，最多留下 ${three.sigma} 个 1。`,
            )}
          </span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Proving non-halting with an invariant (closed tape language)      */
/* ------------------------------------------------------------------ */
const INV_CODE = '1RB0LA_1LA---'
type Pat = { re: RegExp; tex: string; color: string }
const GOOD: Pat[] = [
  { re: /^A1[01]*$/, tex: '\\texttt{A}1\\,\\{0,1\\}^*', color: 'rgba(107,228,255,0.22)' },
  { re: /^A0(0[01]*)?$/, tex: '\\texttt{A}0\\;\\text{or}\\;\\texttt{A}00\\,\\{0,1\\}^*', color: 'rgba(125,255,168,0.22)' },
  { re: /^1B0[01]*$/, tex: '1\\,\\texttt{B}0\\,\\{0,1\\}^*', color: 'rgba(255,122,182,0.22)' },
]
const SLOPPY: Pat[] = [
  { re: /^A[01]+$/, tex: '\\texttt{A}\\,\\{0,1\\}^+', color: 'rgba(107,228,255,0.22)' },
  { re: /^1B[01]+$/, tex: '1\\,\\texttt{B}\\,\\{0,1\\}^+', color: 'rgba(255,122,182,0.22)' },
]

/** Canonical word: tape from min(head, leftmost 1) to max(head, rightmost 1), state letter before the scanned cell. */
function canon(sim: Sim): string {
  let lo = sim.pos
  let hi = sim.pos
  for (let p = sim.minPos - 1; p <= sim.maxPos + 1; p++)
    if (sim.read(p)) {
      lo = Math.min(lo, p)
      hi = Math.max(hi, p)
    }
  let s = ''
  for (let p = lo; p <= hi; p++) s += (p === sim.pos ? stateName(sim.state) : '') + sim.read(p)
  return s
}
function fromWord(Mc: Machine, w: string): Sim {
  const i = w.search(/[A-Z]/)
  const cells = (w.slice(0, i) + w.slice(i + 1)).split('').map(Number)
  const sim = new Sim(Mc).load(cells)
  sim.pos = i
  sim.state = w.charCodeAt(i) - 65
  return sim
}

export function InvariantProver() {
  const { t } = useLang()
  const Mc = useMemo(() => parseTM(INV_CODE)!, [])
  const [sloppy, setSloppy] = useState(false)
  const pats = sloppy ? SLOPPY : GOOD
  const [report, setReport] = useState<null | { checked: number; bad: null | { from: string; to: string; halt: boolean } }>(null)
  useEffect(() => setReport(null), [sloppy])
  const { rows, words } = useMemo(() => {
    const sim = new Sim(Mc)
    const rows: Row[] = []
    const words: string[] = []
    for (let i = 0; i <= 28; i++) {
      const lo = Math.min(sim.minPos, 0) - 1
      rows.push({ cells: Uint8Array.from(sim.window(lo, sim.maxPos + 1)), lo, pos: sim.pos, state: sim.state })
      words.push(canon(sim))
      sim.step()
    }
    return { rows, words }
  }, [Mc])
  const which = (w: string) => pats.findIndex((p) => p.re.test(w))
  const check = () => {
    let checked = 0
    const seen = new Set<string>()
    for (let len = 0; len <= 11; len++)
      for (let bits = 0; bits < 1 << len; bits++) {
        const v = len ? bits.toString(2).padStart(len, '0') : ''
        for (const pre of ['A1', 'A0', 'A00', '1B0', 'A', '1B']) {
          const w = pre + v
          if (!/[A-Z][01]/.test(w)) continue
          const sim0 = fromWord(Mc, w)
          const cw = canon(sim0)
          if (seen.has(cw) || which(cw) < 0) continue
          seen.add(cw)
          checked++
          const sym = sim0.read(sim0.pos)
          const tr = Mc.t[sim0.state][sym]
          if (!tr) {
            setReport({ checked, bad: { from: cw, to: 'HALT', halt: true } })
            return
          }
          sim0.step()
          const nw = canon(sim0)
          if (which(nw) < 0) {
            setReport({ checked, bad: { from: cw, to: nw, halt: false } })
            return
          }
        }
      }
    setReport({ checked, bad: null })
  }
  return (
    <div>
      <div className="row">
        <span className="mono c11-codeshow">{INV_CODE}</span>
        <span className="small muted">
          <L en="The only way to halt: be in state B reading a 1." zh="唯一的停机方式：处于状态 B 且读到 1。" />
        </span>
      </div>
      <div className="btn-row">
        <button className={`chip ${!sloppy ? 'on' : ''}`} onClick={() => setSloppy(false)}>
          <L en="careful invariant" zh="精心设计的不变量" />
        </button>
        <button className={`chip ${sloppy ? 'on' : ''}`} onClick={() => setSloppy(true)}>
          <L en="sloppy invariant" zh="粗糙的不变量" />
        </button>
      </div>
      <div className="c11-inv">
        <div>
          <div className="small muted">
            <L en="Candidate set C (words: tape with the state letter before the scanned cell)" zh="候选集合 C（写法：纸带内容，状态字母放在被读的格子前）" />
          </div>
          {pats.map((p, i) => (
            <div key={i} className="c11-pat" style={{ background: p.color }}>
              <M t={p.tex} />
            </div>
          ))}
          <div className="c11-inv-words mono small">
            {words.slice(0, 12).map((w, i) => {
              const k = which(w)
              return (
                <div key={i} style={{ background: k >= 0 ? pats[k].color : 'rgba(255,107,107,0.3)' }}>
                  {i}: {w}
                </div>
              )
            })}
          </div>
        </div>
        <SpaceTime rows={rows} maxH={300} highlight={(i) => (which(words[i]) >= 0 ? pats[which(words[i])].color : 'rgba(255,107,107,0.35)')} />
      </div>
      <div className="btn-row">
        <button className="btn small" onClick={check}>
          <L en="Check: is C closed under one step? (all words up to length 13)" zh="检验：C 在一步之下封闭吗？（长度 ≤ 13 的所有词）" />
        </button>
      </div>
      {report && (
        <div className={`readout small ${report.bad ? 'c11-bad' : 'c11-ok'}`}>
          {report.bad
            ? report.bad.halt
              ? t(`Counterexample: ${report.bad.from} is in C and its next step is the halting transition. C proves nothing.`, `反例：${report.bad.from} 属于 C，而它的下一步就是停机转移。这个 C 什么也证明不了。`)
              : t(`Counterexample: ${report.bad.from} → ${report.bad.to}, which is not in C.`, `反例：${report.bad.from} → ${report.bad.to}，后者不在 C 里。`)
            : t(
                `Checked ${report.checked.toLocaleString()} configurations in C: every successor is again in C, and none of them is about to halt. (The three-line proof in the next scene covers all lengths.)`,
                `检查了 C 中的 ${report.checked.toLocaleString()} 个格局：每一个的下一步仍在 C 中，且没有一个即将停机。（下一幕的三行证明覆盖了所有长度。）`,
              )}
        </div>
      )}
    </div>
  )
}
