<template>
  <div v-if="open" class="coach-modal" role="dialog" aria-modal="true" :aria-label="coach?.name || 'Тренер'">
    <div class="coach-modal__inner">
      <button type="button" class="coach-modal__close" aria-label="Закрыть" @click="emit('close')">×</button>

      <div v-if="coach" class="coach-modal__layout">
        <div class="coach-modal__left">
          <h3 class="coach-modal__name">{{ coach.name }}</h3>
          <p v-if="coach.description" class="coach-modal__desc">{{ coach.description }}</p>
        </div>
        <div class="coach-modal__right">
          <div class="coach-modal__media">
            <img :src="coach.pic" :alt="coach.name" class="coach-modal__img" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

type Coach = {
  name: string
  pic: string
  description: string
}

const props = defineProps<{
  open: boolean
  coach: Coach | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

let prevBodyOverflow: string | null = null
let prevBodyPaddingRight: string | null = null

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

watch(
  () => props.open,
  (isOpen) => {
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
  },
  { immediate: true }
)
</script>

<style scoped>
.coach-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  z-index: 1000;
  /* keep modal below fixed header */
  padding: 140px 1rem 1rem;
}
.coach-modal__inner {
  position: relative;
  width: min(820px, 100%);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 6px);
  padding: clamp(1.25rem, 2.6vw, 2rem);
  max-height: min(640px, calc(100vh - 160px));
  overflow: auto;
}
.coach-modal__close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  font-size: 28px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.coach-modal__close:hover {
  background: var(--color-border);
}
.coach-modal__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: clamp(1rem, 3vw, 2rem);
  align-items: start;
}
.coach-modal__left {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.coach-modal__name {
  margin: 0 0 0.75rem;
  font-size: clamp(1.25rem, 2vw, 1.6rem);
  font-weight: 900;
  color: var(--color-text);
}
.coach-modal__desc {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
  white-space: pre-line;
  overflow: auto;
  padding-right: 0.35rem;
}
.coach-modal__media {
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: calc(var(--radius) + 6px);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
}
.coach-modal__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 20%;
  display: block;
}

@media (max-width: 860px) {
  .coach-modal__layout {
    grid-template-columns: 1fr;
  }
  .coach-modal__right {
    order: 1;
  }
  .coach-modal__left {
    order: 2;
  }
  .coach-modal__media {
    max-width: 420px;
    margin: 0 auto;
  }
  .coach-modal__inner {
    max-height: calc(100vh - 160px);
    overflow: auto;
  }
  .coach-modal__desc {
    overflow: visible;
  }
}
</style>

