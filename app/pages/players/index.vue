<template>
  <div class="page players-page">
    <div class="container">
      <div v-reveal class="players-page__breadcrumbs-wrap">
        <Breadcrumbs :items="[{ title: 'Игроки' }]" />
      </div>

      <h1 v-reveal class="page__title">Игроки</h1>
      <p v-reveal="{ delay: 70 }" class="page__intro">
        Все игроки, сыгравшие в турнирах с протоколом. Показатели просуммированы по всем турнирам —
        нажмите на имя, чтобы открыть карточку игрока.
      </p>

      <section class="page-surface">
        <div v-if="pending" class="stats-state"><p>Загружаем игроков...</p></div>

        <div v-else-if="!players.length" class="stats-state">
          <p>Статистика игроков пока не опубликована.</p>
          <NuxtLink to="/tournaments" class="btn stats-state__btn">Все турниры</NuxtLink>
        </div>

        <template v-else>
          <div v-reveal class="players-page__filters">
            <label class="players-page__filter players-page__filter--search">
              <span class="players-page__filter-label">Поиск по фамилии или имени</span>
              <span class="players-page__search">
                <Icon name="ph:magnifying-glass" class="players-page__search-icon" />
                <input
                  v-model="query"
                  type="search"
                  class="players-page__input"
                  placeholder="Например, Рогов"
                  autocomplete="off"
                />
                <button
                  v-if="query"
                  type="button"
                  class="players-page__search-clear"
                  aria-label="Очистить поиск"
                  @click="query = ''"
                >×</button>
              </span>
            </label>

            <label v-if="teamOptions.length > 1" class="players-page__filter">
              <span class="players-page__filter-label">Команда</span>
              <select v-model="selectedTeam" class="players-page__select">
                <option value="">Все команды</option>
                <option v-for="team in teamOptions" :key="team" :value="team">{{ team }}</option>
              </select>
            </label>

            <button
              v-if="query || selectedTeam"
              type="button"
              class="players-page__reset"
              @click="query = ''; selectedTeam = ''"
            >
              Сбросить
            </button>
          </div>

          <p v-reveal class="players-page__count">
            Найдено: {{ filtered.length }} из {{ players.length }}
          </p>

          <div class="players-page__tables">
            <StatLinesTable
              v-reveal
              title="Полевые игроки"
              :rows="fieldPlayers"
              show-team
              empty-text="По этому запросу полевых игроков нет."
            />
            <StatLinesTable
              v-reveal
              title="Вратари"
              variant="goalie"
              :rows="goaliePlayers"
              show-team
              empty-text="По этому запросу вратарей нет."
            />
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

useHead({
  title: 'Игроки детских хоккейных турниров — «Время Звёзд KIDS»',
  meta: [
    {
      name: 'description',
      content:
        'Все игроки турниров «Время Звёзд KIDS»: голы, передачи и очки по всем турнирам, статистика вратарей. Поиск по фамилии и фильтр по команде.'
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://timeofthestars-kids.ru/players' }
  ]
})

const { data: players, pending } = await useAllPlayers()

const query = ref('')
const selectedTeam = ref('')

const teamOptions = computed(() => {
  const set = new Set<string>()
  for (const row of players.value ?? []) {
    for (const name of row.teamNames) set.add(name)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'ru'))
})

const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return (players.value ?? []).filter(row => {
    if (selectedTeam.value && !row.teamNames.includes(selectedTeam.value)) return false
    if (needle && !row.player.fullName.toLowerCase().includes(needle)) return false
    return true
  })
})

const fieldPlayers = computed(() =>
  filtered.value
    .filter(row => !row.isGoalie)
    .slice()
    .sort((a, b) =>
      b.points - a.points ||
      b.goals - a.goals ||
      a.player.fullName.localeCompare(b.player.fullName, 'ru')
    )
)

const goaliePlayers = computed(() =>
  filtered.value
    .filter(row => row.isGoalie)
    .slice()
    .sort((a, b) => a.player.fullName.localeCompare(b.player.fullName, 'ru'))
)
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

.players-page__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem 1rem;
  margin-bottom: 1rem;
}
.players-page__filter {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 200px;
}
.players-page__filter--search {
  flex: 1 1 280px;
  max-width: 420px;
}
.players-page__filter-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.players-page__search {
  position: relative;
  display: flex;
  align-items: center;
}
.players-page__search-icon {
  position: absolute;
  left: 0.75rem;
  width: 1.1em;
  height: 1.1em;
  color: var(--color-text-muted);
  pointer-events: none;
}
.players-page__input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.6rem 2.25rem 0.6rem 2.4rem;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.95rem;
  font-family: inherit;
  appearance: none;
  -webkit-appearance: none;
}
.players-page__input::-webkit-search-cancel-button {
  display: none;
}
.players-page__input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}
.players-page__search-clear {
  position: absolute;
  right: 0.4rem;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  border-radius: 9999px;
}
.players-page__search-clear:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}
.players-page__select {
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
.players-page__select:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}
.players-page__reset {
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.55rem 0.9rem;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}
.players-page__reset:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}
.players-page__count {
  margin: 0 0 1.5rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}
.players-page__tables {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

@media (max-width: 600px) {
  .page__title {
    font-size: 1.65rem;
  }
  .players-page__filter,
  .players-page__filter--search {
    flex: 1 1 100%;
    min-width: 0;
    max-width: none;
  }
}
</style>
