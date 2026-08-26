import type { StatLine, Tournament } from '~/types'
import { apiUrl } from '~/utils/api'

export interface AggregatedPlayer extends StatLine {
  /** В скольких турнирах игрок значится в заявке */
  tournamentsCount: number
  /** Все команды, за которые он играл, от последней к первой */
  teamNames: string[]
}

function sumNullable(a: number | null | undefined, b: number | null | undefined): number | null {
  if (a == null && b == null) return null
  return (a ?? 0) + (b ?? 0)
}

/**
 * Сводный список игроков.
 *
 * Публичной ручки «все игроки» в API нет, поэтому собираем заявки турниров,
 * у которых есть заведённые матчи (`hasGames`), и складываем показатели по игроку.
 * Команда и номер берутся из самого свежего турнира.
 */
export function useAllPlayers() {
  return useAsyncData<AggregatedPlayer[]>(
    'all-players',
    async () => {
      let tournaments: Tournament[] = []
      try {
        const res = await $fetch<Tournament[] | { tournaments?: Tournament[] }>(apiUrl('/tournaments'))
        tournaments = Array.isArray(res) ? res : (res?.tournaments ?? [])
      } catch {
        return []
      }

      // от старых к новым: последняя запись перетирает команду и номер
      const withStats = tournaments
        .filter(t => t.hasGames)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))

      const rosters = await Promise.all(
        withStats.map(async t => {
          try {
            return await $fetch<StatLine[]>(apiUrl(`/tournaments/${t.id}/players`))
          } catch {
            return []
          }
        })
      )

      const merged = new Map<string, AggregatedPlayer>()

      for (const roster of rosters) {
        for (const row of roster) {
          const id = row.player?.id
          if (!id) continue
          const prev = merged.get(id)

          if (!prev) {
            merged.set(id, {
              ...row,
              tournamentsCount: 1,
              teamNames: row.team?.name ? [row.team.name] : []
            })
            continue
          }

          merged.set(id, {
            ...prev,
            player: {
              ...prev.player,
              ...row.player,
              photo: row.player.photo ?? prev.player.photo,
              position: row.player.position ?? prev.player.position,
              birthDate: row.player.birthDate ?? prev.player.birthDate
            },
            team: row.team ?? prev.team,
            number: row.number ?? prev.number,
            games: prev.games + row.games,
            goals: prev.goals + row.goals,
            assists: prev.assists + row.assists,
            points: prev.points + row.points,
            isGoalie: prev.isGoalie || row.isGoalie,
            goalsAgainst: sumNullable(prev.goalsAgainst, row.goalsAgainst),
            saves: sumNullable(prev.saves, row.saves),
            minutesPlayed: sumNullable(prev.minutesPlayed, row.minutesPlayed),
            tournamentsCount: prev.tournamentsCount + 1,
            teamNames: row.team?.name && !prev.teamNames.includes(row.team.name)
              ? [row.team.name, ...prev.teamNames]
              : prev.teamNames
          })
        }
      }

      return [...merged.values()]
    },
    { default: () => [] }
  )
}
