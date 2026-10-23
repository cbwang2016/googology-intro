import { useEffect, useRef, useState, type ReactNode } from 'react'
import { B, L, useLang, type Bi } from '../i18n'

/** Fades children in when scrolled into view (immersive reading). */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setShown(true)),
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${shown ? 'shown' : ''}`}>
      {children}
    </div>
  )
}

export function Section({ id, title, kicker, children }: { id: string; title: Bi<string>; kicker?: Bi<string>; children: ReactNode }) {
  return (
    <section id={id} className="section" data-title-en={title.en} data-title-zh={title.zh}>
      <Reveal>
        {kicker && (
          <div className="kicker">
            <L {...kicker} />
          </div>
        )}
        <h2>
          <L {...title} />
        </h2>
      </Reveal>
      {children}
    </section>
  )
}

export function H3({ en, zh }: Bi<string>) {
  return (
    <h3>
      <L en={en} zh={zh} />
    </h3>
  )
}

/** Collapsible panel. kind controls the colour/label. */
export function Expand({
  kind = 'proof',
  title,
  children,
}: {
  kind?: 'proof' | 'detail' | 'deeper'
  title: Bi<string>
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { t } = useLang()
  const label =
    kind === 'proof' ? t('Full proof', '完整证明') : kind === 'detail' ? t('Details', '细节') : t('Go deeper', '深入一步')
  return (
    <div className={`expand expand-${kind} ${open ? 'open' : ''}`}>
      <button className="expand-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="expand-icon">{open ? '−' : '+'}</span>
        <span className="expand-label">{label}</span>
        <span className="expand-title">
          <L {...title} />
        </span>
      </button>
      {open && <div className="expand-body">{children}</div>}
    </div>
  )
}

type StatusKind = 'proved' | 'conjecture' | 'folklore' | 'convention' | 'open'
const statusText: Record<StatusKind, Bi<string>> = {
  proved: { en: 'Proved', zh: '已证明' },
  conjecture: { en: 'Conjecture', zh: '猜想' },
  folklore: { en: 'Community estimate', zh: '社区估计' },
  convention: { en: 'Convention', zh: '约定' },
  open: { en: 'Open problem', zh: '未解决' },
}
export function Status({ kind }: { kind: StatusKind }) {
  return (
    <span className={`status status-${kind}`}>
      <L {...statusText[kind]} />
    </span>
  )
}

export function Thm({
  kind = 'theorem',
  name,
  status = 'proved',
  children,
}: {
  kind?: 'theorem' | 'lemma' | 'definition' | 'fact'
  name?: Bi<string>
  status?: StatusKind
  children: ReactNode
}) {
  const label: Record<string, Bi<string>> = {
    theorem: { en: 'Theorem', zh: '定理' },
    lemma: { en: 'Lemma', zh: '引理' },
    definition: { en: 'Definition', zh: '定义' },
    fact: { en: 'Fact', zh: '事实' },
  }
  return (
    <Reveal>
      <div className={`thm thm-${kind}`}>
        <div className="thm-head">
          <b>
            <L {...label[kind]} />
          </b>
          {name && (
            <span className="thm-name">
              {' '}
              <L {...name} />
            </span>
          )}
          {kind !== 'definition' && <Status kind={status} />}
        </div>
        <div className="thm-body">{children}</div>
      </div>
    </Reveal>
  )
}

export function Proof({ children }: { children: ReactNode }) {
  return (
    <div className="proof">
      <span className="proof-label">
        <L en="Proof." zh="证明." />
      </span>{' '}
      {children}
      <span className="qed">∎</span>
    </div>
  )
}

export function KeyIdea({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <div className="key-idea">
        <div className="key-idea-label">
          <L en="Key idea" zh="核心思想" />
        </div>
        {children}
      </div>
    </Reveal>
  )
}

export function OpenProblem({ title, children }: { title: Bi<string>; children: ReactNode }) {
  return (
    <Reveal>
      <div className="open-problem">
        <div className="op-head">
          <span className="op-icon">🔓</span>
          <b>
            <L {...title} />
          </b>
          <Status kind="open" />
        </div>
        {children}
      </div>
    </Reveal>
  )
}

export function Caution({ children }: { children: ReactNode }) {
  return (
    <div className="caution">
      <span className="caution-icon">⚠</span>
      <div>{children}</div>
    </div>
  )
}

/** Wrapper for an interactive widget. */
export function Widget({ title, children, hint }: { title: Bi<string>; children: ReactNode; hint?: Bi<string> }) {
  return (
    <Reveal>
      <figure className="widget">
        <figcaption>
          <span className="widget-dot" />
          <L {...title} />
        </figcaption>
        {hint && (
          <div className="widget-hint">
            <L {...hint} />
          </div>
        )}
        <div className="widget-body">{children}</div>
      </figure>
    </Reveal>
  )
}

/** A checkpoint question. */
export function Quiz({
  q,
  options,
  answer,
  explain,
}: {
  q: Bi
  options: Bi[]
  answer: number
  explain: Bi
}) {
  const [picked, setPicked] = useState<number | null>(null)
  return (
    <Reveal>
      <div className="quiz">
        <div className="quiz-label">
          <L en="Checkpoint" zh="小测验" />
        </div>
        <div className="quiz-q">
          <B {...q} />
        </div>
        <div className="quiz-options">
          {options.map((o, i) => (
            <button
              key={i}
              className={picked === null ? '' : i === answer ? 'right' : picked === i ? 'wrong' : 'dim'}
              onClick={() => setPicked(i)}
            >
              <B {...o} />
            </button>
          ))}
        </div>
        {picked !== null && (
          <div className={`quiz-explain ${picked === answer ? 'ok' : 'no'}`}>
            <b>{picked === answer ? <L en="Correct. " zh="正确。" /> : <L en="Not quite. " zh="不对哦。" />}</b>
            <B {...explain} />
          </div>
        )}
      </div>
    </Reveal>
  )
}

/** "What you need" list at the top of a chapter. */
export function Prereq({ items }: { items: Bi[] }) {
  return (
    <div className="prereq">
      <div className="prereq-label">
        <L en="You need" zh="预备知识" />
      </div>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <B {...it} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
}: {
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  label?: ReactNode
}) {
  return (
    <label className="slider">
      {label && <span className="slider-label">{label}</span>}
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="slider-value">{value}</span>
    </label>
  )
}
