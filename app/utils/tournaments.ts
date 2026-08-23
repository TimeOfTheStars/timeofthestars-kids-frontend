import type { Tournament } from '~/types'

export const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
]

export function parseDateTime(
  date: string,
  time: string | null | undefined,
  fallback: 'start' | 'end'
): Date {
  const t = time && /^\d{1,2}:\d{2}$/.test(time) ? time : (fallback === 'start' ? '00:00' : '23:59')
  const [hh, mm] = t.split(':')
  return new Date(`${date}T${hh!.padStart(2, '0')}:${mm!.padStart(2, '0')}:00+03:00`)
}

export function startOf(t: Tournament): Date {
  return parseDateTime(t.startDate, t.startTime, 'start')
}

export function endOf(t: Tournament): Date {
  return parseDateTime(t.endDate, t.endTime, 'end')
}

export function inferSeason(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  return m >= 8 ? `${y}/${y + 1}` : `${y - 1}/${y}`
}

export function withSeason(t: Tournament): Tournament {
  return { ...t, season: t.season || inferSeason(t.startDate) }
}

export function startKey(t: Tournament): string {
  return `${t.startDate}T${t.startTime ?? '00:00'}`
}

export function isInProgress(t: Tournament, now: Date): boolean {
  return startOf(t) <= now && now <= endOf(t)
}

export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const sameDay = startIso === endIso
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  const sameYear = start.getFullYear() === end.getFullYear()
  const year = end.getFullYear()

  if (sameDay) {
    return `${start.getDate()} ${MONTHS[start.getMonth()]} ${year}`
  }
  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]} ${year}`
  }
  if (sameYear) {
    return `${start.getDate()} ${MONTHS[start.getMonth()]} — ${end.getDate()} ${MONTHS[end.getMonth()]} ${year}`
  }
  return `${start.getDate()} ${MONTHS[start.getMonth()]} ${start.getFullYear()} — ${end.getDate()} ${MONTHS[end.getMonth()]} ${year}`
}

/** Один день: «23 августа 2026» */
export function formatDay(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** «4-4 · 3 × 15 мин» — из полей регламента, если они заполнены */
export function formatGameFormat(t: Tournament): string {
  const parts: string[] = []
  if (t.gameFormat) parts.push(`Формат ${t.gameFormat}`)
  if (t.periodsCount && t.periodMinutes) {
    parts.push(`${t.periodsCount} × ${t.periodMinutes} мин`)
  } else if (t.periodsCount) {
    parts.push(`${t.periodsCount} периода`)
  } else if (t.periodMinutes) {
    parts.push(`период ${t.periodMinutes} мин`)
  }
  return parts.join(' · ')
}
