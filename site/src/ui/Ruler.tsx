import { useState } from 'react'
import { L } from '../i18n'
import { M } from '../math'
import { landmarks } from '../chapters/registry'

/**
 * The ruler of growth. Landmarks unlocked up to `upTo` are lit; later ones are dim.
 * Positions are ordinal (equally spaced), not to scale — there is no "scale" past ω.
 */
export function Ruler({ upTo = 99, highlight }: { upTo?: number; highlight?: number }) {
  const [hover, setHover] = useState<number | null>(null)
  const n = landmarks.length
  return (
    <div className="ruler">
      <div className="ruler-track">
        {landmarks.map((lm, i) => {
          const lit = lm.chapter <= upTo
          const isNew = highlight !== undefined && lm.chapter === highlight
          return (
            <button
              key={i}
              className={`ruler-mark ${lit ? 'lit' : ''} ${isNew ? 'new' : ''}`}
              style={{ left: `${(i / (n - 1)) * 100}%` }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
            >
              <span className="ruler-tick" />
              <span className="ruler-label">
                <M t={lm.tex} />
              </span>
            </button>
          )
        })}
      </div>
      <div className="ruler-caption">
        {hover !== null ? (
          <>
            <M t={landmarks[hover].tex} /> — <L {...landmarks[hover].name} />{' '}
            <span className="muted">
              (<L en={`Chapter ${landmarks[hover].chapter}`} zh={`第 ${landmarks[hover].chapter} 章`} />)
            </span>
          </>
        ) : (
          <L
            en="The ruler of growth: every notation gets a label by how fast it grows. Hover a mark."
            zh="增长之尺：每种记号按它增长的快慢得到一个刻度。把鼠标移到刻度上看看。"
          />
        )}
      </div>
    </div>
  )
}
