import type { Tournament } from '~/types'
import { apiUrl } from '~/utils/api'

/**
 * Единый источник списка турниров: отдельной ручки GET /tournaments/{id} нет,
 * поэтому метаданные турнира берём из списка. Общий ключ useAsyncData —
 * значит один запрос на список и одна SSR-полезная нагрузка на все страницы.
 */
export function useTournaments() {
  return useAsyncData<Tournament[]>(
    'tournaments',
    async () => {
      try {
        const res = await $fetch<Tournament[] | { tournaments?: Tournament[] }>(apiUrl('/tournaments'))
        return Array.isArray(res) ? res : (res?.tournaments ?? [])
      } catch {
        return []
      }
    },
    { default: () => [] }
  )
}
