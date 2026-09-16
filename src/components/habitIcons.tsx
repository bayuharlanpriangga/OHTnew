import type { ReactNode } from 'react'
import type { HabitIcon } from '../store'

const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const HabitIcons: Record<HabitIcon, ReactNode> = {
  run:      <svg viewBox="0 0 24 24" {...s}><circle cx="13" cy="4" r="2"/><path d="M15 8l-3 4-4 1 1 4"/><path d="M9 12l2 5"/><path d="M13 12l4 2 2 4"/></svg>,
  book:     <svg viewBox="0 0 24 24" {...s}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  water:    <svg viewBox="0 0 24 24" {...s}><path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"/></svg>,
  meditate: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="5" r="3"/><path d="M6 22c0-4 2.5-7 6-7s6 3 6 7"/><path d="M3 14c2 0 3-1 3-3"/><path d="M21 14c-2 0-3-1-3-3"/></svg>,
  sleep:    <svg viewBox="0 0 24 24" {...s}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  write:    <svg viewBox="0 0 24 24" {...s}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  food:     <svg viewBox="0 0 24 24" {...s}><path d="M3 2l3 18"/><path d="M9 2v6a3 3 0 006 0V2"/><path d="M15 2v18"/></svg>,
  music:    <svg viewBox="0 0 24 24" {...s}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  heart:    <svg viewBox="0 0 24 24" {...s}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  fire:     <svg viewBox="0 0 24 24" {...s}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7"/></svg>,
  sun:      <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
  leaf:     <svg viewBox="0 0 24 24" {...s}><path d="M17 8C8 10 5.9 16.17 3.82 19.97"/><path d="M3.82 19.97A10 10 0 0122 12c0-8.5-6-12-6-12C13 4 9 6 9 12a6 6 0 006 6c3 0 5-2 5-2"/></svg>,
}
