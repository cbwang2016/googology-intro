import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { L, LangSwitch, useLang } from '../i18n'
import { acts, chapters } from '../chapters/registry'
import { Ruler } from './Ruler'
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
            <L en="From 1 to ω₁" zh="从 1 到 ω₁" />
          </span>
        </Link>
        <ViewSwitch />
        <LangSwitch />
      </header>
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
