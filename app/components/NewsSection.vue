<template>
  <section class="news section">
    <div class="container">
      <h2 v-reveal class="section-title">Новости</h2>
      <ClientOnly>
        <div v-reveal="{ delay: 150 }" class="news__slider-wrap">
          <Swiper
            :modules="modules"
            :navigation="{ nextEl: '.news__next', prevEl: '.news__prev' }"
            class="news-swiper"
          >
            <SwiperSlide v-for="(item, i) in newsItems" :key="i">
              <article class="news-card">
                <div class="news-card__media">
                  <img v-if="item.image" :src="item.image" :alt="item.title || 'Новость'" class="news-card__img" />
                  <div v-else class="media-placeholder">Тут может быть картинка</div>
                </div>
                <div class="news-card__body">
                  <p class="news-card__text">{{ item.excerpt }}</p>
                  <a :href="item.url" target="_blank" rel="noopener" class="btn btn--small">Подробнее</a>
                </div>
              </article>
            </SwiperSlide>
          </Swiper>
          <div class="news__nav">
            <button type="button" class="news__btn news__prev" aria-label="Назад">‹</button>
            <button type="button" class="news__btn news__next" aria-label="Вперед">›</button>
          </div>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import type { NewsItem } from '~/types'

const modules = [Navigation]

const { data: newsItems } = await useAsyncData<NewsItem[]>(
  'news',
  () => $fetch<NewsItem[]>('https://api.timeofthestars-kids.ru/news'),
  { default: () => [] }
)
</script>

<style scoped>
.news {
  background: var(--color-bg-alt);
  position: relative;
  overflow: hidden;
}
.news::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 500px 350px at 80% 50%, rgba(147, 197, 253, 0.15) 0%, transparent 70%);
  pointer-events: none;
}
.news__slider-wrap {
  position: relative;
}
.news-swiper {
  padding-bottom: 0.5rem;
}
.news-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  min-height: 320px;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.news-card:hover {
  border-color: rgba(37, 99, 235, 0.35);
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
}
.news-card__media {
  aspect-ratio: 16/10;
  background: var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  overflow: hidden;
}
.news-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.news-card__body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.news-card__text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  flex: 1;
  white-space: pre-line;
  max-height: 320px;
  overflow-y: auto;
}
.news__nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.news__btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
}
.news__btn:hover:not(:disabled) {
  background: var(--color-border);
}
.news__btn.swiper-button-disabled {
  opacity: 0.4;
  cursor: default;
}
.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  align-self: flex-start;
}
</style>
