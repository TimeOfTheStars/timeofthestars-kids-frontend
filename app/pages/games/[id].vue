<template>
  <div class="page game-page">
    <div class="container">
      <div v-reveal class="game-page__breadcrumbs-wrap">
        <Breadcrumbs :items="breadcrumbs" />
      </div>

      <h1 v-reveal class="page__title">
        <template v-if="game">Матч №{{ game.matchNo }}</template>
        <template v-else>Матч</template>
      </h1>
      <p v-if="game" v-reveal="{ delay: 70 }" class="game-page__subtitle">
        {{ formatDay(game.date) }}<template v-if="game.time"> · {{ game.time }}</template>
        <template v-if="tournament"> · {{ tournament.title }}</template>
      </p>

      <section class="page-surface">
        <div v-if="pending" class="stats-state"><p>Загружаем протокол...</p></div>

        <div v-else-if="!game" class="stats-state">
          <p>Матч не найден.</p>
          <NuxtLink to="/tournaments" class="btn stats-state__btn">Все турниры</NuxtLink>
        </div>

        <template v-else>
          <div v-reveal class="scoreboard" :class="{ 'scoreboard--pending': !game.isFinished }">
            <span
              class="scoreboard__status"
              :class="game.isFinished ? 'scoreboard__status--done' : 'scoreboard__status--pending'"
            >{{ game.isFinished ? 'Завершён' : 'Не сыгран' }}</span>

            <div class="scoreboard__main">
              <div class="scoreboard__team">
                <img v-if="game.teamA.logo" :src="game.teamA.logo" alt="" class="scoreboard__logo" />
                <span class="scoreboard__team-name">{{ game.teamA.name }}</span>
              </div>

              <div class="scoreboard__score">
                <span class="scoreboard__score-value">{{ game.scoreA ?? '—' }}</span>
                <span class="scoreboard__score-sep">:</span>
                <span class="scoreboard__score-value">{{ game.scoreB ?? '—' }}</span>
              </div>

              <div class="scoreboard__team scoreboard__team--b">
                <img v-if="game.teamB.logo" :src="game.teamB.logo" alt="" class="scoreboard__logo" />
                <span class="scoreboard__team-name">{{ game.teamB.name }}</span>
              </div>
            </div>

            <dl class="scoreboard__facts">
              <div class="scoreboard__fact">
                <dt>Броски</dt>
                <dd>
                  <template v-if="game.shotsA != null && game.shotsB != null">{{ game.shotsA }} : {{ game.shotsB }}</template>
                  <template v-else>—</template>
                </dd>
              </div>
              <div v-if="formatLabel" class="scoreboard__fact">
                <dt>Регламент</dt>
                <dd>{{ formatLabel }}</dd>
              </div>
            </dl>

            <div v-if="game.videoUrl || game.scan" class="scoreboard__links">
              <a
                v-if="game.videoUrl"
                :href="game.videoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="scoreboard__link scoreboard__link--video"
              >
                Запись матча
                <Icon name="ph:play-circle" />
              </a>
              <a
                v-if="game.scan"
                :href="game.scan"
                target="_blank"
                rel="noopener noreferrer"
                class="scoreboard__link"
              >
                Скан протокола
                <Icon name="ph:file-text" />
              </a>
            </div>
          </div>

          <div class="game-page__block">
            <h2 v-reveal class="game-page__block-title">Взятие ворот</h2>
            <GameGoals
              v-reveal
              :goals="detail?.goals ?? []"
              :team-a="game.teamA"
              :team-b="game.teamB"
              :periods-count="tournament?.periodsCount ?? null"
            />
            <p v-if="scoreMismatch" class="game-page__note">
              Протокол заполнен частично: хронология голов не совпадает со счётом на табло.
            </p>
          </div>

          <div class="game-page__rosters">
            <div v-for="side in rosterSides" :key="side.team.id" class="game-page__roster">
              <h2 v-reveal class="game-page__block-title">
                <img v-if="side.team.logo" :src="side.team.logo" alt="" class="game-page__roster-logo" />
                {{ side.team.name }}
              </h2>
              <StatLinesTable
                v-if="side.goalies.length"
                v-reveal
                title="Вратари"
                variant="goalie"
                :rows="side.goalies"
                :show-games="false"
                :show-note="false"
              />
              <StatLinesTable
                v-reveal
                title="Полевые игроки"
                :rows="side.field"
                :show-games="false"
                empty-text="Состав не заполнен."
              />
            </div>
          </div>

          <p v-if="hasGoalies" class="game-page__note">
            Вратарские показатели выводятся из табло матча: пропущено — голы соперника,
            отражено — броски соперника минус его голы. «Мин» — длительность матча по регламенту.
          </p>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameDetail, StatLine, TeamRef } from '~/types'
import { apiUrl } from '~/utils/api'
import { formatDay, formatGameFormat } from '~/utils/tournaments'

definePageMeta({
  key: route => route.path
})

const route = useRoute()
const id = computed(() => String(route.params.id))
const tournamentId = computed(() => (typeof route.query.t === 'string' ? route.query.t : ''))

const { data: detail, pending } = await useAsyncData<GameDetail | null>(
  `game-${String(route.params.id)}`,
  async () => {
    try {
      return await $fetch<GameDetail>(apiUrl(`/games/${id.value}`))
    } catch {
      return null
    }
  },
  { default: () => null }
)

const game = computed(() => detail.value?.game ?? null)

/** Список турниров уже закеширован общим ключом — берём из него регламент и название */
const { data: tournaments } = await useTournaments()
const tournament = computed(() => {
  if (!tournamentId.value) return null
  return (tournaments.value ?? []).find(t => String(t.id) === tournamentId.value) ?? null
})
const formatLabel = computed(() => (tournament.value ? formatGameFormat(tournament.value) : ''))

const breadcrumbs = computed(() => {
  const items: { title: string; to?: string }[] = [{ title: 'Турниры', to: '/tournaments' }]
  if (tournament.value) {
    items.push({ title: tournament.value.title, to: `/tournaments/${tournament.value.id}` })
  } else if (tournamentId.value) {
    items.push({ title: 'Турнир', to: `/tournaments/${tournamentId.value}` })
  }
  items.push({ title: game.value ? `Матч №${game.value.matchNo}` : 'Матч' })
  return items
})

const scoreMismatch = computed(() => {
  const g = game.value
  const goals = detail.value?.goals
  if (!g || !goals || !goals.length) return false
  if (g.scoreA == null || g.scoreB == null) return false
  return goals.length !== g.scoreA + g.scoreB
})

function split(rows: StatLine[] | undefined) {
  const list = rows ?? []
  return {
    goalies: list.filter(row => row.isGoalie),
    field: list.filter(row => !row.isGoalie)
  }
}

const rosterSides = computed(() => {
  const g = game.value
  if (!g) return [] as { team: TeamRef; goalies: StatLine[]; field: StatLine[] }[]
  return [
    { team: g.teamA, ...split(detail.value?.rosterA) },
    { team: g.teamB, ...split(detail.value?.rosterB) }
  ]
})

const hasGoalies = computed(() => rosterSides.value.some(side => side.goalies.length))

useHead(() => ({
  title: game.value
    ? `${game.value.teamA.name} — ${game.value.teamB.name}: протокол матча — «Время Звёзд KIDS»`
    : 'Протокол матча — «Время Звёзд KIDS»',
  meta: [
    {
      name: 'description',
      content: game.value
        ? `Матч №${game.value.matchNo}: ${game.value.teamA.name} — ${game.value.teamB.name}. Счёт, броски, голы и составы команд.`
        : 'Протокол детского хоккейного матча: счёт, голы, составы команд.'
    }
  ],
  link: [
    { rel: 'canonical', href: `https://timeofthestars-kids.ru/games/${id.value}` }
  ]
}))
</script>

<style scoped>
.page {
  padding: 2rem 0 3rem;
}
.page__title {
  font-size: 2rem;
  margin: 0 0 0.5rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}
.game-page__subtitle {
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}

.page-surface {
  position: relative;
  padding: 2rem 0 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.page-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  background: var(--color-bg);
  z-index: 0;
}
.page-surface > * {
  position: relative;
  z-index: 1;
}

.stats-state {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 2rem 1.25rem;
  text-align: center;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.stats-state p {
  margin: 0;
}
.stats-state__btn {
  text-decoration: none;
}

.scoreboard {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem 1.5rem 1.4rem;
  background:
    url('/hockey-watermark.svg') no-repeat right -14px bottom -10px / 170px auto,
    linear-gradient(160deg, rgba(37, 99, 235, 0.16) 0%, rgba(37, 99, 235, 0.04) 45%, rgba(15, 23, 42, 0.02) 100%),
    var(--color-surface);
  border: 1px solid rgba(37, 99, 235, 0.18);
  border-radius: calc(var(--radius) + 4px);
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 32px -14px rgba(37, 99, 235, 0.22);
}
.scoreboard--pending {
  background:
    url('/hockey-watermark.svg') no-repeat right -14px bottom -10px / 170px auto,
    linear-gradient(160deg, rgba(148, 163, 184, 0.18) 0%, rgba(148, 163, 184, 0.06) 50%, rgba(15, 23, 42, 0.02) 100%),
    var(--color-surface);
  border-color: rgba(148, 163, 184, 0.25);
}
.scoreboard__status {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
}
.scoreboard__status::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.scoreboard__status--done {
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
  box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.25);
}
.scoreboard__status--pending {
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
  box-shadow: inset 0 0 0 1px var(--color-border);
}

.scoreboard__main {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}
.scoreboard__team {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}
.scoreboard__team--b {
  flex-direction: row-reverse;
  text-align: right;
}
.scoreboard__logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
  flex-shrink: 0;
}
.scoreboard__team-name {
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.2;
  overflow-wrap: break-word;
  hyphens: manual;
}
.scoreboard__score {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-variant-numeric: tabular-nums;
}
.scoreboard__score-value {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1;
}
.scoreboard__score-sep {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.scoreboard__facts {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}
.scoreboard__fact {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.scoreboard__fact dt {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}
.scoreboard__fact dd {
  margin: 0;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.scoreboard__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.scoreboard__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  background: var(--color-accent);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: calc(var(--radius) - 2px);
  box-shadow: 0 4px 10px -4px rgba(37, 99, 235, 0.5);
  transition: background 0.2s, transform 0.2s;
}
.scoreboard__link:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}
.scoreboard__link--video {
  background: var(--color-accent-red);
  box-shadow: 0 4px 10px -4px rgba(220, 38, 38, 0.5);
}
.scoreboard__link--video:hover {
  background: var(--color-accent-red-hover);
}

.game-page__block {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.game-page__block-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text);
}
.game-page__roster-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}
.game-page__note {
  margin: 0;
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.45;
}

.game-page__rosters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
.game-page__roster {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

@media (min-width: 900px) {
  .game-page__rosters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .page__title {
    font-size: 1.65rem;
  }
  .scoreboard {
    padding: 1.15rem 1rem 1.1rem;
    gap: 1rem;
  }
  .scoreboard__main {
    grid-template-columns: 1fr auto 1fr;
    gap: 0.5rem;
  }
  .scoreboard__team {
    flex-direction: column;
    gap: 0.4rem;
    text-align: center;
  }
  .scoreboard__team--b {
    flex-direction: column;
    text-align: center;
  }
  .scoreboard__logo {
    width: 44px;
    height: 44px;
  }
  .scoreboard__team-name {
    font-size: 0.92rem;
  }
  .scoreboard__score {
    padding: 0.3rem 0.6rem;
  }
  .scoreboard__score-value {
    font-size: 1.9rem;
  }
  .scoreboard__facts {
    gap: 0.65rem 1.25rem;
  }
}
</style>
