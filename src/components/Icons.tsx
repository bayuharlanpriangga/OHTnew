import type { ReactNode } from 'react'

const strokeProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const HabitIcons: Record<HabitIcon, ReactNode> = {
  run:      <svg viewBox="0 0 24 24" {...strokeProps}><circle cx="13" cy="4" r="2"/><path d="M15 8l-3 4-4 1 1 4"/><path d="M9 12l2 5"/><path d="M13 12l4 2 2 4"/></svg>,
  book:     <svg viewBox="0 0 24 24" {...strokeProps}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  water:    <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"/></svg>,
  meditate: <svg viewBox="0 0 24 24" {...strokeProps}><circle cx="12" cy="5" r="3"/><path d="M6 22c0-4 2.5-7 6-7s6 3 6 7"/><path d="M3 14c2 0 3-1 3-3"/><path d="M21 14c-2 0-3-1-3-3"/></svg>,
  sleep:    <svg viewBox="0 0 24 24" {...strokeProps}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  write:    <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  food:     <svg viewBox="0 0 24 24" {...strokeProps}><path d="M3 2l3 18"/><path d="M9 2v6a3 3 0 006 0V2"/><path d="M15 2v18"/></svg>,
  music:    <svg viewBox="0 0 24 24" {...strokeProps}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  heart:    <svg viewBox="0 0 24 24" {...strokeProps}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  fire:     <svg viewBox="0 0 24 24" {...strokeProps}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7c-1.86 0-3.516-.5-4.862-1.5"/></svg>,
  sun:      <svg viewBox="0 0 24 24" {...strokeProps}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
  leaf:     <svg viewBox="0 0 24 24" {...strokeProps}><path d="M17 8C8 10 5.9 16.17 3.82 19.97"/><path d="M3.82 19.97A10 10 0 0122 12c0-8.5-6-12-6-12C13 4 9 6 9 12a6 6 0 006 6c3 0 5-2 5-2"/></svg>,
}

export function NavIcon({ name, className = 'w-5 h-5' }: { name: string; className?: string }) {
  const icons: Record<string, ReactNode> = {
    habits:    <svg viewBox="0 0 24 24" {...strokeProps}><rect x="3" y="4" width="18" height="3" rx="1"/><rect x="3" y="10" width="18" height="3" rx="1"/><rect x="3" y="16" width="12" height="3" rx="1"/><polyline points="17 17 20 20 23 15"/></svg>,
    wellness:  <svg viewBox="0 0 24 24" {...strokeProps}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    focus:     <svg viewBox="0 0 24 24" {...strokeProps}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    more:      <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
    streaks:   <svg viewBox="0 0 24 24" {...strokeProps}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7"/></svg>,
    report:    <svg viewBox="0 0 24 24" {...strokeProps}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    journal:   <svg viewBox="0 0 24 24" {...strokeProps}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    nutrition: <svg viewBox="0 0 24 24" {...strokeProps}><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    jadwal:    <svg viewBox="0 0 24 24" {...strokeProps}><rect x="3" y="4" width="18" height="17" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>,
    settings:  <svg viewBox="0 0 24 24" {...strokeProps}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    plus:      <svg viewBox="0 0 24 24" {...strokeProps}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check:     <svg viewBox="0 0 24 24" {...strokeProps}><polyline points="20 6 9 17 4 12"/></svg>,
    close:     <svg viewBox="0 0 24 24" {...strokeProps}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    trash:     <svg viewBox="0 0 24 24" {...strokeProps}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    edit:      <svg viewBox="0 0 24 24" {...strokeProps}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    water:     <svg viewBox="0 0 24 24" {...strokeProps}><path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"/></svg>,
    moon:      <svg viewBox="0 0 24 24" {...strokeProps}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
    friends:   <svg viewBox="0 0 24 24" {...strokeProps}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    back:      <svg viewBox="0 0 24 24" {...strokeProps}><polyline points="15 18 9 12 15 6"/></svg>,
  }
  return <span className={className}>{icons[name] ?? null}</span>
}
