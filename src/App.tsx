import { useState, useEffect } from 'react'
import { loadState, saveState } from './store'
import type { AppState } from './store'
import { NavIcon } from './components/Icons'
import { HabitsPage } from './pages/HabitsPage'
import { WellnessPage } from './pages/WellnessPage'
import { FocusPage } from './pages/FocusPage'
import { ReportPage } from './pages/ReportPage'
import { StreaksPage } from './pages/StreaksPage'
import { JournalPage } from './pages/JournalPage'
import { NutritionPage } from './pages/NutritionPage'
import { JadwalPage } from './pages/JadwalPage'
import { SettingsPage } from './pages/SettingsPage'

type Page = 'habits' | 'wellness' | 'focus' | 'report' | 'streaks' | 'journal' | 'nutrition' | 'jadwal' | 'settings'

const PAGE_TITLES: Record<Page, string> = {
  habits: '', // dynamic
  wellness: 'Wellness',
  focus: 'Focus',
  report: 'Report',
  streaks: 'Streaks',
  journal: 'Journal',
  nutrition: 'Nutrition',
  jadwal: 'Schedule',
  settings: 'Settings',
}

const MORE_ITEMS: { page: Page; label: string; icon: string; emoji: string }[] = [
  { page: 'report',    label: 'Report',    icon: 'report',    emoji: '📊' },
  { page: 'streaks',   label: 'Streaks',   icon: 'streaks',   emoji: '🔥' },
  { page: 'journal',   label: 'Journal',   icon: 'journal',   emoji: '📓' },
  { page: 'nutrition', label: 'Nutrition', icon: 'nutrition', emoji: '🥗' },
  { page: 'jadwal',    label: 'Schedule',  icon: 'jadwal',    emoji: '📅' },
  { page: 'settings',  label: 'Settings',  icon: 'settings',  emoji: '⚙️' },
]

const BOTTOM_NAV: { page: Page; label: string; icon: string }[] = [
  { page: 'habits',  label: 'Habits',   icon: 'habits' },
  { page: 'wellness',label: 'Wellness', icon: 'wellness' },
  { page: 'focus',   label: 'Focus',    icon: 'focus' },
]

export default function App() {
  const [state, setStateRaw] = useState<AppState>(loadState)
  const [page, setPage] = useState<Page>('habits')
  const [moreOpen, setMoreOpen] = useState(false)

  const setState = (s: AppState) => { setStateRaw(s); saveState(s) }

  // Auto-save
  useEffect(() => { saveState(state) }, [state])

  const navigate = (p: Page) => { setPage(p); setMoreOpen(false) }

  const isBottomPage = (BOTTOM_NAV.some(n => n.page === page))
  const isMorePage = MORE_ITEMS.some(m => m.page === page)

  const todayDone = state.habits.filter(h => h.freq === 'daily' && h.completedDates.includes(new Date().toISOString().slice(0, 10))).length
  const todayTotal = state.habits.filter(h => h.freq === 'daily').length

  const titleForPage = (p: Page) => {
    if (p === 'habits') {
      return new Date().toLocaleDateString('en-US', { weekday: 'long' })
    }
    return PAGE_TITLES[p]
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex justify-center">
      <div className="w-full max-w-lg flex flex-col min-h-screen relative">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#F7F6F3]/90 backdrop-blur-md">
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                {(isMorePage) && (
                  <button onClick={() => navigate('habits')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-1 text-xs">
                    <NavIcon name="back" className="w-3.5 h-3.5"/> Back
                  </button>
                )}
                <h1 className="text-xl font-bold text-stone-900 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {titleForPage(page)}
                </h1>
                {page === 'habits' && (
                  <div className="text-xs text-stone-400 mt-0.5">{todayDone}/{todayTotal} done · {state.userName}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {page === 'habits' && (
                  <button
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                    onClick={() => document.dispatchEvent(new CustomEvent('open-add-habit'))}>
                    <NavIcon name="plus" className="w-4 h-4"/>
                    Add
                  </button>
                )}
                <button onClick={() => navigate('settings')}
                  className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-stone-100 text-stone-500 hover:text-stone-800 transition-colors">
                  <NavIcon name="settings" className="w-4.5 h-4.5"/>
                </button>
              </div>
            </div>

            {/* Bottom nav for main pages only */}
            {isBottomPage && (
              <div className="flex gap-1 bg-stone-100/70 rounded-xl p-1">
                {BOTTOM_NAV.map(n => (
                  <button key={n.page} onClick={() => navigate(n.page)}
                    className={`nav-tab flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all
                      ${page === n.page ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
                    <NavIcon name={n.icon} className="w-3.5 h-3.5"/>
                    {n.label}
                  </button>
                ))}
                <button onClick={() => setMoreOpen(o => !o)}
                  className={`nav-tab flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all
                    ${moreOpen || isMorePage ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
                  <NavIcon name="more" className="w-3.5 h-3.5"/>
                  More
                </button>
              </div>
            )}
          </div>
        </header>

        {/* More menu dropdown */}
        {moreOpen && (
          <div className="fixed inset-0 z-30" onClick={() => setMoreOpen(false)}>
            <div className="absolute top-[130px] left-1/2 -translate-x-1/2 w-full max-w-lg px-5" onClick={e => e.stopPropagation()}>
              <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-3 animate-slide-up">
                <div className="grid grid-cols-3 gap-2">
                  {MORE_ITEMS.map(item => (
                    <button key={item.page} onClick={() => navigate(item.page)}
                      className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl hover:bg-stone-50 transition-colors group">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-xs font-medium text-stone-600 group-hover:text-stone-800">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 px-5 pb-8 pt-2 overflow-y-auto">
          {page === 'habits' && <HabitsPage state={state} setState={setState}/>}
          {page === 'wellness' && <WellnessPage state={state} setState={setState}/>}
          {page === 'focus' && <FocusPage state={state} setState={setState}/>}
          {page === 'report' && <ReportPage state={state}/>}
          {page === 'streaks' && <StreaksPage state={state}/>}
          {page === 'journal' && <JournalPage state={state} setState={setState}/>}
          {page === 'nutrition' && <NutritionPage state={state} setState={setState}/>}
          {page === 'jadwal' && <JadwalPage state={state} setState={setState}/>}
          {page === 'settings' && <SettingsPage state={state} setState={setState}/>}
        </main>
      </div>
    </div>
  )
}
