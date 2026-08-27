import type { Team } from '~/types'
import { apiUrl } from '~/utils/api'

/**
 * Справочник команд с общей статистикой. Один запрос под общим ключом:
 * им пользуются и раздел «Команды», и модалка команды.
 */
export function useTeams(options: { immediate?: boolean } = {}) {
  const failed = useApiFailure('teams')

  const query = useAsyncData<Team[]>(
    'teams',
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

  const { retryDone } = useRetryOnFail('teams', query)

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
