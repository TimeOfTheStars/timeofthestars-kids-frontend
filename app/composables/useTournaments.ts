import type { Tournament } from '~/types'
import { apiUrl } from '~/utils/api'

/**
 * Единый источник списка турниров: отдельной ручки GET /tournaments/{id} нет,
 * поэтому метаданные турнира берём из списка. Общий ключ useAsyncData —
 * значит один запрос на список и одна SSR-полезная нагрузка на все страницы.
 */
export function useTournaments(options: { immediate?: boolean } = {}) {
  const failed = useApiFailure('tournaments')

  const query = useAsyncData<Tournament[]>(
    'tournaments',
    async () => {
      try {
        const res = await $fetch<Tournament[] | { tournaments?: Tournament[] }>(apiUrl('/tournaments'))
        failed.value = false
        return Array.isArray(res) ? res : (res?.tournaments ?? [])
      } catch {
        failed.value = true
        return []
      }
    },
    { default: () => [], immediate: options.immediate ?? true }
  )

  const { retryDone } = useRetryOnFail('tournaments', query)

  return Object.assign(query, { failed, retryDone })
}
