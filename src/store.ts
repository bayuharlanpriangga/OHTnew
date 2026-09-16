// ─── Shared types & localStorage helpers ─────────────────

export type HabitColor = 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'sky' | 'orange' | 'teal'
export type HabitIcon = 'run' | 'book' | 'water' | 'meditate' | 'sleep' | 'write' | 'food' | 'music' | 'heart' | 'fire' | 'sun' | 'leaf'
export type HabitFreq = 'daily' | 'weekly' | 'monthly'

export interface Habit {
  id: string
  name: string
  icon: HabitIcon
  color: HabitColor
  freq: HabitFreq
  completedDates: string[]
  createdAt: string
}

export interface WaterLog {
  date: string
  cups: number
  ml: number
}

export interface SleepLog {
  date: string
  bedTime: string
  wakeTime: string
  hours: number
}

export interface JournalEntry {
  id: string
  date: string
  mood: number // 1-5
  text: string
}

export interface MealLog {
  id: string
  date: string
  name: string
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export interface FocusSession {
  date: string
  minutes: number
  habitId?: string
}

export interface Reminder {
  id: string
  habitId: string
  time: string
  days: number[] // 0-6
  enabled: boolean
}

export interface AppState {
  habits: Habit[]
  waterLogs: WaterLog[]
  sleepLogs: SleepLog[]
  journalEntries: JournalEntry[]
  mealLogs: MealLog[]
  focusSessions: FocusSession[]
  reminders: Reminder[]
  userName: string
  waterTarget: number // cups
  sleepTarget: number // hours
  nutrTarget: { kcal: number; protein: number; carbs: number; fat: number }
}

export const today = (): string => new Date().toISOString().slice(0, 10)

export const calcStreak = (dates: string[]): number => {
  const set = new Set(dates)
  let streak = 0
  const d = new Date()
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1)
  while (set.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1) }
  return streak
}

export const getLast = (n: number): string[] => {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

const DEFAULT_STATE: AppState = {
  habits: [],
  waterLogs: [],
  sleepLogs: [],
  journalEntries: [],
  mealLogs: [],
  focusSessions: [],
  reminders: [],
  userName: 'You',
  waterTarget: 8,
  sleepTarget: 7.5,
  nutrTarget: { kcal: 2000, protein: 50, carbs: 300, fat: 65 },
}

const STORAGE_KEY = 'ht_v3_state'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_STATE
}

export function saveState(s: AppState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

// Color/icon helpers
export const colorMap: Record<HabitColor, { bg: string; soft: string; text: string; bar: string; dot: string }> = {
  indigo:  { bg: 'bg-indigo-500',  soft: 'bg-indigo-50',  text: 'text-indigo-600',  bar: 'bg-indigo-500',  dot: 'bg-indigo-400' },
  emerald: { bg: 'bg-emerald-500', soft: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500', dot: 'bg-emerald-400' },
  amber:   { bg: 'bg-amber-400',   soft: 'bg-amber-50',   text: 'text-amber-600',   bar: 'bg-amber-400',   dot: 'bg-amber-400' },
  rose:    { bg: 'bg-rose-500',    soft: 'bg-rose-50',    text: 'text-rose-600',    bar: 'bg-rose-500',    dot: 'bg-rose-400' },
  violet:  { bg: 'bg-violet-500',  soft: 'bg-violet-50',  text: 'text-violet-600',  bar: 'bg-violet-500',  dot: 'bg-violet-400' },
  sky:     { bg: 'bg-sky-400',     soft: 'bg-sky-50',     text: 'text-sky-600',     bar: 'bg-sky-400',     dot: 'bg-sky-400' },
  orange:  { bg: 'bg-orange-400',  soft: 'bg-orange-50',  text: 'text-orange-600',  bar: 'bg-orange-400',  dot: 'bg-orange-400' },
  teal:    { bg: 'bg-teal-500',    soft: 'bg-teal-50',    text: 'text-teal-600',    bar: 'bg-teal-500',    dot: 'bg-teal-400' },
}

export const HABIT_ICONS: HabitIcon[] = ['run','book','water','meditate','sleep','write','food','music','heart','fire','sun','leaf']
export const HABIT_COLORS: HabitColor[] = ['indigo','emerald','amber','rose','violet','sky','orange','teal']
