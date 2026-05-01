<template>
  <section class="arena arena--dorm section">
    <div class="container">
      <h2 v-reveal class="section-title">Общежитие ГУОР</h2>
      <div class="arena-swiper-shell">
        <ClientOnly>
          <Swiper
            v-reveal="{ delay: 150 }"
            :effect="'cards'"
            :cards-effect="{ slideShadows: true, rotate: true, perSlideRotate: 2, perSlideOffset: 6 }"
            :grab-cursor="true"
            :modules="modules"
            :resize-observer="true"
            :observer="true"
            :observe-parents="true"
            class="arena-swiper"
          >
            <SwiperSlide v-for="(img, i) in dormImages" :key="i">
              <img :src="img" :alt="`Общежитие ГУОР ${i + 1}`" class="arena__img" />
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'

const modules = [EffectCards]

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
  width: 100%;
  max-width: min(420px, 100%);
  margin-inline: auto;
  overflow: hidden;
  box-sizing: border-box;
  contain: layout style;
}
.arena-swiper {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 1rem 0;
}
.arena-swiper :deep(.swiper) {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;
}
.arena-swiper :deep(.swiper.swiper-cards) {
  overflow: hidden;
}
.arena-swiper :deep(.swiper-slide) {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
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
</style>
