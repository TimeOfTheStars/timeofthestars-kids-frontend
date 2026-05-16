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

      <div v-reveal="{ delay: 120 }" class="turniry__cta">
        <button type="button" class="btn" @click="openApply('player')">
          Участвовать как игрок
        </button>
        <button type="button" class="btn btn--red" @click="openApply('team')">
          Участвовать как команда
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
                  <li v-if="t.startTime" class="t-card__meta-row">
                    <Icon name="ph:clock" class="t-card__meta-icon" />
                    <span>Начало в {{ t.startTime }}</span>
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
                      v-for="(team, idx) in t.teams"
                      :key="team.name"
                      class="t-card__team"
                      :class="{ 't-card__team--clickable': team.photo }"
                      :role="team.photo ? 'button' : undefined"
                      :tabindex="team.photo ? 0 : undefined"
                      @click="team.photo && openTeamPhoto(team)"
                      @keydown.enter.prevent="team.photo && openTeamPhoto(team)"
                      @keydown.space.prevent="team.photo && openTeamPhoto(team)"
                    >
                      <span
                        v-if="medalForTeam(t, idx)"
                        class="t-card__team-medal"
                        aria-hidden="true"
                      >{{ medalForTeam(t, idx) }}</span>
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
                  <li v-if="t.startTime" class="t-card__meta-row">
                    <Icon name="ph:clock" class="t-card__meta-icon" />
                    <span>Начало в {{ t.startTime }}</span>
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
                      v-for="(team, idx) in t.teams"
                      :key="team.name"
                      class="t-card__team"
                      :class="{ 't-card__team--clickable': team.photo }"
                      :role="team.photo ? 'button' : undefined"
                      :tabindex="team.photo ? 0 : undefined"
                      @click="team.photo && openTeamPhoto(team)"
                      @keydown.enter.prevent="team.photo && openTeamPhoto(team)"
                      @keydown.space.prevent="team.photo && openTeamPhoto(team)"
                    >
                      <span
                        v-if="medalForTeam(t, idx)"
                        class="t-card__team-medal"
                        aria-hidden="true"
                      >{{ medalForTeam(t, idx) }}</span>
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
        <button
          type="button"
          class="apply-modal__close"
          aria-label="Закрыть"
          @click="closeApply"
        >×</button>
        <h3 class="apply-modal__title">
          {{ applyMode === 'player' ? 'Участвовать как игрок' : 'Участвовать как команда' }}
        </h3>

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

    <div
      v-if="teamPhoto"
      class="team-photo-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="`Фото команды ${teamPhoto.name}`"
      @click.self="closeTeamPhoto"
      @keydown.esc="closeTeamPhoto"
    >
      <div class="team-photo-modal__inner">
        <button
          type="button"
          class="team-photo-modal__close"
          aria-label="Закрыть"
          @click="closeTeamPhoto"
        >×</button>
        <h3 class="team-photo-modal__title">{{ teamPhoto.name }}</h3>
        <img
          :src="teamPhoto.photo"
          :alt="`Фото команды ${teamPhoto.name}`"
          class="team-photo-modal__img"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { Tournament, TournamentTeam } from '~/types'
import { postJson } from '~/utils/api'

useHead({
  title: 'Турниры — Время Звёзд KIDS',
  meta: [
    {
      name: 'description',
      content:
        'Расписание предстоящих и итоги завершённых турниров команд «Время Звёзд KIDS». Фильтрация по сезону, названию и возрастной категории.'
    }
  ]
})

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

const nowMs = useState<number>('tournaments-now', () => Date.now())
const now = computed(() => new Date(nowMs.value))

onMounted(() => {
  nowMs.value = Date.now()
})

function parseDateTime(date: string, time: string | undefined, fallback: 'start' | 'end'): Date {
  const t = time && /^\d{1,2}:\d{2}$/.test(time) ? time : (fallback === 'start' ? '00:00' : '23:59')
  const [hh, mm] = t.split(':')
  return new Date(`${date}T${hh!.padStart(2, '0')}:${mm!.padStart(2, '0')}:00+03:00`)
}

function startOf(t: Tournament): Date {
  return parseDateTime(t.startDate, t.startTime, 'start')
}

function endOf(t: Tournament): Date {
  return parseDateTime(t.endDate, t.endTime, 'end')
}

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

function startKey(t: Tournament): string {
  return `${t.startDate}T${t.startTime ?? '00:00'}`
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
  return startOf(t) <= now.value && now.value <= endOf(t)
}

const TEAM_MEDALS = ['🥇', '🥈', '🥉']

function medalForTeam(t: Tournament, idx: number): string {
  if (endOf(t) >= now.value) return ''
  return TEAM_MEDALS[idx] ?? '🏅'
}

const statusInfoOpen = ref(false)

const teamPhoto = ref<{ name: string; photo: string } | null>(null)

function openTeamPhoto(team: TournamentTeam) {
  if (!team.photo) return
  teamPhoto.value = { name: team.name, photo: team.photo }
}

function closeTeamPhoto() {
  teamPhoto.value = null
}

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
  background: rgba(245, 158, 11, 0.18);
  color: #b45309;
  animation: status-pulse 1.6s ease-in-out infinite;
}
@keyframes status-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
  50% { box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.18); }
}
@media (prefers-reduced-motion: reduce) {
  .t-card__status--in-progress {
    animation: none;
  }
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
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.t-card__team--clickable {
  cursor: pointer;
}
.t-card__team--clickable:hover {
  border-color: var(--color-accent);
  background: var(--color-surface);
  transform: translateY(-1px);
}
.t-card__team--clickable:focus-visible {
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
@media (max-width: 600px) {
  .turniry__cta .btn {
    flex: 1 1 100%;
    text-align: center;
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
  padding: 1rem;
  overflow-y: auto;
}
.apply-modal__inner {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 1.75rem 1.5rem 1.5rem;
  max-width: 520px;
  width: 100%;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}
.apply-modal__title {
  margin: 0 2.5rem 1.25rem 0;
  font-size: 1.2rem;
  color: var(--color-text);
}
.apply-modal__close {
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
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

.team-photo-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}
.team-photo-modal__inner {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 1.25rem;
  max-width: min(900px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}
.team-photo-modal__title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text);
  padding-right: 2.5rem;
}
.team-photo-modal__img {
  display: block;
  max-width: 100%;
  max-height: calc(90vh - 5rem);
  object-fit: contain;
  border-radius: calc(var(--radius) - 4px);
  background: var(--color-bg-alt);
}
.team-photo-modal__close {
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
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
.team-photo-modal__close:hover {
  background: var(--color-border);
}
.t-card__team-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  border-radius: 50%;
  background: #fff;
}
.t-card__team-medal {
  font-size: 1.05rem;
  line-height: 1;
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
