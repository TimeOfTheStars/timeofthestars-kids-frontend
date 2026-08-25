<template>
  <Transition name="modal">
    <div
      v-if="photo"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="photo.title ? `Фотография: ${photo.title}` : 'Фотография'"
      @click.self="closePhoto"
    >
      <div class="lightbox__inner">
        <button
          type="button"
          class="lightbox__close"
          aria-label="Закрыть"
          @click="closePhoto"
        >×</button>
        <img
          :src="photo.src"
          :alt="photo.title ?? ''"
          class="lightbox__img"
          @click.stop
        />
        <p v-if="photo.title" class="lightbox__caption">{{ photo.title }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const { photo, closePhoto } = useLightbox()
const route = useRoute()

function onKeydown(e: KeyboardEvent) {
  if (!photo.value) return
  if (e.key === 'Escape') closePhoto()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

watch(() => route.fullPath, closePhoto)

/*
 * Блокировка скролла: сохраняем то, что стоит сейчас, и возвращаем при закрытии.
 * Если лайтбокс открыт поверх модалки команды, вернётся её 'hidden', а не пустая строка.
 */
let prevOverflow: string | null = null
let prevPaddingRight: string | null = null

watch(
  () => photo.value !== null,
  isOpen => {
    if (typeof document === 'undefined') return
    const body = document.body

    if (isOpen) {
      if (prevOverflow === null) prevOverflow = body.style.overflow
      if (prevPaddingRight === null) prevPaddingRight = body.style.paddingRight

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      body.style.overflow = 'hidden'
      body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : prevPaddingRight || ''
      return
    }

    body.style.overflow = prevOverflow ?? ''
    body.style.paddingRight = prevPaddingRight ?? ''
    prevOverflow = null
    prevPaddingRight = null
  }
)

onUnmounted(() => {
  if (typeof document === 'undefined') return
  if (prevOverflow === null) return
  document.body.style.overflow = prevOverflow
  document.body.style.paddingRight = prevPaddingRight ?? ''
})
</script>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 400;
  padding: 1rem;
}
.lightbox__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  max-width: 100%;
  max-height: 100%;
}
.lightbox__img {
  display: block;
  max-width: min(1400px, 100%);
  max-height: calc(100vh - 6rem);
  object-fit: contain;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.04);
}
.lightbox__caption {
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.92rem;
  text-align: center;
}
.lightbox__close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 9999px;
  font-size: 1.7rem;
  line-height: 1;
  color: #fff;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
}
.lightbox__close:hover {
  background: rgba(255, 255, 255, 0.24);
}
.lightbox__close:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

@media (max-width: 600px) {
  .lightbox {
    padding: 0.5rem;
  }
  .lightbox__img {
    max-height: calc(100vh - 7rem);
  }
  .lightbox__close {
    top: 0.6rem;
    right: 0.6rem;
    width: 40px;
    height: 40px;
  }
}
</style>
