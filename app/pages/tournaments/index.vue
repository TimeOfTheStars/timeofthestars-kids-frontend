<template>
  <div class="page turniry-page">
    <div class="container">
      <div v-reveal class="turniry-page__breadcrumbs-wrap">
        <Breadcrumbs :items="[{ title: 'Турниры' }]" />
      </div>

      <h1 v-reveal class="page__title">Турниры</h1>
      <p v-reveal="{ delay: 70 }" class="page__intro">
        Соревновательная практика — ключевая часть подготовки. Здесь собраны турниры,
        в которых участвуют наши команды: предстоящие и уже сыгранные.
      </p>

      <div v-reveal="{ delay: 120 }" class="turniry__cta">
        <button type="button" class="btn turniry__cta-btn" @click="openApply('player')">
          <Icon name="ph:user-plus" />
          <span>Участвовать как игрок</span>
        </button>
        <button type="button" class="btn btn--red turniry__cta-btn" @click="openApply('team')">
          <Icon name="ph:users-three" />
          <span>Участвовать как команда</span>
        </button>
      </div>

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
          <label class="turniry__filter">
            <span class="turniry__filter-label">Дата</span>
            <input
              v-model="selectedDate"
              type="date"
              class="turniry__filter-select turniry__filter-date"
            />
          </label>
          <button
            v-if="selectedAge || selectedTitle || selectedDate"
            type="button"
            class="turniry__filter-reset"
            @click="selectedAge = ''; selectedTitle = ''; selectedDate = ''"
          >
            Сбросить
          </button>
          <div
            class="status-info"
            @mouseenter="statusInfoOpen = true"
            @mouseleave="statusInfoOpen = false"
          >
            <button
              type="button"
              class="status-info__btn"
              :aria-expanded="statusInfoOpen"
              aria-label="Что означают статусы"
              @click="statusInfoOpen = !statusInfoOpen"
            >
              <Icon name="ph:info" />
            </button>
            <div
              v-if="statusInfoOpen"
              class="status-info__popover"
              role="tooltip"
            >
              <p class="status-info__title">Статусы турниров</p>
              <ul class="status-info__list">
                <li>
                  <span class="t-card__status t-card__status--upcoming">Предстоящий</span>
                  — ещё не начался
                </li>
                <li>
                  <span class="t-card__status t-card__status--in-progress">В процессе</span>
                  — идёт прямо сейчас
                </li>
                <li>
                  <span class="t-card__status t-card__status--done">Завершён</span>
                  — уже сыгран
                </li>
              </ul>
            </div>
          </div>
        </div>

        <HockeyLoader v-if="loading" text="Загружаем турниры" :immediate="failed" />

        <div v-else-if="loadFailed" class="turniry__state">
          <p>Не удалось загрузить турниры.</p>
          <button type="button" class="btn turniry__retry" :disabled="pending" @click="refresh()">
            Попробовать снова
          </button>
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
                :class="['t-card', isInProgress(t) ? 't-card--in-progress' : 't-card--upcoming']"
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
                <h3 class="t-card__title">
                  <NuxtLink
                    v-if="hasTournamentPage(t)"
                    :to="`/tournaments/${t.id}`"
                    class="t-card__title-link"
                  >{{ t.title }}</NuxtLink>
                  <template v-else>{{ t.title }}</template>
                </h3>
                <ul class="t-card__meta">
                  <li class="t-card__meta-row">
                    <button
                      type="button"
                      class="t-card__meta-link t-card__meta-link--btn"
                      aria-label="Добавить в календарь"
                      @click="openCalendar(t)"
                    >
                      <Icon name="ph:calendar-blank" class="t-card__meta-icon" />
                      <span>{{ formatDateRange(t.startDate, t.endDate) }}</span>
                    </button>
                  </li>
                  <li v-if="t.startTime" class="t-card__meta-row">
                    <Icon name="ph:clock" class="t-card__meta-icon" />
                    <span>Начало в {{ t.startTime }}</span>
                  </li>
                  <li v-if="t.arena || t.location" class="t-card__meta-row">
                    <button
                      type="button"
                      class="t-card__meta-link t-card__meta-link--btn"
                      :aria-label="`Открыть карту: ${arenaLabel(t)}`"
                      @click="openArena(t)"
                    >
                      <Icon name="ph:map-pin" class="t-card__meta-icon" />
                      <span>{{ arenaLabel(t) }}</span>
                    </button>
                  </li>
                  <li v-if="t.birthYear" class="t-card__meta-row">
                    <Icon name="ph:users-three" class="t-card__meta-icon" />
                    <span>{{ t.birthYear }} г. р.</span>
                  </li>
                  <li v-if="gameFormatLabel(t)" class="t-card__meta-row">
                    <Icon name="ph:timer" class="t-card__meta-icon" />
                    <span>{{ gameFormatLabel(t) }}</span>
                  </li>
                </ul>
                <p v-if="t.description" class="t-card__desc">{{ t.description }}</p>
                <div v-if="t.teams && t.teams.length" class="t-card__teams">
                  <span class="t-card__teams-label">Команды:</span>
                  <ul class="t-card__teams-list">
                    <li v-for="(team, idx) in t.teams" :key="team.name">
                      <button
                        type="button"
                        class="t-card__team"
                        :aria-label="`Команда ${team.name}`"
                        @click="openTeam({ name: team.name, logo: team.logo, tournamentId: String(t.id) })"
                      >
                        <span
                          v-if="medalForTeam(t, idx)"
                          class="t-card__team-medal"
                          aria-hidden="true"
                        >{{ medalForTeam(t, idx) }}</span>
                        <img
                          v-if="team.logo"
                          :src="team.logo"
                          :alt="''"
                          class="t-card__team-logo"
                          loading="lazy"
                          decoding="async"
                        />
                        <span class="t-card__team-name">{{ team.name }}</span>
                      </button>
                    </li>
                  </ul>
                </div>
                <div v-if="hasTournamentPage(t) || t.url || t.recordingsUrl" class="t-card__links">
                  <NuxtLink
                    v-if="hasTournamentPage(t)"
                    :to="`/tournaments/${t.id}`"
                    class="t-card__link t-card__link--stats"
                  >
                    Статистика
                    <Icon name="ph:chart-bar" />
                  </NuxtLink>
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
                <h3 class="t-card__title">
                  <NuxtLink
                    v-if="hasTournamentPage(t)"
                    :to="`/tournaments/${t.id}`"
                    class="t-card__title-link"
                  >{{ t.title }}</NuxtLink>
                  <template v-else>{{ t.title }}</template>
                </h3>
                <ul class="t-card__meta">
                  <li class="t-card__meta-row">
                    <button
                      type="button"
                      class="t-card__meta-link t-card__meta-link--btn"
                      aria-label="Добавить в календарь"
                      @click="openCalendar(t)"
                    >
                      <Icon name="ph:calendar-blank" class="t-card__meta-icon" />
                      <span>{{ formatDateRange(t.startDate, t.endDate) }}</span>
                    </button>
                  </li>
                  <li v-if="t.startTime" class="t-card__meta-row">
                    <Icon name="ph:clock" class="t-card__meta-icon" />
                    <span>Начало в {{ t.startTime }}</span>
                  </li>
                  <li v-if="t.arena || t.location" class="t-card__meta-row">
                    <button
                      type="button"
                      class="t-card__meta-link t-card__meta-link--btn"
                      :aria-label="`Открыть карту: ${arenaLabel(t)}`"
                      @click="openArena(t)"
                    >
                      <Icon name="ph:map-pin" class="t-card__meta-icon" />
                      <span>{{ arenaLabel(t) }}</span>
                    </button>
                  </li>
                  <li v-if="t.birthYear" class="t-card__meta-row">
                    <Icon name="ph:users-three" class="t-card__meta-icon" />
                    <span>{{ t.birthYear }} г. р.</span>
                  </li>
                  <li v-if="gameFormatLabel(t)" class="t-card__meta-row">
                    <Icon name="ph:timer" class="t-card__meta-icon" />
                    <span>{{ gameFormatLabel(t) }}</span>
                  </li>
                </ul>
                <p v-if="t.description" class="t-card__desc">{{ t.description }}</p>
                <div v-if="t.teams && t.teams.length" class="t-card__teams">
                  <span class="t-card__teams-label">Команды:</span>
                  <ul class="t-card__teams-list">
                    <li v-for="(team, idx) in t.teams" :key="team.name">
                      <button
                        type="button"
                        class="t-card__team"
                        :aria-label="`Команда ${team.name}`"
                        @click="openTeam({ name: team.name, logo: team.logo, tournamentId: String(t.id) })"
                      >
                        <span
                          v-if="medalForTeam(t, idx)"
                          class="t-card__team-medal"
                          aria-hidden="true"
                        >{{ medalForTeam(t, idx) }}</span>
                        <img
                          v-if="team.logo"
                          :src="team.logo"
                          :alt="''"
                          class="t-card__team-logo"
                          loading="lazy"
                          decoding="async"
                        />
                        <span class="t-card__team-name">{{ team.name }}</span>
                      </button>
                    </li>
                  </ul>
                </div>
                <div v-if="hasTournamentPage(t) || t.url || t.recordingsUrl" class="t-card__links">
                  <NuxtLink
                    v-if="hasTournamentPage(t)"
                    :to="`/tournaments/${t.id}`"
                    class="t-card__link t-card__link--stats"
                  >
                    Статистика
                    <Icon name="ph:chart-bar" />
                  </NuxtLink>
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

    <Transition name="modal">
    <div
      v-if="applyMode"
      class="apply-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="applyMode === 'player' ? 'Участвовать как игрок' : 'Участвовать как команда'"
      @click.self="closeApply"
      @keydown.esc="closeApply"
    >
      <div class="apply-modal__inner">
        <div class="apply-modal__top">
          <h3 class="apply-modal__title">
            {{ applyMode === 'player' ? 'Участвовать как игрок' : 'Участвовать как команда' }}
          </h3>
          <button
            type="button"
            class="apply-modal__close"
            aria-label="Закрыть"
            @click="closeApply"
          >×</button>
        </div>

        <form
          v-if="!applySent"
          class="apply-form"
          @submit.prevent="submitApply"
        >
          <div class="apply-form__fields">
            <template v-if="applyMode === 'player'">
              <input
                v-model="playerForm.parent_name"
                type="text"
                class="apply-form__input"
                placeholder="ФИО родителя"
                required
              />
              <input
                v-model="playerForm.child_name"
                type="text"
                class="apply-form__input"
                placeholder="ФИО ребёнка"
                required
              />
              <input
                v-model.number="playerForm.child_age"
                type="number"
                min="1"
                max="18"
                inputmode="numeric"
                class="apply-form__input"
                placeholder="Возраст ребёнка"
                required
              />
              <input
                v-model="playerForm.phone"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                class="apply-form__input"
                placeholder="+7 (___) ___-__-__"
                required
                @input="onPlayerPhoneInput"
              />
            </template>
            <template v-else>
              <input
                v-model="teamForm.team_name"
                type="text"
                class="apply-form__input"
                placeholder="Название команды"
                required
              />
              <input
                v-model="teamForm.city"
                type="text"
                class="apply-form__input"
                placeholder="Город"
                required
              />
              <input
                v-model="teamForm.age_category"
                type="text"
                class="apply-form__input"
                placeholder="Возрастная категория (например, U10)"
                required
              />
              <input
                v-model="teamForm.coach_name"
                type="text"
                class="apply-form__input"
                placeholder="ФИО тренера"
                required
              />
              <input
                v-model="teamForm.phone"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                class="apply-form__input"
                placeholder="+7 (___) ___-__-__"
                required
                @input="onTeamPhoneInput"
              />
              <textarea
                v-model="teamForm.comment"
                class="apply-form__input apply-form__textarea"
                placeholder="Комментарий (необязательно)"
                rows="3"
              />
            </template>
          </div>

          <p v-if="applyError" class="apply-form__error" role="alert">{{ applyError }}</p>

          <label class="apply-form__agree">
            <input v-model="applyAgree" type="checkbox" required />
            <span>Согласие на обработку персональных данных</span>
          </label>
          <p class="apply-form__disclaimer">
            Заполняя и отправляя форму, Вы даете
            <NuxtLink to="/privacy-policy" class="apply-form__disclaimer-link">Согласие на обработку персональных данных</NuxtLink>.
          </p>

          <button type="submit" class="btn" :disabled="applyLoading">
            {{ applyLoading ? 'Отправляем…' : 'Отправить' }}
          </button>
        </form>

        <p v-else class="apply-form__thanks">Спасибо! Заявка принята, мы свяжемся с вами.</p>
      </div>
    </div>
    </Transition>

    <Transition name="modal">
      <div
        v-if="calendarTournament"
        class="calendar-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Добавить в календарь"
        @click.self="closeCalendar"
        @keydown.esc="closeCalendar"
      >
        <div class="calendar-modal__inner">
          <div class="calendar-modal__top">
            <h3 class="calendar-modal__title">Добавить в календарь</h3>
            <button
              type="button"
              class="calendar-modal__close"
              aria-label="Закрыть"
              @click="closeCalendar"
            >×</button>
          </div>
          <div class="calendar-modal__body">
            <p class="calendar-modal__event">{{ calendarTournament.title }}</p>
            <p class="calendar-modal__when">
              {{ formatDateRange(calendarTournament.startDate, calendarTournament.endDate) }}
              <template v-if="calendarTournament.startTime">
                · {{ calendarTournament.startTime }}<template v-if="calendarTournament.endTime">–{{ calendarTournament.endTime }}</template>
              </template>
            </p>
          </div>
          <div class="calendar-modal__actions">
            <a
              :href="googleCalendarUrl(calendarTournament)"
              target="_blank"
              rel="noopener noreferrer"
              class="btn"
              @click="closeCalendar"
            >
              Google Календарь
              <Icon name="ph:arrow-up-right" />
            </a>
            <button
              type="button"
              class="btn btn--secondary"
              @click="downloadIcs(calendarTournament)"
            >
              Скачать .ics
              <Icon name="ph:download-simple" />
            </button>
          </div>
          <p class="calendar-modal__hint">
            Файл .ics подойдёт для Apple Календаря, Outlook, Яндекс Календаря.
          </p>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
    <div
      v-if="arenaModal"
      class="arena-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="`Место проведения: ${arenaModal.name}`"
      @click.self="closeArena"
      @keydown.esc="closeArena"
    >
      <div class="arena-modal__inner">
        <div class="arena-modal__top">
          <h3 class="arena-modal__title">{{ arenaModal.name }}</h3>
          <button
            type="button"
            class="arena-modal__close"
            aria-label="Закрыть"
            @click="closeArena"
          >×</button>
        </div>

        <dl v-if="arenaModal.address || arenaModal.city" class="arena-modal__details">
          <template v-if="arenaModal.city">
            <dt>Город</dt>
            <dd>{{ arenaModal.city }}</dd>
          </template>
          <template v-if="arenaModal.address">
            <dt>Адрес</dt>
            <dd>{{ arenaModal.address }}</dd>
          </template>
        </dl>

        <div v-if="arenaMapUrl" class="arena-modal__map">
          <iframe
            :src="arenaMapUrl"
            width="100%"
            height="100%"
            allowfullscreen
            title="Карта"
            class="arena-modal__map-iframe"
          />
        </div>

        <a
          v-if="arenaModal.url"
          :href="arenaModal.url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn arena-modal__cta"
        >
          Открыть в Яндекс.Картах
          <Icon name="ph:arrow-up-right" />
        </a>
      </div>
    </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { Tournament, TournamentArena } from '~/types'
import { postJson } from '~/utils/api'
import {
  endOf,
  formatDateRange,
  formatGameFormat,
  hasTournamentPage,
  isInProgress as isInProgressAt,
  startKey,
  startOf,
  withSeason
} from '~/utils/tournaments'

useHead({
  title: 'Детские хоккейные турниры в Ярославле — «Время Звёзд KIDS»',
  meta: [
    {
      name: 'description',
      content:
        'Расписание предстоящих и итоги завершённых детских хоккейных турниров с участием команд «Время Звёзд KIDS». Фильтрация по сезону, названию и возрастной категории.'
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://timeofthestars-kids.ru/tournaments' }
  ]
})

const nowMs = useState<number>('tournaments-now', () => Date.now())
const now = computed(() => new Date(nowMs.value))

onMounted(() => {
  nowMs.value = Date.now()
})

/*
  * Ждём запрос, но поля берём из самого объекта: useAsyncData возвращает промис
  * с копией полей, а await отдаёт уже другой объект — своих полей в нём нет.
  */
const tournamentsQuery = useTournaments()
await tournamentsQuery
const { data: apiData, pending, failed, retryDone, refresh } = tournamentsQuery

/** Пока не отработала повторная попытка на клиенте — это ещё загрузка, а не ошибка */
const loading = computed(() => pending.value || (failed.value && !retryDone.value))
const loadFailed = computed(() => failed.value && retryDone.value && !tournaments.value.length)

const tournaments = computed<Tournament[]>(() => (apiData.value ?? []).map(withSeason))

const seasons = computed(() => {
  const set = new Set<string>()
  for (const t of tournaments.value) set.add(t.season)
  return [...set].sort((a, b) => b.localeCompare(a))
})

const initialSeason = computed(() => {
  const list = seasons.value
  if (!list.length) return ''
  const withUpcoming = list.find(s =>
    tournaments.value.some(t => t.season === s && endOf(t) >= now.value)
  )
  return withUpcoming || list[0]!
})

const activeSeason = ref<string>(initialSeason.value)

const selectedAge = ref<string>('')
const selectedTitle = ref<string>('')
const selectedDate = ref<string>('')

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
  if (selectedDate.value && (t.startDate > selectedDate.value || t.endDate < selectedDate.value)) return false
  return true
}

const upcomingForSeason = computed(() =>
  tournaments.value
    .filter(t => t.season === activeSeason.value && matchesFilters(t) && endOf(t) >= now.value)
    .sort((a, b) => startKey(a).localeCompare(startKey(b)))
)

const completedForSeason = computed(() =>
  tournaments.value
    .filter(t => t.season === activeSeason.value && matchesFilters(t) && endOf(t) < now.value)
    .sort((a, b) => startKey(b).localeCompare(startKey(a)))
)

function isInProgress(t: Tournament): boolean {
  return isInProgressAt(t, now.value)
}

function gameFormatLabel(t: Tournament): string {
  return formatGameFormat(t)
}

const TEAM_MEDALS = ['🥇', '🥈', '🥉']

function medalForTeam(t: Tournament, idx: number): string {
  if (endOf(t) >= now.value) return ''
  return TEAM_MEDALS[idx] ?? '🏅'
}

const statusInfoOpen = ref(false)

const { openTeam } = useTeamModal()

const tournamentsJsonLd = computed(() => {
  const combined = [
    ...upcomingForSeason.value,
    ...completedForSeason.value.slice(0, 10)
  ]
  const items = combined.slice(0, 30).map((t, idx) => {
    const loc = t.arena
      ? {
          '@type': 'Place',
          name: t.arena.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: t.arena.address,
            addressLocality: t.arena.city ?? 'Ярославль',
            addressCountry: 'RU'
          }
        }
      : t.location
        ? { '@type': 'Place', name: t.location }
        : undefined
    return {
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'SportsEvent',
        name: t.title,
        startDate: `${t.startDate}T${t.startTime ?? '00:00'}:00+03:00`,
        endDate: `${t.endDate}T${t.endTime ?? '23:59'}:00+03:00`,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        sport: 'Ice Hockey',
        location: loc,
        description: t.description,
        url: t.url ?? undefined,
        organizer: {
          '@type': 'SportsClub',
          name: 'Время Звёзд KIDS',
          url: 'https://timeofthestars-kids.ru/'
        }
      }
    }
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items
  }
})

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(tournamentsJsonLd.value)
    }
  ]
}))

const calendarTournament = ref<Tournament | null>(null)

function openCalendar(t: Tournament) {
  calendarTournament.value = t
}

function closeCalendar() {
  calendarTournament.value = null
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function toIcsUtc(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
}

function icsEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function calendarLocation(t: Tournament): string {
  if (t.arena) {
    return [t.arena.name, t.arena.address, t.arena.city].filter(Boolean).join(', ')
  }
  return t.location ?? ''
}

function googleCalendarUrl(t: Tournament): string {
  const start = toIcsUtc(startOf(t))
  const end = toIcsUtc(endOf(t))
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: t.title,
    dates: `${start}/${end}`,
    details: t.description ?? '',
    location: calendarLocation(t)
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function downloadIcs(t: Tournament) {
  const start = toIcsUtc(startOf(t))
  const end = toIcsUtc(endOf(t))
  const stamp = toIcsUtc(new Date())
  const location = calendarLocation(t)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Time of the Stars KIDS//Tournaments//RU',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:tournament-${t.id}@timeofthestars-kids.ru`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${icsEscape(t.title)}`,
    t.description ? `DESCRIPTION:${icsEscape(t.description)}` : '',
    location ? `LOCATION:${icsEscape(location)}` : '',
    t.url ? `URL:${t.url}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n')

  const blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' })
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = `tournament-${t.id}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(href)
  closeCalendar()
}

const arenaModal = ref<TournamentArena | null>(null)

function arenaLabel(t: Tournament): string {
  if (t.arena?.name) return t.arena.name
  return t.location ?? ''
}

function openArena(t: Tournament) {
  if (t.arena) {
    arenaModal.value = t.arena
  } else if (t.location) {
    arenaModal.value = { name: t.location }
  }
}

function closeArena() {
  arenaModal.value = null
}

const arenaMapUrl = computed<string | null>(() => {
  const url = arenaModal.value?.url
  if (!url) return null
  try {
    const u = new URL(url)
    const point = u.searchParams.get('whatshere[point]') ?? u.searchParams.get('ll')
    if (!point) return null
    const [lon, lat] = point.split(',')
    if (!lon || !lat) return null
    const zoom = u.searchParams.get('z') ?? u.searchParams.get('whatshere[zoom]') ?? '16'
    return `https://yandex.ru/map-widget/v1/?ll=${lon},${lat}&z=${zoom}&pt=${lon},${lat}`
  } catch {
    return null
  }
})

type ApplyMode = 'player' | 'team'

const applyMode = ref<ApplyMode | null>(null)
const applyLoading = ref(false)
const applyError = ref<string | null>(null)
const applySent = ref(false)
const applyAgree = ref(false)

const playerForm = reactive({
  parent_name: '',
  child_name: '',
  child_age: null as number | null,
  phone: ''
})

const teamForm = reactive({
  team_name: '',
  city: '',
  age_category: '',
  coach_name: '',
  phone: '',
  comment: ''
})

function normalizePhone(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, '')
  const hasPlus = raw.trim().startsWith('+')
  return `${hasPlus ? '+' : ''}${digitsOnly}`
}

function onPlayerPhoneInput(e: Event) {
  playerForm.phone = normalizePhone((e.target as HTMLInputElement).value)
}

function onTeamPhoneInput(e: Event) {
  teamForm.phone = normalizePhone((e.target as HTMLInputElement).value)
}

function resetApply() {
  applyLoading.value = false
  applyError.value = null
  applySent.value = false
  applyAgree.value = false
  playerForm.parent_name = ''
  playerForm.child_name = ''
  playerForm.child_age = null
  playerForm.phone = ''
  teamForm.team_name = ''
  teamForm.city = ''
  teamForm.age_category = ''
  teamForm.coach_name = ''
  teamForm.phone = ''
  teamForm.comment = ''
}

function openApply(mode: ApplyMode) {
  resetApply()
  applyMode.value = mode
}

function closeApply() {
  applyMode.value = null
}

async function submitApply() {
  if (applyLoading.value || !applyMode.value) return
  applyError.value = null
  applyLoading.value = true
  try {
    if (applyMode.value === 'player') {
      await postJson('/tournament-applications/player', {
        parent_name: playerForm.parent_name.trim(),
        child_name: playerForm.child_name.trim(),
        child_age: playerForm.child_age,
        phone: playerForm.phone.trim()
      })
    } else {
      await postJson('/tournament-applications/team', {
        team_name: teamForm.team_name.trim(),
        city: teamForm.city.trim(),
        age_category: teamForm.age_category.trim(),
        coach_name: teamForm.coach_name.trim(),
        phone: teamForm.phone.trim(),
        comment: teamForm.comment.trim()
      })
    }
    applySent.value = true
  } catch {
    applyError.value = 'Не удалось отправить. Попробуйте ещё раз.'
  } finally {
    applyLoading.value = false
  }
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
.status-info {
  position: relative;
  display: inline-flex;
  margin-left: auto;
  align-self: flex-end;
  padding-bottom: 0.15rem;
  z-index: 150;
}
.status-info__btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  border-radius: 9999px;
  cursor: pointer;
  font-size: 1.05rem;
  line-height: 1;
  padding: 0;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.status-info__btn:hover,
.status-info__btn:focus-visible {
  background: var(--color-bg-alt);
  border-color: var(--color-accent);
  color: var(--color-accent);
  outline: none;
}
.status-info__popover {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 150;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);
  padding: 0.9rem 1rem;
  min-width: 260px;
  max-width: min(320px, calc(100vw - 2rem));
  font-size: 0.92rem;
}
.status-info__title {
  margin: 0 0 0.6rem;
  font-weight: 600;
  font-size: 0.95rem;
}
.status-info__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.status-info__list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.35;
  flex-wrap: wrap;
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
  z-index: 50;
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
.turniry__filter-date {
  background-image: none;
  padding-right: 0.85rem;
  font-family: inherit;
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

.turniry__retry {
  align-self: center;
  margin-top: 1rem;
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
  position: relative;
  background:
    url('/hockey-watermark.svg') no-repeat right -10px bottom -8px / 170px auto,
    linear-gradient(160deg, rgba(37, 99, 235, 0.16) 0%, rgba(37, 99, 235, 0.04) 45%, rgba(15, 23, 42, 0.02) 100%),
    var(--color-surface);
  border: 1px solid rgba(37, 99, 235, 0.18);
  border-radius: calc(var(--radius) + 4px);
  padding: 1.4rem 1.4rem 1.4rem 1.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  overflow: hidden;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.05),
    0 12px 32px -14px rgba(37, 99, 235, 0.22);
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}
.t-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(180deg, var(--color-accent), rgba(37, 99, 235, 0.45));
}
.t-card::after {
  content: '';
  position: absolute;
  top: -70px;
  right: -70px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 1px solid rgba(37, 99, 235, 0.14);
  background:
    radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.18), transparent 60%);
  pointer-events: none;
}
.t-card:hover {
  border-color: rgba(37, 99, 235, 0.45);
  box-shadow:
    0 0 0 1px rgba(37, 99, 235, 0.18),
    0 20px 42px -16px rgba(37, 99, 235, 0.42);
  transform: translateY(-3px);
}
.t-card--upcoming {
  background:
    url('/hockey-watermark.svg') no-repeat right -10px bottom -8px / 170px auto,
    linear-gradient(160deg, rgba(34, 197, 94, 0.18) 0%, rgba(34, 197, 94, 0.05) 45%, rgba(15, 23, 42, 0.02) 100%),
    var(--color-surface);
  border-color: rgba(34, 197, 94, 0.22);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.05),
    0 12px 32px -14px rgba(34, 197, 94, 0.25);
}
.t-card--upcoming::before {
  background: linear-gradient(180deg, #22c55e, rgba(34, 197, 94, 0.45));
}
.t-card--upcoming::after {
  background:
    radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.2), transparent 60%);
  border-color: rgba(34, 197, 94, 0.18);
}
.t-card--upcoming:hover {
  border-color: rgba(34, 197, 94, 0.5);
  box-shadow:
    0 0 0 1px rgba(34, 197, 94, 0.2),
    0 20px 42px -16px rgba(34, 197, 94, 0.45);
}
.t-card--in-progress {
  background:
    url('/hockey-watermark.svg') no-repeat right -10px bottom -8px / 170px auto,
    linear-gradient(160deg, rgba(245, 158, 11, 0.22) 0%, rgba(245, 158, 11, 0.06) 45%, rgba(15, 23, 42, 0.02) 100%),
    var(--color-surface);
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.05),
    0 12px 32px -14px rgba(245, 158, 11, 0.3);
}
.t-card--in-progress::before {
  background: linear-gradient(180deg, #f59e0b, rgba(245, 158, 11, 0.5));
}
.t-card--in-progress::after {
  background:
    radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.22), transparent 60%);
  border-color: rgba(245, 158, 11, 0.2);
}
.t-card--in-progress:hover {
  border-color: rgba(245, 158, 11, 0.55);
  box-shadow:
    0 0 0 1px rgba(245, 158, 11, 0.25),
    0 20px 42px -16px rgba(245, 158, 11, 0.5);
}
.t-card--past {
  background:
    url('/hockey-watermark.svg') no-repeat right -10px bottom -8px / 170px auto,
    linear-gradient(160deg, rgba(148, 163, 184, 0.18) 0%, rgba(148, 163, 184, 0.06) 50%, rgba(15, 23, 42, 0.02) 100%),
    var(--color-surface);
  border-color: rgba(148, 163, 184, 0.25);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 28px -14px rgba(15, 23, 42, 0.18);
}
.t-card--past::before {
  background: linear-gradient(180deg, #94a3b8, rgba(148, 163, 184, 0.45));
}
.t-card--past::after {
  background:
    radial-gradient(circle at 30% 30%, rgba(148, 163, 184, 0.18), transparent 60%);
  border-color: rgba(148, 163, 184, 0.2);
}
.t-card--past:hover {
  border-color: rgba(148, 163, 184, 0.45);
  box-shadow:
    0 0 0 1px rgba(148, 163, 184, 0.2),
    0 18px 38px -16px rgba(15, 23, 42, 0.3);
  transform: translateY(-2px);
}

.t-card__head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.t-card__age {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(37, 99, 235, 0.06));
  color: var(--color-accent);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.15);
}
.t-card__status {
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
.t-card__status::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.t-card__status--upcoming {
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
  box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.25);
}
.t-card__status--in-progress {
  background: rgba(245, 158, 11, 0.18);
  color: #b45309;
  box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.35);
}
.t-card__status--in-progress::before {
  animation: status-dot-pulse 1.4s ease-in-out infinite;
}
@keyframes status-dot-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
  50% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .t-card__status--in-progress::before {
    animation: none;
  }
}
.t-card__status--done {
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
  box-shadow: inset 0 0 0 1px var(--color-border);
}

.t-card__title {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.t-card__title-link {
  color: inherit;
  text-decoration: none;
}
.t-card__title-link:hover,
.t-card__title-link:focus-visible {
  color: var(--color-accent);
  text-decoration: underline;
  outline: none;
}

.t-card__meta {
  position: relative;
  z-index: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.t-card__meta-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.95rem;
  color: var(--color-text);
}
.t-card__meta-icon {
  width: 1.05em;
  height: 1.05em;
  color: var(--color-accent);
  flex-shrink: 0;
}
.t-card--upcoming .t-card__meta-icon {
  color: #15803d;
}
.t-card--in-progress .t-card__meta-icon {
  color: #b45309;
}
.t-card--past .t-card__meta-icon {
  color: #475569;
}
.t-card__meta-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
  text-decoration: none;
  border-radius: 6px;
  transition: color 0.2s;
}
.t-card__meta-link--btn {
  background: transparent;
  border: 0;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-align: left;
}
.t-card__meta-link:hover,
.t-card__meta-link:focus-visible {
  color: var(--color-accent);
  text-decoration: underline;
  outline: none;
}

.t-card__desc {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.t-card__teams {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--color-border);
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
  gap: 0.5rem;
  padding: 0.25rem 0.75rem 0.25rem 0.35rem;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.t-card__team:not(:has(.t-card__team-logo)) {
  padding-left: 0.75rem;
}
.t-card__team:hover {
  border-color: var(--color-accent);
  background: var(--color-surface);
  transform: translateY(-1px);
}
.t-card__team:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.turniry__cta {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0 0 2rem;
}
.turniry__cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
}
.turniry__cta-btn :deep(svg),
.turniry__cta-btn .iconify {
  width: 1.15em;
  height: 1.15em;
  flex-shrink: 0;
}
@media (max-width: 600px) {
  .turniry__cta-btn {
    flex: 1 1 100%;
  }
}

.apply-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 140px 1rem 1rem;
  overflow-y: auto;
}
.apply-modal__inner {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 0 1.5rem 1.5rem;
  max-width: 520px;
  width: 100%;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
}
.apply-modal__top {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0 0.75rem;
  margin: 0 -1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1rem;
}
.apply-modal__title {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-text);
}
.apply-modal__close {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text);
  padding: 0;
}
.apply-modal__close:hover {
  background: var(--color-border);
}

.apply-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.apply-form__fields {
  display: grid;
  gap: 0.75rem;
}
.apply-form__input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font: inherit;
}
.apply-form__input:focus {
  outline: none;
  border-color: var(--color-accent);
}
.apply-form__textarea {
  resize: vertical;
  min-height: 80px;
}
.apply-form__agree {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  cursor: pointer;
}
.apply-form__agree input {
  margin-top: 0.2rem;
}
.apply-form__disclaimer {
  margin: 0;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}
.apply-form__disclaimer-link {
  color: var(--color-accent);
  text-decoration: underline;
}
.apply-form__error {
  margin: 0;
  color: #ef4444;
  font-size: 0.9rem;
}
.apply-form__thanks {
  margin: 0;
  color: #22c55e;
  font-weight: 600;
  line-height: 1.5;
}

.calendar-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 140px 1rem 1rem;
}
.calendar-modal__inner {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 0 1.5rem 1.5rem;
  max-width: 460px;
  width: 100%;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.calendar-modal__top {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0 0.85rem;
  margin: 0 -1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}
.calendar-modal__title {
  margin: 0;
  font-size: 1.15rem;
  color: var(--color-text);
}
.calendar-modal__close {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text);
  padding: 0;
}
.calendar-modal__close:hover {
  background: var(--color-border);
}
.calendar-modal__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.calendar-modal__event {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text);
}
.calendar-modal__when {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
.calendar-modal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.calendar-modal__actions .btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.calendar-modal__hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.45;
}

.arena-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 140px 1rem 1rem;
}
.arena-modal__inner {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 0 1.5rem 1.5rem;
  max-width: 640px;
  width: 100%;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.arena-modal__top {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0 0.85rem;
  margin: 0 -1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}
.arena-modal__title {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-text);
}
.arena-modal__close {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text);
  padding: 0;
}
.arena-modal__close:hover {
  background: var(--color-border);
}
.arena-modal__details {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 1rem;
  row-gap: 0.4rem;
  margin: 0;
  font-size: 0.95rem;
}
.arena-modal__details dt {
  font-weight: 600;
  color: var(--color-text-muted);
}
.arena-modal__details dd {
  margin: 0;
  color: var(--color-text);
}
.arena-modal__map {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-bg-alt);
}
.arena-modal__map-iframe {
  position: absolute;
  inset: 0;
  border: 0;
  width: 100%;
  height: 100%;
}
.arena-modal__cta {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.t-card__team-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}
.t-card__team-medal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 22px;
  line-height: 1;
  flex-shrink: 0;
}

.t-card__links {
  position: relative;
  z-index: 1;
  margin-top: auto;
  padding-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}
.t-card__link {
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
  border: 1px solid transparent;
  box-shadow: 0 4px 10px -4px rgba(37, 99, 235, 0.5);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
}
.t-card__link:hover {
  background: #1d4ed8;
  box-shadow: 0 6px 14px -4px rgba(37, 99, 235, 0.55);
  transform: translateY(-1px);
}
.t-card__link--stats {
  background: var(--color-surface);
  color: var(--color-accent);
  border-color: rgba(37, 99, 235, 0.35);
  box-shadow: 0 4px 10px -6px rgba(37, 99, 235, 0.45);
}
.t-card__link--stats:hover {
  background: var(--color-accent);
  color: #fff;
  border-color: transparent;
}

.t-card__link--recordings {
  background: var(--color-accent-red);
  color: #fff;
  box-shadow: 0 4px 10px -4px rgba(220, 38, 38, 0.5);
}
.t-card__link--recordings:hover {
  background: var(--color-accent-red-hover);
  box-shadow: 0 6px 14px -4px rgba(220, 38, 38, 0.55);
}

@media (max-width: 600px) {
  .turniry__grid {
    grid-template-columns: 1fr;
  }
  .page__title {
    font-size: 1.65rem;
  }
  .t-card {
    padding: 1.15rem 1.15rem 1.15rem 1.4rem;
  }
  .t-card__title {
    font-size: 1.15rem;
  }
}
</style>
