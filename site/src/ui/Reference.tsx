import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { chapters } from '../chapters/registry'
import { L, useLang } from '../i18n'
import { M } from '../math'
import { referenceEntries } from './referenceData'
import './reference.css'

const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[\s_{}\\^·–-]/g, '')

export function Reference({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const needle = normalize(query)
  const entries = referenceEntries.filter(entry => normalize([
    entry.symbol, entry.aliases, entry.name.en, entry.name.zh,
  ].join(' ')).includes(needle)).sort((a, b) => {
    // Exact abbreviations precede entries that merely mention the requested symbol.
    const exact = (aliases: string) => aliases.split(/\s+/).some(alias => normalize(alias) === needle)
    return Number(exact(b.aliases)) - Number(exact(a.aliases))
  })

  useEffect(() => {
    const element = dialog.current!
    const previousFocus = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    search.current?.focus()
    return () => {
      element.close()
      document.body.style.overflow = overflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  return <dialog ref={dialog} className="reference-dialog" aria-labelledby={titleId} onCancel={onClose}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose() } }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="reference-panel">
      <div className="reference-head">
        <h2 id={titleId}><L en="Symbols & ordinals" zh="符号与序数速查" /></h2>
        <button className="reference-close" onClick={onClose} aria-label={t('Close reference', '关闭速查')}>×</button>
      </div>
      <p className="reference-intro"><L en="Course definitions at a glance. Looking something up keeps your reading position." zh="随时查阅本课程采用的定义，关闭后继续读当前页。" /></p>
      <div className="reference-search">
        <label htmlFor={`${titleId}-search`}><L en="Find a symbol or name" zh="查找符号或名称" /></label>
        <div>
          <input ref={search} id={`${titleId}-search`} type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t('BHO, BO, epsilon, FGH…', 'BHO、BO、ε₀、基本列…')} autoComplete="off" />
          {query && <button onClick={() => { setQuery(''); search.current?.focus() }}><L en="Clear" zh="清空" /></button>}
        </div>
        <span className="reference-count" role="status"><L en={`${entries.length} entries`} zh={`${entries.length} 条定义`} /></span>
      </div>
      <div className="reference-results">
        {entries.length ? <table className="reference-table">
          <caption className="reference-sr-only"><L en="Course symbol definitions and source chapters" zh="课程符号定义及来源章节" /></caption>
          <thead><tr><th scope="col"><L en="Symbol / name" zh="符号／名称" /></th><th scope="col"><L en="Definition" zh="定义" /></th><th scope="col"><L en="Learn more" zh="详解" /></th></tr></thead>
          <tbody>{entries.map(entry => {
            const chapter = chapters.find(c => c.num === entry.chapter)!
            return <tr key={entry.symbol}>
              <th scope="row"><div className="reference-symbol"><M t={entry.symbol} /></div><div className="reference-name"><L {...entry.name} /></div></th>
              <td><div><L {...entry.definition} /></div>{entry.formula && <div className="reference-formula" tabIndex={0} role="region" aria-label={t('Definition formula', '定义公式')}><M t={entry.formula} /></div>}</td>
              <td><Link to={`/ch/${chapter.slug}`} onClick={onClose} aria-label={t(`Chapter ${chapter.num}: ${chapter.title.en}`, `第 ${chapter.num} 章：${chapter.title.zh}`)}><L en={`Ch. ${chapter.num} →`} zh={`第 ${chapter.num} 章 →`} /></Link></td>
            </tr>
          })}</tbody>
        </table> : <p className="reference-empty"><L en="No matches. Try a symbol, its English name, or its Chinese name." zh="没有找到。试试符号、英文名称或中文名称。" /></p>}
      </div>
    </div>
  </dialog>
}
