import type { AppState } from '../store'
import { calcStreak, colorMap, getLast } from '../store'
import { HabitIcons } from "../components/habitIcons"

export function ReportPage({ state }: { state: AppState }) {
  const days30 = getLast(30)
  const days7 = getLast(7)

  const dailyHabits = state.habits.filter(h => h.freq === 'daily')

  const completionByDay = days30.map(d => ({
    date: d,
    done: dailyHabits.filter(h => h.completedDates.includes(d)).length,
    total: dailyHabits.length,
  }))

  const totalCheckins = dailyHabits.reduce((s, h) => s + h.completedDates.filter(d => days30.includes(d)).length, 0)
  const perfectDays = days30.filter(d => dailyHabits.length > 0 && dailyHabits.every(h => h.completedDates.includes(d))).length
  const bestStreak = Math.max(0, ...state.habits.map(h => calcStreak(h.completedDates)))
  const avgCompletion = dailyHabits.length > 0
    ? Math.round(completionByDay.reduce((s, d) => s + (d.total > 0 ? d.done / d.total : 0), 0) / 30 * 100)
    : 0

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Heatmap: group days30 by week
  const weeks: string[][] = []
  const startPad = (new Date(days30[0] + 'T00:00:00').getDay() + 6) % 7 // Mon=0
  const paddedDays = [...Array(startPad).fill(null), ...days30]
  for (let i = 0; i < paddedDays.length; i += 7) weeks.push(paddedDays.slice(i, i + 7))

  return (
    <div className="animate-fade-in space-y-4">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Check-ins', value: totalCheckins, sub: '30 days', emoji: '✅' },
          { label: 'Perfect Days', value: perfectDays, sub: 'all habits done', emoji: '🌟' },
          { label: 'Best Streak', value: `${bestStreak}d`, sub: 'consecutive', emoji: '🔥' },
          { label: 'Avg Completion', value: `${avgCompletion}%`, sub: 'daily rate', emoji: '📈' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="text-xl mb-2">{s.emoji}</div>
            <div className="text-2xl font-bold text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
            <div className="text-xs font-medium text-stone-500">{s.label}</div>
            <div className="text-[10px] text-stone-300">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Activity heatmap */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Activity Heatmap (30d)</h3>
        <div className="flex gap-1 mb-2 ml-5">
          {weekDays.map(d => <div key={d} className="text-[9px] text-stone-400 flex-1 text-center">{d}</div>)}
        </div>
        <div className="space-y-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex gap-1">
              {week.map((d, di) => {
                if (!d) return <div key={di} className="flex-1 h-6 rounded"/>
                const stat = completionByDay.find(c => c.date === d)
                const pct = stat && stat.total > 0 ? stat.done / stat.total : 0
                const bg = pct >= 1 ? 'bg-indigo-500' : pct >= 0.5 ? 'bg-indigo-300' : pct > 0 ? 'bg-indigo-100' : 'bg-stone-100'
                return (
                  <div key={d} className={`flex-1 h-6 rounded-md ${bg} transition-colors`} title={`${d}: ${Math.round(pct*100)}%`}/>
                )
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] text-stone-400">Less</span>
          {['bg-stone-100','bg-indigo-100','bg-indigo-300','bg-indigo-500'].map(c => <div key={c} className={`w-3.5 h-3.5 rounded ${c}`}/>)}
          <span className="text-[10px] text-stone-400">More</span>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>This Week</h3>
        <div className="flex items-end gap-2 h-24">
          {days7.map(d => {
            const done = dailyHabits.filter(h => h.completedDates.includes(d)).length
            const pct = dailyHabits.length > 0 ? done / dailyHabits.length : 0
            const isToday = d === new Date().toISOString().slice(0, 10)
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-lg overflow-hidden bg-stone-100" style={{ height: '80px' }}>
                  <div className={`w-full rounded-lg ${isToday ? 'bg-indigo-500' : 'bg-indigo-300'} transition-all duration-500`}
                    style={{ height: `${pct * 80}px`, marginTop: `${(1 - pct) * 80}px` }}/>
                </div>
                <div className={`text-[10px] ${isToday ? 'font-bold text-indigo-600' : 'text-stone-400'}`}>
                  {new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-habit performance */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-stone-50">
          <h3 className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Habit Performance</h3>
        </div>
        <div className="divide-y divide-stone-50">
          {state.habits.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-8">No habits tracked yet.</p>
          )}
          {state.habits.map(h => {
            const count = h.completedDates.filter(d => days30.includes(d)).length
            const total = h.freq === 'daily' ? 30 : h.freq === 'weekly' ? 4 : 1
            const pct = Math.round((count / total) * 100)
            const streak = calcStreak(h.completedDates)
            const c = colorMap[h.color]
            return (
              <div key={h.id} className="px-5 py-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`${c.text}`} style={{ width: 16, height: 16 }}>{HabitIcons[h.icon]}</span>
                  <span className="text-sm font-medium text-stone-700 flex-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{h.name}</span>
                  <span className="text-sm font-bold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>{Math.min(100, pct)}%</span>
                  {streak > 0 && <span className="text-xs text-stone-400">🔥{streak}d</span>}
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.bar} transition-all duration-700`} style={{ width: `${Math.min(100, pct)}%` }}/>
                </div>
                <div className="text-[10px] text-stone-400 mt-1">{count} of {total} {h.freq} target</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Water & sleep summaries */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <div className="text-xl mb-2">💧</div>
          <div className="text-lg font-bold text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {state.waterLogs.length > 0
              ? Math.round(state.waterLogs.reduce((s, l) => s + l.cups, 0) / state.waterLogs.length * 10) / 10
              : 0}gl
          </div>
          <div className="text-xs text-stone-400">Avg daily water</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <div className="text-xl mb-2">🌙</div>
          <div className="text-lg font-bold text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {state.sleepLogs.length > 0
              ? Math.round(state.sleepLogs.reduce((s, l) => s + l.hours, 0) / state.sleepLogs.length * 10) / 10
              : 0}h
          </div>
          <div className="text-xs text-stone-400">Avg sleep</div>
        </div>
      </div>
    </div>
  )
}
