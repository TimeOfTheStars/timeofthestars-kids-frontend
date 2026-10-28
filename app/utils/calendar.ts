import type { Tournament } from '~/types'
import { endOf, startOf } from '~/utils/tournaments'

/** Фид со всеми турнирами отдаёт server/routes/tournaments.ics.ts */
export const CALENDAR_FEED_URL = 'webcal://timeofthestars-kids.ru/tournaments.ics'

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export function toIcsUtc(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
}

function icsEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/** RFC 5545: строки длиннее 75 октетов переносятся, продолжение начинается с пробела */
function foldLine(line: string): string {
  const encoder = new TextEncoder()
  const parts: string[] = []
  let current = ''
  let size = 0
  for (const ch of line) {
    const chSize = encoder.encode(ch).length
    if (size + chSize > (parts.length ? 74 : 75)) {
      parts.push(current)
      current = ''
      size = 0
    }
    current += ch
    size += chSize
  }
  parts.push(current)
  return parts.join('\r\n ')
}

export function calendarLocation(t: Tournament): string {
  if (t.arena) {
    return [t.arena.name, t.arena.address, t.arena.city].filter(Boolean).join(', ')
  }
  return t.location ?? ''
}

export function tournamentVevent(t: Tournament, stamp: string): string[] {
  const location = calendarLocation(t)
  return [
    'BEGIN:VEVENT',
    `UID:tournament-${t.id}@timeofthestars-kids.ru`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsUtc(startOf(t))}`,
    `DTEND:${toIcsUtc(endOf(t))}`,
    `SUMMARY:${icsEscape(t.title)}`,
    t.description ? `DESCRIPTION:${icsEscape(t.description)}` : '',
    location ? `LOCATION:${icsEscape(location)}` : '',
    t.url ? `URL:${t.url}` : '',
    'END:VEVENT'
  ].filter(Boolean)
}

export function buildCalendar(events: string[][], header: string[] = []): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Time of the Stars KIDS//Tournaments//RU',
    'CALSCALE:GREGORIAN',
    ...header,
    ...events.flat(),
    'END:VCALENDAR'
  ].map(foldLine).join('\r\n') + '\r\n'
}

export function googleCalendarUrl(t: Tournament): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: t.title,
    dates: `${toIcsUtc(startOf(t))}/${toIcsUtc(endOf(t))}`,
    details: t.description ?? '',
    location: calendarLocation(t)
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Google принимает подписку по webcal-ссылке в параметре cid */
export function googleSubscribeUrl(): string {
  return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(CALENDAR_FEED_URL)}`
}
