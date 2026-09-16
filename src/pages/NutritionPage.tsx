import { useState } from 'react'
import type { AppState, MealLog } from '../store'
import { today } from '../store'

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-stone-500 font-medium">{label}</span>
        <span className="text-stone-400">{value}g / {target}g</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }}/>
      </div>
    </div>
  )
}

export function NutritionPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', kcal: '', protein: '', carbs: '', fat: '' })

  const todayMeals = state.mealLogs.filter(l => l.date === today())
  const totals = todayMeals.reduce((s, m) => ({
    kcal: s.kcal + m.kcal, protein: s.protein + m.protein, carbs: s.carbs + m.carbs, fat: s.fat + m.fat,
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0 })

  const kcalPct = Math.min(100, Math.round((totals.kcal / state.nutrTarget.kcal) * 100))

  const addMeal = () => {
    if (!form.name.trim()) return
    const meal: MealLog = {
      id: Date.now().toString(),
      date: today(),
      name: form.name.trim(),
      kcal: Number(form.kcal) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    }
    setState({ ...state, mealLogs: [...state.mealLogs, meal] })
    setForm({ name: '', kcal: '', protein: '', carbs: '', fat: '' })
    setShowAdd(false)
  }

  const deleteMeal = (id: string) => setState({ ...state, mealLogs: state.mealLogs.filter(m => m.id !== id) })

  return (
    <div className="animate-fade-in space-y-4">
      {/* Calorie summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {totals.kcal} <span className="text-base text-stone-400 font-normal">/ {state.nutrTarget.kcal} kcal</span>
            </div>
            <div className="text-xs text-stone-400 mt-0.5">{kcalPct}% of daily target</div>
          </div>
          <div className="text-4xl">{kcalPct >= 100 ? '🍽️' : kcalPct >= 60 ? '😋' : '🥗'}</div>
        </div>

        {/* Kcal bar */}
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden mb-5">
          <div className={`h-full rounded-full transition-all duration-700 ${kcalPct >= 100 ? 'bg-rose-400' : kcalPct >= 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
            style={{ width: `${kcalPct}%` }}/>
        </div>

        {/* Macros */}
        <div className="space-y-2.5">
          <MacroBar label="Protein" value={totals.protein} target={state.nutrTarget.protein} color="bg-indigo-400"/>
          <MacroBar label="Carbs" value={totals.carbs} target={state.nutrTarget.carbs} color="bg-amber-400"/>
          <MacroBar label="Fat" value={totals.fat} target={state.nutrTarget.fat} color="bg-rose-400"/>
        </div>
      </div>

      {/* Add meal button */}
      <button onClick={() => setShowAdd(true)}
        className="w-full py-3 bg-white border-2 border-dashed border-stone-200 rounded-2xl text-sm font-medium text-stone-500 hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Log a meal
      </button>

      {/* Add meal form */}
      {showAdd && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 animate-slide-up">
          <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Log Meal</h3>
          <div className="space-y-3">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Meal name *"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"/>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'kcal', label: 'Calories (kcal)', placeholder: '0' },
                { key: 'protein', label: 'Protein (g)', placeholder: '0' },
                { key: 'carbs', label: 'Carbs (g)', placeholder: '0' },
                { key: 'fat', label: 'Fat (g)', placeholder: '0' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">{f.label}</label>
                  <input type="number" value={form[f.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400"/>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50">Cancel</button>
              <button onClick={addMeal} disabled={!form.name.trim()} className="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 disabled:opacity-40">
                Add Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's meals */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-stone-50">
          <h3 className="text-sm font-semibold text-stone-700" style={{ fontFamily: 'Outfit, sans-serif' }}>Today's Meals</h3>
        </div>
        {todayMeals.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">No meals logged today.</p>
        ) : (
          <div className="divide-y divide-stone-50">
            {todayMeals.map(m => (
              <div key={m.id} className="flex items-center gap-4 px-5 py-4 group">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-800" style={{ fontFamily: 'Outfit, sans-serif' }}>{m.name}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {m.kcal}kcal · P:{m.protein}g · C:{m.carbs}g · F:{m.fat}g
                  </div>
                </div>
                <button onClick={() => deleteMeal(m.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-300 hover:text-rose-400 rounded-lg hover:bg-rose-50 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Target settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Daily Targets</h3>
        <div className="space-y-3">
          {([
            { key: 'kcal', label: 'Calories', unit: 'kcal', min: 1000, max: 4000, step: 50 },
            { key: 'protein', label: 'Protein', unit: 'g', min: 20, max: 200, step: 5 },
            { key: 'carbs', label: 'Carbs', unit: 'g', min: 50, max: 500, step: 10 },
            { key: 'fat', label: 'Fat', unit: 'g', min: 20, max: 150, step: 5 },
          ] as const).map(f => (
            <div key={f.key} className="flex items-center gap-3">
              <span className="text-xs text-stone-500 w-16 flex-shrink-0">{f.label}</span>
              <input type="range" min={f.min} max={f.max} step={f.step} value={state.nutrTarget[f.key]}
                onChange={e => setState({ ...state, nutrTarget: { ...state.nutrTarget, [f.key]: Number(e.target.value) } })}
                className="flex-1 accent-indigo-500"/>
              <span className="text-xs font-bold text-stone-600 w-14 text-right">{state.nutrTarget[f.key]}{f.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
