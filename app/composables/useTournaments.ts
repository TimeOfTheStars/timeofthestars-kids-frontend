import type { Tournament } from '~/types'
import { apiUrl } from '~/utils/api'

/**
 * Единый источник списка турниров: отдельной ручки GET /tournaments/{id} нет,
 * поэтому метаданные турнира берём из списка.
 *
 * `key` нужен «ленивым» потребителям вроде модалки команды: она живёт в лэйауте
 * между переходами, и на общем ключе Nuxt при гидрации помечает данные как
 * загруженные (значение по умолчанию — уже значение). Страница, придя на такой
 * ключ, запрос не делает и остаётся пустой. Поэтому у модалки ключ свой.
 */
export function useTournaments(options: { immediate?: boolean; key?: string } = {}) {
  const key = options.key ?? 'tournaments'
  const failed = useApiFailure(key)

  const query = useAsyncData<Tournament[]>(
    key,
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

  const { retryDone } = useRetryOnFail(key, query)

  return Object.assign(query, { failed, retryDone })
}
