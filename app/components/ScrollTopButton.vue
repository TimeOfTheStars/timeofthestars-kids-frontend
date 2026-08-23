<template>
  <Transition name="scroll-top">
    <button
      v-if="visible"
      type="button"
      class="scroll-top"
      aria-label="Наверх"
      title="Наверх"
      @click="toTop"
    >
      <Icon name="ph:arrow-up" class="scroll-top__icon" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const SHOW_AFTER = 600

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > SHOW_AFTER
}

function toTop() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.scroll-top {
  position: fixed;
  right: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  z-index: 90;
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid rgba(37, 99, 235, 0.35);
  border-radius: 9999px;
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 20px -6px rgba(37, 99, 235, 0.6), 0 2px 6px rgba(15, 23, 42, 0.18);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.scroll-top:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 26px -8px rgba(37, 99, 235, 0.7), 0 2px 6px rgba(15, 23, 42, 0.2);
}
.scroll-top:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}
.scroll-top__icon {
  width: 1.4em;
  height: 1.4em;
}

.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 600px) {
  .scroll-top {
    right: 0.75rem;
    bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
    width: 44px;
    height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-top,
  .scroll-top-enter-active,
  .scroll-top-leave-active {
    transition: none;
  }
  .scroll-top:hover {
    transform: none;
  }
}
</style>
