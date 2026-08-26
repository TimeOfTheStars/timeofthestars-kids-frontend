<template>
  <div class="page teams-page">
    <div class="container">
      <div v-reveal class="teams-page__breadcrumbs-wrap">
        <Breadcrumbs :items="[{ title: 'Команды' }]" />
      </div>

      <h1 v-reveal class="page__title">Команды</h1>
      <p v-reveal="{ delay: 70 }" class="page__intro">
        Все команды, которые участвуют в наших турнирах. Показатели — за всю историю выступлений.
        Нажмите на команду, чтобы увидеть состав, фотографию и результаты по турнирам.
      </p>

      <section class="page-surface">
        <HockeyLoader v-if="pending" text="Загружаем команды" />

        <div v-else-if="!teams.length" class="stats-state">
          <p>Справочник команд пока пуст.</p>
          <NuxtLink to="/tournaments" class="btn stats-state__btn">Все турниры</NuxtLink>
        </div>

        <template v-else>
          <div v-reveal class="teams-page__filters">
            <label class="teams-page__filter">
              <span class="teams-page__filter-label">Поиск по названию</span>
              <span class="teams-page__search">
                <Icon name="ph:magnifying-glass" class="teams-page__search-icon" />
                <input
                  v-model="query"
                  type="search"
                  class="teams-page__input"
                  placeholder="Например, Локомотив"
                  autocomplete="off"
                />
                <button
                  v-if="query"
                  type="button"
                  class="teams-page__search-clear"
                  aria-label="Очистить поиск"
                  @click="query = ''"
                >×</button>
              </span>
            </label>
          </div>

          <p v-reveal class="teams-page__count">Найдено: {{ filtered.length }} из {{ teams.length }}</p>

          <div v-if="!filtered.length" class="stats-state">
            <p>По этому запросу команд нет.</p>
          </div>

          <div v-else v-reveal class="teams-table__scroll">
            <table class="teams-table">
              <caption class="sr-only">Команды и их статистика за всю историю</caption>
              <thead>
                <tr>
                  <th scope="col" class="teams-table__th teams-table__th--name">Команда</th>
                  <th scope="col" class="teams-table__th teams-table__th--tours" title="Турниров">Турн.</th>
                  <th scope="col" class="teams-table__th" title="Игры">И</th>
                  <th scope="col" class="teams-table__th" title="Победы">В</th>
                  <th scope="col" class="teams-table__th" title="Ничьи">Н</th>
                  <th scope="col" class="teams-table__th" title="Поражения">П</th>
                  <th scope="col" class="teams-table__th teams-table__th--goals" title="Забито : пропущено">Шайбы</th>
                  <th scope="col" class="teams-table__th teams-table__th--points" title="Очки">О</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="team in filtered"
                  :key="team.id"
                  class="teams-table__row"
                  :class="{ 'teams-table__row--idle': !team.stats.games }"
                >
                  <td class="teams-table__td teams-table__td--name">
                    <button
                      type="button"
                      class="teams-table__team"
                      :aria-label="`Команда ${team.name}`"
                      @click="openTeam({ teamId: team.id, name: team.name, logo: team.logo })"
                    >
                      <img
                        v-if="team.logo"
                        :src="team.logo"
                        alt=""
                        class="teams-table__logo"
                        loading="lazy"
                        decoding="async"
                      />
                      <span class="teams-table__names">
                        <span class="teams-table__name">{{ team.name }}</span>
                        <span v-if="team.city" class="teams-table__hint">{{ team.city }}</span>
                      </span>
                    </button>
                  </td>
                  <td class="teams-table__td teams-table__td--tours">{{ team.stats.tournaments }}</td>
                  <td class="teams-table__td">{{ team.stats.games }}</td>
                  <td class="teams-table__td">{{ team.stats.wins }}</td>
                  <td class="teams-table__td">{{ team.stats.draws }}</td>
                  <td class="teams-table__td">{{ team.stats.losses }}</td>
                  <td class="teams-table__td teams-table__td--goals">{{ team.stats.goalsFor }}:{{ team.stats.goalsAgainst }}</td>
                  <td class="teams-table__td teams-table__td--points">{{ team.stats.points }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p v-reveal class="teams-page__legend">
            И — игры, В — победы, Н — ничьи, П — поражения, О — очки. В показатели может входить
            история выступлений до появления электронных протоколов.
          </p>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

useHead({
  title: 'Команды детских хоккейных турниров — «Время Звёзд KIDS»',
  meta: [
    {
      name: 'description',
      content:
        'Команды турниров «Время Звёзд KIDS»: сыгранные турниры и матчи, победы и поражения, забитые и пропущенные шайбы. Состав и фотография каждой команды.'
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://timeofthestars-kids.ru/teams' }
  ]
})

const { data: teamsData, pending } = await useTeams()
const { openTeam } = useTeamModal()

/** Сначала играющие команды, потом остальные с нулями */
const teams = computed(() =>
  (teamsData.value ?? [])
    .slice()
    .sort((a, b) =>
      b.stats.games - a.stats.games ||
      b.stats.wins - a.stats.wins ||
      a.name.localeCompare(b.name, 'ru')
    )
)

const query = ref('')

const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (!needle) return teams.value
  return teams.value.filter(team =>
    team.name.toLowerCase().includes(needle) ||
    (team.city ?? '').toLowerCase().includes(needle)
  )
})
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

.teams-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin-bottom: 1rem;
}
.teams-page__filter {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1 1 280px;
  max-width: 420px;
}
.teams-page__filter-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.teams-page__search {
  position: relative;
  display: flex;
  align-items: center;
}
.teams-page__search-icon {
  position: absolute;
  left: 0.75rem;
  width: 1.1em;
  height: 1.1em;
  color: var(--color-text-muted);
  pointer-events: none;
}
.teams-page__input {
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
.teams-page__input::-webkit-search-cancel-button {
  display: none;
}
.teams-page__input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}
.teams-page__search-clear {
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
.teams-page__search-clear:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}
.teams-page__count {
  margin: 0 0 1rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}
.teams-page__legend {
  margin: 0.75rem 0 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.teams-table__scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 4px);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 32px -18px rgba(37, 99, 235, 0.22);
}
.teams-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}
.teams-table__th {
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
.teams-table__th--name {
  text-align: left;
  padding-left: 0.9rem;
  min-width: 175px;
}
.teams-table__th--goals {
  min-width: 60px;
}
.teams-table__td {
  text-align: center;
  padding: 0.6rem 0.4rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}
.teams-table__row:last-child .teams-table__td {
  border-bottom: 0;
}
.teams-table__row--idle .teams-table__td {
  color: var(--color-text-muted);
}
.teams-table__td--name {
  text-align: left;
  padding-left: 0.9rem;
}
.teams-table__team {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.teams-table__team:hover .teams-table__name,
.teams-table__team:focus-visible .teams-table__name {
  color: var(--color-accent);
  text-decoration: underline;
}
.teams-table__team:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
.teams-table__logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}
.teams-table__names {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  min-width: 0;
}
.teams-table__name {
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}
.teams-table__hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
.teams-table__td--goals {
  white-space: nowrap;
  color: var(--color-text-muted);
}
.teams-table__td--points {
  font-weight: 700;
  color: var(--color-accent);
}

@media (max-width: 600px) {
  .page__title {
    font-size: 1.65rem;
  }
  .teams-page__filter {
    flex: 1 1 100%;
    max-width: none;
  }
  .teams-table {
    font-size: 0.85rem;
  }
  .teams-table__th,
  .teams-table__td {
    padding: 0.55rem 0.2rem;
  }
  .teams-table__th--name,
  .teams-table__td--name {
    padding-left: 0.5rem;
    min-width: 130px;
  }
  .teams-table__th--tours,
  .teams-table__td--tours {
    display: none;
  }
  .teams-table__logo {
    width: 24px;
    height: 24px;
  }
  .teams-table__name {
    font-size: 0.85rem;
  }
}
</style>
