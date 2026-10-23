import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
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

type StoryBlock = { el: Element; section: string | null; position: number }
function collectBlocks(root: HTMLElement): StoryBlock[] {
  return Array.from(root.children).flatMap<StoryBlock>((child, position) => child.matches('section.section')
    ? Array.from(child.children).map((el, position) => ({ el, section: child.id, position }))
    : [{ el: child, section: null, position }])
}

function computeBeats(blocks: StoryBlock[], bilingual: boolean) {
  const beats: Element[][] = []
  let cur: Element[] = []
  let text = 0
  let heavy = false
  let closed = false
  // a paragraph ending in a colon introduces the next block: a page break before
  // that block moves the lead-in to the new page with it
  let lead: { el: Element; len: number } | null = null
  const flush = (keepLead = false) => {
    const carry = keepLead && lead && cur.length > 1 && cur[cur.length - 1] === lead.el ? lead : null
    if (carry) cur.pop()
    if (cur.length) beats.push(cur)
    cur = carry ? [carry.el] : []
    text = carry ? carry.len : 0
    heavy = false
    closed = false
  }
  let prevKind: Kind | null = null
  for (const { el } of blocks) {
    const k = classify(el)
    // visual weight: a CJK character is about twice as wide as a Latin letter
    const txt = el.textContent || ''
    const cjk = (txt.match(/[\u3000-\u9fff\uff00-\uffef]/g) || []).length
    const len = (txt.length - cjk + 2.1 * cjk) / (bilingual ? 2.1 : 1)
    const introduced = lead !== null && cur[cur.length - 1] === lead.el
    const brk = () => { if (!(introduced && cur.length === 1)) flush(true) }
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
        if (closed || heavy || (text > 0 && text + len > TEXT_LIMIT)) brk()
        cur.push(el)
        text += len
        break
      case 'math':
        if (closed) brk()
        cur.push(el)
        break
      case 'attach':
        cur.push(el)
        break
      case 'heavy':
        if (heavy || closed || text > HEAVY_INTRO) brk()
        cur.push(el)
        heavy = true
        closed = true
        break
    }
    lead = k === 'text' && /[:：]\s*$/.test(txt.trim()) ? { el, len } : null
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
  return { count: beats.length, sections, beats, blocks }
}

const POSITION_KEY = 'googology-reading-position'
function savedBeat(chapter: string) {
  try {
    const saved = JSON.parse(localStorage.getItem(POSITION_KEY) || 'null')
    return saved?.chapter === chapter && Number.isInteger(saved.page) && saved.page >= 0 ? saved.page : 0
  } catch { return 0 }
}

export function StoryFlow({ storageKey, previous, children }: { storageKey: string; previous?: string; children: ReactNode }) {
  const navigate = useNavigate()
  const { view } = useView()
  const { mode, t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [sections, setSections] = useState<{ first: number; en: string; zh: string }[]>([])
  const [beat, setBeat] = useState(() => savedBeat(storageKey))
  const [anim, setAnim] = useState(0)
  const [menu, setMenu] = useState(false)
  const currentBeat = useRef(beat)
  const lastLayout = useRef<(ReturnType<typeof computeBeats> & { mode: string }) | null>(null)
  // Retain the chosen content across repeated switches, even if a translation
  // groups it with earlier paragraphs. Explicit navigation chooses a new anchor.
  const readingAnchor = useRef<StoryBlock | null>(null)

  // Re-tag translated blocks and relocate the reader before the browser paints.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    let raf = 0
    const run = () => {
      if (root.querySelector('.loading')) return
      const blocks = collectBlocks(root)
      const previous = lastLayout.current
      const same = previous?.mode === mode && blocks.length === previous.blocks.length
        && blocks.every((block, i) => block.el === previous.blocks[i].el && block.el.hasAttribute('data-beats'))
      if (same) return

      let anchor = readingAnchor.current
      if (!anchor && previous) {
        const page = previous.beats[currentBeat.current] || []
        // A widget or theorem is the focus of its scene; otherwise use its first block.
        const focus = page.find(el => classify(el) === 'heavy') || page[0]
        anchor = previous.blocks.find(block => block.el === focus) || null
      }
      const result = computeBeats(blocks, mode === 'bi')
      if (anchor) {
        // P/B can replace their DOM wrapper between single and bilingual modes.
        // Their position within the section is the fallback identity.
        const translated = blocks.find(block => block.el === anchor.el)
          || blocks.find(block => block.section === anchor.section && block.position === anchor.position)
        if (translated) {
          const next = result.beats.findIndex(page => page.includes(translated.el))
          if (next >= 0) {
            currentBeat.current = next
            setBeat(next)
            readingAnchor.current = translated
          }
        }
      }
      lastLayout.current = { ...result, mode }
      setCount(result.count)
      setSections(result.sections)
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
    if (count && beat > count - 1) { currentBeat.current = count - 1; setBeat(count - 1) }
  }, [count, beat])
  useEffect(() => {
    try {
      // Retire the old per-chapter bookmarks, retaining only the current pair.
      localStorage.removeItem('googology-last')
      sessionStorage.removeItem(POSITION_KEY)
      Object.keys(sessionStorage).filter((key) => key.startsWith('beat-')).forEach((key) => sessionStorage.removeItem(key))
      localStorage.setItem(POSITION_KEY, JSON.stringify({ chapter: storageKey, page: beat }))
    } catch { /* Reading still works when browser storage is unavailable. */ }
  }, [beat, storageKey])

  const go = useCallback(
    (b: number) => {
      if (b < 0 && previous) {
        navigate(`/ch/${previous}`)
        window.scrollTo({ top: 0 })
        return
      }
      const nb = Math.max(0, Math.min(count - 1, b))
      if (nb === beat) return
      readingAnchor.current = null
      currentBeat.current = nb
      setBeat(nb)
      setAnim((a) => a + 1)
      window.scrollTo({ top: 0 })
    },
    [beat, count, previous, navigate],
  )

  useEffect(() => {
    if (view !== 'story') return
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement
      if (document.querySelector('.toc-overlay, dialog[open]')) return
      if (tgt.closest('input, textarea, select, button, a, [contenteditable="true"]')) return
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

  // Document-level gestures also cover the blank area below a short scene.
  useEffect(() => {
    if (view !== 'story') return
    let start: { x: number; y: number; time: number } | null = null
    const interactive = 'a, button, input, textarea, select, label, summary, [role="button"], [contenteditable="true"], .widget-body, .reference-guide, .story-bar, .toc-overlay, header:not(.chapter-head), nav, svg, canvas'
    const onStart = (e: TouchEvent) => {
      start = null
      if (document.querySelector('dialog[open]')) return
      if (e.touches.length !== 1 || (e.target as Element).closest(interactive)) return
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() }
    }
    const onEnd = (e: TouchEvent) => {
      const from = start
      start = null
      if (!from || e.touches.length || !e.changedTouches.length || window.getSelection()?.toString()) return
      const end = e.changedTouches[0]
      const dx = end.clientX - from.x, dy = end.clientY - from.y
      if (Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy)) go(beat + (dx < 0 ? 1 : -1))
      else if (Math.hypot(dx, dy) < 12 && Date.now() - from.time < 500) go(beat + (end.clientX >= window.innerWidth / 2 ? 1 : -1))
    }
    const cancel = () => { start = null }
    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })
    document.addEventListener('touchcancel', cancel)
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchend', onEnd)
      document.removeEventListener('touchcancel', cancel)
    }
  }, [view, beat, go])
  const story = view === 'story'
  const curSection = [...sections].reverse().find((s) => s.first <= beat)

  return (
    <div className={story ? 'story' : 'scrollview'}>
      {story && <style>{`.story .chapter-flow [data-beats]:not([data-beats~="b${beat}"]){display:none !important}`}</style>}
      <div
        ref={ref}
        className="chapter-flow"
        data-anim={anim % 2}
        data-cur={beat}

      >
        {children}
      </div>
      {story && count > 0 && (
        <div className="story-bar">
          <button className="story-btn" onClick={() => go(beat - 1)} disabled={beat === 0 && !previous} aria-label={t('Previous', '上一页')}>
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
