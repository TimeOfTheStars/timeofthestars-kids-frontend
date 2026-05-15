<template>
  <section class="news section">
    <div class="container">
      <h2 v-reveal class="section-title">Новости</h2>
      <ClientOnly>
        <div v-reveal="{ delay: 150 }" class="news__slider-wrap">
          <Swiper
            :modules="modules"
            :navigation="{ nextEl: '.news__next', prevEl: '.news__prev' }"
            :loop="(newsItems?.length ?? 0) > 1"
            :auto-height="false"
            class="news-swiper"
          >
            <SwiperSlide v-for="(item, i) in newsItems" :key="i">
              <article class="news-card">
                <div class="news-card__media">
                  <img v-if="item.image" :src="item.image" :alt="item.title || 'Новость'" class="news-card__img" />
                  <div v-else class="media-placeholder">Тут может быть картинка</div>
                </div>
                <div class="news-card__body">
                  <div
                    class="news-card__text-wrap"
                    @wheel.stop
                    @touchstart.stop
                    @touchmove.stop
                  >
                    <p class="news-card__text">{{ item.excerpt }}</p>
                  </div>
                  <a :href="item.url" target="_blank" rel="noopener" class="btn btn--small news-card__more">Подробнее</a>
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
  max-width: 1100px;
  margin: 0 auto;
}
.news-swiper {
  padding-bottom: 0.5rem;
}
.news-swiper :deep(.swiper-slide) {
  height: auto;
  display: flex;
}
.news-card {
  background: var(--color-surface);
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  height: 640px;
  transition: border-color 0.25s, box-shadow 0.25s;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05);
}
.news-card:hover {
  border-color: rgba(37, 99, 235, 0.35);
  box-shadow: 0 12px 36px rgba(37, 99, 235, 0.12);
}
.news-card__media {
  background: var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  overflow: hidden;
  height: 240px;
}
.news-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.news-card__body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}
.news-card__text-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 0.5rem;
  touch-action: pan-y;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}
.news-card__text {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.55;
  color: var(--color-text);
  white-space: pre-line;
}
.news-card__more {
  align-self: flex-start;
}
.news__nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.25rem;
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
  border-radius: 9999px;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}
.news__btn:hover:not(:disabled) {
  background: var(--color-border);
}
.news__btn.swiper-button-disabled {
  opacity: 0.4;
  cursor: default;
}
.btn--small {
  padding: 0.55rem 1.1rem;
  font-size: 0.9rem;
}

@media (min-width: 760px) {
  .news-card {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    height: 520px;
  }
  .news-card__media {
    height: 100%;
  }
  .news-card__body {
    padding: 1.75rem 1.75rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .news-card {
    height: 680px;
  }
  .news-card__media {
    height: 220px;
  }
  .news-card__body {
    padding: 1.25rem;
  }
}
</style>
