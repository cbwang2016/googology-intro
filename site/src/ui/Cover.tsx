import { useEffect, useRef } from 'react'
import { L } from '../i18n'

/** Milestones of the whole journey, in increasing order (numbers, then growth rates). */
const STREAM: { s: string; tier: number }[] = [
  { s: '1', tier: 0 }, { s: '3', tier: 0 }, { s: '10', tier: 0 }, { s: '万', tier: 0 }, { s: '亿', tier: 0 },
  { s: '2⁶⁴', tier: 0 }, { s: '10⁸⁰', tier: 0 }, { s: 'googol', tier: 1 }, { s: '不可说不可说转', tier: 1 },
  { s: '10^10^100', tier: 1 }, { s: '10↑↑10', tier: 1 }, { s: '3↑↑↑3', tier: 2 }, { s: 'G(64)', tier: 2 },
  { s: 'ω', tier: 3 }, { s: 'ω+1', tier: 3 }, { s: 'ω²', tier: 3 }, { s: 'ω^ω', tier: 3 }, { s: 'ε₀', tier: 3 },
  { s: 'Goodstein', tier: 3 }, { s: 'Γ₀', tier: 4 }, { s: 'TREE(3)', tier: 4 }, { s: 'ψ(Ω)', tier: 4 },
  { s: 'BHO', tier: 4 }, { s: 'ψ(Ω_ω)', tier: 4 }, { s: '(0,0,0)(1,1,1)', tier: 4 }, { s: 'ψ(I)', tier: 5 },
  { s: 'ψ(M)', tier: 5 }, { s: 'Π₃', tier: 5 }, { s: 'ω₁ᶜᴷ', tier: 6 }, { s: 'BB(10¹⁰⁰)', tier: 6 },
  { s: 'Ξ(10⁶)', tier: 6 }, { s: 'Rayo(10¹⁰⁰)', tier: 7 },
]
const COLORS = ['#e6e9f5', '#6be4ff', '#7dffa8', '#ffd36b', '#ffa95e', '#b59bff', '#ff7ab6', '#ff6b6b']

type Flyer = { i: number; z: number; ang: number; r: number }

export function JourneyCover() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 220 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }))
    const flyers: Flyer[] = []
    let next = 0
    let spawnT = 0
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const cx = w / 2
      const cy = h * 0.3
      ctx.clearRect(0, 0, w, h)
      // horizon glow: ω₁, never reached
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.22)
      g.addColorStop(0, 'rgba(255,211,107,0.55)')
      g.addColorStop(0.35, 'rgba(255,122,182,0.12)')
      g.addColorStop(1, 'rgba(10,14,31,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, Math.min(w, h) * 0.22, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff6d8'
      ctx.font = `600 ${Math.max(18, Math.min(w, h) * 0.045)}px 'Iowan Old Style', Georgia, serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.globalAlpha = 0.85 + 0.15 * Math.sin(now / 600)
      ctx.fillText('ω₁', cx, cy)
      ctx.globalAlpha = 1
      // stars rushing outward
      for (const s of stars) {
        if (!reduce) s.z -= dt * 0.25
        if (s.z <= 0.02) {
          s.z = 1
          s.x = Math.random() * 2 - 1
          s.y = Math.random() * 2 - 1
        }
        const px = cx + (s.x / s.z) * w * 0.25
        const py = cy + (s.y / s.z) * h * 0.25
        const z2 = s.z + 0.04
        const qx = cx + (s.x / z2) * w * 0.25
        const qy = cy + (s.y / z2) * h * 0.25
        ctx.strokeStyle = `rgba(200,215,255,${(1 - s.z) * 0.8})`
        ctx.lineWidth = Math.max(0.5, (1 - s.z) * 1.6)
        ctx.beginPath()
        ctx.moveTo(qx, qy)
        ctx.lineTo(px, py)
        ctx.stroke()
      }
      // milestones flying toward the viewer, in increasing order
      spawnT -= dt
      if (spawnT <= 0 && !reduce) {
        flyers.push({ i: next, z: 1, ang: next * 2.399963 /* golden angle */, r: 0.55 + 0.35 * ((next * 7) % 5) / 5 })
        next = (next + 1) % STREAM.length
        spawnT = 0.55
      }
      for (let k = flyers.length - 1; k >= 0; k--) {
        const f = flyers[k]
        f.z -= dt * 0.16
        if (f.z <= 0.06) {
          flyers.splice(k, 1)
          continue
        }
        const item = STREAM[f.i]
        const spread = (1 / f.z - 1) * 0.12
        const px = cx + Math.cos(f.ang) * f.r * spread * w
        const py = cy + Math.sin(f.ang) * f.r * spread * h * 0.8
        const size = Math.min(90, 10 / f.z)
        const alpha = Math.min(1, (1 - f.z) * 2.2) * Math.min(1, (f.z - 0.06) * 6)
        ctx.globalAlpha = alpha
        ctx.fillStyle = COLORS[item.tier]
        ctx.font = `${item.tier >= 3 ? 'italic ' : ''}${size}px 'Iowan Old Style', Georgia, 'Songti SC', 'Noto Serif CJK SC', serif`
        ctx.fillText(item.s, px, py)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="chapter-cover">
      <canvas ref={canvas} className="cover-canvas" aria-hidden />
      <div className="cover-text">
        <h1 className="cover-title">
          <span className="cover-count">1, 2, 3, …</span>
          <L en="How big can a number be?" zh="数能有多大？" />
        </h1>
        <div className="cover-sub">
          <L
            en="Start by counting on your fingers, build ever larger numbers, and keep going until mathematics itself can no longer say."
            zh="从掰手指开始，一步步造出更大的数，直到连数学都说不清的地方。"
          />
        </div>
        <ul className="cover-hooks">
          <li>
            <L en="A number whose digits’ digits’ digits … cannot be written in this universe." zh="一个数，它的位数的位数的位数……整个宇宙都写不下。" />
          </li>
          <li>
            <L en="Numbers that no computer will ever compute — and we can prove it." zh="一些数，任何计算机都永远算不出来——而且这一点可以被证明。" />
          </li>
          <li>
            <L en="A number so big that mathematicians still argue whether it is well-defined." zh="一个数大到数学家至今还在争论：它到底有没有被良定义。" />
          </li>
        </ul>
        <div className="cover-go">
          <L en="Press → or tap the arrow below to begin" zh="按 → 键，或点击下方箭头，出发" />
        </div>
      </div>
    </div>
  )
}
