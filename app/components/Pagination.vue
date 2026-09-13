<template>
  <nav v-if="totalPages > 1" class="pager" :aria-label="ariaLabel">
    <button
      type="button"
      class="pager__step"
      :disabled="page <= 1"
      aria-label="Предыдущая страница"
      @click="go(page - 1)"
    >
      <Icon name="ph:caret-left" />
      <span class="pager__step-text">Назад</span>
    </button>

    <ul class="pager__pages">
      <li v-for="(item, i) in items" :key="`${item}-${i}`">
        <span v-if="item === GAP" class="pager__gap" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          class="pager__page"
          :class="{ 'pager__page--active': item === page }"
          :aria-current="item === page ? 'page' : undefined"
          :aria-label="`Страница ${item}`"
          @click="go(item as number)"
        >{{ item }}</button>
      </li>
    </ul>

    <span class="pager__counter">{{ page }} из {{ totalPages }}</span>

    <button
      type="button"
      class="pager__step"
      :disabled="page >= totalPages"
      aria-label="Следующая страница"
      @click="go(page + 1)"
    >
      <span class="pager__step-text">Вперёд</span>
      <Icon name="ph:caret-right" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalPages: number
  ariaLabel?: string
}>()

const page = defineModel<number>({ required: true })

const GAP = '…'

/** Первая, последняя, текущая и соседние; между ними — многоточие */
const items = computed<(number | string)[]>(() => {
  const total = props.totalPages
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const around = new Set([1, total, page.value, page.value - 1, page.value + 1])
  if (page.value <= 3) [2, 3, 4].forEach(n => around.add(n))
  if (page.value >= total - 2) [total - 3, total - 2, total - 1].forEach(n => around.add(n))

  const pages = [...around].filter(n => n >= 1 && n <= total).sort((a, b) => a - b)
  const result: (number | string)[] = []
  let prev = 0
  for (const n of pages) {
    if (prev && n - prev > 1) result.push(GAP)
    result.push(n)
    prev = n
  }
  return result
})

function go(next: number) {
  const target = Math.min(Math.max(next, 1), props.totalPages)
  if (target === page.value) return
  page.value = target
}
</script>

<style scoped>
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
}
.pager__step {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.5rem 0.85rem;
  border-radius: calc(var(--radius) - 2px);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.pager__step:hover:not(:disabled) {
  background: var(--color-bg-alt);
  color: var(--color-text);
  border-color: var(--color-accent);
}
.pager__step:disabled {
  opacity: 0.45;
  cursor: default;
}
.pager__step:focus-visible,
.pager__page:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

.pager__pages {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.pager__page {
  min-width: 38px;
  height: 38px;
  padding: 0 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: calc(var(--radius) - 2px);
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.pager__page:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}
.pager__page--active,
.pager__page--active:hover {
  background: var(--color-accent);
  color: #fff;
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.25);
}
.pager__gap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 38px;
  color: var(--color-text-muted);
}

/* Счётчик — запасной вариант для узкого экрана, где номера скрыты */
.pager__counter {
  display: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 600px) {
  .pager {
    width: 100%;
    justify-content: space-between;
    gap: 0.4rem;
  }
  .pager__pages {
    display: none;
  }
  .pager__counter {
    display: inline-flex;
  }
  .pager__step {
    padding: 0.5rem 0.7rem;
  }
}
</style>
