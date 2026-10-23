import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLang } from '../i18n'
import { useView } from './view'

/**
 * Story mode: splits the chapter flow into "beats" (one screen each) by tagging
 * top-level blocks with data-beats="b0 b3 …" and showing only the current beat via CSS.
 * The DOM is owned by React; we only add data attributes, which React never touches.
 */

type Kind = 'cover' | 'heading' | 'h3' | 'text' | 'math' | 'heavy' | 'attach' | 'card'
const TEXT_LIMIT = 420 // characters of running text per beat (bilingual counts ~half)
const HEAVY_INTRO = 240 // a short intro may share a beat with the following heavy block

function classify(el: Element): Kind {
  if (el.matches('.chapter-cover')) return 'cover'
  if (el.matches('.chapter-head, .chapter-end, .chapter-nav, .prereq')) return 'card'
  if (el.matches('h3')) return 'h3'
  if (el.matches('.mb')) return 'math'
  if (el.matches('.proof')) return 'attach'
  if (el.matches('.expand, .caution')) return 'attach'
  if (el.matches('.reveal')) {
    if (el.querySelector(':scope > .widget, :scope > .thm, :scope > .quiz, :scope > .key-idea, :scope > .open-problem')) return 'heavy'
    if (el.querySelector(':scope > h2, :scope > .kicker')) return 'heading'
    if (el.querySelector(':scope > .chapter-end')) return 'card'
  }
  if (el.matches('.scroll-x, table, figure, svg')) return 'heavy'
  return 'text'
}

function computeBeats(root: HTMLElement, bilingual: boolean) {
  // collect blocks in reading order
  const blocks: { el: Element; section: Element | null }[] = []
  for (const child of Array.from(root.children)) {
    if (child.matches('section.section')) for (const c of Array.from(child.children)) blocks.push({ el: c, section: child })
    else blocks.push({ el: child, section: null })
  }
  const beats: Element[][] = []
  let cur: Element[] = []
  let text = 0
  let heavy = false
  let closed = false
  const flush = () => {
    if (cur.length) beats.push(cur)
    cur = []
    text = 0
    heavy = false
    closed = false
  }
  let prevKind: Kind | null = null
  for (const { el } of blocks) {
    const k = classify(el)
    const len = (el.textContent || '').length / (bilingual ? 1.9 : 1)
    switch (k) {
      case 'card':
        // chapter-end + nav share a screen; the title card and the prerequisites each get their own
        if (prevKind === 'card' && cur.length && !closed && !el.matches('.prereq') && !cur[0].matches('.chapter-head')) cur.push(el)
        else {
          flush()
          cur.push(el)
        }
        break
      case 'cover':
      case 'heading':
      case 'h3':
        flush()
        cur.push(el)
        break
      case 'text':
        // a short remark right after a widget/theorem stays with it
        if (closed && len < 170 && text === 0) {
          cur.push(el)
          text += len
          break
        }
        if (closed || heavy || (text > 0 && text + len > TEXT_LIMIT)) flush()
        cur.push(el)
        text += len
        break
      case 'math':
        if (closed) flush()
        cur.push(el)
        break
      case 'attach':
        cur.push(el)
        break
      case 'heavy':
        if (heavy || closed || text > HEAVY_INTRO) flush()
        cur.push(el)
        heavy = true
        closed = true
        break
    }
    prevKind = k
  }
  flush()
  // tag elements (sections get the union of their children's beats)
  const sectionTokens = new Map<Element, string[]>()
  beats.forEach((els, i) =>
    els.forEach((el) => {
      el.setAttribute('data-beats', `b${i}`)
      const sec = el.parentElement?.matches('section.section') ? el.parentElement : null
      if (sec) sectionTokens.set(sec, [...(sectionTokens.get(sec) || []), `b${i}`])
    }),
  )
  sectionTokens.forEach((toks, sec) => sec.setAttribute('data-beats', toks.join(' ')))
  // section index for the jump menu
  const sections = Array.from(sectionTokens.entries()).map(([sec, toks]) => ({
    first: Number(toks[0].slice(1)),
    en: sec.getAttribute('data-title-en') || '',
    zh: sec.getAttribute('data-title-zh') || '',
  }))
  return { count: beats.length, sections, signature: blocks.map((b) => b.el).length }
}

export function StoryFlow({ storageKey, children }: { storageKey: string; children: ReactNode }) {
  const { view } = useView()
  const { mode, t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [sections, setSections] = useState<{ first: number; en: string; zh: string }[]>([])
  const [beat, setBeat] = useState(() => Number(sessionStorage.getItem(storageKey) || 0))
  const [anim, setAnim] = useState(0)
  const [menu, setMenu] = useState(false)
  const lastBlocks = useRef<Element[]>([])

  // (re)compute beats whenever the set of top-level blocks changes
  useEffect(() => {
    const root = ref.current
    if (!root) return
    let raf = 0
    const run = () => {
      const blocks: Element[] = []
      for (const c of Array.from(root.children)) {
        if (c.matches('section.section')) blocks.push(...Array.from(c.children))
        else blocks.push(c)
      }
      const same = blocks.length === lastBlocks.current.length && blocks.every((b, i) => b === lastBlocks.current[i]) && blocks.every((b) => b.hasAttribute('data-beats'))
      if (same) return
      lastBlocks.current = blocks
      const r = computeBeats(root, mode === 'bi')
      setCount(r.count)
      setSections(r.sections)
    }
    run()
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(run)
    })
    mo.observe(root, { childList: true, subtree: true })
    return () => {
      mo.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [mode])

  useEffect(() => {
    if (count && beat > count - 1) setBeat(count - 1)
  }, [count, beat])
  useEffect(() => sessionStorage.setItem(storageKey, String(beat)), [beat, storageKey])

  const go = useCallback(
    (b: number) => {
      const nb = Math.max(0, Math.min(count - 1, b))
      if (nb === beat) return
      setBeat(nb)
      setAnim((a) => a + 1)
      window.scrollTo({ top: 0 })
    },
    [beat, count],
  )

  useEffect(() => {
    if (view !== 'story') return
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement
      if (tgt.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        // Space only advances when the beat is fully visible (otherwise let the page scroll)
        if (e.key === ' ' && window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return
        e.preventDefault()
        go(beat + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault()
        go(beat - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, beat, go])

  // swipe on touch screens
  const touch = useRef<{ x: number; y: number } | null>(null)
  const story = view === 'story'
  const curSection = [...sections].reverse().find((s) => s.first <= beat)

  return (
    <div className={story ? 'story' : 'scrollview'}>
      {story && <style>{`.story .chapter-flow [data-beats]:not([data-beats~="b${beat}"]){display:none !important}`}</style>}
      <div
        ref={ref}
        className="chapter-flow"
        data-anim={anim % 2}
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          if (!story || !touch.current) return
          const dx = e.changedTouches[0].clientX - touch.current.x
          const dy = e.changedTouches[0].clientY - touch.current.y
          const tgt = e.target as HTMLElement
          if (tgt.closest('input, svg, canvas, .widget-body')) return
          if (Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy)) go(beat + (dx < 0 ? 1 : -1))
          touch.current = null
        }}
      >
        {children}
      </div>
      {story && count > 0 && (
        <div className="story-bar">
          <button className="story-btn" onClick={() => go(beat - 1)} disabled={beat === 0} aria-label={t('Previous', '上一页')}>
            ←
          </button>
          <button className="story-where" onClick={() => setMenu(!menu)}>
            <span className="story-sec">{curSection ? t(curSection.en, curSection.zh) : t('Opening', '开场')}</span>
            <span className="story-count">
              {beat + 1} / {count}
            </span>
            <span className="story-track">
              <span style={{ width: `${((beat + 1) / count) * 100}%` }} />
            </span>
          </button>
          <button className="story-btn primary" onClick={() => go(beat + 1)} disabled={beat >= count - 1} aria-label={t('Next', '下一页')}>
            →
          </button>
          {menu && (
            <div className="story-menu" onClick={() => setMenu(false)}>
              <button onClick={() => go(0)}>{t('Opening', '开场')}</button>
              {sections.map((s, i) => (
                <button key={i} className={curSection === s ? 'on' : ''} onClick={() => go(s.first)}>
                  {t(s.en, s.zh)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
