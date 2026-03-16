<template>
  <section class="faq section">
    <div class="container">
      <h2 v-reveal class="section-title">Ответы на вопросы родителей</h2>
      <div class="faq__list">
        <div
          v-for="(item, i) in items"
          :key="i"
          v-reveal="{ delay: i * 80 }"
          class="faq__item"
          :class="{ 'faq__item--open': openIndex === i }"
        >
          <button
            type="button"
            class="faq__question"
            :aria-expanded="openIndex === i"
            @click="toggle(i)"
          >
            {{ item.question }}
            <span class="faq__arrow" :class="{ 'faq__arrow--open': openIndex === i }">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </button>
          <div class="faq__answer-wrap">
            <div class="faq__answer">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const items = [
  { question: 'Со скольки лет можно отдавать ребенка в хоккейную школу?', answer: 'Общая практика показывает, что лучший возраст для ребенка начать заниматься хоккеем, это 3 года!' },
  { question: 'Как часто у вас проводится набор в детские группы?', answer: 'В нашей школе набор идет круглый год.' },
  { question: 'Сколько раз в неделю лучше посещать тренировки для детей 3-х лет?', answer: 'В этом возрасте закладывается фундамент хоккейных навыков, для ребенка лучше всего будет 3 раза в неделю приходить на занятия.' },
  { question: 'Какие документы нужны, чтобы записать ребенка на занятия?', answer: 'Для записи ребенка будет достаточно следующих документов: справка врача о допуске, копия свидетельства о рождении.' },
  { question: 'Сколько времени длится занятие и сколько детей занимается в группе?', answer: 'Занятие длится один час. Два раза в неделю после занятий на льду проводится час общефизической подготовки.' },
  { question: 'Работает ли школа в период летних каникул?', answer: 'Сезон заканчивается 31 мая, начинается 1 сентября. В перерыве проходят «заминочные» и предсезонные сборы.' }
]
const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<style scoped>
.faq {
  background:
    radial-gradient(ellipse 600px 400px at 50% 0%, rgba(37, 99, 235, 0.07) 0%, transparent 70%),
    var(--color-bg-alt);
  position: relative;
}
.faq__list {
  max-width: 700px;
  margin: 0 auto;
}
.faq__item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-bottom: 0.5rem;
  overflow: hidden;
  background: var(--color-surface);
  transition: border-color 0.25s, box-shadow 0.25s;
}
.faq__item:hover {
  border-color: rgba(37, 99, 235, 0.35);
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.08);
}
.faq__item--open {
  border-color: rgba(37, 99, 235, 0.45);
  box-shadow: 0 4px 24px rgba(37, 99, 235, 0.12);
}
.faq__question {
  width: 100%;
  padding: 1rem 1.25rem;
  text-align: left;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: background 0.2s;
}
.faq__question:hover {
  background: rgba(0, 0, 0, 0.04);
}
.faq__arrow {
  flex-shrink: 0;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s;
}
.faq__arrow--open {
  transform: rotate(180deg);
  color: var(--color-accent);
}
.faq__answer-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.faq__item--open .faq__answer-wrap {
  grid-template-rows: 1fr;
}
.faq__answer {
  overflow: hidden;
}
.faq__answer p {
  margin: 0;
  padding: 0.75rem 1.25rem 1.25rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  border-top: 1px solid var(--color-border);
}
</style>
