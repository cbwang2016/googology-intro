import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useMemo } from 'react'

const macros = {
  '\\ua': '\\uparrow',
  '\\N': '\\mathbb{N}',
}

function render(tex: string, display: boolean) {
  return katex.renderToString(tex, { displayMode: display, throwOnError: false, macros: { ...macros } })
}

/** Inline math. */
export function M({ t }: { t: string }) {
  const html = useMemo(() => render(t, false), [t])
  return <span className="m" dangerouslySetInnerHTML={{ __html: html }} />
}

/** Display math. */
export function MB({ t }: { t: string }) {
  const html = useMemo(() => render(t, true), [t])
  return <div className="mb" dangerouslySetInnerHTML={{ __html: html }} />
}

/** TeX for a↑^c b with readable arrows (up to 4 arrows written out). */
export function arrowTex(a: string | number, c: number, b: string | number) {
  const arrows = c <= 4 ? '\\uparrow'.repeat(c) : `\\uparrow^{${c}}`
  return `${a}${arrows} ${b}`
}
