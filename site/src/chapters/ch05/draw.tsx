import type { ReactNode } from 'react'
import { parentOf, type Seq, type Tree } from './ordinal.ts'

/* ------------------------------------------------------------------ */
/* Rooted tree (root at the bottom), used for PrSS trees and hydras.   */
/* ------------------------------------------------------------------ */
type Placed = { t: Tree; x: number; depth: number; path: number[]; parent: Placed | null }

export function layoutTree(root: Tree): { nodes: Placed[]; leaves: number; depth: number } {
  const nodes: Placed[] = []
  let leaf = 0
  let maxD = 0
  const walk = (t: Tree, depth: number, path: number[], parent: Placed | null): Placed => {
    const me: Placed = { t, x: 0, depth, path, parent }
    nodes.push(me)
    maxD = Math.max(maxD, depth)
    if (t.ch.length === 0) me.x = leaf++
    else {
      const kids = t.ch.map((c, i) => walk(c, depth + 1, [...path, i], me))
      me.x = (kids[0].x + kids[kids.length - 1].x) / 2
    }
    return me
  }
  walk(root, 0, [], null)
  return { nodes, leaves: Math.max(1, leaf), depth: maxD }
}

export function TreeView({
  tree,
  height = 220,
  colorOf,
  onLeaf,
  rootLabel,
  glow,
  vbWidth = 600,
}: {
  tree: Tree
  vbWidth?: number
  height?: number
  colorOf?: (id: number) => string | undefined
  onLeaf?: (path: number[]) => void
  rootLabel?: string
  glow?: Set<number>
}) {
  const { nodes, leaves, depth } = layoutTree(tree)
  const W = vbWidth
  const padX = 24
  const padTop = 22
  const padBot = 26
  const step = leaves > 1 ? (W - 2 * padX) / (leaves - 1) : 0
  const levelH = depth > 0 ? Math.min(70, (height - padTop - padBot) / depth) : 0
  const X = (p: Placed) => (leaves > 1 ? padX + p.x * step : W / 2)
  const Y = (p: Placed) => height - padBot - p.depth * levelH
  const r = Math.max(2.2, Math.min(7, step / 2.6 || 7))
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="c05-tree" role="img">
      {nodes.map((p) =>
        p.parent ? (
          <line key={`e${p.t.id}`} x1={X(p.parent)} y1={Y(p.parent)} x2={X(p)} y2={Y(p)} stroke={colorOf?.(p.t.id) ?? '#6b7399'} strokeWidth={1.8} />
        ) : null,
      )}
      {nodes.map((p) => {
        const isRoot = !p.parent
        const isLeaf = !isRoot && p.t.ch.length === 0
        const col = colorOf?.(p.t.id) ?? (isRoot ? '#ffd36b' : isLeaf ? '#7dffa8' : '#9aa3c7')
        return (
          <g key={`n${p.t.id}`}>
            {glow?.has(p.t.id) && <circle cx={X(p)} cy={Y(p)} r={r + 5} fill="none" stroke="#ff7ab6" strokeWidth={2} opacity={0.8} />}
            <circle
              cx={X(p)}
              cy={Y(p)}
              r={isRoot ? r + 2 : r}
              fill={col}
              className={isLeaf && onLeaf ? 'c05-head' : undefined}
              onClick={isLeaf && onLeaf ? () => onLeaf(p.path) : undefined}
            />
            {isLeaf && onLeaf && (
              <circle cx={X(p)} cy={Y(p)} r={Math.max(r + 4, 9)} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => onLeaf(p.path)} />
            )}
          </g>
        )
      })}
      {rootLabel && (
        <text x={W / 2} y={height - 6} textAnchor="middle" fill="#9aa3c7" fontSize="12">
          {rootLabel}
        </text>
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Mountain: each term is a column; a line joins it to its parent.     */
/* ------------------------------------------------------------------ */
export function Mountain({ s, colors, height = 170, hover, onHover, vbWidth = 600 }: { s: Seq; colors?: string[]; height?: number; hover?: number | null; onHover?: (i: number | null) => void; vbWidth?: number }) {
  const n = s.length
  const maxV = Math.max(1, ...s)
  const W = vbWidth
  const cw = Math.min(46, (W - 20) / Math.max(1, n))
  const x0 = (W - cw * n) / 2
  const unit = (height - 34) / (maxV + 1)
  const cx = (i: number) => x0 + cw * i + cw / 2
  const top = (i: number) => height - 20 - (s[i] + 1) * unit
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="c05-mountain" role="img">
      <line x1={x0 - 10} y1={height - 20} x2={x0 + cw * n + 10} y2={height - 20} stroke="#2a3563" />
      {s.map((v, i) => {
        const p = parentOf(s, i)
        const col = colors?.[i] ?? '#6be4ff'
        return (
          <g key={i} onMouseEnter={() => onHover?.(i)} onMouseLeave={() => onHover?.(null)}>
            <rect x={cx(i) - cw * 0.32} y={top(i)} width={cw * 0.64} height={height - 20 - top(i)} rx={3} fill={col} opacity={hover === i ? 0.55 : 0.22} />
            <line
              x1={cx(i)}
              y1={top(i)}
              x2={p < 0 ? cx(i) : cx(p)}
              y2={p < 0 ? height - 20 : top(p)}
              stroke={col}
              strokeWidth={hover === i ? 3 : 1.6}
              opacity={0.9}
            />
            <circle cx={cx(i)} cy={top(i)} r={4} fill={col} />
            <text x={cx(i)} y={height - 5} textAnchor="middle" fontSize={cw < 22 ? 9 : 13} fill="#e6e9f5" fontFamily="ui-monospace, monospace">
              {v}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Sequence shown as coloured chips.                                   */
/* ------------------------------------------------------------------ */
export function SeqChips({ s, cls, after, max = 60 }: { s: Seq; cls?: (i: number) => string; after?: ReactNode; max?: number }) {
  const shown = s.length > max ? s.slice(0, max) : s
  return (
    <span className="c05-seq">
      <span className="c05-paren">(</span>
      {shown.map((v, i) => (
        <span key={i} className={`c05-term ${cls?.(i) ?? ''}`}>
          {v}
        </span>
      ))}
      {s.length > max && <span className="c05-more">…+{s.length - max}</span>}
      <span className="c05-paren">)</span>
      {after}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Altimeter: a vertical gauge for ordinals below ε₀.                  */
/* ------------------------------------------------------------------ */
export function Gauge({ marks, value, trail, label, height = 300 }: { marks: { y: number; text: string }[]; value: number; trail?: number[]; label?: string; height?: number }) {
  const H = height
  const top = 14
  const bot = H - 14
  const Y = (v: number) => bot - v * (bot - top)
  return (
    <svg viewBox={`0 0 120 ${H}`} className="c05-gauge" role="img">
      <line x1={30} y1={top} x2={30} y2={bot} stroke="#2a3563" strokeWidth={8} strokeLinecap="round" />
      <line x1={30} y1={top} x2={30} y2={top + 1} stroke="#ffd36b" strokeWidth={10} strokeLinecap="round" />
      {marks.map((m, i) => (
        <g key={i}>
          <line x1={24} y1={Y(m.y)} x2={36} y2={Y(m.y)} stroke="#6b7399" />
          <text x={42} y={Y(m.y) + 4} fontSize="11" fill="#9aa3c7">
            {m.text}
          </text>
        </g>
      ))}
      {trail?.map((v, i) => (
        <circle key={i} cx={30} cy={Y(v)} r={2.5} fill="#ff7ab6" opacity={0.25 + (0.6 * (i + 1)) / trail.length} />
      ))}
      <circle cx={30} cy={Y(value)} r={7} fill="#7dffa8" stroke="#0a0e1f" strokeWidth={2} style={{ transition: 'cy 0.35s' }} />
      {label && (
        <text x={60} y={top - 2} fontSize="10" fill="#ffd36b" textAnchor="middle">
          {label}
        </text>
      )}
    </svg>
  )
}
