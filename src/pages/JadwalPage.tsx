import { useState } from 'react'
import type { AppState, Reminder } from '../store'
import { HabitIcons } from "../components/habitIcons"
import { colorMap } from '../store'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function JadwalPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [habitId, setHabitId] = useState('')
  const [time, setTime] = useState('08:00')
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5])

  const addReminder = () => {
    if (!habitId) return
    const r: Reminder = { id: Date.now().toString(), habitId, time, days, enabled: true }
    setState({ ...state, reminders: [...state.reminders, r] })
    setShowAdd(false)
    setHabitId('')
  }

  const toggleReminder = (id: string) =>
    setState({ ...state, reminders: state.reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r) })

  const deleteReminder = (id: string) =>
    setState({ ...state, reminders: state.reminders.filter(r => r.id !== id) })

  const toggleDay = (d: number) =>
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort())

  return (
    <div className="animate-fade-in space-y-4">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 items-start">
        <span className="text-xl flex-shrink-0">⏰</span>
        <div>
          <div className="text-sm font-semibold text-indigo-800 mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>Habit Reminders</div>
          <div className="text-xs text-indigo-500">Reminders are saved locally and work as visual guides. Browser notifications require permission.</div>
        </div>
      </div>

      {/* Add reminder */}
      <button onClick={() => setShowAdd(true)}
        className="w-full py-3 bg-white border-2 border-dashed border-stone-200 rounded-2xl text-sm font-medium text-stone-500 hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Reminder
      </button>

      {showAdd && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 animate-slide-up">
          <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>New Reminder</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1.5">Habit</label>
              <select value={habitId} onChange={e => setHabitId(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 bg-white">
                <option value="">Select a habit...</option>
                {state.habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1.5">Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"/>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Days</label>
              <div className="flex gap-1.5">
                {DAY_LABELS.map((d, i) => (
                  <button key={i} onClick={() => toggleDay(i)}
                    className={`flex-1 py-2 rounded-xl text-[11px] font-medium transition-all
                      ${days.includes(i) ? 'bg-indigo-500 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600">Cancel</button>
              <button onClick={addReminder} disabled={!habitId}
                className="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold disabled:opacity-40">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminders list */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-stone-50">
          <h3 className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Reminders</h3>
        </div>
        {state.reminders.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-10">No reminders set. Add one to stay on track!</p>
        ) : (
          <div className="divide-y divide-stone-50">
            {state.reminders.map(r => {
              const habit = state.habits.find(h => h.id === r.habitId)
              if (!habit) return null
              const c = colorMap[habit.color]
              return (
                <div key={r.id} className={`flex items-center gap-4 px-5 py-4 group ${!r.enabled ? 'opacity-50' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${c.soft}`}>
                    <span className={`${c.text}`} style={{ width: 18, height: 18 }}>{HabitIcons[habit.icon]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>{habit.name}</div>
                    <div className="text-[11px] text-stone-400">
                      {r.time} · {r.days.map(d => DAY_LABELS[d]).join(', ')}
                    </div>
                  </div>
                  <button onClick={() => deleteReminder(r.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-300 hover:text-rose-400 rounded-lg hover:bg-rose-50 transition-all">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                  <button onClick={() => toggleReminder(r.id)}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 relative ${r.enabled ? 'bg-indigo-500' : 'bg-stone-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${r.enabled ? 'left-7' : 'left-1'}`}/>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Mini calendar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>This Week's Schedule</h3>
        <div className="grid grid-cols-7 gap-1">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-stone-400 pb-1">{d}</div>
          ))}
          {Array.from({ length: 7 }).map((_, i) => {
            const d = new Date()
            const dayOfWeek = d.getDay()
            const startOfWeek = new Date(d)
            startOfWeek.setDate(d.getDate() - dayOfWeek)
            const dayDate = new Date(startOfWeek)
            dayDate.setDate(startOfWeek.getDate() + i)
            const isToday = dayDate.toDateString() === new Date().toDateString()
            const remindersForDay = state.reminders.filter(r => r.enabled && r.days.includes(i))
            return (
              <div key={i} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5
                ${isToday ? 'bg-indigo-500 text-white' : 'bg-stone-50'}`}>
                <span className={`text-xs font-bold ${isToday ? 'text-white' : 'text-stone-700'}`}>{dayDate.getDate()}</span>
                {remindersForDay.length > 0 && (
                  <div className="flex gap-0.5">
                    {remindersForDay.slice(0, 3).map((r, ri) => {
                      const h = state.habits.find(h => h.id === r.habitId)
                      return h ? <div key={ri} className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : colorMap[h.color].dot}`}/> : null
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
