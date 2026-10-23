import { cloneElement, createContext, isValidElement, useContext, useEffect, useState, type ReactNode } from 'react'

/** Display mode: English only, Chinese only, or both (Chinese first, English below). */
export type Mode = 'en' | 'zh' | 'bi'

/** A piece of content in both languages. */
export type Bi<T = ReactNode> = { en: T; zh: T }

type Ctx = { mode: Mode; setMode: (m: Mode) => void }
const LangContext = createContext<Ctx>({ mode: 'bi', setMode: () => {} })

const KEY = 'googology-lang-mode'

function initialMode(): Mode {
  const saved = localStorage.getItem(KEY)
  if (saved === 'en' || saved === 'zh' || saved === 'bi') return saved
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  useEffect(() => {
    localStorage.setItem(KEY, mode)
    document.documentElement.lang = mode === 'en' ? 'en' : 'zh-CN'
  }, [mode])
  return <LangContext.Provider value={{ mode, setMode }}>{children}</LangContext.Provider>
}

export function useLang() {
  const { mode, setMode } = useContext(LangContext)
  /** Plain-string translation for labels, attributes, canvas text. */
  const t = (en: string, zh: string) => (mode === 'en' ? en : mode === 'zh' ? zh : `${zh} · ${en}`)
  /** Single-language pick (bilingual mode prefers Chinese); for places that cannot hold two strings. */
  const pick = <T,>(en: T, zh: T) => (mode === 'en' ? en : zh)
  return { mode, setMode, t, pick }
}

/** Inline text. In bilingual mode shows Chinese followed by a muted English gloss. */
export function L({ en, zh }: Bi) {
  const { mode } = useLang()
  if (mode === 'en') return <>{en}</>
  if (mode === 'zh') return <>{zh}</>
  return (
    <>
      {zh}
      <span className="bi-gloss"> {en}</span>
    </>
  )
}

/** Plain text of one language's content: picks that language from nested L/Term, TeX source for math. */
function plain(node: ReactNode, lang: 'en' | 'zh'): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map((n) => plain(n, lang)).join('')
  if (isValidElement(node)) {
    const props = node.props as { en?: ReactNode; zh?: ReactNode; t?: unknown; children?: ReactNode }
    if (props.en !== undefined && props.zh !== undefined) return plain(props[lang], lang)
    if (typeof props.t === 'string') return props.t
    return plain(props.children, lang)
  }
  return ''
}

/** Weighted length (a CJK character is about twice as wide as a Latin letter). */
const weigh = (s: string) => {
  const cjk = (s.match(/[\u3000-\u9fff\uff00-\uffef]/g) || []).length
  return s.length - cjk + 2.1 * cjk
}

/**
 * Block-level bilingual content: in bilingual mode renders both blocks, Chinese first.
 * The block carries data-len / data-lead, computed from both languages whatever the mode,
 * so story mode pages the chapter identically in en, zh and bilingual mode.
 */
export function B({ en, zh }: Bi) {
  const { mode } = useLang()
  const z = plain(zh, 'zh').trim()
  const e = plain(en, 'en').trim()
  const attrs = {
    'data-len': Math.round((weigh(z) + weigh(e)) / 2.1),
    'data-lead': /[:：]$/.test(z) || /[:：]$/.test(e) ? '' : undefined,
  }
  const one = (node: ReactNode) => (isValidElement(node) && typeof node.type === 'string' ? cloneElement(node, attrs) : <>{node}</>)
  if (mode === 'en') return one(en)
  if (mode === 'zh') return one(zh)
  return (
    <div className="bi-pair" {...attrs}>
      <div className="bi-zh">{zh}</div>
      <div className="bi-en">{en}</div>
    </div>
  )
}

/** A bilingual paragraph. */
export function P({ en, zh }: Bi) {
  return <B en={<p>{en}</p>} zh={<p>{zh}</p>} />
}

/** Technical term: shows the term in the current language with the other language on hover. */
export function Term({ en, zh }: Bi<string>) {
  const { mode } = useLang()
  if (mode === 'en') return <span className="term" title={zh}>{en}</span>
  if (mode === 'zh') return <span className="term" title={en}>{zh}</span>
  return (
    <span className="term">
      {zh}
      <span className="bi-gloss">（{en}）</span>
    </span>
  )
}

export function LangSwitch() {
  const { mode, setMode } = useLang()
  const opts: [Mode, string][] = [
    ['en', 'EN'],
    ['zh', '中'],
    ['bi', '中/EN'],
  ]
  return (
    <div className="lang-switch" role="radiogroup" aria-label="Language">
      {opts.map(([m, label]) => (
        <button key={m} role="radio" aria-checked={mode === m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>
          {label}
        </button>
      ))}
    </div>
  )
}
