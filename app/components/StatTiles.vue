<template>
  <ul class="tiles">
    <li v-for="item in items" :key="item.label" class="tiles__item">
      <span class="tiles__value">{{ item.value }}</span>
      <span class="tiles__label">{{ item.label }}</span>
      <span v-if="item.hint" class="tiles__hint">{{ item.hint }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
export interface StatTile {
  label: string
  value: string | number
  hint?: string
}

defineProps<{
  items: StatTile[]
}>()
</script>

<style scoped>
.tiles {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
  gap: 0.75rem;
}
.tiles__item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.85rem 0.9rem;
  background:
    linear-gradient(160deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.02) 60%),
    var(--color-surface);
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: calc(var(--radius) + 2px);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
.tiles__value {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}
.tiles__label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}
.tiles__hint {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  line-height: 1.35;
}

@media (max-width: 600px) {
  .tiles {
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 0.55rem;
  }
  .tiles__item {
    padding: 0.7rem 0.65rem;
  }
  .tiles__value {
    font-size: 1.3rem;
  }
  .tiles__label {
    font-size: 0.68rem;
  }
}
</style>
