<template>
  <section class="arena section">
    <div class="container">
      <h2 v-reveal class="section-title">Арена ГУОР</h2>
      <ClientOnly>
        <Swiper
          v-reveal="{ delay: 150 }"
          :effect="'cards'"
          :grab-cursor="true"
          :modules="modules"
          class="arena-swiper"
        >
          <SwiperSlide v-for="(img, i) in guorImages" :key="i">
            <img :src="img" :alt="`Арена ГУОР ${i + 1}`" class="arena__img" />
          </SwiperSlide>
        </Swiper>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'

const modules = [EffectCards]

const guorImages = [
  '/guor/photo_2026-02-01_13-16-32.jpg',
  '/guor/photo_2026-02-01_13-17-22.jpg',
  '/guor/photo_2026-02-01_13-17-26.jpg',
  '/guor/photo_2026-02-01_13-17-29.jpg',
  '/guor/photo_2026-02-01_13-17-33.jpg',
  '/guor/photo_2026-02-01_13-17-37.jpg',
  '/guor/photo_2026-02-01_13-17-41.jpg',
  '/guor/photo_2026-02-01_13-17-45.jpg'
]
</script>

<style scoped>
.arena-swiper {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem 0;
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
  object-fit: cover;
  display: block;
}
.arena-swiper :deep(.swiper-slide) {
  aspect-ratio: 16/10;
}
</style>
