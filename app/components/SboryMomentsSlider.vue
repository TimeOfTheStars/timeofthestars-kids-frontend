<template>
  <div class="sbory-moments-slider">
    <ClientOnly>
      <div class="sbory-moments-slider__wrap">
        <Swiper
          :modules="modules"
          :slides-per-view="1.08"
          :space-between="12"
          :centered-slides="true"
          :pagination="{ clickable: true }"
          :navigation="{ nextEl: '.sbory-moments-slider__next', prevEl: '.sbory-moments-slider__prev' }"
          :breakpoints="{
            640: { slidesPerView: 1.2, spaceBetween: 14 },
            900: { slidesPerView: 2, spaceBetween: 16, centeredSlides: false },
          }"
          class="sbory-moments-swiper"
        >
          <SwiperSlide v-for="(src, i) in momentImages" :key="i">
            <div class="sbory-moments-slider__slide">
              <img :src="src" :alt="`Летние сборы — фото ${i + 1}`" class="sbory-moments-slider__img" loading="lazy" decoding="async" />
            </div>
          </SwiperSlide>
        </Swiper>
        <button type="button" class="sbory-moments-slider__btn sbory-moments-slider__prev" aria-label="Назад">
          ‹
        </button>
        <button type="button" class="sbory-moments-slider__btn sbory-moments-slider__next" aria-label="Вперёд">
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

import leto1 from '~/assets/leto_sbory/0u28YrbD5bHTSUlHP-5Hf9rYYVGNhAqnzEADdPPz5lml2KtI8Q3AL824Hq9NnUwa1G7I28qu_LKU6CnpDWbckARa.jpg'
import leto2 from '~/assets/leto_sbory/eSDOMk5ZKYje9IOc-zaJ18KWWiYnWpZWV62j2ckQPdch8wlv5g-2m_dYvSR9RNTCEsHdCOResjlH814UUPsGxoG3.jpg'
import leto3 from '~/assets/leto_sbory/F7XBzll_d6gOzfu3_P_jKX7XVV-uyebJZbKFLQOoBKWlRS7DtNojMd4R3lMzXdQptxASprnOfhxUC-7enX92RId6.jpg'
import leto4 from '~/assets/leto_sbory/ouW1WHLqtyni6xdguiTHlfdIacATSq18t_L7g_D5JX2DvNtaOlXBJ_vmSMgr2NKSNPH3BNGwt0YHK7eQivtAWPmq.jpg'
import leto5 from '~/assets/leto_sbory/RjtCRFCjYxZXWYTT_9jUcxdWSzvYLK9FQjGPUH_Sc-cD9idOiItV3YisKOQcv1t5wz5vHtiT8k3n1jqQB5uO3mt-.jpg'
import leto6 from '~/assets/leto_sbory/zXiYnn8Tlvk2KBQ9Egn2lNpccZ6VqpYhA-4eje9MR7D1uKvrNa3vyxAxU8DpthJKVDgGNObHUNEb3J9SLh-05uwK.jpg'

const modules = [Navigation, Pagination]

const momentImages = [leto1, leto2, leto3, leto4, leto5, leto6]
</script>

<style scoped>
.sbory-moments-slider {
  width: 100%;
}
.sbory-moments-slider__wrap {
  position: relative;
  margin: 0 auto;
  max-width: 960px;
  padding: 0 2.75rem;
}
@media (max-width: 520px) {
  .sbory-moments-slider__wrap {
    padding: 0 2.25rem;
  }
}
.sbory-moments-swiper {
  padding-bottom: 2.75rem;
}
.sbory-moments-swiper :deep(.swiper-pagination-bullet) {
  background: var(--color-border);
  opacity: 1;
}
.sbory-moments-swiper :deep(.swiper-pagination-bullet-active) {
  background: var(--color-accent);
}
.sbory-moments-slider__slide {
  border-radius: calc(var(--radius) + 4px);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  aspect-ratio: 16 / 10;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
}
@media (max-width: 767px) {
  .sbory-moments-slider__slide {
    aspect-ratio: 4 / 3;
  }
}
@media (max-width: 420px) {
  .sbory-moments-slider__slide {
    aspect-ratio: 3 / 4;
  }
}
.sbory-moments-slider__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.sbory-moments-slider__btn {
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
.sbory-moments-slider__btn:hover {
  background: var(--color-bg);
  border-color: color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
}
.sbory-moments-slider__btn.swiper-button-disabled {
  opacity: 0.35;
  pointer-events: none;
}
.sbory-moments-slider__prev {
  left: 0;
}
.sbory-moments-slider__next {
  right: 0;
}
</style>
