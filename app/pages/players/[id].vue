<template>
  <div class="page player-page">
    <div class="container">
      <div v-reveal class="player-page__breadcrumbs-wrap">
        <Breadcrumbs
          :items="[
            { title: 'Игроки', to: '/players' },
            { title: player ? player.fullName : 'Игрок' }
          ]"
        />
      </div>

      <h1 v-reveal class="page__title">{{ player ? player.fullName : 'Игрок' }}</h1>

      <section class="page-surface">
        <div v-if="pending" class="stats-state"><p>Загружаем статистику...</p></div>

        <div v-else-if="!stats" class="stats-state">
          <p>Игрок не найден.</p>
          <NuxtLink to="/tournaments" class="btn stats-state__btn">Все турниры</NuxtLink>
        </div>

        <template v-else>
          <div v-reveal class="player-card">
            <button
              v-if="player?.photo"
              type="button"
              class="player-card__photo-wrap player-card__photo-wrap--zoom"
              :aria-label="`Открыть фото ${player.fullName} на весь экран`"
              @click="openPhoto({ src: player.photo, title: player.fullName })"
            >
              <img
                :src="player.photo"
                :alt="player.fullName"
                class="player-card__photo"
                loading="lazy"
                decoding="async"
              />
              <span class="player-card__zoom" aria-hidden="true">
                <Icon name="ph:magnifying-glass-plus" />
              </span>
            </button>
            <div v-else class="player-card__photo-wrap">
              <span class="player-card__initials" aria-hidden="true">{{ initials }}</span>
            </div>
            <div class="player-card__body">
              <p v-if="player?.position" class="player-card__pos">{{ player.position }}</p>
              <dl class="player-card__facts">
                <div class="player-card__fact">
                  <dt>{{ stats.byTeam.length > 1 ? 'Команды' : 'Команда' }}</dt>
                  <dd>
                    <template v-if="stats.byTeam.length">
                      <template v-for="(row, i) in stats.byTeam" :key="row.id">
                        <span v-if="i" class="player-card__sep">, </span>
                        <button
                          type="button"
                          class="team-open"
                          :aria-label="`Команда ${row.name}`"
                          @click="openTeam({ teamId: row.id, name: row.name })"
                        >{{ row.name }}</button>
                      </template>
                    </template>
                    <template v-else>не указана</template>
                  </dd>
                </div>
                <div class="player-card__fact">
                  <dt>{{ stats.byTournament.length > 1 ? 'Турниров' : 'Турнир' }}</dt>
                  <dd>
                    <template v-if="stats.byTournament.length > 1">{{ stats.byTournament.length }}</template>
                    <template v-else-if="stats.byTournament.length">{{ stats.byTournament[0].name }}</template>
                    <template v-else>нет данных</template>
                  </dd>
                </div>
                <div v-if="player?.birthDate" class="player-card__fact">
                  <dt>Дата рождения</dt>
                  <dd>{{ formatDay(player.birthDate) }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="player-page__block">
            <h2 v-reveal class="player-page__block-title">Всего за карьеру</h2>
            <StatTiles v-reveal :items="careerTiles" />
          </div>

          <div class="player-page__block">
            <h2 v-reveal class="player-page__block-title">По турнирам</h2>
            <div v-if="!stats.byTournament.length" class="stats-state"><p>Данных по турнирам пока нет.</p></div>
            <div v-else v-reveal class="totals">
              <div class="totals__scroll">
                <table class="totals__table">
                  <thead>
                    <tr>
                      <th scope="col" class="totals__th totals__th--name">Турнир</th>
                      <th scope="col" class="totals__th" title="Игры">И</th>
                      <template v-if="isGoalie">
                        <th scope="col" class="totals__th" title="Пропущено шайб">ПШ</th>
                        <th scope="col" class="totals__th" title="Отражённые броски">ОБ</th>
                        <th scope="col" class="totals__th" title="Процент отражённых бросков">%</th>
                      </template>
                      <th scope="col" class="totals__th" title="Голы">Г</th>
                      <th scope="col" class="totals__th" title="Передачи">П</th>
                      <th scope="col" class="totals__th totals__th--points" title="Очки">О</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in stats.byTournament" :key="row.id" class="totals__row">
                      <td class="totals__td totals__td--name">
                        <NuxtLink :to="`/tournaments/${row.id}`" class="totals__link">{{ row.name }}</NuxtLink>
                      </td>
                      <td class="totals__td">{{ row.totals.games }}</td>
                      <template v-if="isGoalie">
                        <td class="totals__td">{{ dash(row.totals.goalsAgainst) }}</td>
                        <td class="totals__td">{{ dash(row.totals.saves) }}</td>
                        <td class="totals__td">{{ savePct(row.totals) }}</td>
                      </template>
                      <td class="totals__td">{{ row.totals.goals }}</td>
                      <td class="totals__td">{{ row.totals.assists }}</td>
                      <td class="totals__td totals__td--points">{{ row.totals.points }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="player-page__block">
            <h2 v-reveal class="player-page__block-title">По командам</h2>
            <div v-if="!stats.byTeam.length" class="stats-state"><p>Данных по командам пока нет.</p></div>
            <div v-else v-reveal class="totals">
              <div class="totals__scroll">
                <table class="totals__table">
                  <thead>
                    <tr>
                      <th scope="col" class="totals__th totals__th--name">Команда</th>
                      <th scope="col" class="totals__th" title="Игры">И</th>
                      <template v-if="isGoalie">
                        <th scope="col" class="totals__th" title="Пропущено шайб">ПШ</th>
                        <th scope="col" class="totals__th" title="Отражённые броски">ОБ</th>
                        <th scope="col" class="totals__th" title="Процент отражённых бросков">%</th>
                      </template>
                      <th scope="col" class="totals__th" title="Голы">Г</th>
                      <th scope="col" class="totals__th" title="Передачи">П</th>
                      <th scope="col" class="totals__th totals__th--points" title="Очки">О</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in stats.byTeam" :key="row.id" class="totals__row">
                      <td class="totals__td totals__td--name">
                        <button
                          type="button"
                          class="team-open totals__link"
                          :aria-label="`Команда ${row.name}`"
                          @click="openTeam({ teamId: row.id, name: row.name })"
                        >{{ row.name }}</button>
                      </td>
                      <td class="totals__td">{{ row.totals.games }}</td>
                      <template v-if="isGoalie">
                        <td class="totals__td">{{ dash(row.totals.goalsAgainst) }}</td>
                        <td class="totals__td">{{ dash(row.totals.saves) }}</td>
                        <td class="totals__td">{{ savePct(row.totals) }}</td>
                      </template>
                      <td class="totals__td">{{ row.totals.goals }}</td>
                      <td class="totals__td">{{ row.totals.assists }}</td>
                      <td class="totals__td totals__td--points">{{ row.totals.points }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <p v-if="isGoalie" class="player-page__note">
            Вратарские показатели считаются по табло матча: если броски не записаны — стоит прочерк.
            «Время в воротах» — длительность матчей по регламенту турнира, а не фактическое время на льду.
          </p>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PlayerStats, PlayerTotals } from '~/types'
import { apiUrl } from '~/utils/api'
import { formatDay } from '~/utils/tournaments'

definePageMeta({
  key: route => route.path
})

const route = useRoute()
const id = computed(() => String(route.params.id))

const { openTeam } = useTeamModal()
const { openPhoto } = useLightbox()

const { data: stats, pending } = await useAsyncData<PlayerStats | null>(
  `player-${String(route.params.id)}`,
  async () => {
    try {
      return await $fetch<PlayerStats>(apiUrl(`/players/${id.value}/stats`))
    } catch {
      return null
    }
  },
  { default: () => null }
)

const player = computed(() => stats.value?.player ?? null)

const isGoalie = computed(() => {
  const career = stats.value?.career
  if (player.value?.position === 'вратарь') return true
  if (!career) return false
  return career.goalsAgainst != null || career.saves != null || career.minutesPlayed != null
})

const initials = computed(() => {
  const name = player.value?.fullName ?? ''
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
})

function dash(value: number | null | undefined): string {
  return value == null ? '—' : String(value)
}

function savePct(totals: PlayerTotals): string {
  const saves = totals.saves
  const against = totals.goalsAgainst
  if (saves == null || against == null) return '—'
  const shots = saves + against
  if (!shots) return '—'
  return `${Math.round((saves / shots) * 100)}%`
}

const careerTiles = computed(() => {
  const career = stats.value?.career
  if (!career) return []
  const tiles: { label: string; value: string | number; hint?: string }[] = [
    { label: 'Игры', value: career.games },
    { label: 'Голы', value: career.goals },
    { label: 'Передачи', value: career.assists },
    { label: 'Очки', value: career.points }
  ]
  if (isGoalie.value) {
    tiles.push(
      { label: 'Пропущено', value: dash(career.goalsAgainst) },
      { label: 'Отражено', value: dash(career.saves) },
      { label: '% отражённых', value: savePct(career) },
      { label: 'В воротах', value: career.minutesPlayed == null ? '—' : `${career.minutesPlayed} мин` }
    )
  }
  return tiles
})

useHead(() => ({
  title: player.value
    ? `${player.value.fullName} — статистика игрока — «Время Звёзд KIDS»`
    : 'Статистика игрока — «Время Звёзд KIDS»',
  meta: [
    {
      name: 'description',
      content: player.value
        ? `Статистика игрока ${player.value.fullName}: игры, голы, передачи и очки по турнирам и командам.`
        : 'Статистика игроков детских хоккейных турниров «Время Звёзд KIDS».'
    }
  ],
  link: [
    { rel: 'canonical', href: `https://timeofthestars-kids.ru/players/${id.value}` }
  ]
}))
</script>

<style scoped>
.page {
  padding: 2rem 0 3rem;
}
.page__title {
  font-size: 2rem;
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
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

.player-card {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  padding: 1.25rem 1.4rem;
  background:
    url('/hockey-watermark.svg') no-repeat right -14px bottom -10px / 150px auto,
    linear-gradient(160deg, rgba(37, 99, 235, 0.14) 0%, rgba(37, 99, 235, 0.04) 45%, rgba(15, 23, 42, 0.02) 100%),
    var(--color-surface);
  border: 1px solid rgba(37, 99, 235, 0.18);
  border-radius: calc(var(--radius) + 4px);
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 32px -16px rgba(37, 99, 235, 0.22);
}
.player-card__photo-wrap {
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.player-card__photo-wrap--zoom {
  cursor: zoom-in;
}
.player-card__zoom {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.55);
  color: #fff;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.18s;
}
.player-card__photo-wrap--zoom:hover .player-card__zoom,
.player-card__photo-wrap--zoom:focus-visible .player-card__zoom {
  opacity: 1;
}
.player-card__photo-wrap--zoom:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.player-card__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.player-card__initials {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-accent);
}
.player-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
.player-card__pos {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
}
.player-card__sep {
  color: var(--color-text-muted);
}
.player-card__facts {
  margin: 0.2rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}
.player-card__fact {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}
.player-card__fact dt {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}
.player-card__fact dd {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.player-page__block {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.player-page__block-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text);
}
.player-page__note {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.totals__scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 4px);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 32px -18px rgba(37, 99, 235, 0.22);
}
.totals__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}
.totals__th {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  padding: 0.7rem 0.4rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}
.totals__th--name {
  text-align: left;
  padding-left: 0.9rem;
  min-width: 170px;
}
.totals__td {
  text-align: center;
  padding: 0.65rem 0.4rem;
  border-bottom: 1px solid var(--color-border);
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}
.totals__row:last-child .totals__td {
  border-bottom: 0;
}
.totals__td--name {
  text-align: left;
  padding-left: 0.9rem;
  font-weight: 600;
}
.totals__link {
  color: inherit;
  text-decoration: none;
}
.totals__link:hover,
.totals__link:focus-visible {
  color: var(--color-accent);
  text-decoration: underline;
}
.totals__td--points {
  font-weight: 700;
  color: var(--color-accent);
}

@media (max-width: 600px) {
  .page__title {
    font-size: 1.65rem;
  }
  .player-card {
    padding: 1.1rem;
    gap: 0.9rem;
  }
  .player-card__photo-wrap {
    width: 64px;
    height: 64px;
  }
  .totals__table {
    font-size: 0.85rem;
  }
  .totals__th,
  .totals__td {
    padding: 0.55rem 0.25rem;
  }
  .totals__th--name,
  .totals__td--name {
    padding-left: 0.55rem;
    min-width: 130px;
  }
}
</style>
