import { useState, useEffect, useRef, useCallback } from 'react'
import type { AppState } from '../store'
import { today } from '../store'

type Mode = 'focus' | 'short' | 'long'

const DURATIONS: Record<Mode, number> = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 }
const MODE_LABELS: Record<Mode, string> = { focus: 'Focus Session', short: 'Short Break', long: 'Long Break' }
const MODE_COLORS: Record<Mode, string> = { focus: '#4F46E5', short: '#16A34A', long: '#0284C7' }

export function FocusPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [mode, setMode] = useState<Mode>('focus')
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [linkedHabit, setLinkedHabit] = useState('')
  const [customMins, setCustomMins] = useState(25)
  const totalTime = useRef(DURATIONS.focus)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const todaySessions = state.focusSessions.filter(s => s.date === today())
  const todayMins = todaySessions.reduce((sum, s) => sum + s.minutes, 0)

  const reset = useCallback(() => {
    setRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    const t = mode === 'focus' ? customMins * 60 : DURATIONS[mode]
    totalTime.current = t
    setTimeLeft(t)
  }, [mode, customMins])

  useEffect(() => { reset() }, [mode, reset])

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setRunning(false)
            if (mode === 'focus') {
              setState({
                ...state,
                focusSessions: [...state.focusSessions, {
                  date: today(),
                  minutes: Math.round(totalTime.current / 60),
                  habitId: linkedHabit || undefined,
                }]
              })
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running, mode, linkedHabit, state, setState])

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const progress = 1 - timeLeft / totalTime.current
  const r = 110
  const circ = 2 * Math.PI * r

  return (
    <div className="animate-fade-in space-y-4">
      {/* Mode tabs */}
      <div className="flex gap-1 bg-stone-100/70 rounded-xl p-1">
        {(['focus', 'short', 'long'] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all
              ${mode === m ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
            {m === 'focus' ? 'Focus' : m === 'short' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      {/* Timer card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex flex-col items-center">
        <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-6">{MODE_LABELS[mode]}</div>

        {/* Ring */}
        <div className="relative mb-6">
          <svg width="240" height="240" className="-rotate-90">
            <circle cx="120" cy="120" r={r} fill="none" stroke="#F0EFE9" strokeWidth="10"/>
            <circle cx="120" cy="120" r={r} fill="none" stroke={MODE_COLORS[mode]} strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} strokeLinecap="round"
              style={{ transition: running ? 'stroke-dashoffset 0.9s linear' : 'none' }}/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-stone-800 tabular-nums" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {mins}:{secs}
            </div>
            <div className="text-xs text-stone-400 mt-1">{todaySessions.length} sessions today</div>
          </div>
        </div>

        {/* Custom duration (focus only) */}
        {mode === 'focus' && !running && (
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs text-stone-400">Duration:</span>
            <div className="flex items-center gap-2 bg-stone-50 rounded-xl px-4 py-2">
              <button onClick={() => { setCustomMins(m => Math.max(5, m - 5)); setTimeLeft(Math.max(5, customMins - 5) * 60) }}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg w-5 text-center">−</button>
              <span className="text-sm font-bold text-stone-700 w-10 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>{customMins}m</span>
              <button onClick={() => { setCustomMins(m => Math.min(90, m + 5)); setTimeLeft(Math.min(90, customMins + 5) * 60) }}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg w-5 text-center">+</button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          <button onClick={() => setRunning(r => !r)}
            className="px-10 py-3 rounded-2xl text-white font-bold text-base transition-all hover:scale-105"
            style={{ background: MODE_COLORS[mode], fontFamily: 'Outfit, sans-serif' }}>
            {running ? '⏸ Pause' : timeLeft < (mode === 'focus' ? customMins * 60 : DURATIONS[mode]) ? '▶ Resume' : '▶ Start'}
          </button>
          <button onClick={reset} className="px-5 py-3 rounded-2xl bg-stone-100 text-stone-500 font-medium text-sm hover:bg-stone-200 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Link habit */}
      {mode === 'focus' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Link to Habit</label>
          <select value={linkedHabit} onChange={e => setLinkedHabit(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-indigo-400 bg-white">
            <option value="">— None —</option>
            {state.habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
      )}

      {/* Today's stats */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Today</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-700" style={{ fontFamily: 'Outfit, sans-serif' }}>{todaySessions.length}</div>
            <div className="text-xs text-indigo-400 mt-0.5">sessions</div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-700" style={{ fontFamily: 'Outfit, sans-serif' }}>{todayMins}</div>
            <div className="text-xs text-indigo-400 mt-0.5">minutes</div>
          </div>
        </div>
        {todaySessions.length > 0 && (
          <div className="mt-3 space-y-2">
            {todaySessions.map((s, i) => {
              const linked = s.habitId ? state.habits.find(h => h.id === s.habitId) : null
              return (
                <div key={i} className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">{i+1}</span>
                  <span>{s.minutes} min focus</span>
                  {linked && <span className="text-stone-300">· {linked.name}</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
