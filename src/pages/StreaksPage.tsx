import type { AppState } from '../store'
import { calcStreak, colorMap, getLast } from '../store'
import { HabitIcons } from "../components/habitIcons"

export function StreaksPage({ state }: { state: AppState }) {
  const days21 = getLast(21)

  const habitsWithStreaks = state.habits.map(h => ({
    ...h,
    streak: calcStreak(h.completedDates),
    best: (() => {
      const sorted = [...h.completedDates].sort()
      let best = 0, cur = 0
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) { cur = 1; best = 1; continue }
        const prev = new Date(sorted[i-1] + 'T00:00:00')
        const curr = new Date(sorted[i] + 'T00:00:00')
        const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000)
        if (diff === 1) { cur++; best = Math.max(best, cur) } else cur = 1
      }
      return best
    })(),
  })).sort((a, b) => b.streak - a.streak)

  return (
    <div className="animate-fade-in space-y-4">
      {/* Top streaks */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-stone-50">
          <h3 className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Current Streaks</h3>
        </div>
        <div className="divide-y divide-stone-50">
          {habitsWithStreaks.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-8">No habits yet — add one to start streaking!</p>
          )}
          {habitsWithStreaks.map((h, idx) => {
            const c = colorMap[h.color]
            const medals = ['🥇', '🥈', '🥉']
            return (
              <div key={h.id} className="flex items-center gap-4 px-5 py-4">
                <div className="text-lg w-6 text-center flex-shrink-0">{medals[idx] ?? <span className="text-stone-300 text-xs">#{idx+1}</span>}</div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${c.soft}`}>
                  <span className={`${c.text}`} style={{ width: 18, height: 18 }}>{HabitIcons[h.icon]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-800 truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>{h.name}</div>
                  <div className="text-[11px] text-stone-400">Best: {h.best}d</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {h.streak > 0 ? <>{h.streak}<span className="text-sm text-stone-400 font-normal">d</span></> : <span className="text-stone-300 text-base">—</span>}
                  </div>
                  {h.streak >= 7 && <div className="text-[10px] text-amber-500">🔥 On fire!</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 21-day calendar grid */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>21-Day Grid</h3>
        <div className="overflow-x-auto">
          <div className="flex flex-col gap-2.5 min-w-max">
            {state.habits.map(h => {
              const c = colorMap[h.color]
              return (
                <div key={h.id} className="flex items-center gap-2.5">
                  <div className="w-24 flex-shrink-0 flex items-center gap-2">
                    <span className={`${c.text}`} style={{ width: 14, height: 14 }}>{HabitIcons[h.icon]}</span>
                    <span className="text-[11px] text-stone-600 truncate">{h.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {days21.map(d => {
                      const done = h.completedDates.includes(d)
                      const isToday = d === new Date().toISOString().slice(0, 10)
                      return (
                        <div key={d} className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center
                          ${done ? c.bg : 'bg-stone-100'}
                          ${isToday ? 'ring-2 ring-offset-1 ring-stone-400' : ''}`}
                          title={d}>
                          {done && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="mt-3 flex gap-2 text-[10px] text-stone-400 items-center">
          <div className="w-4 h-4 rounded bg-stone-100"/>Not done
          <div className="w-4 h-4 rounded bg-indigo-500 ml-2"/>Done
        </div>
      </div>

      {/* Motivational message */}
      {habitsWithStreaks[0]?.streak >= 7 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <div className="text-sm font-semibold text-amber-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {habitsWithStreaks[0].name} — {habitsWithStreaks[0].streak} days!
            </div>
            <div className="text-xs text-amber-600 mt-0.5">Keep it up. Consistency is the key.</div>
          </div>
        </div>
      )}
    </div>
  )
}
