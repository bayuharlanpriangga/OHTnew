import { useState } from 'react'
import type { AppState } from '../store'
import { calcStreak, getLast } from '../store'

export function SettingsPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [nameEdit, setNameEdit] = useState(false)
  const [nameVal, setNameVal] = useState(state.userName)

  const totalCheckins = state.habits.reduce((s, h) => s + h.completedDates.length, 0)
  const bestStreak = Math.max(0, ...state.habits.map(h => calcStreak(h.completedDates)))
  const days30 = getLast(30)
  const perfectDays = days30.filter(d =>
    state.habits.filter(h => h.freq === 'daily').every(h => h.completedDates.includes(d))
  ).length

  const clearAllData = () => {
    if (confirm('Clear all data? This cannot be undone.')) {
      localStorage.clear()
      location.reload()
    }
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Profile card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl flex-shrink-0">
            {state.userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            {nameEdit ? (
              <div className="flex gap-2">
                <input autoFocus value={nameVal} onChange={e => setNameVal(e.target.value)}
                  className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  onKeyDown={e => { if (e.key === 'Enter') { setState({ ...state, userName: nameVal.trim() || state.userName }); setNameEdit(false) } }}/>
                <button onClick={() => { setState({ ...state, userName: nameVal.trim() || state.userName }); setNameEdit(false) }}
                  className="px-3 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium">OK</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>{state.userName}</span>
                <button onClick={() => setNameEdit(true)} className="text-stone-400 hover:text-stone-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
            )}
            <div className="text-xs text-stone-400 mt-0.5">Habit Tracker member</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Habits', value: state.habits.length },
            { label: 'Check-ins', value: totalCheckins },
            { label: 'Best Streak', value: `${bestStreak}d` },
          ].map(s => (
            <div key={s.label} className="bg-stone-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
              <div className="text-[10px] text-stone-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-stone-50">
          <h3 className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Preferences</h3>
        </div>
        <div className="divide-y divide-stone-50">
          {[
            { label: 'Water Target', sub: `${state.waterTarget} glasses/day`, emoji: '💧' },
            { label: 'Sleep Target', sub: `${state.sleepTarget}h/night`, emoji: '🌙' },
            { label: 'Calorie Target', sub: `${state.nutrTarget.kcal} kcal/day`, emoji: '🍽️' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-4 px-5 py-4">
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-stone-700">{item.label}</div>
                <div className="text-xs text-stone-400">{item.sub}</div>
              </div>
              <div className="text-xs text-stone-300">Set in Wellness / Nutrition</div>
            </div>
          ))}
        </div>
      </div>

      {/* Data & privacy */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-stone-50">
          <h3 className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Data</h3>
        </div>
        <div className="divide-y divide-stone-50">
          <div className="flex items-center gap-4 px-5 py-4">
            <span className="text-xl">💾</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-stone-700">Storage</div>
              <div className="text-xs text-stone-400">All data saved locally in your browser</div>
            </div>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <span className="text-xl">📊</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-stone-700">Summary</div>
              <div className="text-xs text-stone-400">{state.habits.length} habits · {totalCheckins} check-ins · {perfectDays} perfect days</div>
            </div>
          </div>
          <button onClick={clearAllData} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-rose-50 transition-colors text-left">
            <span className="text-xl">🗑️</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-rose-500">Clear All Data</div>
              <div className="text-xs text-rose-300">Remove all habits, logs, and progress</div>
            </div>
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 text-center">
        <div className="text-2xl mb-2">✨</div>
        <div className="text-sm font-semibold text-stone-700 mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>Habit Tracker</div>
        <div className="text-xs text-stone-400">Build consistency, one day at a time.</div>
      </div>
    </div>
  )
}
