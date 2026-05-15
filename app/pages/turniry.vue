<template>
  <div class="page turniry-page">
    <div class="container">
      <div v-reveal class="turniry-page__breadcrumbs-wrap">
        <Breadcrumbs :items="[{ title: 'Главная', to: '/' }, { title: 'Турниры' }]" />
      </div>

      <h1 v-reveal class="page__title">Турниры</h1>
      <p v-reveal="{ delay: 70 }" class="page__intro">
        Соревновательная практика — ключевая часть подготовки. Здесь собраны турниры,
        в которых участвуют наши команды: предстоящие и уже сыгранные.
      </p>

      <section class="turniry__section">
        <div v-if="seasons.length > 1" v-reveal class="turniry__seasons" role="tablist" aria-label="Сезоны">
          <button
            v-for="s in seasons"
            :key="s"
            type="button"
            class="turniry__season"
            :class="{ 'turniry__season--active': s === activeSeason }"
            role="tab"
            :aria-selected="s === activeSeason"
            @click="activeSeason = s"
          >
            Сезон {{ s }}
          </button>
        </div>

        <div v-if="!loading && (ageOptions.length || titleOptions.length)" v-reveal class="turniry__filters">
          <label v-if="titleOptions.length" class="turniry__filter">
            <span class="turniry__filter-label">Название</span>
            <select v-model="selectedTitle" class="turniry__filter-select">
              <option value="">Все</option>
              <option v-for="title in titleOptions" :key="title" :value="title">{{ title }}</option>
            </select>
          </label>
          <label v-if="ageOptions.length" class="turniry__filter">
            <span class="turniry__filter-label">Категория</span>
            <select v-model="selectedAge" class="turniry__filter-select">
              <option value="">Все</option>
              <option v-for="age in ageOptions" :key="age" :value="age">{{ age }}</option>
            </select>
          </label>
          <button
            v-if="selectedAge || selectedTitle"
            type="button"
            class="turniry__filter-reset"
            @click="selectedAge = ''; selectedTitle = ''"
          >
            Сбросить
          </button>
        </div>

        <div v-if="loading" class="turniry__state">
          <p>Загружаем турниры...</p>
        </div>

        <template v-else>
          <div
            v-if="upcomingForSeason.length === 0 && completedForSeason.length === 0"
            class="turniry__state"
          >
            <p>В этом сезоне турниров пока нет.</p>
          </div>

          <div v-if="upcomingForSeason.length" class="turniry__group">
            <h2 v-reveal class="turniry__group-title">
              Предстоящие
              <span class="turniry__group-count">{{ upcomingForSeason.length }}</span>
            </h2>
            <div class="turniry__grid">
              <article
                v-for="(t, i) in upcomingForSeason"
                :key="t.id"
                v-reveal="{ delay: 60 * i }"
                class="t-card"
              >
                <div class="t-card__head">
                  <span class="t-card__age">{{ t.ageCategory }}</span>
                  <span
                    v-if="isInProgress(t)"
                    class="t-card__status t-card__status--in-progress"
                  >В процессе</span>
                  <span
                    v-else
                    class="t-card__status t-card__status--upcoming"
                  >Предстоящий</span>
                </div>
                <h3 class="t-card__title">{{ t.title }}</h3>
                <ul class="t-card__meta">
                  <li class="t-card__meta-row">
                    <Icon name="ph:calendar-blank" class="t-card__meta-icon" />
                    <span>{{ formatDateRange(t.startDate, t.endDate) }}</span>
                  </li>
                  <li class="t-card__meta-row">
                    <Icon name="ph:map-pin" class="t-card__meta-icon" />
                    <span>{{ t.location }}</span>
                  </li>
                  <li v-if="t.birthYear" class="t-card__meta-row">
                    <Icon name="ph:users-three" class="t-card__meta-icon" />
                    <span>{{ t.birthYear }} г. р.</span>
                  </li>
                </ul>
                <p v-if="t.description" class="t-card__desc">{{ t.description }}</p>
                <div v-if="t.teams && t.teams.length" class="t-card__teams">
                  <span class="t-card__teams-label">Команды:</span>
                  <ul class="t-card__teams-list">
                    <li
                      v-for="team in t.teams"
                      :key="team.name"
                      class="t-card__team"
                    >
                      <img
                        v-if="team.logo"
                        :src="team.logo"
                        :alt="team.name"
                        class="t-card__team-logo"
                        loading="lazy"
                        decoding="async"
                      />
                      <span class="t-card__team-name">{{ team.name }}</span>
                    </li>
                  </ul>
                </div>
                <div v-if="t.url || t.recordingsUrl" class="t-card__links">
                  <a
                    v-if="t.url"
                    :href="t.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="t-card__link"
                  >
                    Подробнее
                    <Icon name="ph:arrow-up-right" />
                  </a>
                  <a
                    v-if="t.recordingsUrl"
                    :href="t.recordingsUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="t-card__link t-card__link--recordings"
                  >
                    Записи матчей
                    <Icon name="ph:play-circle" />
                  </a>
                </div>
              </article>
            </div>
          </div>

          <div v-if="completedForSeason.length" class="turniry__group">
            <h2 v-reveal class="turniry__group-title">
              Завершённые
              <span class="turniry__group-count">{{ completedForSeason.length }}</span>
            </h2>
            <div class="turniry__grid">
              <article
                v-for="(t, i) in completedForSeason"
                :key="t.id"
                v-reveal="{ delay: 60 * i }"
                class="t-card t-card--past"
              >
                <div class="t-card__head">
                  <span class="t-card__age">{{ t.ageCategory }}</span>
                  <span class="t-card__status t-card__status--done">Завершён</span>
                </div>
                <h3 class="t-card__title">{{ t.title }}</h3>
                <ul class="t-card__meta">
                  <li class="t-card__meta-row">
                    <Icon name="ph:calendar-blank" class="t-card__meta-icon" />
                    <span>{{ formatDateRange(t.startDate, t.endDate) }}</span>
                  </li>
                  <li class="t-card__meta-row">
                    <Icon name="ph:map-pin" class="t-card__meta-icon" />
                    <span>{{ t.location }}</span>
                  </li>
                  <li v-if="t.birthYear" class="t-card__meta-row">
                    <Icon name="ph:users-three" class="t-card__meta-icon" />
                    <span>{{ t.birthYear }} г. р.</span>
                  </li>
                </ul>
                <p v-if="t.description" class="t-card__desc">{{ t.description }}</p>
                <div v-if="t.teams && t.teams.length" class="t-card__teams">
                  <span class="t-card__teams-label">Команды:</span>
                  <ul class="t-card__teams-list">
                    <li
                      v-for="team in t.teams"
                      :key="team.name"
                      class="t-card__team"
                    >
                      <img
                        v-if="team.logo"
                        :src="team.logo"
                        :alt="team.name"
                        class="t-card__team-logo"
                        loading="lazy"
                        decoding="async"
                      />
                      <span class="t-card__team-name">{{ team.name }}</span>
                    </li>
                  </ul>
                </div>
                <div v-if="t.url || t.recordingsUrl" class="t-card__links">
                  <a
                    v-if="t.url"
                    :href="t.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="t-card__link"
                  >
                    Подробнее
                    <Icon name="ph:arrow-up-right" />
                  </a>
                  <a
                    v-if="t.recordingsUrl"
                    :href="t.recordingsUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="t-card__link t-card__link--recordings"
                  >
                    Записи матчей
                    <Icon name="ph:play-circle" />
                  </a>
                </div>
              </article>
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Tournament } from '~/types'

const DEMO_TOURNAMENTS: Tournament[] = [
  {
    id: 'demo-1',
    title: 'Кубок «Время Звёзд»',
    ageCategory: 'U12',
    birthYear: 2014,
    startDate: '2026-05-22',
    endDate: '2026-05-25',
    location: 'Арена «Локомотив», Ярославль',
    city: 'Ярославль',
    season: '2025/2026',
    description: 'Открытый турнир для команд 2014 г. р. Четыре игровых дня, групповой этап и плей-офф.',
    teams: [
      { name: 'Время Звёзд Kids' },
      { name: 'Локомотив-2014' },
      { name: 'ЦСКА-2014' },
      { name: 'Динамо-2014' }
    ],
  },
  {
    id: 'demo-2',
    title: 'Весенний турнир Ярославля',
    ageCategory: 'U10',
    birthYear: 2016,
    startDate: '2026-04-18',
    endDate: '2026-04-21',
    location: 'Арена-2000, Ярославль',
    city: 'Ярославль',
    season: '2025/2026',
    description: 'Команда Время Звёзд Kids заняла 2-е место среди шести участников.',
    teams: [
      { name: 'Время Звёзд Kids' },
      { name: 'Локомотив-2016' },
      { name: 'СКА-2016' },
      { name: 'Полёт-2016' }
    ]
  },
  {
    id: 'demo-3',
    title: 'Новогодний турнир «Прорыв»',
    ageCategory: 'U8',
    birthYear: 2018,
    startDate: '2026-01-04',
    endDate: '2026-01-07',
    location: 'Арктика, Москва',
    city: 'Москва',
    season: '2025/2026',
    description: 'Дебютное участие младшей команды в выездном турнире.',
    teams: [
      { name: 'Время Звёзд Kids' },
      { name: 'Прорыв-2018' },
      { name: 'Витязь-2018' }
    ]
  }
]

const today = new Date()
today.setHours(0, 0, 0, 0)

function inferSeason(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  return m >= 8 ? `${y}/${y + 1}` : `${y - 1}/${y}`
}

function withSeason(t: Tournament): Tournament {
  return { ...t, season: t.season || inferSeason(t.startDate) }
}

const { data: apiData, pending } = await useAsyncData<Tournament[]>(
  'tournaments',
  async () => {
    try {
      const res = await $fetch<Tournament[] | { tournaments?: Tournament[] }>(
        'https://api.timeofthestars-kids.ru/tournaments'
      )
      return Array.isArray(res) ? res : (res?.tournaments ?? [])
    } catch {
      return []
    }
  },
  { default: () => [] }
)

const loading = computed(() => pending.value)

const tournaments = computed<Tournament[]>(() => {
  const list = apiData.value ?? []
  return (list.length ? list : DEMO_TOURNAMENTS).map(withSeason)
})

const seasons = computed(() => {
  const set = new Set<string>()
  for (const t of tournaments.value) set.add(t.season)
  return [...set].sort((a, b) => b.localeCompare(a))
})

const initialSeason = computed(() => {
  const list = seasons.value
  if (!list.length) return ''
  const withUpcoming = list.find(s =>
    tournaments.value.some(t => t.season === s && new Date(t.endDate) >= today)
  )
  return withUpcoming || list[0]!
})

const activeSeason = ref<string>(initialSeason.value)

const selectedAge = ref<string>('')
const selectedTitle = ref<string>('')

const ageOptions = computed(() => {
  const set = new Set<string>()
  for (const t of tournaments.value) {
    if (t.ageCategory) set.add(t.ageCategory)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }))
})

const titleOptions = computed(() => {
  const set = new Set<string>()
  for (const t of tournaments.value) {
    if (t.title) set.add(t.title)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'ru'))
})

function matchesFilters(t: Tournament): boolean {
  if (selectedAge.value && t.ageCategory !== selectedAge.value) return false
  if (selectedTitle.value && t.title !== selectedTitle.value) return false
  return true
}

const upcomingForSeason = computed(() =>
  tournaments.value
    .filter(t => t.season === activeSeason.value && matchesFilters(t) && new Date(t.endDate) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
)

const completedForSeason = computed(() =>
  tournaments.value
    .filter(t => t.season === activeSeason.value && matchesFilters(t) && new Date(t.endDate) < today)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
)

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
]

function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const sameDay = startIso === endIso
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  const sameYear = start.getFullYear() === end.getFullYear()
  const year = end.getFullYear()

  if (sameDay) {
    return `${start.getDate()} ${MONTHS[start.getMonth()]} ${year}`
  }
  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]} ${year}`
  }
  if (sameYear) {
    return `${start.getDate()} ${MONTHS[start.getMonth()]} — ${end.getDate()} ${MONTHS[end.getMonth()]} ${year}`
  }
  return `${start.getDate()} ${MONTHS[start.getMonth()]} ${start.getFullYear()} — ${end.getDate()} ${MONTHS[end.getMonth()]} ${year}`
}

function isInProgress(t: Tournament): boolean {
  return new Date(t.startDate) <= today && today <= new Date(t.endDate)
}

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
.page__intro {
  margin: 0 0 1.5rem;
  max-width: 720px;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
  line-height: 1.5;
}

.turniry__section {
  position: relative;
  padding: 2rem 0 2.5rem;
}
.turniry__section::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  background: var(--color-bg);
  z-index: 0;
}
.turniry__seasons,
.turniry__filters,
.turniry__group,
.turniry__state {
  position: relative;
  z-index: 1;
}

.turniry__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem 1rem;
  margin-bottom: 1.75rem;
}
.turniry__filter {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 200px;
}
.turniry__filter-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.turniry__filter-select {
  appearance: none;
  -webkit-appearance: none;
  background: var(--color-surface) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='%2364748b'><path d='M2 4l4 4 4-4z'/></svg>") no-repeat right 0.85rem center / 12px 12px;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.6rem 2.25rem 0.6rem 0.85rem;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  min-width: 200px;
  max-width: 100%;
}
.turniry__filter-select:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}
.turniry__filter-reset {
  align-self: flex-end;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.55rem 0.9rem;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
.turniry__filter-reset:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}
@media (max-width: 600px) {
  .turniry__filter {
    flex: 1 1 100%;
    min-width: 0;
  }
  .turniry__filter-select {
    min-width: 0;
    width: 100%;
  }
}

.turniry__seasons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  width: fit-content;
  max-width: 100%;
}
.turniry__season {
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.55rem 1rem;
  border-radius: calc(var(--radius) - 2px);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.turniry__season:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
}
.turniry__season--active {
  background: var(--color-accent);
  color: #fff;
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.25);
}
.turniry__season--active:hover {
  background: var(--color-accent);
  color: #fff;
}

.turniry__state {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 2rem 1.25rem;
  text-align: center;
  color: var(--color-text-muted);
}

.turniry__group {
  margin-bottom: 2.5rem;
}
.turniry__group:last-child {
  margin-bottom: 0;
}
.turniry__group-title {
  font-size: 1.4rem;
  margin: 0 0 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-text);
}
.turniry__group-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 0.55rem;
  border-radius: 9999px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.turniry__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

.t-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}
.t-card:hover {
  border-color: rgba(37, 99, 235, 0.35);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.1), 0 8px 24px rgba(37, 99, 235, 0.1);
  transform: translateY(-2px);
}
.t-card--past {
  opacity: 0.94;
}

.t-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.t-card__age {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  background: rgba(37, 99, 235, 0.1);
  color: var(--color-accent);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.t-card__status {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
}
.t-card__status--upcoming {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}
.t-card__status--in-progress {
  background: rgba(59, 130, 246, 0.14);
  color: #1d4ed8;
}
.t-card__status--done {
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
}

.t-card__title {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.3;
  color: var(--color-text);
}

.t-card__meta {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.t-card__meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}
.t-card__meta-icon {
  width: 18px;
  height: 18px;
  color: var(--color-accent);
  flex-shrink: 0;
}

.t-card__desc {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.t-card__teams {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--color-border);
}
.t-card__teams-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}
.t-card__teams-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.t-card__team {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.65rem;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  font-size: 0.85rem;
  color: var(--color-text);
}
.t-card__team-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  border-radius: 50%;
  background: #fff;
}

.t-card__links {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: center;
}
.t-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
}
.t-card__link:hover {
  text-decoration: underline;
}
.t-card__link--recordings {
  color: #b91c1c;
}

@media (max-width: 600px) {
  .turniry__grid {
    grid-template-columns: 1fr;
  }
  .page__title {
    font-size: 1.65rem;
  }
}
</style>
