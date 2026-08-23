<template>
  <div class="tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="tabs__item"
      :class="{ 'tabs__item--active': tab.key === model }"
      role="tab"
      :aria-selected="tab.key === model"
      @click="model = tab.key"
    >
      <span>{{ tab.label }}</span>
      <span v-if="tab.count != null" class="tabs__count">{{ tab.count }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface SegmentedTab {
  key: string
  label: string
  count?: number | null
}

defineProps<{
  tabs: SegmentedTab[]
  ariaLabel?: string
}>()

const model = defineModel<string>({ required: true })
</script>

<style scoped>
.tabs {
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
.tabs__item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.55rem 1rem;
  border-radius: calc(var(--radius) - 2px);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.tabs__item:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
}
.tabs__item:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}
.tabs__item--active,
.tabs__item--active:hover {
  background: var(--color-accent);
  color: #fff;
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.25);
}
.tabs__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 0.35rem;
  border-radius: 9999px;
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 700;
}
.tabs__item--active .tabs__count {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

@media (max-width: 600px) {
  .tabs {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }
  .tabs__item {
    scroll-snap-align: start;
    flex: 0 0 auto;
    padding: 0.55rem 0.85rem;
  }
}
</style>
