<template>
  <NuxtLink
    class="g-card"
    :class="{ 'g-card--pending': !game.isFinished }"
    :to="{ path: `/games/${game.id}`, query: tournamentId ? { t: tournamentId } : {} }"
  >
    <div class="g-card__head">
      <span class="g-card__no">Матч №{{ game.matchNo }}</span>
      <span
        class="g-card__status"
        :class="game.isFinished ? 'g-card__status--done' : 'g-card__status--pending'"
      >{{ game.isFinished ? 'Завершён' : 'Не сыгран' }}</span>
    </div>

    <div class="g-card__score-row">
      <div class="g-card__team g-card__team--a">
        <img
          v-if="game.teamA.logo"
          :src="game.teamA.logo"
          alt=""
          class="g-card__logo"
          loading="lazy"
          decoding="async"
        />
        <span class="g-card__team-name">{{ game.teamA.name }}</span>
      </div>

      <div class="g-card__score">
        <span class="g-card__score-value">{{ game.scoreA ?? '—' }}</span>
        <span class="g-card__score-sep">:</span>
        <span class="g-card__score-value">{{ game.scoreB ?? '—' }}</span>
      </div>

      <div class="g-card__team g-card__team--b">
        <img
          v-if="game.teamB.logo"
          :src="game.teamB.logo"
          alt=""
          class="g-card__logo"
          loading="lazy"
          decoding="async"
        />
        <span class="g-card__team-name">{{ game.teamB.name }}</span>
      </div>
    </div>

    <ul class="g-card__meta">
      <li class="g-card__meta-row">
        <Icon name="ph:calendar-blank" class="g-card__meta-icon" />
        <span>{{ formatDay(game.date) }}<template v-if="game.time"> · {{ game.time }}</template></span>
      </li>
      <li v-if="hasShots" class="g-card__meta-row">
        <Icon name="ph:target" class="g-card__meta-icon" />
        <span>Броски {{ game.shotsA }}:{{ game.shotsB }}</span>
      </li>
    </ul>

    <div class="g-card__foot">
      <span class="g-card__more">
        Протокол матча
        <Icon name="ph:arrow-right" />
      </span>
      <span v-if="game.videoUrl" class="g-card__tag">
        <Icon name="ph:play-circle" /> Запись
      </span>
      <span v-if="game.scan" class="g-card__tag">
        <Icon name="ph:file-text" /> Скан
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameListItem } from '~/types'
import { formatDay } from '~/utils/tournaments'

const props = defineProps<{
  game: GameListItem
  tournamentId?: string
}>()

const hasShots = computed(() => props.game.shotsA != null && props.game.shotsB != null)
</script>

<style scoped>
.g-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.15rem 1.25rem 1.15rem 1.5rem;
  background:
    linear-gradient(160deg, rgba(37, 99, 235, 0.12) 0%, rgba(37, 99, 235, 0.03) 45%, rgba(15, 23, 42, 0.02) 100%),
    var(--color-surface);
  border: 1px solid rgba(37, 99, 235, 0.18);
  border-radius: calc(var(--radius) + 4px);
  text-decoration: none;
  color: var(--color-text);
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 32px -16px rgba(37, 99, 235, 0.22);
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}
.g-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: linear-gradient(180deg, var(--color-accent), rgba(37, 99, 235, 0.45));
}
.g-card:hover {
  border-color: rgba(37, 99, 235, 0.45);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18), 0 20px 42px -18px rgba(37, 99, 235, 0.42);
  transform: translateY(-3px);
}
.g-card:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.g-card--pending {
  background:
    linear-gradient(160deg, rgba(148, 163, 184, 0.16) 0%, rgba(148, 163, 184, 0.05) 50%, rgba(15, 23, 42, 0.02) 100%),
    var(--color-surface);
  border-color: rgba(148, 163, 184, 0.25);
}
.g-card--pending::before {
  background: linear-gradient(180deg, #94a3b8, rgba(148, 163, 184, 0.45));
}

.g-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.g-card__no {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}
.g-card__status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.28rem 0.65rem;
  border-radius: 9999px;
}
.g-card__status::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.g-card__status--done {
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
  box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.25);
}
.g-card__status--pending {
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
  box-shadow: inset 0 0 0 1px var(--color-border);
}

.g-card__score-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.6rem;
}
.g-card__team {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
}
.g-card__logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
  flex-shrink: 0;
}
.g-card__team-name {
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.2;
  /* break-word, а не anywhere: min-content колонки остаётся равен самому
     длинному слову, поэтому «Локомотив» не рвётся посреди слова */
  overflow-wrap: break-word;
  hyphens: manual;
}
.g-card__score {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
  padding: 0.25rem 0.7rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-variant-numeric: tabular-nums;
}
.g-card__score-value {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-text);
}
.g-card__score-sep {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.g-card__meta {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.1rem;
}
.g-card__meta-row {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}
.g-card__meta-icon {
  width: 1.05em;
  height: 1.05em;
  color: var(--color-accent);
  flex-shrink: 0;
}

.g-card__foot {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  padding-top: 0.15rem;
}
.g-card__more {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-accent);
}
.g-card:hover .g-card__more {
  text-decoration: underline;
}
.g-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  padding: 0.2rem 0.6rem;
}

@media (max-width: 600px) {
  .g-card {
    padding: 1rem 1rem 1rem 1.25rem;
  }
  .g-card__score-row {
    gap: 0.4rem;
  }
  .g-card__score {
    padding: 0.2rem 0.55rem;
  }
  .g-card__score-value {
    font-size: 1.35rem;
  }
  .g-card__team-name {
    font-size: 0.9rem;
  }
  .g-card__logo {
    width: 30px;
    height: 30px;
  }
}
</style>
