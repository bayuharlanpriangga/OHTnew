import { useState } from 'react'
import type { AppState } from '../store'
import { today } from '../store'

export function WellnessPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [activeTab, setActiveTab] = useState<'water' | 'sleep'>('water')

  // Water
  const waterLog = state.waterLogs.find(l => l.date === today()) ?? { date: today(), cups: 0, ml: 0 }
  const waterPct = Math.min(1, waterLog.cups / state.waterTarget)

  const addCup = () => {
    const updated = state.waterLogs.find(l => l.date === today())
      ? state.waterLogs.map(l => l.date === today() ? { ...l, cups: l.cups + 1, ml: l.ml + 250 } : l)
      : [...state.waterLogs, { date: today(), cups: 1, ml: 250 }]
    setState({ ...state, waterLogs: updated })
  }

  const resetWater = () => setState({
    ...state,
    waterLogs: state.waterLogs.map(l => l.date === today() ? { ...l, cups: 0, ml: 0 } : l)
  })

  // Sleep
  const [bedTime, setBedTime] = useState('23:00')
  const [wakeTime, setWakeTime] = useState('06:30')

  const logSleep = () => {
    const [bh, bm] = bedTime.split(':').map(Number)
    const [wh, wm] = wakeTime.split(':').map(Number)
    let diff = (wh * 60 + wm) - (bh * 60 + bm)
    if (diff < 0) diff += 24 * 60
    const hours = Math.round(diff / 60 * 10) / 10
    const entry = { date: today(), bedTime, wakeTime, hours }
    const updated = state.sleepLogs.find(l => l.date === today())
      ? state.sleepLogs.map(l => l.date === today() ? entry : l)
      : [...state.sleepLogs, entry]
    setState({ ...state, sleepLogs: updated })
  }

  const sleepLog = state.sleepLogs.find(l => l.date === today())
  const sleepPct = sleepLog ? Math.min(1, sleepLog.hours / state.sleepTarget) : 0

  // Recent sleep logs
  const recentSleep = [...state.sleepLogs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7)

  const waterColor = waterPct >= 1 ? 'bg-emerald-500' : waterPct >= 0.6 ? 'bg-sky-400' : 'bg-sky-300'

  return (
    <div className="animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100/70 rounded-xl p-1 mb-4">
        {(['water', 'sleep'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize
              ${activeTab === t ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}>
            {t === 'water' ? '💧 Water' : '🌙 Sleep'}
          </button>
        ))}
      </div>

      {activeTab === 'water' && (
        <div className="space-y-4">
          {/* Water summary card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-3xl font-bold text-stone-800 mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {waterLog.cups} <span className="text-lg text-stone-400 font-medium">/ {state.waterTarget}</span>
                </div>
                <div className="text-xs text-stone-400">glasses today · {waterLog.ml} ml</div>
              </div>
              <div className="text-5xl">{waterPct >= 1 ? '🥳' : waterPct >= 0.5 ? '💧' : '🫙'}</div>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-stone-100 rounded-full overflow-hidden mb-5">
              <div className={`h-full rounded-full transition-all duration-500 ${waterColor}`} style={{ width: `${waterPct * 100}%` }}/>
            </div>

            {/* Cup grid */}
            <div className="grid grid-cols-8 gap-1.5 mb-5">
              {Array.from({ length: state.waterTarget }).map((_, i) => (
                <div key={i} className={`h-7 rounded-lg transition-all duration-300 ${i < waterLog.cups ? 'bg-sky-400' : 'bg-stone-100'}`}/>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={addCup} disabled={waterLog.cups >= state.waterTarget}
                className="flex-1 py-3 bg-sky-400 text-white rounded-xl font-semibold text-sm hover:bg-sky-500 disabled:opacity-50 transition-colors"
                style={{ fontFamily: 'Outfit, sans-serif' }}>
                + Add Glass
              </button>
              <button onClick={resetWater} className="px-4 py-3 bg-stone-100 text-stone-500 rounded-xl text-sm hover:bg-stone-200 transition-colors">
                Reset
              </button>
            </div>
          </div>

          {/* Set target */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Daily Target</span>
              <span className="text-sm font-bold text-sky-500">{state.waterTarget} glasses</span>
            </div>
            <input type="range" min={4} max={16} value={state.waterTarget}
              onChange={e => setState({ ...state, waterTarget: Number(e.target.value) })}
              className="w-full accent-sky-400"/>
            <div className="flex justify-between text-[10px] text-stone-400 mt-1"><span>4</span><span>16</span></div>
          </div>

          {/* 7-day history */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Last 7 Days</h3>
            <div className="space-y-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (6 - i))
                const ds = d.toISOString().slice(0, 10)
                const log = state.waterLogs.find(l => l.date === ds)
                const pct = log ? Math.min(1, log.cups / state.waterTarget) : 0
                return (
                  <div key={ds} className="flex items-center gap-3">
                    <div className="text-[11px] text-stone-400 w-8 text-right">{d.toLocaleDateString('en', { weekday: 'short' })}</div>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full transition-all" style={{ width: `${pct * 100}%` }}/>
                    </div>
                    <div className="text-[11px] text-stone-500 w-8">{log?.cups ?? 0}gl</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sleep' && (
        <div className="space-y-4">
          {/* Sleep log card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-3xl font-bold text-stone-800 mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {sleepLog ? `${sleepLog.hours}h` : '—'}
                </div>
                <div className="text-xs text-stone-400">
                  {sleepLog ? `${sleepLog.bedTime} → ${sleepLog.wakeTime}` : 'No sleep logged today'}
                </div>
              </div>
              <div className="text-5xl">{sleepPct >= 1 ? '😴' : sleepLog ? '😪' : '🛏️'}</div>
            </div>

            {sleepLog && (
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden mb-5">
                <div className={`h-full rounded-full transition-all duration-500 ${sleepPct >= 1 ? 'bg-emerald-400' : 'bg-violet-400'}`}
                  style={{ width: `${sleepPct * 100}%` }}/>
              </div>
            )}

            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1.5">Bedtime 🌙</label>
                <input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"/>
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1.5">Wake up ☀️</label>
                <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"/>
              </div>
            </div>
            <button onClick={logSleep} className="w-full py-3 bg-violet-500 text-white rounded-xl font-semibold text-sm hover:bg-violet-600 transition-colors"
              style={{ fontFamily: 'Outfit, sans-serif' }}>
              Log Sleep
            </button>
          </div>

          {/* Target */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Sleep Target</span>
              <span className="text-sm font-bold text-violet-500">{state.sleepTarget}h</span>
            </div>
            <input type="range" min={5} max={10} step={0.5} value={state.sleepTarget}
              onChange={e => setState({ ...state, sleepTarget: Number(e.target.value) })}
              className="w-full accent-violet-500"/>
            <div className="flex justify-between text-[10px] text-stone-400 mt-1"><span>5h</span><span>10h</span></div>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Sleep History</h3>
            {recentSleep.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-4">No sleep data yet</p>
            ) : (
              <div className="space-y-3">
                {recentSleep.map(l => {
                  const pct = Math.min(1, l.hours / state.sleepTarget)
                  return (
                    <div key={l.date} className="flex items-center gap-3">
                      <div className="text-[11px] text-stone-400 w-16 flex-shrink-0">
                        {new Date(l.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 1 ? 'bg-emerald-400' : 'bg-violet-400'}`} style={{ width: `${pct * 100}%` }}/>
                      </div>
                      <div className="text-[11px] font-medium text-stone-600 w-8 text-right">{l.hours}h</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
