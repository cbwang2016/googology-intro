import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { L } from '../i18n'
import { acts, chapters, type ChapterMeta } from '../chapters/registry'
import { Ruler } from './Ruler'
import { Reveal } from './blocks'
import { StoryFlow } from './Story'
import { JourneyCover } from './Cover'

export function ChapterShell({ meta, children }: { meta: ChapterMeta; children: ReactNode }) {
  const idx = chapters.findIndex((c) => c.num === meta.num)
  const prev = chapters[idx - 1]
  const next = chapters[idx + 1]
  const act = acts.find((a) => a.id === meta.act)!
  return (
    <article className="chapter">
      <StoryFlow key={meta.slug} storageKey={meta.slug} previous={prev?.built ? prev.slug : undefined}>
      {meta.num === 1 && <JourneyCover />}
      <header className="chapter-head">
        <div className="chapter-act">
          <L {...act.title} />
        </div>
        <div className="chapter-num">
          <L en={`Chapter ${meta.num}`} zh={`第 ${meta.num} 章`} />
        </div>
        <h1>
          <L {...meta.title} />
        </h1>
        <div className="chapter-teaser">
          <L {...meta.teaser} />
        </div>
      </header>
      {children}
      <Reveal>
        <div className="chapter-end">
          <h2>
            <L en="Where we are on the ruler" zh="我们在尺子上的位置" />
          </h2>
          <Ruler upTo={meta.num} highlight={meta.num} />
        </div>
      </Reveal>
      <nav className="chapter-nav">
        {prev ? (
          <Link to={`/ch/${prev.slug}`} className="nav-prev">
            ← <L {...prev.title} />
          </Link>
        ) : (
          <span />
        )}
        {next &&
          (next.built ? (
            <Link to={`/ch/${next.slug}`} className="nav-next">
              <L {...next.title} /> →
            </Link>
          ) : (
            <span className="nav-next disabled">
              <L en={`Next: ${next.title.en} (coming)`} zh={`下一章：${next.title.zh}（即将上线）`} />
            </span>
          ))}
      </nav>
      </StoryFlow>
    </article>
  )
}
