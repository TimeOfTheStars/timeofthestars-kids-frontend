<template>
  <nav class="stabs" :aria-label="ariaLabel">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="stabs__item"
      :class="{ 'stabs__item--active': isActive(item.to) }"
      :aria-current="isActive(item.to) ? 'page' : undefined"
    >{{ item.label }}</NuxtLink>
  </nav>
</template>

<script setup lang="ts">
export interface SectionTab {
  label: string
  to: string
}

const props = defineProps<{
  items: SectionTab[]
  ariaLabel?: string
}>()

const route = useRoute()

/** Активен и сам раздел, и его внутренние страницы: /players/{id} подсвечивает «Игроков» */
function isActive(to: string): boolean {
  return route.path === to || route.path.startsWith(`${to}/`)
}

void props
</script>

<style scoped>
.stabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  width: fit-content;
  max-width: 100%;
  flex-wrap: wrap;
}
.stabs__item {
  display: inline-flex;
  align-items: center;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.55rem 1rem;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.stabs__item:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
}
.stabs__item:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}
.stabs__item--active,
.stabs__item--active:hover {
  background: var(--color-accent);
  color: #fff;
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.25);
}

@media (max-width: 600px) {
  .stabs {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .stabs::-webkit-scrollbar {
    display: none;
  }
  .stabs__item {
    scroll-snap-align: start;
    flex: 0 0 auto;
    padding: 0.55rem 0.85rem;
  }
}
</style>
