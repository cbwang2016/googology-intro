import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { L, LangSwitch, useLang } from '../i18n'
import { acts, chapters } from '../chapters/registry'
import { Ruler } from './Ruler'
import { Reference } from './Reference'
import { ReferenceButton } from './ReferenceButton'
import { useView, ViewSwitch } from './view'

function ProgressBar() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setP(max > 0 ? h.scrollTop / max : 0)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return <div className="progress" style={{ transform: `scaleX(${p})` }} />
}

function Toc({ onClose }: { onClose: () => void }) {
  return (
    <div className="toc-overlay" onClick={onClose}>
      <nav className="toc" onClick={(e) => e.stopPropagation()}>
        <div className="toc-top">
          <div className="toc-title">
            <L en="The journey" zh="旅程全图" />
          </div>
          <button className="toc-close" onClick={onClose} aria-label="close">
            ×
          </button>
        </div>
        <div className="toc-ruler">
          <Ruler upTo={chapters.filter((c) => c.built).length} />
        </div>
        {acts.map((a) => (
          <div key={a.id} className="toc-act">
            <div className="toc-act-title">
              <L {...a.title} />
            </div>
            {chapters
              .filter((c) => c.act === a.id)
              .map((c) =>
                c.built ? (
                  <Link key={c.num} to={`/ch/${c.slug}`} onClick={onClose} className="toc-ch">
                    <span className="toc-num">{c.num}</span>
                    <L {...c.title} />
                  </Link>
                ) : (
                  <div key={c.num} className="toc-ch disabled">
                    <span className="toc-num">{c.num}</span>
                    <L {...c.title} />
                    <span className="soon">
                      <L en="soon" zh="待建" />
                    </span>
                  </div>
                ),
              )}
          </div>
        ))}
      </nav>
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const [toc, setToc] = useState(false)
  const [reference, setReference] = useState(false)
  const loc = useLocation()
  const { t } = useLang()
  const { view } = useView()
  useEffect(() => {
    if (!loc.hash) window.scrollTo(0, 0)
  }, [loc.pathname, loc.hash])
  return (
    <>
      <ProgressBar />
      <header className="topbar">
        <button className="menu-btn" onClick={() => setToc(true)} aria-label={t('Contents', '目录')}>
          ☰ <span className="menu-label">{t('Contents', '目录')}</span>
        </button>
        <Link to={`/ch/${chapters[0].slug}`} className="brand">
          <span className="brand-mark">ω</span>
          <span className="brand-text">
            <L en="How big can a number be?" zh="自然数能有多大？" />
          </span>
        </Link>
        <a
          className="github-link"
          href={import.meta.env.VITE_GITHUB_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('View source on GitHub (opens in a new tab)', '在 GitHub 上查看源码（在新标签页中打开）')}
          title={t('View source on GitHub', '在 GitHub 上查看源码')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.596 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span className="github-label">GitHub</span>
        </a>
        <ReferenceButton onOpen={() => setReference(true)} blocked={toc || reference} />
        <ViewSwitch />
        <LangSwitch />
      </header>
      {reference && <Reference onClose={() => setReference(false)} />}
      {toc && <Toc onClose={() => setToc(false)} />}
      <main>{children}</main>
      {view === 'scroll' && <footer className="site-footer">
        <L
          en={
            <>
              Built on 曹知秋《大数理论》 (Googology lecture notes) and the googology community’s work. Claims are tagged as proved,
              conjectured, or community estimates.
            </>
          }
          zh={<>主要参考曹知秋《大数理论》以及大数社区的工作。文中的结论均标注为“已证明”“猜想”或“社区估计”。</>}
        />
      </footer>}
    </>
  )
}
