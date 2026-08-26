import { onMounted } from 'vue'
import type { Tournament } from '~/types'
import { apiUrl } from '~/utils/api'

/**
 * Единый источник списка турниров: отдельной ручки GET /tournaments/{id} нет,
 * поэтому метаданные турнира берём из списка. Общий ключ useAsyncData —
 * значит один запрос на список и одна SSR-полезная нагрузка на все страницы.
 *
 * Если запрос упал на сервере, повторяем его на клиенте: иначе страница
 * оставалась бы пустой до ручного обновления.
 */
export function useTournaments(options: { immediate?: boolean } = {}) {
  const failed = useState('tournaments-failed', () => false)

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

  if (import.meta.client) {
    onMounted(() => {
      if (!failed.value) return
      failed.value = false
      query.refresh()
    })
  }

  return query
}
