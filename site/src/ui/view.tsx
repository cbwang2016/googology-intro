import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLang } from '../i18n'

/** Reading mode: 'story' shows one beat per screen; 'scroll' shows the whole chapter. */
export type View = 'story' | 'scroll'
const KEY = 'googology-view-mode'
const Ctx = createContext<{ view: View; setView: (v: View) => void }>({ view: 'story', setView: () => {} })

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>(() => (localStorage.getItem(KEY) === 'scroll' ? 'scroll' : 'story'))
  useEffect(() => localStorage.setItem(KEY, view), [view])
  return <Ctx.Provider value={{ view, setView }}>{children}</Ctx.Provider>
}

export const useView = () => useContext(Ctx)

export function ViewSwitch() {
  const { view, setView } = useView()
  const { t } = useLang()
  return (
    <button
      className="view-switch"
      onClick={() => setView(view === 'story' ? 'scroll' : 'story')}
      title={view === 'story' ? t('Switch to scrolling', '切换为滚动阅读') : t('Switch to story mode', '切换为故事模式')}
    >
      {view === 'story' ? '▤' : '▶'} <span className="view-label">{view === 'story' ? t('Story', '故事') : t('Scroll', '滚动')}</span>
    </button>
  )
}
