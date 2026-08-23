<template>
  <div class="standings">
    <div class="standings__scroll">
      <table class="standings__table">
        <caption class="sr-only">Турнирная таблица</caption>
        <thead>
          <tr>
            <th scope="col" class="standings__th standings__th--place">#</th>
            <th scope="col" class="standings__th standings__th--team">Команда</th>
            <th scope="col" class="standings__th" title="Игры">И</th>
            <th scope="col" class="standings__th" title="Победы">В</th>
            <th scope="col" class="standings__th" title="Ничьи">Н</th>
            <th scope="col" class="standings__th" title="Поражения">П</th>
            <th scope="col" class="standings__th standings__th--goals" title="Забито : пропущено">Шайбы</th>
            <th scope="col" class="standings__th standings__th--diff" title="Разница шайб">+/−</th>
            <th scope="col" class="standings__th standings__th--points" title="Очки">О</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.team.id"
            class="standings__row"
            :class="[`standings__row--place-${row.place <= 3 ? row.place : 'rest'}`]"
          >
            <td class="standings__td standings__td--place">
              <span v-if="medal(row)" class="standings__medal" aria-hidden="true">{{ medal(row) }}</span>
              <span v-else>{{ row.place }}</span>
              <span v-if="medal(row)" class="sr-only">{{ row.place }} место</span>
            </td>
            <td class="standings__td standings__td--team">
              <div class="standings__team">
                <img
                  v-if="row.team.logo"
                  :src="row.team.logo"
                  :alt="''"
                  class="standings__logo"
                  loading="lazy"
                  decoding="async"
                />
                <span class="standings__team-name">{{ row.team.name }}</span>
              </div>
            </td>
            <td class="standings__td">{{ row.games }}</td>
            <td class="standings__td">{{ row.wins }}</td>
            <td class="standings__td">{{ row.draws }}</td>
            <td class="standings__td">{{ row.losses }}</td>
            <td class="standings__td standings__td--goals">{{ row.goalsFor }}:{{ row.goalsAgainst }}</td>
            <td class="standings__td standings__td--diff">{{ row.goalDiff > 0 ? '+' : '' }}{{ row.goalDiff }}</td>
            <td class="standings__td standings__td--points">{{ row.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="standings__legend">
      И — игры, В — победы, Н — ничьи, П — поражения, О — очки. Победа — 2 очка, ничья — 1.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { StandingRow } from '~/types'

defineProps<{
  rows: StandingRow[]
}>()

const MEDALS = ['🥇', '🥈', '🥉']

/** Медаль только у команд, которые уже играли: иначе «бронза» достаётся нулевой строке */
function medal(row: StandingRow): string {
  if (!row.games) return ''
  return MEDALS[row.place - 1] ?? ''
}
</script>

<style scoped>
.standings {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.standings__scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 4px);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 32px -18px rgba(37, 99, 235, 0.22);
}
.standings__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  min-width: 460px;
}
.standings__th {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  padding: 0.75rem 0.4rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}
.standings__th--place {
  width: 44px;
}
.standings__th--team {
  text-align: left;
  padding-left: 0.9rem;
  min-width: 150px;
}
.standings__th--goals {
  min-width: 62px;
}
.standings__td {
  text-align: center;
  padding: 0.7rem 0.4rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}
.standings__row:last-child .standings__td {
  border-bottom: 0;
}
.standings__td--place {
  font-weight: 700;
  color: var(--color-text-muted);
  border-left: 3px solid transparent;
}
.standings__row--place-1 .standings__td--place { border-left-color: #eab308; }
.standings__row--place-2 .standings__td--place { border-left-color: #94a3b8; }
.standings__row--place-3 .standings__td--place { border-left-color: #d97706; }
.standings__medal {
  font-size: 1.1rem;
  line-height: 1;
}
.standings__td--team {
  text-align: left;
  padding-left: 0.9rem;
}
.standings__team {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
.standings__logo {
  width: 26px;
  height: 26px;
  object-fit: contain;
  flex-shrink: 0;
}
.standings__team-name {
  font-weight: 600;
  line-height: 1.25;
}
.standings__td--goals {
  white-space: nowrap;
  color: var(--color-text-muted);
}
.standings__td--diff {
  color: var(--color-text-muted);
}
.standings__td--points {
  font-weight: 700;
  color: var(--color-accent);
  font-size: 1.05rem;
}
.standings__legend {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.45;
}

@media (max-width: 600px) {
  .standings__table {
    font-size: 0.85rem;
    min-width: 0;
  }
  .standings__th,
  .standings__td {
    padding: 0.55rem 0.18rem;
  }
  .standings__th--place {
    width: 32px;
  }
  .standings__th--team,
  .standings__td--team {
    padding-left: 0.45rem;
    min-width: 0;
  }
  .standings__th--goals {
    min-width: 48px;
  }
  .standings__th--diff,
  .standings__td--diff {
    display: none;
  }
  .standings__logo {
    width: 20px;
    height: 20px;
  }
  .standings__team-name {
    font-size: 0.8rem;
  }
  .standings__medal {
    font-size: 0.95rem;
  }
  .standings__td--points {
    font-size: 0.95rem;
  }
}
</style>
