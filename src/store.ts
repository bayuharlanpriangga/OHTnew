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

const sampleDates = (n: number, pct = 0.75): string[] => {
  const dates: string[] = []
  for (let i = 0; i < n; i++) {
    if (Math.random() < pct) {
      const d = new Date(); d.setDate(d.getDate() - i)
      dates.push(d.toISOString().slice(0, 10))
    }
  }
  return dates
}

const DEFAULT_STATE: AppState = {
  habits: [
    { id: '1', name: 'Morning Run', icon: 'run', color: 'emerald', freq: 'daily', completedDates: [...sampleDates(30), today()], createdAt: '2024-01-01' },
    { id: '2', name: 'Read 30 min', icon: 'book', color: 'indigo', freq: 'daily', completedDates: sampleDates(25), createdAt: '2024-01-01' },
    { id: '3', name: 'Drink Water', icon: 'water', color: 'sky', freq: 'daily', completedDates: [...sampleDates(28), today()], createdAt: '2024-01-01' },
    { id: '4', name: 'Meditate', icon: 'meditate', color: 'violet', freq: 'daily', completedDates: sampleDates(20), createdAt: '2024-01-01' },
    { id: '5', name: 'Journal', icon: 'write', color: 'amber', freq: 'daily', completedDates: sampleDates(18), createdAt: '2024-01-01' },
    { id: '6', name: 'Weekly Review', icon: 'target' as HabitIcon, color: 'rose', freq: 'weekly', completedDates: sampleDates(10, 0.6), createdAt: '2024-01-01' },
  ] as Habit[],
  waterLogs: [{ date: today(), cups: 5, ml: 1250 }],
  sleepLogs: [{ date: today(), bedTime: '23:00', wakeTime: '06:30', hours: 7.5 }],
  journalEntries: [
    { id: 'j1', date: today(), mood: 4, text: 'Great day today. Finished my morning run and felt energized all day.' },
    { id: 'j2', date: getLast(7)[0], mood: 3, text: 'A bit tired but managed to complete most habits.' },
  ],
  mealLogs: [
    { id: 'm1', date: today(), name: 'Nasi Goreng', kcal: 450, protein: 12, carbs: 65, fat: 15 },
    { id: 'm2', date: today(), name: 'Ayam Bakar', kcal: 320, protein: 35, carbs: 5, fat: 14 },
  ],
  focusSessions: [
    { date: today(), minutes: 25, habitId: '1' },
    { date: today(), minutes: 25 },
  ],
  reminders: [],
  userName: 'Orias',
  waterTarget: 8,
  sleepTarget: 7.5,
  nutrTarget: { kcal: 2000, protein: 50, carbs: 300, fat: 65 },
}

const STORAGE_KEY = 'ht_v2_state'

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
