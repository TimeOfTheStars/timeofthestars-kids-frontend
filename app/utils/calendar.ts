import type { GameListItem, Tournament } from '~/types'
import { endOf, formatDay, hasTournamentPage, startOf } from '~/utils/tournaments'

const SITE_URL = 'https://timeofthestars-kids.ru'

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

/** Своя страница турнира, если она есть, иначе внешняя ссылка из API */
function tournamentLink(t: Tournament): string {
  return hasTournamentPage(t) ? `${SITE_URL}/tournaments/${t.id}` : (t.url ?? '')
}

function gameLine(g: GameListItem): string {
  const score = g.isFinished && g.scoreA != null && g.scoreB != null
    ? ` ${g.scoreA}:${g.scoreB} `
    : ' — '
  return [`№${g.matchNo}`, g.time, `${g.teamA.name}${score}${g.teamB.name}`].filter(Boolean).join(' · ')
}

/** Расписание матчей; если турнир идёт несколько дней — с заголовком на каждый день */
function gamesBlock(games: GameListItem[]): string {
  const sorted = games.slice().sort((a, b) =>
    a.date.localeCompare(b.date) ||
    (a.time ?? '').localeCompare(b.time ?? '') ||
    a.matchNo - b.matchNo
  )
  const days = new Set(sorted.map(g => g.date))
  const lines = ['Матчи:']
  let day = ''
  for (const g of sorted) {
    if (days.size > 1 && g.date !== day) {
      day = g.date
      lines.push('', `${formatDay(g.date)}:`)
    }
    lines.push(gameLine(g))
  }
  return lines.join('\n')
}

/** Google не показывает поле URL, поэтому ссылку дублируем в описание */
function calendarDescription(t: Tournament, games?: GameListItem[]): string {
  const link = tournamentLink(t)
  return [
    t.description,
    games?.length ? gamesBlock(games) : '',
    link ? `Подробнее: ${link}` : ''
  ].filter(Boolean).join('\n\n')
}

export function tournamentVevent(t: Tournament, stamp: string, games?: GameListItem[]): string[] {
  const location = calendarLocation(t)
  const description = calendarDescription(t, games)
  const link = tournamentLink(t)
  return [
    'BEGIN:VEVENT',
    `UID:tournament-${t.id}@timeofthestars-kids.ru`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsUtc(startOf(t))}`,
    `DTEND:${toIcsUtc(endOf(t))}`,
    `SUMMARY:${icsEscape(t.title)}`,
    description ? `DESCRIPTION:${icsEscape(description)}` : '',
    location ? `LOCATION:${icsEscape(location)}` : '',
    link ? `URL:${link}` : '',
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
    details: calendarDescription(t),
    location: calendarLocation(t)
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Google принимает подписку по webcal-ссылке в параметре cid */
export function googleSubscribeUrl(): string {
  return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(CALENDAR_FEED_URL)}`
}
