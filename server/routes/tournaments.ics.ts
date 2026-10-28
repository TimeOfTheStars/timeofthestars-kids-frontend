import type { Tournament } from '~/types'
import { apiUrl } from '~/utils/api'
import { buildCalendar, toIcsUtc, tournamentVevent } from '~/utils/calendar'

/**
 * Календарь всех турниров для подписки (Apple — webcal://, Google — по cid).
 * Если API не ответил, отдаём ошибку, а не пустой календарь: пустой фид
 * календари воспримут как удаление всех событий у подписчиков.
 */
export default defineCachedEventHandler(
  async (event) => {
    let tournaments: Tournament[]
    try {
      const res = await $fetch<Tournament[] | { tournaments?: Tournament[] }>(apiUrl('/tournaments'))
      tournaments = Array.isArray(res) ? res : (res?.tournaments ?? [])
    } catch {
      throw createError({ statusCode: 502, statusMessage: 'Tournaments API unavailable' })
    }

    const stamp = toIcsUtc(new Date())
    const body = buildCalendar(
      tournaments.map(t => tournamentVevent(t, stamp)),
      [
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Турниры «Время Звёзд KIDS»',
        'X-WR-TIMEZONE:Europe/Moscow',
        'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
        'X-PUBLISHED-TTL:PT6H'
      ]
    )

    setResponseHeaders(event, {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="tournaments.ics"'
    })
    return body
  },
  { maxAge: 60 * 15, name: 'tournaments-ics' }
)
