<template>
  <div class="sbory-tasks-first-slider">
    <ClientOnly>
      <div class="sbory-tasks-first-slider__wrap">
        <Swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="16"
          :loop="true"
          :loop-additional-slides="2"
          :speed="450"
          :pagination="{ clickable: true }"
          :navigation="{ nextEl: '.sbory-tasks-first-slider__next', prevEl: '.sbory-tasks-first-slider__prev' }"
          class="sbory-tasks-first-swiper"
        >
          <SwiperSlide v-for="(src, i) in slides" :key="i">
            <div class="sbory-tasks-first-slider__slide">
              <img
                :src="src"
                :alt="`Тренировки — фото ${i + 1}`"
                class="sbory-tasks-first-slider__img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </SwiperSlide>
        </Swiper>
        <button type="button" class="sbory-tasks-first-slider__btn sbory-tasks-first-slider__prev" aria-label="Назад">
          ‹
        </button>
        <button type="button" class="sbory-tasks-first-slider__btn sbory-tasks-first-slider__next" aria-label="Вперёд">
          ›
        </button>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import s1 from '~/assets/first_slider/5DG3B0KJH9ldt0DjhT8DhT654hV5fxQFi0CiCJcajefUXjozFl4Cv2Fi51usMoxGofrjtkkxwQa3AWsssS4Hdxzb.jpg'
import s2 from '~/assets/first_slider/8-99ZwQBBLEjNRXK28b9WaAWWpQ2UzuT7FGS-FlitXao4_HJFx2F3po7sXiAVky1Ox1w2MpawISXwY99M2SzSq39.jpg'
import s3 from '~/assets/first_slider/9vghxMXuuo-x962oe-WYmJhjIJGovSIYVCquJCp4HR_CtvEx8wFsIbpztPzKrAIAI4fIGdOOh9jVg2VJerDJSEjc.jpg'
import s4 from '~/assets/first_slider/bNuz8X8F060bI7JevmcbkOkOHvYTd2_-tQ2_pPkuifoMquT53oFAZENAJMSJMExiXRh-qcb-GTeDsnWKaN4ZluuX.jpg'
import s5 from '~/assets/first_slider/Cgi4TRI0JL7P3jFjPFlEOh8J4jU3zP2ax--qv2irlUrBTXJwunDIGZM6-6_9GGuC5BbQw_qsBNDsCHZxG7sgOUl-.jpg'
import s6 from '~/assets/first_slider/FXZFqs-3EYkq1VKlApOvXEm9HFlVA0JyFnWFIuKiyw3JIR59twjmoJil5QygZlmzo-FxrPsPWAqP1aI_QnCQKiLE.jpg'
import s7 from '~/assets/first_slider/pIIWxx_Sf-4zxWsZFNOf0qG04ipyFL45XNsGeZ5QgJ30uIz51Nmn0vwivzucbXND-BavuZr4bU-KYdvldYJx4mWE.jpg'
import s8 from '~/assets/first_slider/tGVTavxs_82JZpB_o0WgJQzWMV6I-PAlxheGqRVLzaMVXWMSstxhSVHp2YdI7_RFg8lJjIFznKZ1Rw7uLvLEQpyL.jpg'

const modules = [Navigation, Pagination]

const slides = [s1, s2, s3, s4, s5, s6, s7, s8]
</script>

<style scoped>
.sbory-tasks-first-slider {
  width: 100%;
  margin-top: 1.5rem;
}
.sbory-tasks-first-slider__wrap {
  position: relative;
  margin: 0 auto;
  max-width: 640px;
  padding: 0 2.75rem;
}
@media (max-width: 520px) {
  .sbory-tasks-first-slider__wrap {
    padding: 0 2.25rem;
  }
}
.sbory-tasks-first-swiper {
  padding-bottom: 2.5rem;
}
.sbory-tasks-first-swiper :deep(.swiper-pagination-bullet) {
  background: var(--color-border);
  opacity: 1;
}
.sbory-tasks-first-swiper :deep(.swiper-pagination-bullet-active) {
  background: var(--color-accent);
}
.sbory-tasks-first-slider__slide {
  border-radius: calc(var(--radius) + 4px);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  aspect-ratio: 16 / 10;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
}
@media (max-width: 767px) {
  .sbory-tasks-first-slider__slide {
    aspect-ratio: 4 / 3;
  }
}
@media (max-width: 420px) {
  .sbory-tasks-first-slider__slide {
    aspect-ratio: 3 / 4;
  }
}
.sbory-tasks-first-slider__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.sbory-tasks-first-slider__btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s, opacity 0.2s;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.1);
}
.sbory-tasks-first-slider__btn:hover {
  background: var(--color-bg);
  border-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
}
.sbory-tasks-first-slider__btn.swiper-button-disabled {
  opacity: 0.35;
  pointer-events: none;
}
.sbory-tasks-first-slider__prev {
  left: 0;
}
.sbory-tasks-first-slider__next {
  right: 0;
}
</style>
