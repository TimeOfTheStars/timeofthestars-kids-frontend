<template>
  <section class="testimonials section">
    <div class="container">
      <h2 v-reveal class="section-title">Отзывы о нас</h2>
      <div class="testimonials__grid">
        <article
          v-for="(item, i) in items"
          :key="i"
          v-reveal="{ delay: i * 100 }"
          class="testimonial-card"
        >
          <p class="testimonial-card__text">{{ item.text }}</p>
          <p class="testimonial-card__author">{{ item.author }}</p>
          <p class="testimonial-card__role">{{ item.role }}</p>
        </article>
      </div>
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
const reviewsTopicUrl = 'https://vk.com/topic-125696800_56616420'

const items = [
  {
    text: 'Ребёнок с нетерпением ждёт каждую тренировку. Видно, что тренеры умеют работать с малышами — и дисциплина, и уважение к детям.',
    author: 'Елена',
    role: 'мама игрока'
  },
  {
    text: 'Нравится атмосфера и организация: всегда понятно, где и во сколько занятия. После полугода занятий сын стал увереннее на коньках.',
    author: 'Андрей',
    role: 'папа игрока'
  },
  {
    text: 'Выбрали школу после просмотра — понравилось, как объясняют базу и безопасность на льду. Рекомендуем знакомым.',
    author: 'Ольга',
    role: 'родитель'
  }
]
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
.testimonials__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}
.testimonial-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.testimonial-card:hover {
  border-color: rgba(37, 99, 235, 0.25);
  box-shadow: 0 8px 28px rgba(37, 99, 235, 0.08);
}
.testimonial-card__text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--color-text-muted);
  flex: 1;
}
.testimonial-card__author {
  margin: 0;
  font-weight: 600;
  color: var(--color-text);
  font-size: 1rem;
}
.testimonial-card__role {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
.testimonials__action {
  display: flex;
  justify-content: center;
  margin-top: 1.75rem;
  position: relative;
  z-index: 1;
}
</style>
