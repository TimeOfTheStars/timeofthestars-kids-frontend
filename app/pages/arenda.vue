<template>
  <div class="page arenda-page">
    <div class="container">
      <Breadcrumbs :items="[{ title: 'Главная', to: '/' }, { title: 'Аренда' }]" />
      <h1 class="page__title">Аренда</h1>

      <section class="page-surface">
        <div class="arenda__media">
          <div class="media-placeholder">Тут может быть картинка</div>
        </div>
        <div class="arenda__content">
          <p>Мы предлагаем к аренде две ледовые арены размером 30×60 метров. Стоимость составляет от 15 000 рублей в час.</p>
          <p>В стоимость входит предоставление ледовой арены после заливки, раздевалка, хоккейные ворота, если требуются.</p>
          <p>Если необходима дополнительная раздевалка, то доплата за нее составит 2000 руб.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.page {
  padding: 2rem 0 3rem;
}
.page__title {
  font-size: 2rem;
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}
.page-surface {
  position: relative;
  padding: 2rem 0 2.5rem;
}
.page-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  background: var(--color-bg);
  z-index: 0;
}
.page-surface > * {
  position: relative;
  z-index: 1;
}
.arenda__media {
  aspect-ratio: 16/9;
  max-width: 700px;
  margin-bottom: 2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
.arenda__content p {
  margin: 0 0 1rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}
</style>
