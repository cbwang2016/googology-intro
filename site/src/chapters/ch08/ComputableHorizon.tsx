import { useState } from 'react'
import { L } from '../../i18n'
import { M } from '../../math'

const marks = ['\\omega', '\\varepsilon_0', '\\Gamma_0', '\\mathrm{SVO}', '\\mathrm{BHO}', '\\mathrm{BO}']
export function ComputableHorizon() {
  const [step, setStep] = useState(0)
  return <div className="c08-horizon">
    <div className="c08-horizon-region">
      <b><L en="Computable ordinals" zh="可计算序数" /></b>
      <div className="c08-horizon-marks">{marks.slice(0, step + 1).map(m => <span key={m}><M t={m} /></span>)}<span>⋯</span></div>
      <L en="Selected landmarks; BHO and BO come later in this chapter." zh="选取的路标；BHO、BO 将在本章后面定义。" />
    </div>
    <div className="c08-horizon-wall"><b><M t="\Omega=\omega_1^{\mathrm{CK}}" /></b><M t="\sup\{\alpha:\alpha\text{ is computable}\}" /><div><L en="Still countable · first noncomputable ordinal" zh="仍然可数 · 第一个不可计算序数" /></div></div>
    <div className="btn-row"><button className="btn" disabled={step === marks.length - 1} onClick={() => setStep(step + 1)}><L en="Reveal another landmark" zh="展开下一个路标" /></button><button className="btn small" onClick={() => setStep(0)}><L en="Reset" zh="重来" /></button></div>
    <div><L en="An effective ladder always has a computable bound below Ω. No program supplies a cofinal ladder to Ω." zh="有效的梯子总有一个小于 Ω 的可计算上界。没有程序能提供通向 Ω 的共尾序列。" /></div>

  </div>
}
