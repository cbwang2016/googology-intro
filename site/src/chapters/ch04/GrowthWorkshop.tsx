import { useEffect, useState } from 'react'
import { L } from '../../i18n'
import { M } from '../../math'
import { Slider } from '../../ui/blocks'
import { fExact, parseIdx } from './fgh'

export function GrowthWorkshop() {
  const [kind, setKind] = useState<'1' | '2' | 'w'>('2')
  const [n, setN] = useState(3)
  const [step, setStep] = useState(0)
  const [play, setPlay] = useState(false)
  const end = kind === 'w' ? 1 : n
  useEffect(() => {
    if (!play) return
    const timer = window.setInterval(() => setStep(s => Math.min(end, s + 1)), 900)
    return () => window.clearInterval(timer)
  }, [play, end])
  useEffect(() => { if (step === end) setPlay(false) }, [step, end])
  const reset = () => { setStep(0); setPlay(false) }
  const values = [BigInt(n)]
  if (kind !== 'w') for (let i = 0; i < n; i++) values.push(fExact(parseIdx(String(Number(kind) - 1)), values[i]))
  return <div className="c04-growth-lab">
    <div className="btn-row">{(['1', '2', 'w'] as const).map(k => <button key={k} className="btn" aria-pressed={kind === k} onClick={() => { setKind(k); reset() }}><M t={`f_{${k === 'w' ? '\\omega' : k}}`} /></button>)}</div>
    <Slider label={<L en="Finite input n" zh="有限输入 n" />} min={2} max={4} value={n} onChange={v => { setN(v); reset() }} />
    <div className="c04-growth-roles">
      <div><div><L en="Ordinal: selects the recipe" zh="序数：选择配方" /></div><M t={`\\alpha=${kind === 'w' ? '\\omega' : kind}`} /></div>
      <div><div><L en="Natural number: supplies the input" zh="自然数：提供输入" /></div><M t={`n=${n}`} /></div>
    </div>
    {kind === 'w' ? <>
      <div className="c04-growth-pipeline">{[0,1,2,3,4].map(i => <span key={i} className={i === n && step ? 'active' : ''}><M t={`f_${i}(${n})`} /></span>)}<span>…</span></div>
      <div className="readout" aria-live="polite"><M t={step ? `f_\\omega(${n})=f_{\\omega[${n}]}(${n})=f_${n}(${n})` : `\\omega[${n}]=${n}`} /></div>
      <div><L en="The input selects ONE row; increasing n selects a higher row." zh="输入只选中一层；调大 n，就选中更高的一层。" /></div>
    </> : <>
      <div className="c04-growth-pipeline" aria-live="polite">{values.map((v,i) => <span key={i} className={i === step ? 'active' : ''}>{i > 0 && <small><M t={`\\xrightarrow{f_${Number(kind)-1}}`} /></small>}<b>{i <= step ? v.toString() : '?'}</b></span>)}</div>
      <M t={`f_${kind}(${n})=f_${Number(kind)-1}^{\\,${n}}(${n})${step === n ? `=${values[n]}` : ''}`} />
      <div><L en={`${n} repetitions, fixed at the start. Feed each output into the next call.`} zh={`开始时定好重复 ${n} 次，每次输出送进下一次调用。`} /></div>
    </>}
    <div className="btn-row"><button className="btn" disabled={step === end} onClick={() => setPlay(!play)}><L en={play ? 'Pause' : 'Play'} zh={play ? '暂停' : '播放'} /></button><button className="btn" disabled={step === end} onClick={() => { setPlay(false); setStep(step + 1) }}><L en="One step" zh="走一步" /></button><button className="btn" onClick={reset}><L en="Reset" zh="重来" /></button></div>

  </div>
}
