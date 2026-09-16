import { useState, useEffect } from 'react'
import type { AppState, Habit, HabitColor, HabitFreq, HabitIcon } from '../store'
import { calcStreak, colorMap, today, HABIT_ICONS, HABIT_COLORS } from '../store'
import { NavIcon } from "../components/Icons"
import { HabitIcons } from "../components/habitIcons"

function ProgressRing({ value, size = 60 }: { value: number; size?: number }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0EFE9" strokeWidth="5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#4F46E5" strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - value)} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}/>
    </svg>
  )
}

function HabitRow({ habit, onToggle, onDelete }: { habit: Habit; onToggle: () => void; onDelete: () => void }) {
  const done = habit.completedDates.includes(today())
  const c = colorMap[habit.color]
  const streak = calcStreak(habit.completedDates)

  return (
    <div className="habit-row flex items-center gap-3.5 px-5 py-3.5 group">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${c.soft}`}>
        <span className={`w-4.5 h-4.5 ${c.text}`} style={{ width: '18px', height: '18px' }}>{HabitIcons[habit.icon]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium leading-tight ${done ? 'line-through text-stone-400' : 'text-stone-800'}`}
          style={{ fontFamily: 'Outfit, sans-serif' }}>
          {habit.name}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-stone-400">{streak > 0 ? `${streak}d streak` : 'No streak'}</span>
          {streak >= 3 && <span className="text-[10px]">🔥</span>}
          <span className="text-[10px] text-stone-300 ml-0.5 capitalize">{habit.freq}</span>
        </div>
      </div>
      <button onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-stone-300 hover:text-rose-400 rounded-lg hover:bg-rose-50">
        <NavIcon name="trash" className="w-3.5 h-3.5"/>
      </button>
      <button onClick={onToggle}
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border-2 transition-all
          ${done ? `${c.bg} border-transparent text-white` : 'border-stone-200 bg-white text-transparent hover:border-stone-300'}`}>
        <NavIcon name="check" className="w-3.5 h-3.5"/>
      </button>
    </div>
  )
}

function AddModal({ onAdd, onClose }: {
  onAdd: (data: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<HabitIcon>('sun')
  const [color, setColor] = useState<HabitColor>('indigo')
  const [freq, setFreq] = useState<HabitFreq>('daily')

  const colorNames: Record<HabitColor, string> = {
    indigo: 'Indigo', emerald: 'Emerald', amber: 'Amber', rose: 'Rose',
    violet: 'Violet', sky: 'Sky', orange: 'Orange', teal: 'Teal',
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>New Habit</h2>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg">
            <NavIcon name="close" className="w-5 h-5"/>
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 mb-1.5 uppercase tracking-widest">Name</label>
            <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Morning Run"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"/>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 mb-1.5 uppercase tracking-widest">Frequency</label>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as HabitFreq[]).map(f => (
                <button key={f} onClick={() => setFreq(f)} type="button"
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all capitalize
                    ${freq === f ? 'bg-indigo-500 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 mb-2 uppercase tracking-widest">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {HABIT_ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all
                    ${icon === ic ? 'bg-indigo-50 ring-2 ring-indigo-300 text-indigo-600' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'}`}>
                  <span style={{ width: 18, height: 18 }}>{HabitIcons[ic]}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 mb-2 uppercase tracking-widest">Color</label>
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map(cl => (
                <button key={cl} type="button" onClick={() => setColor(cl)} title={colorNames[cl]}
                  className={`w-8 h-8 rounded-full transition-all ${colorMap[cl].bg} ${color === cl ? 'ring-2 ring-offset-2 ring-stone-400 scale-110' : 'opacity-70 hover:opacity-100'}`}/>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Cancel</button>
            <button disabled={!name.trim()} onClick={() => { if (name.trim()) { onAdd({ name: name.trim(), icon, color, freq }); onClose() } }}
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 disabled:opacity-40 transition-colors">
              Add Habit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type FreqTab = 'all' | 'daily' | 'weekly' | 'monthly'

export function HabitsPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [freqTab, setFreqTab] = useState<FreqTab>('all')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    const handler = () => setShowAdd(true)
    document.addEventListener('open-add-habit', handler)
    return () => document.removeEventListener('open-add-habit', handler)
  }, [])

  const habits = freqTab === 'all' ? state.habits : state.habits.filter(h => h.freq === freqTab)
  const todayDone = state.habits.filter(h => h.freq === 'daily' && h.completedDates.includes(today())).length
  const todayTotal = state.habits.filter(h => h.freq === 'daily').length
  const ratio = todayTotal > 0 ? todayDone / todayTotal : 0

  const toggleHabit = (id: string) => {
    const t = today()
    setState({
      ...state,
      habits: state.habits.map(h => h.id !== id ? h : ({
        ...h,
        completedDates: h.completedDates.includes(t)
          ? h.completedDates.filter(d => d !== t)
          : [...h.completedDates, t],
      }))
    })
  }

  const deleteHabit = (id: string) => setState({ ...state, habits: state.habits.filter(h => h.id !== id) })

  const addHabit = (data: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) =>
    setState({ ...state, habits: [...state.habits, { id: Date.now().toString(), completedDates: [], createdAt: today(), ...data }] })

  return (
    <div className="animate-fade-in">
      {/* Summary card */}
      <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <div className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {todayDone === todayTotal && todayTotal > 0 ? '🎉 All done!' : `${todayDone} / ${todayTotal}`}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">daily habits completed</div>
          </div>
          <div className="relative">
            <ProgressRing value={ratio} size={60}/>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>{Math.round(ratio * 100)}%</span>
            </div>
          </div>
        </div>
        <div className="mt-4 h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${ratio * 100}%` }}/>
        </div>
      </div>

      {/* Freq tabs */}
      <div className="flex gap-1 bg-stone-100/70 rounded-xl p-1 mb-3">
        {(['all', 'daily', 'weekly', 'monthly'] as FreqTab[]).map(f => (
          <button key={f} onClick={() => setFreqTab(f)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
              ${freqTab === f ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Habits list */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center py-14 px-6 text-center">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 text-2xl">✨</div>
            <p className="font-medium text-stone-600 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>No habits here</p>
            <p className="text-sm text-stone-400 mb-4">Add a habit to start building consistency.</p>
            <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 transition-colors">
              Add habit
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {habits.map(h => <HabitRow key={h.id} habit={h} onToggle={() => toggleHabit(h.id)} onDelete={() => deleteHabit(h.id)}/>)}
          </div>
        )}
      </div>

      {showAdd && <AddModal onAdd={addHabit} onClose={() => setShowAdd(false)}/>}
    </div>
  )
}
