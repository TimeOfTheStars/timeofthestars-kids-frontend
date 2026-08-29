<template>
  <div class="page t-page">
    <div class="container">
      <div v-reveal class="t-page__breadcrumbs-wrap">
        <Breadcrumbs
          :items="[
            { title: 'Турниры', to: '/tournaments' },
            { title: tournament ? tournament.title : 'Турнир' }
          ]"
        />
      </div>

      <h1 v-reveal class="page__title">{{ tournament ? tournament.title : 'Турнир' }}</h1>

      <ul v-if="tournament" v-reveal="{ delay: 70 }" class="t-page__meta">
        <li v-if="tournament.ageCategory" class="t-page__meta-item t-page__age">{{ tournament.ageCategory }}</li>
        <li class="t-page__meta-item">
          <Icon name="ph:calendar-blank" />
          <span>{{ formatDateRange(tournament.startDate, tournament.endDate) }}</span>
        </li>
        <li v-if="arenaLabel" class="t-page__meta-item">
          <Icon name="ph:map-pin" />
          <a v-if="tournament.arena?.url" :href="tournament.arena.url" target="_blank" rel="noopener noreferrer">{{ arenaLabel }}</a>
          <span v-else>{{ arenaLabel }}</span>
        </li>
        <li v-if="tournament.birthYear" class="t-page__meta-item">
          <Icon name="ph:users-three" />
          <span>{{ tournament.birthYear }} г. р.</span>
        </li>
        <li v-if="formatLabel" class="t-page__meta-item">
          <Icon name="ph:timer" />
          <span>{{ formatLabel }}</span>
        </li>
      </ul>

      <section class="page-surface">
        <HockeyLoader v-if="pending" text="Загружаем турнир" />

        <div v-else-if="!ready" class="stats-state">
          <p v-if="!tournament">Турнир не найден.</p>
          <p v-else>По этому турниру пока нет ни матчей, ни статистики.</p>
          <NuxtLink to="/tournaments" class="btn stats-state__btn">Все турниры</NuxtLink>
        </div>

        <template v-else>
          <SegmentedTabs
            v-model="tab"
            v-reveal
            class="t-page__tabs"
            aria-label="Разделы статистики турнира"
            :tabs="TABS"
          />

          <div v-if="tab === 'standings'" class="t-page__section">
            <HockeyLoader v-if="standings.pending.value" text="Загружаем таблицу" />
            <div v-else-if="!standings.data.value.length" class="stats-state"><p>Таблица пока пуста.</p></div>
            <TournamentStandings v-else v-reveal :rows="standings.data.value" :tournament-id="id" />
          </div>

          <div v-else-if="tab === 'games'" class="t-page__section">
            <HockeyLoader v-if="games.pending.value" text="Загружаем матчи" />
            <div v-else-if="!games.data.value.length" class="stats-state"><p>Матчи ещё не добавлены.</p></div>
            <div v-else class="t-page__games">
              <GameCard
                v-for="(game, i) in games.data.value"
                :key="game.id"
                v-reveal="{ delay: 50 * i }"
                :game="game"
                :tournament-id="id"
              />
            </div>
          </div>

          <div v-else-if="tab === 'players'" class="t-page__section">
            <HockeyLoader v-if="players.pending.value" text="Загружаем игроков" />
            <div v-else-if="!players.data.value.length" class="stats-state"><p>Заявка ещё не опубликована.</p></div>
            <template v-else>
              <label v-if="teamOptions.length > 1" class="t-page__filter">
                <span class="t-page__filter-label">Команда</span>
                <select v-model="selectedTeam" class="t-page__filter-select">
                  <option value="">Все команды</option>
                  <option v-for="team in teamOptions" :key="team.id" :value="team.id">{{ team.name }}</option>
                </select>
              </label>

              <StatLinesTable
                v-reveal
                title="Полевые игроки"
                :rows="fieldPlayers"
                :show-team="!selectedTeam"
                :tournament-id="id"
                empty-text="Полевых игроков в заявке нет."
              />
              <StatLinesTable
                v-reveal
                title="Вратари"
                variant="goalie"
                :rows="goaliePlayers"
                :show-team="!selectedTeam"
                :tournament-id="id"
                empty-text="Вратарей в заявке нет."
              />
            </template>
          </div>

          <div v-else-if="tab === 'best'" class="t-page__section">
            <HockeyLoader v-if="best.pending.value" text="Загружаем бомбардиров" />
            <StatLinesTable
              v-else
              v-reveal
              title="Лучшие бомбардиры"
              :rows="best.data.value"
              show-rank
              show-team
              :tournament-id="id"
              empty-text="Пока никто не набрал очков."
            />
          </div>

          <div v-else-if="tab === 'snipers'" class="t-page__section">
            <HockeyLoader v-if="players.pending.value" text="Загружаем снайперов" />
            <StatLinesTable
              v-else
              v-reveal
              title="Лучшие снайперы"
              :rows="snipers"
              show-rank
              show-team
              :tournament-id="id"
              empty-text="Пока никто не забивал."
            />
          </div>

          <div v-else class="t-page__section">
            <HockeyLoader v-if="players.pending.value" text="Загружаем ассистентов" />
            <StatLinesTable
              v-else
              v-reveal
              title="Лучшие ассистенты"
              :rows="assistants"
              show-rank
              show-team
              :tournament-id="id"
              empty-text="Пока никто не отдавал передач."
            />
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { GameListItem, StandingRow, StatLine, Tournament } from '~/types'
import { apiUrl } from '~/utils/api'
import { formatDateRange, formatGameFormat, hasTournamentPage, withSeason } from '~/utils/tournaments'

definePageMeta({
  key: route => route.path
})

const TABS = [
  { key: 'standings', label: 'Таблица' },
  { key: 'games', label: 'Матчи' },
  { key: 'players', label: 'Игроки' },
  { key: 'best', label: 'Бомбардиры' },
  { key: 'snipers', label: 'Снайперы' },
  { key: 'assistants', label: 'Ассистенты' }
]

/** Снайперы и ассистенты считаются из заявки турнира — отдельной ручки под них нет */
const LEADERS_LIMIT = 10

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))

const { data: tournaments, pending } = await useTournaments()

const tournament = computed<Tournament | null>(() => {
  const found = (tournaments.value ?? []).find(t => String(t.id) === id.value)
  return found ? withSeason(found) : null
})

/** Матчи заведены — страницу открываем, даже если счёт ещё не заполнен */
const ready = computed(() => (tournament.value ? hasTournamentPage(tournament.value) : false))

const arenaLabel = computed(() => tournament.value?.arena?.name || tournament.value?.location || '')
const formatLabel = computed(() => (tournament.value ? formatGameFormat(tournament.value) : ''))

const tab = ref(typeof route.query.tab === 'string' && TABS.some(t => t.key === route.query.tab)
  ? route.query.tab
  : 'standings')

/** Таб из ссылки рендерим на сервере, остальные — при первом открытии */
const initialTab = tab.value

/** Табы, которым нужна заявка турнира */
const PLAYERS_TABS = ['players', 'snipers', 'assistants']

watch(tab, value => {
  const query = { ...route.query }
  if (value === 'standings') delete query.tab
  else query.tab = value
  router.replace({ path: route.path, query })
})

const standings = useAsyncData<StandingRow[]>(
  `standings-${id.value}`,
  async () => {
    try {
      return await $fetch<StandingRow[]>(apiUrl(`/tournaments/${id.value}/standings`))
    } catch {
      return []
    }
  },
  { default: () => [], immediate: ready.value && initialTab === 'standings' }
)

const games = useAsyncData<GameListItem[]>(
  `games-${id.value}`,
  async () => {
    try {
      return await $fetch<GameListItem[]>(apiUrl(`/tournaments/${id.value}/games`))
    } catch {
      return []
    }
  },
  { default: () => [], immediate: ready.value && initialTab === 'games' }
)

const players = useAsyncData<StatLine[]>(
  `players-${id.value}`,
  async () => {
    try {
      return await $fetch<StatLine[]>(apiUrl(`/tournaments/${id.value}/players`))
    } catch {
      return []
    }
  },
  { default: () => [], immediate: ready.value && PLAYERS_TABS.includes(initialTab) }
)

const best = useAsyncData<StatLine[]>(
  `best-${id.value}`,
  async () => {
    try {
      return await $fetch<StatLine[]>(apiUrl(`/tournaments/${id.value}/best-players?limit=10`))
    } catch {
      return []
    }
  },
  { default: () => [], immediate: ready.value && initialTab === 'best' }
)

const LOADERS = { standings, games, players, best }

/** Какой загрузчик обслуживает таб: снайперы и ассистенты живут на данных «Игроков» */
const TAB_LOADER: Record<string, keyof typeof LOADERS> = {
  standings: 'standings',
  games: 'games',
  players: 'players',
  best: 'best',
  snipers: 'players',
  assistants: 'players'
}

/**
 * Что уже запрошено. Учёт по загрузчику, а не по табу: у «Игроков»,
 * «Снайперов» и «Ассистентов» источник один, и переключение между ними
 * не должно дёргать API заново.
 *
 * Считать «загружено ли» по status нельзя: во время SSR ленивые useAsyncData
 * попадают в payload со значением по умолчанию, и после гидрации их статус —
 * 'success', а не 'idle'. Поэтому ведём учёт сами.
 */
const loaded = new Set<string>(ready.value ? [TAB_LOADER[initialTab] ?? ''] : [])

watch([tab, ready], ([value, isReady]) => {
  if (!isReady) return
  const name = TAB_LOADER[value]
  if (!name || loaded.has(name)) return
  loaded.add(name)
  LOADERS[name].execute()
}, { immediate: true })

const selectedTeam = ref('')

const teamOptions = computed(() => {
  const map = new Map<string, string>()
  for (const row of players.data.value ?? []) {
    if (row.team?.id) map.set(row.team.id, row.team.name)
  }
  return [...map].map(([teamId, name]) => ({ id: teamId, name }))
})

const filteredPlayers = computed(() =>
  (players.data.value ?? []).filter(row => !selectedTeam.value || row.team?.id === selectedTeam.value)
)

const fieldPlayers = computed(() =>
  filteredPlayers.value
    .filter(row => !row.isGoalie)
    .slice()
    .sort((a, b) =>
      b.points - a.points ||
      b.goals - a.goals ||
      a.player.fullName.localeCompare(b.player.fullName, 'ru')
    )
)

const goaliePlayers = computed(() =>
  filteredPlayers.value
    .filter(row => row.isGoalie)
    .slice()
    .sort((a, b) => a.player.fullName.localeCompare(b.player.fullName, 'ru'))
)

/** Лучшие по голам: чистая результативность, без учёта передач */
const snipers = computed(() =>
  (players.data.value ?? [])
    .filter(row => row.goals > 0)
    .slice()
    .sort((a, b) =>
      b.goals - a.goals ||
      b.assists - a.assists ||
      a.player.fullName.localeCompare(b.player.fullName, 'ru')
    )
    .slice(0, LEADERS_LIMIT)
)

/** Лучшие по передачам */
const assistants = computed(() =>
  (players.data.value ?? [])
    .filter(row => row.assists > 0)
    .slice()
    .sort((a, b) =>
      b.assists - a.assists ||
      b.goals - a.goals ||
      a.player.fullName.localeCompare(b.player.fullName, 'ru')
    )
    .slice(0, LEADERS_LIMIT)
)

useHead(() => ({
  title: tournament.value
    ? `Статистика турнира «${tournament.value.title}» — «Время Звёзд KIDS»`
    : 'Статистика турнира — «Время Звёзд KIDS»',
  meta: [
    {
      name: 'description',
      content: tournament.value
        ? `Турнирная таблица, результаты матчей, составы и бомбардиры турнира «${tournament.value.title}» (${tournament.value.ageCategory}).`
        : 'Статистика детских хоккейных турниров «Время Звёзд KIDS».'
    }
  ],
  link: [
    { rel: 'canonical', href: `https://timeofthestars-kids.ru/tournaments/${id.value}` }
  ]
}))
</script>

<style scoped>
.page {
  padding: 2rem 0 3rem;
}
.page__title {
  font-size: 2rem;
  margin: 0 0 0.75rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.t-page__meta {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}
.t-page__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.95rem;
}
.t-page__meta-item a {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.5);
}
.t-page__meta-item a:hover {
  text-decoration-color: currentColor;
}
.t-page__age {
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-weight: 700;
  font-size: 0.85rem;
  text-shadow: none;
}

.page-surface {
  position: relative;
  padding: 2rem 0 2.5rem;
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

.t-page__tabs {
  margin-bottom: 1.75rem;
}
.t-page__section {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
.t-page__games {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
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

.t-page__filter {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 220px;
  max-width: 320px;
}
.t-page__filter-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.t-page__filter-select {
  appearance: none;
  -webkit-appearance: none;
  background: var(--color-surface) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='%2364748b'><path d='M2 4l4 4 4-4z'/></svg>") no-repeat right 0.85rem center / 12px 12px;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.6rem 2.25rem 0.6rem 0.85rem;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.95rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  width: 100%;
}
.t-page__filter-select:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

@media (max-width: 600px) {
  .page__title {
    font-size: 1.65rem;
  }
  .t-page__games {
    grid-template-columns: 1fr;
  }
  .t-page__filter {
    max-width: none;
    min-width: 0;
  }
}
</style>
