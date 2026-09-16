import { useState } from 'react'
import type { AppState, JournalEntry } from '../store'
import { today } from '../store'

const MOODS = ['😞', '😐', '🙂', '😊', '🤩']
const MOOD_LABELS = ['Rough', 'Okay', 'Good', 'Great', 'Amazing']
const MOOD_COLORS = ['bg-rose-100 text-rose-600', 'bg-amber-100 text-amber-600', 'bg-yellow-100 text-yellow-600', 'bg-emerald-100 text-emerald-600', 'bg-indigo-100 text-indigo-600']

export function JournalPage({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [mood, setMood] = useState(3)
  const [text, setText] = useState('')
  const [editing, setEditing] = useState<string | null>(null)

  const todayEntry = state.journalEntries.find(e => e.date === today())
  const sorted = [...state.journalEntries].sort((a, b) => b.date.localeCompare(a.date))

  const save = () => {
    if (!text.trim()) return
    if (editing) {
      setState({ ...state, journalEntries: state.journalEntries.map(e => e.id === editing ? { ...e, mood, text } : e) })
      setEditing(null)
    } else if (todayEntry) {
      setState({ ...state, journalEntries: state.journalEntries.map(e => e.date === today() ? { ...e, mood, text } : e) })
    } else {
      setState({ ...state, journalEntries: [...state.journalEntries, { id: Date.now().toString(), date: today(), mood, text }] })
    }
    setText('')
    setMood(3)
  }

  const editEntry = (e: JournalEntry) => { setMood(e.mood); setText(e.text); setEditing(e.id) }
  const deleteEntry = (id: string) => setState({ ...state, journalEntries: state.journalEntries.filter(e => e.id !== id) })

  return (
    <div className="animate-fade-in space-y-4">
      {/* Write entry */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {editing ? 'Edit Entry' : todayEntry ? "Today's Entry" : 'Write Today'}
        </h3>

        {/* Mood picker */}
        <div className="mb-4">
          <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Mood</div>
          <div className="flex gap-2">
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => setMood(i + 1)} title={MOOD_LABELS[i]}
                className={`flex-1 py-2.5 rounded-xl text-xl transition-all ${mood === i + 1 ? 'ring-2 ring-indigo-300 bg-indigo-50 scale-105' : 'bg-stone-50 opacity-60 hover:opacity-100'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
          placeholder="What's on your mind today? How did your habits go?..."
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none transition-all mb-3"/>
        <div className="flex gap-2">
          {editing && (
            <button onClick={() => { setEditing(null); setText(''); setMood(3) }}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">
              Cancel
            </button>
          )}
          <button onClick={save} disabled={!text.trim()}
            className="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 disabled:opacity-40 transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}>
            {editing ? 'Save' : todayEntry ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
      </div>

      {/* Entries list */}
      <div className="space-y-3">
        {sorted.map(e => {
          const moodIdx = e.mood - 1
          return (
            <div key={e.id} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${MOOD_COLORS[moodIdx]}`}>
                    {MOODS[moodIdx]} {MOOD_LABELS[moodIdx]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-stone-400">
                    {new Date(e.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <button onClick={() => editEntry(e)} className="p-1.5 text-stone-300 hover:text-stone-600 rounded-lg hover:bg-stone-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => deleteEntry(e.id)} className="p-1.5 text-stone-300 hover:text-rose-400 rounded-lg hover:bg-rose-50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{e.text}</p>
            </div>
          )
        })}
        {sorted.length === 0 && (
          <div className="text-center py-8 text-stone-400 text-sm">No journal entries yet. Write your first one above!</div>
        )}
      </div>
    </div>
  )
}
