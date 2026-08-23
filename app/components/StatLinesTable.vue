<template>
  <div class="slt">
    <h3 v-if="title" class="slt__title">
      {{ title }}
      <span class="slt__title-count">{{ rows.length }}</span>
    </h3>

    <div v-if="!rows.length" class="slt__empty">
      <p>{{ emptyText }}</p>
    </div>

    <template v-else>
      <div class="slt__scroll">
        <table class="slt__table">
          <caption v-if="title" class="sr-only">{{ title }}</caption>
          <thead>
            <tr>
              <th v-if="showRank" scope="col" class="slt__th slt__th--rank">#</th>
              <th scope="col" class="slt__th slt__th--num" title="Игровой номер">№</th>
              <th scope="col" class="slt__th slt__th--player">Игрок</th>
              <th v-if="showTeam" scope="col" class="slt__th slt__th--team">Команда</th>
              <th v-if="showGames" scope="col" class="slt__th" title="Игры">И</th>
              <template v-if="variant === 'goalie'">
                <th scope="col" class="slt__th" title="Пропущено шайб">ПШ</th>
                <th scope="col" class="slt__th" title="Отражённые броски">ОБ</th>
                <th scope="col" class="slt__th" title="Процент отражённых бросков">%</th>
                <th scope="col" class="slt__th" title="Время в воротах">Мин</th>
              </template>
              <template v-else>
                <th scope="col" class="slt__th" title="Голы">Г</th>
                <th scope="col" class="slt__th" title="Передачи">П</th>
                <th scope="col" class="slt__th slt__th--points" title="Очки (голы + передачи)">О</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows" :key="row.player.id" class="slt__row">
              <td v-if="showRank" class="slt__td slt__td--rank">
                <span v-if="MEDALS[i]" aria-hidden="true">{{ MEDALS[i] }}</span>
                <span v-else>{{ i + 1 }}</span>
              </td>
              <td class="slt__td slt__td--num">{{ row.number ?? '—' }}</td>
              <td class="slt__td slt__td--player">
                <NuxtLink :to="`/players/${row.player.id}`" class="slt__player">
                  <span class="slt__player-name">{{ row.player.fullName }}</span>
                  <span v-if="showTeam && row.team?.name" class="slt__player-team">{{ row.team.name }}</span>
                  <span v-if="row.player.position" class="slt__player-pos">{{ row.player.position }}</span>
                </NuxtLink>
              </td>
              <td v-if="showTeam" class="slt__td slt__td--team">
                <span class="slt__team">
                  <img
                    v-if="row.team?.logo"
                    :src="row.team.logo"
                    alt=""
                    class="slt__team-logo"
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{{ row.team?.name }}</span>
                </span>
              </td>
              <td v-if="showGames" class="slt__td">{{ row.games }}</td>
              <template v-if="variant === 'goalie'">
                <td class="slt__td">{{ dash(row.goalsAgainst) }}</td>
                <td class="slt__td">{{ dash(row.saves) }}</td>
                <td class="slt__td">{{ savePct(row) }}</td>
                <td class="slt__td">{{ dash(row.minutesPlayed) }}</td>
              </template>
              <template v-else>
                <td class="slt__td">{{ row.goals }}</td>
                <td class="slt__td">{{ row.assists }}</td>
                <td class="slt__td slt__td--points">{{ row.points }}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="variant === 'goalie' && showNote" class="slt__note">
        ПШ и ОБ считаются по табло матча: если броски не записаны — стоит прочерк.
        «Мин» — время в воротах по регламенту турнира, а не фактическое время на льду.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { StatLine } from '~/types'

withDefaults(
  defineProps<{
    rows: StatLine[]
    variant?: 'field' | 'goalie'
    title?: string
    showTeam?: boolean
    showRank?: boolean
    showGames?: boolean
    showNote?: boolean
    emptyText?: string
  }>(),
  {
    variant: 'field',
    showTeam: false,
    showRank: false,
    showGames: true,
    showNote: true,
    emptyText: 'Пока нет данных.'
  }
)

const MEDALS = ['🥇', '🥈', '🥉']

function dash(value: number | null | undefined): string {
  return value == null ? '—' : String(value)
}

function savePct(row: StatLine): string {
  const saves = row.saves
  const against = row.goalsAgainst
  if (saves == null || against == null) return '—'
  const shots = saves + against
  if (!shots) return '—'
  return `${Math.round((saves / shots) * 100)}%`
}
</script>

<style scoped>
.slt {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.slt__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.slt__title-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 0.45rem;
  border-radius: 9999px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
}
.slt__empty {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.25rem;
  text-align: center;
  color: var(--color-text-muted);
}
.slt__empty p {
  margin: 0;
}
.slt__scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 4px);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 32px -18px rgba(37, 99, 235, 0.22);
}
.slt__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}
.slt__th {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  padding: 0.7rem 0.4rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
  background: var(--color-surface);
}
.slt__th--rank {
  width: 40px;
}
.slt__th--num {
  width: 42px;
}
.slt__th--player {
  text-align: left;
  padding-left: 0.9rem;
  min-width: 165px;
}
.slt__th--team {
  text-align: left;
  min-width: 130px;
}
.slt__td {
  text-align: center;
  padding: 0.62rem 0.4rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.slt__row:last-child .slt__td {
  border-bottom: 0;
}
.slt__td--rank {
  font-weight: 700;
  color: var(--color-text-muted);
}
.slt__td--num {
  font-weight: 700;
  color: var(--color-text-muted);
}
.slt__td--player {
  text-align: left;
  padding-left: 0.9rem;
  white-space: normal;
}
.slt__player {
  display: inline-flex;
  flex-direction: column;
  gap: 0.1rem;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 600;
  border-radius: 4px;
}
.slt__player:hover .slt__player-name,
.slt__player:focus-visible .slt__player-name {
  color: var(--color-accent);
  text-decoration: underline;
}
.slt__player:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.slt__player-name {
  line-height: 1.25;
}
.slt__player-pos {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
}
/* Дубль команды под именем: на узком экране колонка «Команда» скрывается,
   иначе она выдавливает за край очки */
.slt__player-team {
  display: none;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
}
.slt__td--team {
  text-align: left;
  white-space: normal;
}
.slt__team {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.slt__team-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}
.slt__td--points {
  font-weight: 700;
  color: var(--color-accent);
}
.slt__note {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

@media (max-width: 600px) {
  .slt__table {
    font-size: 0.85rem;
  }
  .slt__th,
  .slt__td {
    padding: 0.5rem 0.2rem;
  }
  .slt__th--player,
  .slt__td--player {
    padding-left: 0.55rem;
    min-width: 118px;
  }
  .slt__th--rank {
    width: 32px;
  }
  .slt__th--num {
    width: 34px;
  }
  .slt__th--team,
  .slt__td--team {
    display: none;
  }
  .slt__player-team {
    display: block;
  }
}
</style>
