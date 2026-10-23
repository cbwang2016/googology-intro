import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './ui/Layout'
import { ChapterShell } from './ui/Chapter'
import { chapterBySlug, chapters } from './chapters/registry'

// Chapters are discovered automatically: src/chapters/chNN/ChapterNN.tsx (default export).
const modules = import.meta.glob<{ default: ComponentType }>('./chapters/ch*/Chapter*.tsx')
const pages: Record<string, LazyExoticComponent<ComponentType>> = {}
for (const [path, load] of Object.entries(modules)) {
  const m = path.match(/ch(\d\d)\/Chapter\d\d\.tsx$/)
  const meta = m && chapters.find((c) => c.num === Number(m[1]))
  if (meta) pages[meta.slug] = lazy(load)
}

function ChapterRoute() {
  const { slug = '' } = useParams()
  const meta = chapterBySlug(slug)
  const Page = pages[slug]
  if (!meta || !Page) return <Navigate to={`/ch/${chapters[0].slug}`} replace />
  return (
    <ChapterShell meta={meta}>
      <Suspense fallback={<div className="loading">…</div>}>
        <Page />
      </Suspense>
    </ChapterShell>
  )
}

/** No landing page: go straight into the journey (resume the last chapter read). */
function Resume() {
  let last: string | undefined
  try { last = JSON.parse(localStorage.getItem('googology-reading-position') || 'null')?.chapter } catch { /* start at chapter one */ }
  const target = chapters.find((c) => c.slug === last && c.built) ?? chapters[0]
  return <Navigate to={`/ch/${target.slug}`} replace />
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Resume />} />
        <Route path="/ch/:slug" element={<ChapterRoute />} />
        <Route path="*" element={<Resume />} />
      </Routes>
    </Layout>
  )
}
