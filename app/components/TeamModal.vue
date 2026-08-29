<template>
  <Transition name="modal">
    <div
      v-if="target"
      class="team-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="`Команда ${teamName}`"
      @click.self="closeTeam"
    >
      <div class="team-modal__inner">
        <div class="team-modal__top">
          <div class="team-modal__ident">
            <img
              v-if="teamLogo"
              :src="teamLogo"
              :alt="''"
              class="team-modal__logo"
            />
            <div class="team-modal__heading">
              <h3 class="team-modal__title">{{ teamName }}</h3>
              <p v-if="subtitle" class="team-modal__subtitle">{{ subtitle }}</p>
            </div>
          </div>
          <button
            type="button"
            class="team-modal__close"
            aria-label="Закрыть"
            @click="closeTeam"
          >×</button>
        </div>

        <div class="team-modal__body">
          <HockeyLoader v-if="loading" text="Загружаем команду" bare />

          <template v-else>
            <section v-if="team" class="team-modal__section">
              <h4 class="team-modal__section-title">Всего за историю</h4>
              <StatTiles :items="statTiles" />
            </section>

            <section v-if="tournamentsOfTeam.length" class="team-modal__section">
              <h4 class="team-modal__section-title">Турнир</h4>
              <SegmentedTabs
                v-if="tournamentTabs.length > 1"
                v-model="selectedTournamentId"
                class="team-modal__tabs"
                aria-label="Турниры команды"
                :tabs="tournamentTabs"
              />
              <p v-if="selectedTournament" class="team-modal__hint">
                {{ selectedTournament.title }} ·
                {{ formatDateRange(selectedTournament.startDate, selectedTournament.endDate) }}
              </p>
            </section>

            <section v-if="teamPhoto" class="team-modal__section">
              <h4 class="team-modal__section-title">Общая фотография</h4>
              <div class="team-photo">
                <button
                  type="button"
                  class="team-photo__btn"
                  :aria-label="`Открыть фотографию команды ${teamName} на весь экран`"
                  @click="openPhoto({ src: teamPhoto, title: photoTitle })"
                >
                  <img
                    :src="teamPhoto"
                    :alt="`Фото команды ${teamName}`"
                    class="team-photo__img"
                    loading="lazy"
                    decoding="async"
                  />
                  <span class="team-photo__zoom" aria-hidden="true">
                    <Icon name="ph:magnifying-glass-plus" />
                  </span>
                </button>
              </div>
            </section>

            <section class="team-modal__section">
              <h4 class="team-modal__section-title">Состав</h4>

              <HockeyLoader v-if="rosterPending" text="Загружаем состав" bare />
              <ul v-else-if="roster.length" class="roster">
                <li v-for="row in roster" :key="row.player.id" class="roster__item">
                  <button
                    v-if="row.player.photo"
                    type="button"
                    class="roster__avatar roster__avatar--zoom"
                    :aria-label="`Открыть фото ${row.player.fullName} на весь экран`"
                    @click="openPhoto({ src: row.player.photo, title: row.player.fullName })"
                  >
                    <img
                      :src="row.player.photo"
                      :alt="row.player.fullName"
                      class="roster__photo"
                      loading="lazy"
                      decoding="async"
                    />
                    <span class="roster__zoom" aria-hidden="true">
                      <Icon name="ph:magnifying-glass-plus" />
                    </span>
                  </button>
                  <span v-else class="roster__avatar">
                    <span class="roster__initials" aria-hidden="true">{{ initials(row.player.fullName) }}</span>
                  </span>
                  <span class="roster__num">{{ row.number ?? '—' }}</span>
                  <span class="roster__body">
                    <NuxtLink
                      :to="`/players/${row.player.id}`"
                      class="roster__name"
                      @click="closeTeam"
                    >{{ row.player.fullName }}</NuxtLink>
                    <span v-if="amplua(row)" class="roster__pos">{{ amplua(row) }}</span>
                  </span>
                </li>
              </ul>
              <div v-else-if="!tournamentsOfTeam.length" class="team-modal__state">
                <p>Команда ещё не заявлена в турниры.</p>
              </div>
              <div v-else class="team-modal__state">
                <p>Состав в этом турнире не публиковался.</p>
              </div>
            </section>

            <section v-if="tournamentsOfTeam.length" class="team-modal__section">
              <h4 class="team-modal__section-title">Турниры команды</h4>
              <div class="tm-table__scroll">
                <table class="tm-table">
                  <thead>
                    <tr>
                      <th scope="col" class="tm-table__th tm-table__th--name">Турнир</th>
                      <th scope="col" class="tm-table__th" title="Место в таблице">М</th>
                      <th scope="col" class="tm-table__th" title="Игры">И</th>
                      <th scope="col" class="tm-table__th" title="Победы">В</th>
                      <th scope="col" class="tm-table__th" title="Ничьи">Н</th>
                      <th scope="col" class="tm-table__th" title="Поражения">П</th>
                      <th scope="col" class="tm-table__th tm-table__th--goals" title="Забито : пропущено">Шайбы</th>
                      <th scope="col" class="tm-table__th tm-table__th--points" title="Очки">О</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in tournamentRows" :key="row.id" class="tm-table__row">
                      <td class="tm-table__td tm-table__td--name">
                        <NuxtLink
                          v-if="row.hasGames"
                          :to="`/tournaments/${row.id}`"
                          class="tm-table__link"
                          @click="closeTeam"
                        >{{ row.title }}</NuxtLink>
                        <span v-else>{{ row.title }}</span>
                        <span class="tm-table__season">{{ row.season }}</span>
                      </td>
                      <td class="tm-table__td">{{ row.place ?? '—' }}</td>
                      <td class="tm-table__td">{{ row.games ?? '—' }}</td>
                      <td class="tm-table__td">{{ row.wins ?? '—' }}</td>
                      <td class="tm-table__td">{{ row.draws ?? '—' }}</td>
                      <td class="tm-table__td">{{ row.losses ?? '—' }}</td>
                      <td class="tm-table__td tm-table__td--goals">
                        <template v-if="row.goalsFor != null">{{ row.goalsFor }}:{{ row.goalsAgainst }}</template>
                        <template v-else>—</template>
                      </td>
                      <td class="tm-table__td tm-table__td--points">{{ row.points ?? '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { StandingRow, StatLine, Team, Tournament } from '~/types'
import { apiUrl } from '~/utils/api'
import { formatDateRange, formatShortDay } from '~/utils/tournaments'

const { target, closeTeam } = useTeamModal()
const { photo: lightboxPhoto, openPhoto } = useLightbox()
const route = useRoute()

/* --- данные подтягиваем только когда модалку открыли --- */

const teamsQuery = useTeams({ immediate: false, key: 'team-modal-teams' })
const tournamentsQuery = useTournaments({ immediate: false, key: 'team-modal-tournaments' })

let teamsRequested = false
let tournamentsRequested = false

const teams = teamsQuery.data
const tournaments = tournamentsQuery.data

/** Разрешение команды: id из статистики, иначе имя + логотип (имена не уникальны) */
const team = computed<Team | null>(() => {
  const t = target.value
  if (!t) return null
  const list = teams.value ?? []
  if (t.teamId) {
    const byId = list.find(x => x.id === t.teamId)
    if (byId) return byId
  }
  return findTeamByName(list, t.name, t.logo)
})

const teamId = computed(() => team.value?.id ?? target.value?.teamId ?? '')
const teamName = computed(() => team.value?.name ?? target.value?.name ?? 'Команда')
const teamLogo = computed(() => team.value?.logo ?? target.value?.logo ?? '')

/** Только город: описание команды — внутреннее поле, публично его не показываем */
const subtitle = computed(() => team.value?.city ?? '')

const loading = computed(() => teamsQuery.pending.value || tournamentsQuery.pending.value)

const statTiles = computed(() => {
  const s = team.value?.stats
  if (!s) return []
  return [
    { label: 'Турниров', value: s.tournaments },
    { label: 'Игр', value: s.games },
    { label: 'Побед', value: s.wins },
    { label: 'Ничьих', value: s.draws },
    { label: 'Поражений', value: s.losses },
    { label: 'Забито', value: s.goalsFor },
    { label: 'Пропущено', value: s.goalsAgainst },
    { label: 'Очков', value: s.points }
  ]
})

/** Запись команды внутри teams[] турнира: только там живёт общее фото */
function entryOf(t: Tournament) {
  const name = teamName.value
  const logo = teamLogo.value
  return (t.teams ?? []).find(x => {
    if (x.name !== name) return false
    if (x.logo && logo) return x.logo === logo
    return true
  })
}

/**
 * Кандидаты: в teams[] турнира нет id, поэтому сопоставляем по имени и логотипу.
 * Логотип обязателен как различитель — одноимённых команд несколько.
 */
const candidateTournaments = computed<Tournament[]>(() =>
  (tournaments.value ?? [])
    .filter(t => entryOf(t))
    .slice()
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
)

const candidateKey = computed(() => candidateTournaments.value.map(t => t.id).join(','))

/**
 * У турниров с матчами есть таблица с настоящими id: если нашей команды там нет,
 * значит совпало только имя — такой турнир выбрасываем.
 */
const tournamentsOfTeam = computed<Tournament[]>(() => {
  const results = resultsQuery.data.value ?? {}
  const resolved = resultsQuery.status.value === 'success'
  return candidateTournaments.value.filter(t => {
    if (!t.hasGames || !resolved) return true
    return Boolean(results[String(t.id)])
  })
})

const tournamentTabs = computed(() =>
  tournamentsOfTeam.value.map(t => ({
    key: String(t.id),
    label: `${t.title} · ${formatShortDay(t.startDate)}`
  }))
)

const selectedTournamentId = ref('')

const selectedTournament = computed(
  () => tournamentsOfTeam.value.find(t => String(t.id) === selectedTournamentId.value) ?? null
)

const photoTitle = computed(() => {
  const t = selectedTournament.value
  return t ? `${teamName.value} — ${t.title}` : teamName.value
})

const teamPhoto = computed(() => {
  const t = selectedTournament.value
  return t ? entryOf(t)?.photo ?? '' : ''
})

/* --- состав выбранного турнира: тот же ключ, что на странице турнира --- */

const rosterQuery = useAsyncData<StatLine[]>(
  () => `players-${selectedTournamentId.value || 'none'}`,
  async () => {
    if (!selectedTournamentId.value) return []
    try {
      return await $fetch<StatLine[]>(apiUrl(`/tournaments/${selectedTournamentId.value}/players`))
    } catch {
      return []
    }
  },
  { default: () => [], immediate: false, watch: [selectedTournamentId] }
)

const rosterPending = computed(() => rosterQuery.pending.value)

const roster = computed(() =>
  (rosterQuery.data.value ?? []).filter(row => row.team?.id === teamId.value)
)

/* --- результаты по всем турнирам команды --- */

const resultsQuery = useAsyncData<Record<string, StandingRow>>(
  () => `team-results-${teamId.value || 'none'}-${candidateKey.value}`,
  async () => {
    const id = teamId.value
    const list = candidateTournaments.value.filter(t => t.hasGames)
    if (!id || !list.length) return {}
    const pairs = await Promise.all(
      list.map(async t => {
        try {
          const rows = await $fetch<StandingRow[]>(apiUrl(`/tournaments/${t.id}/standings`))
          const own = rows.find(r => r.team.id === id)
          return own ? ([String(t.id), own] as const) : null
        } catch {
          return null
        }
      })
    )
    return Object.fromEntries(pairs.filter(Boolean) as [string, StandingRow][])
  },
  { default: () => ({}), immediate: false }
)

const tournamentRows = computed(() =>
  tournamentsOfTeam.value.map(t => {
    const own = resultsQuery.data.value?.[String(t.id)]
    return {
      id: String(t.id),
      title: t.title,
      season: t.season,
      hasGames: t.hasGames === true,
      place: own?.place ?? null,
      games: own?.games ?? null,
      wins: own?.wins ?? null,
      draws: own?.draws ?? null,
      losses: own?.losses ?? null,
      goalsFor: own?.goalsFor ?? null,
      goalsAgainst: own?.goalsAgainst ?? null,
      points: own?.points ?? null
    }
  })
)

/* --- открытие / закрытие --- */

watch(target, value => {
  if (!value) return
  if (!teamsRequested) {
    teamsRequested = true
    teamsQuery.execute()
  }
  if (!tournamentsRequested) {
    tournamentsRequested = true
    tournamentsQuery.execute()
  }
})

/** Выбор турнира: тот, из которого открыли, иначе самый свежий */
watch([target, tournamentsOfTeam], () => {
  if (!target.value) return
  const wanted = target.value.tournamentId ? String(target.value.tournamentId) : ''
  const list = tournamentsOfTeam.value
  if (wanted && list.some(t => String(t.id) === wanted)) {
    selectedTournamentId.value = wanted
    return
  }
  selectedTournamentId.value = list.length ? String(list[0]!.id) : ''
}, { immediate: true })

/*
 * Запрос уходит, когда известны и команда, и список её турниров: id приходит
 * из /teams, а турниры — из /tournaments, и порядок ответов не гарантирован.
 */
let lastResultsKey = ''

watch([target, teamId, candidateKey], () => {
  if (!target.value || !teamId.value) return
  const key = `${teamId.value}|${candidateKey.value}`
  if (key === lastResultsKey) return
  lastResultsKey = key
  resultsQuery.execute()
}, { immediate: true })

watch(() => route.fullPath, closeTeam)

function initials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

function amplua(row: StatLine): string {
  if (row.player.position) return row.player.position
  return row.isGoalie ? 'вратарь' : ''
}

/* --- Escape и блокировка скролла: как в CoachDetailsModal --- */

let prevBodyOverflow: string | null = null
let prevBodyPaddingRight: string | null = null

function onKeydown(e: KeyboardEvent) {
  if (!target.value) return
  // поверх модалки может быть открыт лайтбокс — Escape закрывает сначала его
  if (lightboxPhoto.value) return
  if (e.key === 'Escape') closeTeam()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

watch(
  () => target.value !== null,
  isOpen => {
    if (typeof document === 'undefined') return
    const body = document.body

    if (isOpen) {
      if (prevBodyOverflow === null) prevBodyOverflow = body.style.overflow
      if (prevBodyPaddingRight === null) prevBodyPaddingRight = body.style.paddingRight

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      body.style.overflow = 'hidden'
      body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : prevBodyPaddingRight || ''
      return
    }

    body.style.overflow = prevBodyOverflow ?? ''
    body.style.paddingRight = prevBodyPaddingRight ?? ''
    prevBodyOverflow = null
    prevBodyPaddingRight = null
  }
)

onUnmounted(() => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = prevBodyOverflow ?? ''
  document.body.style.paddingRight = prevBodyPaddingRight ?? ''
})
</script>

<style scoped>
.team-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 140px 1rem 1rem;
}
.team-modal__inner {
  position: relative;
  background: var(--color-surface);
  border-radius: calc(var(--radius) + 6px);
  border: 1px solid var(--color-border);
  padding: 0 1.5rem 1.5rem;
  width: min(1080px, 100%);
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
}
.team-modal__top {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 -1.5rem;
  padding: 1rem 1.5rem 0.85rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}
.team-modal__ident {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
}
.team-modal__logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
}
.team-modal__heading {
  min-width: 0;
}
.team-modal__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-text);
  overflow-wrap: break-word;
}
.team-modal__subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}
.team-modal__close {
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
.team-modal__close:hover {
  background: var(--color-border);
}

.team-modal__body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1.25rem;
}
.team-modal__section {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.team-modal__section-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-text-muted);
}
.team-modal__hint {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}
.team-modal__state {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.1rem;
  text-align: center;
  color: var(--color-text-muted);
}
.team-modal__state p {
  margin: 0;
}
.team-photo {
  display: flex;
  justify-content: center;
}
/* Кнопка обнимает фотографию по размеру: иначе под панорамным снимком остаётся пустота */
.team-photo__btn {
  position: relative;
  display: block;
  width: fit-content;
  max-width: 100%;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg-alt);
  overflow: hidden;
  cursor: zoom-in;
  line-height: 0;
}
.team-photo__img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  /* Ограничение только по высоте: ширину снимок добирает сам, сохраняя пропорции.
     width: 100% здесь нельзя — вместе с max-height это растянет картинку. */
  max-height: 62vh;
}
.team-photo__zoom {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.62);
  color: #fff;
  font-size: 1.15rem;
  line-height: 1;
  transition: background 0.2s, transform 0.2s;
}
.team-photo__btn:hover .team-photo__zoom {
  background: var(--color-accent);
  transform: scale(1.06);
}
.team-photo__btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Состав */
.roster {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 0.5rem;
}
.roster__item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.7rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  min-width: 0;
}
.roster__avatar {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.roster__avatar--zoom {
  cursor: zoom-in;
}
.roster__zoom {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.55);
  color: #fff;
  font-size: 0.95rem;
  opacity: 0;
  transition: opacity 0.18s;
}
.roster__avatar--zoom:hover .roster__zoom,
.roster__avatar--zoom:focus-visible .roster__zoom {
  opacity: 1;
}
.roster__avatar--zoom:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.roster__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.roster__initials {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-accent);
}
.roster__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 22px;
  padding: 0 0.3rem;
  border-radius: 6px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
.roster__body {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  min-width: 0;
}
.roster__name {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  line-height: 1.2;
  overflow-wrap: break-word;
}
.roster__name:hover,
.roster__name:focus-visible {
  color: var(--color-accent);
  text-decoration: underline;
}
.roster__pos {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Таблица турниров команды */
.tm-table__scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 2px);
}
.tm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.tm-table__th {
  text-align: center;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  padding: 0.6rem 0.35rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}
.tm-table__th--name {
  text-align: left;
  padding-left: 0.8rem;
  min-width: 150px;
}
.tm-table__th--goals {
  min-width: 58px;
}
.tm-table__td {
  text-align: center;
  padding: 0.6rem 0.35rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.tm-table__row:last-child .tm-table__td {
  border-bottom: 0;
}
.tm-table__td--name {
  text-align: left;
  padding-left: 0.8rem;
  white-space: normal;
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}
.tm-table__link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}
.tm-table__link:hover,
.tm-table__link:focus-visible {
  color: var(--color-accent);
  text-decoration: underline;
}
.tm-table__season {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
.tm-table__td--goals {
  color: var(--color-text-muted);
}
.tm-table__td--points {
  font-weight: 700;
  color: var(--color-accent);
}

@media (min-width: 900px) {
  .team-modal__inner {
    padding: 0 2rem 2rem;
  }
  .team-modal__top {
    margin: 0 -2rem;
    padding: 1.15rem 2rem 0.95rem;
  }
  .team-modal__logo {
    width: 80px;
    height: 80px;
  }
  .team-modal__title {
    font-size: 1.45rem;
  }
  .team-modal__body {
    gap: 1.85rem;
    padding-top: 1.5rem;
  }
}

@media (max-width: 600px) {
  .team-modal {
    padding: 110px 0.65rem 0.65rem;
  }
  .team-modal__inner {
    padding: 0 1rem 1.15rem;
    max-height: calc(100vh - 130px);
  }
  .team-modal__top {
    margin: 0 -1rem;
    padding: 0.85rem 1rem 0.7rem;
  }
  .team-modal__logo {
    width: 50px;
    height: 50px;
  }
  .team-modal__title {
    font-size: 1.1rem;
  }
  .team-photo__img {
    max-height: 50vh;
  }
  .roster {
    grid-template-columns: 1fr;
  }
  .tm-table {
    font-size: 0.82rem;
  }
  .tm-table__th,
  .tm-table__td {
    padding: 0.5rem 0.22rem;
  }
  .tm-table__th--name,
  .tm-table__td--name {
    padding-left: 0.5rem;
    min-width: 120px;
  }
}
</style>
