import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { chapters } from '../chapters/registry'
import { L, useLang } from '../i18n'

const GUIDE_KEY = 'googology-reference-guide-seen'
function hasSeenGuide() {
  try { return localStorage.getItem(GUIDE_KEY) === '1' } catch { return false }
}

export function ReferenceButton({ onOpen, blocked }: { onOpen: () => void; blocked: boolean }) {
  const { t, pick } = useLang()
  const location = useLocation()
  const seen = useRef(hasSeenGuide())
  const [visible, setVisible] = useState(false)
  const chapter = chapters.find(c => location.pathname === `/ch/${c.slug}`)

  const remember = () => {
    seen.current = true
    try { localStorage.setItem(GUIDE_KEY, '1') } catch { /* still once per app session */ }
  }
  const dismiss = () => { remember(); setVisible(false) }
  const open = () => { dismiss(); onOpen() }

  useEffect(() => {
    setVisible(false)
    // Wait for actual lesson content, not the cover or prerequisites. Readers
    // who skip Chapter 2 get the same introduction in their first later lesson.
    if (seen.current || blocked || !chapter || chapter.num < 2) return
    const observed = new Set<Element>()
    const intersection = new IntersectionObserver(entries => {
      if (seen.current || !entries.some(entry => entry.isIntersecting)) return
      remember()
      setVisible(true)
      intersection.disconnect()
      mutations.disconnect()
    }, { rootMargin: '-80px 0px -20% 0px', threshold: 0.1 })
    const observeLesson = () => {
      document.querySelectorAll('main .chapter-flow section.section > .reveal, main .chapter-flow section.section > .bi-pair, main .chapter-flow section.section > p').forEach(element => {
        if (!observed.has(element)) { observed.add(element); intersection.observe(element) }
      })
    }
    const mutations = new MutationObserver(observeLesson)
    mutations.observe(document.querySelector('main')!, { childList: true, subtree: true })
    observeLesson()
    return () => { intersection.disconnect(); mutations.disconnect() }
  }, [chapter, blocked])

  useEffect(() => {
    if (!visible) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVisible(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  return <div className="reference-button-wrap">
    <button className={`reference-trigger${visible ? ' reference-trigger-guided' : ''}`} onClick={open} aria-haspopup="dialog" aria-label={t('Open symbol reference', '打开符号速查')} aria-describedby={visible ? 'reference-guide-description' : undefined}>{pick('Symbols', '符号')}</button>
    {visible && <aside className="reference-guide" aria-label={t('Symbol reference tip', '符号速查提示')}>
      <strong><L en="No need to memorize every symbol" zh="不用记住每一个符号" /></strong>
      <p id="reference-guide-description" role="status"><L en="This Symbols button is on every page. Look up arrows, ordinals and definitions, then return to the same place." zh="每页上方都有「符号」按钮。遇到箭头、序数或陌生定义，随时查一下，再回到原处继续读。" /></p>
      <div className="reference-guide-actions">
        <button onClick={open}><L en="Open reference" zh="打开速查" /></button>
        <button onClick={dismiss}><L en="Got it" zh="知道了" /></button>
      </div>
    </aside>}
  </div>
}
