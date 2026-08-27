import type { Team } from '~/types'
import { apiUrl } from '~/utils/api'

/**
 * Справочник команд с общей статистикой.
 *
 * `key` — для «ленивых» потребителей: см. пояснение в useTournaments,
 * общий ключ с ленивой регистрацией оставляет страницу без данных.
 */
export function useTeams(options: { immediate?: boolean; key?: string } = {}) {
  const key = options.key ?? 'teams'
  const failed = useApiFailure(key)

  const query = useAsyncData<Team[]>(
    key,
    async () => {
      try {
        const res = await $fetch<Team[]>(apiUrl('/teams?limit=500'))
        failed.value = false
        return res
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

/**
 * Имена команд не уникальны (две «Звезды», два «Витязя» из разных городов),
 * поэтому при совпадении имён уточняем по логотипу.
 */
export function findTeamByName(
  teams: Team[],
  name: string | null | undefined,
  logo?: string | null
): Team | null {
  if (!name) return null
  const matches = teams.filter(t => t.name === name)
  if (!matches.length) return null
  if (matches.length === 1) return matches[0]!
  if (logo) {
    const byLogo = matches.find(t => t.logo === logo)
    if (byLogo) return byLogo
  }
  return matches[0]!
}
