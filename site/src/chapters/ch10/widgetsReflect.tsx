import { useState } from 'react'
import { L, useLang } from '../../i18n'
import { M } from '../../math'
import { Status } from '../../ui/blocks'
import { STEPS } from './data'
import { reflExpand, reflParse, reflShow } from './lib'

/* ------------------------------------------------------------------ */
/* A Bashicu matrix drawn as columns (Ch. 9 convention: row 0 on top)  */
/* ------------------------------------------------------------------ */
export function BmsGrid({ m }: { m: string }) {
  const cols = [...m.matchAll(/\(([^)]*)\)/g)].map((x) => x[1].split(','))
  const rows = Math.max(...cols.map((c) => c.length))
  return (
    <span className="c10-bms" aria-label={m}>
      {cols.map((c, i) => (
        <span key={i} className="c10-bms-col">
          {Array.from({ length: rows }, (_, r) => (
            <span key={r}>{c[r] ?? ''}</span>
          ))}
        </span>
      ))}
    </span>
  )
}

const reflTex = (s: string) => s.replace(/−/g, '{-}').replace(/ /g, '\\ ')

/* ------------------------------------------------------------------ */
/* 1. The staircase                                                     */
/* ------------------------------------------------------------------ */
export function ReflectionStaircase() {
  const { t } = useLang()
  const [i, setI] = useState(3)
  const s = STEPS[i]
  const W = 56
  return (
    <div>
      <div className="scroll-x">
        <div className="c10-stairs" style={{ width: STEPS.length * W + 10 }}>
          {STEPS.map((st, k) => (
            <button
              key={k}
              className={`c10-step ${k === i ? 'on' : ''} ${k >= 8 ? 'informal' : ''}`}
              style={{ left: k * W, bottom: k * 7, width: W - 4 }}
              onClick={() => setI(k)}
              aria-label={st.name.en}
            >
              <M t={st.tex.length > 22 ? st.tex.split('=')[0] : st.tex} />
            </button>
          ))}
          <div className="c10-stairs-band" style={{ left: 8 * W - 3 }}>
            <L en="no rigorous notation ↗" zh="没有严格记号 ↗" />
          </div>
        </div>
      </div>
      <div className="c10-step-panel">
        <div className="c10-step-head">
          <span className="c10-step-tex">
            <M t={s.tex} />
          </span>
          <b>{t(s.name.en, s.name.zh)}</b>
          {s.expr && (
            <span className="chip small mono" title={t('reflection expression', '反射表达式')}>
              {s.expr}
            </span>
          )}
          <Status kind={s.status} />
        </div>
        <p>{t(s.property.en, s.property.zh)}</p>
        <p className="small">
          <span className="muted">
            <L en="Inside ψ it folds: " zh="放进 ψ 里，它折叠的是：" />
          </span>
          {t(s.folds.en, s.folds.zh)}
        </p>
        <div className="c10-step-land">
          <span className="muted small">
            <L en="Recursive landmark:" zh="对应的递归里程碑：" />
          </span>{' '}
          <M t={s.landmark.tex} />
          {s.landmark.bms && (
            <>
              <span className="muted small">
                {' '}
                <L en="BMS:" zh="BMS：" />
              </span>{' '}
              <BmsGrid m={s.landmark.bms} />
            </>
          )}
        </div>
        <div className="muted small">{t(s.note.en, s.note.zh)}</div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Reflection expressions expand like primitive sequences (Thm 9.5) */
/* ------------------------------------------------------------------ */
const NAMES: Record<string, string> = {
  '1': '\\omega',
  '1−1': '\\omega^2',
  '1−1−1': '\\omega^3',
  '1−1−1−1': '\\omega^4',
  '2': '\\Omega',
  '1−2': '\\Omega_\\omega',
  '1−1−2': '\\Omega_{\\omega^2}',
  '1−1−1−2': '\\Omega_{\\omega^3}',
  '1−1−1−1−2': '\\Omega_{\\omega^4}',
  '2 1−2': 'I',
  '1−2 1−2': 'I_\\omega',
  '2 1−2 1−2': 'I(1,0)',
  '2 1−2 1−2 1−2': 'I(2,0)',
  '2 1−2 1−2 1−2 1−2': 'I(3,0)',
  '2−2': 'M',
  '2−2 1−2−2': 'M(1;0)',
  '2−2−2': 'N',
  '3': 'K',
  '1−3': 'K_\\omega',
  '4': '\\Pi_4',
  '5': '\\Pi_5',
}
const PRESETS = ['2', '2 1−2', '2−2', '2−2−2', '3', '3 1−3', '2−3', '2−3 1−3 2−3', '4 2−4', '5']

export function ReflectionExpander() {
  const { t } = useLang()
  const [src, setSrc] = useState('2−3 1−3 2−3')
  const terms = reflParse(src).filter((x) => x >= 1 && x <= 9).slice(0, 10)
  const canon = reflShow(terms)
  const e = reflExpand(terms)
  const name = NAMES[canon]

  let cells: { v: number; role: 'keep' | 'root' | 'block' | 'last'; pad?: boolean }[] = []
  if (e.kind === 'rule') {
    const padded = [e.ak, ...e.one, e.ak - 1, ...(e.pad === 'appended' ? [] : e.two)]
    const rootIdx = 1 + e.one.length
    const Lg = padded.length
    const rev = [...padded].reverse()
    const r = Lg - 1 - rootIdx
    cells = rev.map((v, k) => ({
      v,
      role: k === Lg - 1 ? 'last' : k === r ? 'root' : k > r ? 'block' : 'keep',
      pad: k === r && e.pad !== 'none',
    }))
  }
  return (
    <div>
      <div className="btn-row">
        {PRESETS.map((p) => (
          <button key={p} className={`chip small mono ${canon === p ? 'on' : ''}`} onClick={() => setSrc(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="row">
        <input className="c10-input mono" style={{ maxWidth: 260 }} value={src} onChange={(ev) => setSrc(ev.target.value)} aria-label="reflection expression" />
        <span className="muted small">
          <L en="digits 1–9; separators are filled in for you" zh="输入数字 1–9，连接符号会自动补上" />
        </span>
      </div>
      {terms.length > 0 && (
        <div className="readout c10-refl-head">
          <M t={reflTex(canon)} />
          {name && (
            <>
              {' '}
              = <M t={name} />
            </>
          )}
        </div>
      )}
      {e.kind === 'nth' && (
        <p className="small">
          <L
            en={<>A leading 1 means “limit points of”: its least element is the ω-th element of what follows, so it expands to “the n-th element”. Start with a digit ≥ 2.</>}
            zh={<>开头的 1 表示“……的极限点”：它的最小元素是后面那个类的第 ω 个元素，所以展开成“第 n 个元素”。请以 ≥ 2 的数字开头。</>}
          />
        </p>
      )}
      {e.kind === 'rule' && (
        <>
          <div className="c10-seq-label muted small">
            <L en="Reversed, it is a sequence; expand it like a primitive sequence (Ch. 5):" zh="把它倒过来就是一个序列，按初等序列（第 5 章）的方法展开：" />
          </div>
          <div className="c10-seq">
            {cells.map((c, k) => (
              <span key={k} className={`c10-seq-cell ${c.role} ${c.pad ? 'pad' : ''}`}>
                {c.v}
              </span>
            ))}
          </div>
          <div className="c10-legend small">
            <span className="c10-seq-cell last mini" /> <L en="deleted last term" zh="删去的末项" />
            <span className="c10-seq-cell root mini" /> <L en="bad root (dashed = padded in)" zh="坏根（虚线 = 补上的项）" />
            <span className="c10-seq-cell block mini" /> <L en="bad part, copied" zh="坏部，被复制" />
          </div>
          <div className="readout">
            <M t={`${reflTex(canon)}\\ \\Rightarrow\\ \\bigl(${reflTex(reflShow([...e.one, e.ak - 1]))}{-}\\bigr)^{\\alpha}\\ ${reflTex(reflShow(e.two))}`} />
          </div>
          <div className="c10-approx">
            {[1, 2, 3].map((n) => {
              const a = reflShow(e.approx(n))
              return (
                <div key={n}>
                  <span className="muted mono">[{n}]</span> <M t={reflTex(a)} />
                  {NAMES[a] && (
                    <>
                      {' '}
                      = <M t={NAMES[a]} />
                    </>
                  )}
                </div>
              )
            })}
          </div>
          <div className="muted small">
            {e.pad === 'appended'
              ? t('Nothing smaller than the first term: a term (first − 1) is padded at the end, so the whole rest gets iterated.', '找不到比首项小的项：在末尾补上一个“首项 − 1”，于是整个剩余部分都被迭代。')
              : e.pad === 'inserted'
                ? t('The first smaller term is too small, so a term (first − 1) is padded just before it (book Thm 9.5, case 1).', '第一个更小的项小得太多，于是在它左边补上一个“首项 − 1”（书定理 9.5 第 1 种情形）。')
                : t('The first smaller term is exactly (first − 1): it is the bad root.', '第一个更小的项恰好是“首项 − 1”：它就是坏根。')}
          </div>
        </>
      )}
    </div>
  )
}
