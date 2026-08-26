<template>
  <div v-if="visible" class="hloader" :class="{ 'hloader--bare': bare }" role="status" aria-live="polite">
    <div class="hloader__rink" aria-hidden="true">
      <span class="hloader__ice"></span>
      <span class="hloader__puck"></span>
      <span class="hloader__puck hloader__puck--ghost"></span>
      <span class="hloader__puck hloader__puck--ghost hloader__puck--ghost-2"></span>
    </div>
    <p class="hloader__text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    text?: string
    /** Не мигаем на быстрых ответах: показываемся, только если загрузка затянулась */
    delay?: number
    /** Без рамки и фона — для случаев, когда лоадер уже внутри карточки */
    bare?: boolean
  }>(),
  {
    text: 'Загружаем данные',
    delay: 300,
    bare: false
  }
)

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  timer = setTimeout(() => {
    visible.value = true
  }, props.delay)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.hloader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
.hloader--bare {
  background: transparent;
  border: 0;
  padding: 1.25rem 0;
}

.hloader__rink {
  position: relative;
  width: 132px;
  height: 34px;
}
/* лёд: тонкая линия, по которой скользит шайба */
.hloader__ice {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, var(--color-border) 15%, var(--color-border) 85%, transparent);
}
.hloader__puck {
  position: absolute;
  bottom: 6px;
  left: 0;
  width: 22px;
  height: 9px;
  border-radius: 9999px;
  background: linear-gradient(180deg, #334155, #0f172a);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.35);
  animation: hloader-slide 1.5s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}
/* «шлейф» — те же шайбы с задержкой и прозрачностью */
.hloader__puck--ghost {
  opacity: 0.28;
  animation-delay: -0.1s;
  box-shadow: none;
}
.hloader__puck--ghost-2 {
  opacity: 0.14;
  animation-delay: -0.2s;
}

@keyframes hloader-slide {
  0% {
    transform: translateX(0) scaleX(1);
  }
  45% {
    transform: translateX(110px) scaleX(1.12);
  }
  50% {
    transform: translateX(110px) scaleX(0.9);
  }
  95% {
    transform: translateX(0) scaleX(1.12);
  }
  100% {
    transform: translateX(0) scaleX(1);
  }
}

.hloader__text {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  text-align: center;
}
.hloader__text::after {
  content: '';
  animation: hloader-dots 1.5s steps(1, end) infinite;
}

@keyframes hloader-dots {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
  100% { content: ''; }
}

@media (prefers-reduced-motion: reduce) {
  .hloader__puck {
    animation: none;
  }
  .hloader__puck--ghost {
    display: none;
  }
  .hloader__text::after {
    content: '...';
    animation: none;
  }
}
</style>
