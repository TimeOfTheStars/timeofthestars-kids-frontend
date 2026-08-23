<template>
  <div class="goals">
    <div v-if="!goals.length" class="goals__empty">
      <p>Протокол голов не заполнен.</p>
    </div>

    <template v-else>
      <div v-for="group in groups" :key="group.period" class="goals__period">
        <h3 class="goals__period-title">{{ periodLabel(group.period) }}</h3>
        <ul class="goals__list">
          <li
            v-for="(goal, i) in group.items"
            :key="`${group.period}-${i}`"
            class="goals__item"
            :class="isTeamA(goal) ? 'goals__item--a' : 'goals__item--b'"
          >
            <span class="goals__time">{{ goal.time }}</span>
            <span class="goals__team">
              <span class="goals__dot" aria-hidden="true"></span>
              <img
                v-if="teamOf(goal)?.logo"
                :src="teamOf(goal)!.logo!"
                alt=""
                class="goals__logo"
                loading="lazy"
                decoding="async"
              />
              <span class="goals__team-name">{{ teamOf(goal)?.name ?? '—' }}</span>
            </span>
            <span class="goals__body">
              <NuxtLink :to="`/players/${goal.scorer.id}`" class="goals__scorer">
                <span v-if="goal.scorerNumber != null" class="goals__num">{{ goal.scorerNumber }}</span>
                <span class="goals__name">{{ goal.scorer.fullName }}</span>
              </NuxtLink>
              <span v-if="goal.assists?.length" class="goals__assists">
                <Icon name="ph:arrow-elbow-down-right" class="goals__assists-icon" />
                <span class="goals__assists-list">
                  <NuxtLink
                    v-for="(assist, ai) in goal.assists"
                    :key="assist.id"
                    :to="`/players/${assist.id}`"
                    class="goals__assist"
                  >
                    <span v-if="goal.assistNumbers?.[ai] != null" class="goals__num goals__num--small">{{ goal.assistNumbers[ai] }}</span>
                    <span>{{ assist.fullName }}</span>
                  </NuxtLink>
                </span>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GoalEvent, TeamRef } from '~/types'

const props = defineProps<{
  goals: GoalEvent[]
  teamA: TeamRef
  teamB: TeamRef
  periodsCount?: number | null
}>()

/** Порядок событий отдаёт сервер — группируем, не пересортировывая */
const groups = computed(() => {
  const result: { period: number; items: GoalEvent[] }[] = []
  for (const goal of props.goals) {
    const last = result[result.length - 1]
    if (last && last.period === goal.period) last.items.push(goal)
    else result.push({ period: goal.period, items: [goal] })
  }
  return result
})

function isTeamA(goal: GoalEvent): boolean {
  return goal.teamId === props.teamA.id
}

function teamOf(goal: GoalEvent): TeamRef | null {
  if (goal.teamId === props.teamA.id) return props.teamA
  if (goal.teamId === props.teamB.id) return props.teamB
  return null
}

function periodLabel(period: number): string {
  const total = props.periodsCount
  if (total && period > total) return 'Овертайм'
  return `${period} период`
}
</script>

<style scoped>
.goals {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.goals__empty {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem 1.25rem;
  text-align: center;
  color: var(--color-text-muted);
}
.goals__empty p {
  margin: 0;
}
.goals__period {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.goals__period-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}
.goals__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 4px);
  overflow: hidden;
}
.goals__item {
  display: grid;
  grid-template-columns: 58px minmax(140px, 200px) 1fr;
  align-items: start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}
.goals__item:last-child {
  border-bottom: 0;
}
.goals__time {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  padding-top: 0.1rem;
}
.goals__team {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
}
.goals__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--color-text-muted);
}
.goals__item--a .goals__dot {
  background: var(--color-accent);
}
.goals__item--b .goals__dot {
  background: var(--color-accent-red);
}
.goals__logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
}
.goals__team-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text-muted);
  line-height: 1.25;
  overflow-wrap: break-word;
}
.goals__body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
.goals__scorer {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  border-radius: 4px;
}
.goals__scorer:hover .goals__name,
.goals__scorer:focus-visible .goals__name {
  color: var(--color-accent);
  text-decoration: underline;
}
.goals__scorer:focus-visible,
.goals__assist:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.goals__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
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
.goals__num--small {
  min-width: 21px;
  height: 19px;
  font-size: 0.72rem;
}
.goals__name {
  overflow-wrap: break-word;
}
.goals__assists {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.goals__assists-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  margin-top: 0.2rem;
}
.goals__assists-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.15rem 0.7rem;
}
.goals__assist {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  text-decoration: none;
  color: var(--color-text-muted);
  border-radius: 4px;
}
.goals__assist:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

@media (max-width: 600px) {
  .goals__item {
    grid-template-columns: 46px 1fr;
    gap: 0.35rem 0.6rem;
    padding: 0.7rem 0.8rem;
  }
  .goals__body {
    grid-column: 2;
  }
  .goals__time {
    font-size: 0.82rem;
  }
  .goals__team-name {
    font-size: 0.82rem;
  }
}
</style>
