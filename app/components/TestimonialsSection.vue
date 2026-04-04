<template>
  <section class="testimonials section">
    <div class="container">
      <h2 v-reveal class="section-title">Отзывы о нас</h2>
      <ClientOnly>
        <div v-reveal="{ delay: 150 }" class="testimonials__slider-wrap">
          <Swiper
            :modules="modules"
            :navigation="{ nextEl: '.testimonials__next', prevEl: '.testimonials__prev' }"
            :loop="items.length > 1"
            :auto-height="false"
            :allow-touch-move="false"
            :touch-start-prevent-default="false"
            :no-swiping="true"
            :nested="true"
            :slides-per-view="1"
            :space-between="16"
            class="testimonials-swiper"
          >
            <SwiperSlide v-for="(item, i) in items" :key="i">
              <article class="testimonial-card">
                <img
                  class="testimonial-card__avatar"
                  :src="item.pic || '/reviews/default.jpg'"
                  :alt="`Фото автора отзыва: ${item.author}`"
                  loading="lazy"
                >
                <div class="testimonial-card__content">
                  <p class="testimonial-card__author">{{ item.author }}</p>
                  <div
                    class="testimonial-card__text-wrap swiper-no-swiping"
                    @wheel.stop
                    @touchstart.stop
                    @touchmove.stop
                  >
                    <template v-if="isExpanded(i)">
                      <p
                        class="testimonial-card__text testimonial-card__text--expanded"
                      >
                        {{ item.text }}
                      </p>
                      <button
                        type="button"
                        class="testimonial-card__toggle"
                        @click="toggleExpanded(i)"
                      >
                        Свернуть
                      </button>
                    </template>
                    <p v-else class="testimonial-card__text">
                      {{ getPreviewText(item.text) }}
                      <button
                        v-if="isLong(item.text)"
                        type="button"
                        class="testimonial-card__toggle testimonial-card__toggle--inline"
                        @click="toggleExpanded(i)"
                      >
                        Показать полностью
                      </button>
                    </p>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          </Swiper>
          <div class="testimonials__nav" aria-hidden="true">
            <button type="button" class="testimonials__btn testimonials__prev" aria-label="Назад">‹</button>
            <button type="button" class="testimonials__btn testimonials__next" aria-label="Вперед">›</button>
          </div>
        </div>
      </ClientOnly>
      <div v-reveal="{ delay: 350 }" class="testimonials__action">
        <a
          :href="reviewsTopicUrl"
          class="btn"
          target="_blank"
          rel="noopener noreferrer"
        >Все отзывы</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import type { Review } from '~/types'
import reviewsData from '~~/public/reviews.json'

const modules = [Navigation]

const reviewsTopicUrl = 'https://vk.com/topic-125696800_56616420'
const PREVIEW_LIMIT = 420
const expandedItems = ref<Record<number, boolean>>({})

const items = computed<Review[]>(() => reviewsData.reviews ?? [])

const normalizeText = (text: string) => text.replace(/\s+/g, ' ').trim()

const isLong = (text: string) => normalizeText(text).length > PREVIEW_LIMIT

const getPreviewText = (text: string) => {
  const normalized = normalizeText(text)
  if (normalized.length <= PREVIEW_LIMIT) {
    return normalized
  }

  return `${normalized.slice(0, PREVIEW_LIMIT).trimEnd()}...`
}

const isExpanded = (index: number) => Boolean(expandedItems.value[index])

const toggleExpanded = (index: number) => {
  expandedItems.value[index] = !expandedItems.value[index]
}
</script>

<style scoped>
.testimonials {
  background: var(--color-bg);
  position: relative;
  overflow: hidden;
}
.testimonials::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 600px 380px at 20% 40%, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
  pointer-events: none;
}
.testimonials__slider-wrap {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
}
.testimonials-swiper {
  width: 100%;
  padding-bottom: 0.5rem;
}
.testimonial-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.75rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: border-color 0.25s, box-shadow 0.25s;
  min-height: 22rem;
}
.testimonial-card__avatar {
  width: 120px;
  height: 120px;
  border-radius: 999px;
  object-fit: cover;
  object-position: center;
  border: 4px solid rgba(37, 99, 235, 0.16);
  flex-shrink: 0;
}
.testimonial-card__content {
  width: 100%;
  min-width: 0;
}
.testimonial-card__text-wrap {
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 12.5rem;
  overflow-y: auto;
  padding-right: 0.25rem;
  touch-action: pan-y;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}
.testimonial-card:hover {
  border-color: rgba(37, 99, 235, 0.25);
  box-shadow: 0 8px 28px rgba(37, 99, 235, 0.08);
}
.testimonial-card__text {
  margin: 0;
  font-size: clamp(1rem, 1vw, 1.05rem);
  line-height: 1.45;
  color: var(--color-text);
  white-space: normal;
}
.testimonial-card__text--expanded {
  white-space: pre-line;
}
.testimonial-card__toggle {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-accent);
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  white-space: nowrap;
}
.testimonial-card__toggle--inline {
  margin-top: 0;
  margin-left: 0.4rem;
}
.testimonial-card__author {
  margin: 0 0 0.75rem;
  font-weight: 600;
  color: #ef4444;
  font-size: clamp(1.35rem, 1.6vw, 1.65rem);
  min-height: 3.4rem;
}
.testimonials__nav {
  position: absolute;
  inset: 50% 0 auto;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 5;
}
.testimonials__btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  color: rgba(37, 99, 235, 0.36);
  border-radius: 999px;
  cursor: pointer;
  font-size: 2.8rem;
  line-height: 1;
  pointer-events: auto;
  z-index: 6;
}
.testimonials__prev {
  left: -104px;
}
.testimonials__next {
  right: -104px;
}
.testimonials__btn:hover:not(:disabled) {
  color: rgba(37, 99, 235, 0.72);
  border-color: rgba(37, 99, 235, 0.28);
}

@media (max-width: 960px) {
  .testimonial-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.1rem;
    padding: 1.25rem;
    border-radius: 1.5rem;
    min-height: 0;
  }

  .testimonial-card__avatar {
    width: 108px;
    height: 108px;
    border-width: 3px;
  }

  .testimonial-card__author {
    font-size: 2.05rem;
    line-height: 1.08;
    margin-bottom: 0.65rem;
    min-height: 0;
  }

  .testimonial-card__text-wrap {
    height: 13.5rem;
  }

  .testimonial-card__text {
    font-size: 1.05rem;
    line-height: 1.45;
  }

  .testimonial-card__toggle {
    font-size: 0.96rem;
  }

  .testimonials__prev {
    left: -16px;
  }

  .testimonials__next {
    right: -16px;
  }

  .testimonials__btn {
    width: 36px;
    height: 36px;
    font-size: 1.7rem;
    background: rgba(255, 255, 255, 0.96);
    border-color: rgba(37, 99, 235, 0.35);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.18);
  }
}
.testimonials__btn.swiper-button-disabled {
  opacity: 0.4;
  cursor: default;
}
.testimonials__action {
  display: flex;
  justify-content: center;
  margin-top: 1.75rem;
  position: relative;
  z-index: 1;
}
</style>
