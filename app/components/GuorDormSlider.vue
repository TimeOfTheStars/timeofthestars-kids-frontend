<template>
  <section class="arena arena--dorm section">
    <div class="container">
      <h2 v-reveal class="section-title">Общежитие ГУОР</h2>
      <div class="arena-swiper-shell">
        <ClientOnly>
          <Swiper
            v-reveal="{ delay: 150 }"
            :effect="'cards'"
            :cards-effect="{ slideShadows: true, rotate: true, perSlideRotate: 2, perSlideOffset: 10 }"
            :grab-cursor="true"
            :loop="dormImages.length > 1"
            :modules="modules"
            :navigation="{ nextEl: '.arena-swiper-nav--next.arena-swiper-nav--dorm', prevEl: '.arena-swiper-nav--prev.arena-swiper-nav--dorm' }"
            :resize-observer="true"
            :observer="true"
            :observe-parents="true"
            class="arena-swiper"
          >
            <SwiperSlide v-for="(img, i) in dormImages" :key="i">
              <img :src="img" :alt="`Общежитие ГУОР ${i + 1}`" class="arena__img" />
            </SwiperSlide>
          </Swiper>
          <button type="button" class="arena-swiper-nav arena-swiper-nav--prev arena-swiper-nav--dorm" aria-label="Назад">
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" class="arena-swiper-nav arena-swiper-nav--next arena-swiper-nav--dorm" aria-label="Вперёд">
            <span aria-hidden="true">›</span>
          </button>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCards, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'
import 'swiper/css/navigation'

const modules = [EffectCards, Navigation]

const dormImages = [
  '/guor/photo_2026-05-01_22-23-07.jpg',
  '/guor/photo_2026-05-01_22-23-50.jpg',
  '/guor/photo_2026-05-01_22-23-54.jpg',
  '/guor/photo_2026-05-01_22-23-59.jpg',
  '/guor/photo_2026-05-01_22-24-03.jpg',
  '/guor/photo_2026-05-01_22-24-07.jpg',
  '/guor/photo_2026-05-01_22-24-11.jpg',
]
</script>

<style scoped>
.arena-swiper-shell {
  position: relative;
  width: 100%;
  max-width: min(640px, 100%);
  margin-inline: auto;
  padding: 1rem clamp(2rem, 5vw, 3.5rem);
  box-sizing: border-box;
  contain: layout style;
}
.arena-swiper {
  width: 100%;
  max-width: none;
  margin: 0;
}
.arena-swiper :deep(.swiper) {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
  overflow: visible;
}
.arena-swiper :deep(.swiper-slide) {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  overflow: hidden;
}
.arena__img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  object-fit: cover;
  display: block;
}
.arena-swiper :deep(.swiper-slide) {
  aspect-ratio: 16/10;
}

.arena-swiper-nav {
  position: absolute;
  top: 50%;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgba(37, 99, 235, 0.35);
  background: rgba(255, 255, 255, 0.92);
  color: rgba(37, 99, 235, 0.85);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  z-index: 5;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.16);
  -webkit-tap-highlight-color: transparent;
}
.arena-swiper-nav span {
  display: inline-block;
  transform: translateY(-2px);
}
.arena-swiper-nav:hover {
  background: #fff;
  color: var(--color-accent);
}
.arena-swiper-nav.swiper-button-disabled {
  opacity: 0.4;
  cursor: default;
  animation: none;
}
.arena-swiper-nav--prev {
  left: 0;
  transform: translateY(-50%);
  animation: arena-nav-pulse-left 1.8s ease-in-out infinite;
}
.arena-swiper-nav--next {
  right: 0;
  transform: translateY(-50%);
  animation: arena-nav-pulse-right 1.8s ease-in-out infinite;
}
@keyframes arena-nav-pulse-left {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-50%) translateX(-6px); }
}
@keyframes arena-nav-pulse-right {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-50%) translateX(6px); }
}
@media (prefers-reduced-motion: reduce) {
  .arena-swiper-nav--prev,
  .arena-swiper-nav--next {
    animation: none;
  }
}

@media (max-width: 640px) {
  .arena-swiper-shell {
    padding: 0.75rem 2.5rem;
    max-width: 100%;
  }
  .arena-swiper-nav {
    width: 38px;
    height: 38px;
    font-size: 1.6rem;
  }
}
</style>
