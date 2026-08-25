export interface TeamModalTarget {
  /** Есть в контуре статистики: standings, составы, byTeam */
  teamId?: string | null
  /** Есть там, где id не отдаётся: карточка турнира */
  name?: string | null
  /** Дискриминатор для одноимённых команд */
  logo?: string | null
  /** Турнир, из которого открыли: определяет состав и фото по умолчанию */
  tournamentId?: string | null
}

/**
 * Состояние общей модалки команды. Через useState, потому что открывают её
 * страницы и вложенные компоненты, а рисует — компонент в лэйауте.
 */
export function useTeamModal() {
  const target = useState<TeamModalTarget | null>('team-modal', () => null)

  function openTeam(next: TeamModalTarget) {
    target.value = next
  }

  function closeTeam() {
    target.value = null
  }

  return { target, openTeam, closeTeam }
}
