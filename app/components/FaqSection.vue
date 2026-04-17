<template>
  <section class="faq section">
    <div class="container">
      <h2 v-reveal class="section-title">Ответы на вопросы родителей</h2>
      <div class="faq__layout">
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

        <aside v-reveal="{ delay: 160 }" class="faq__coach">
          <div class="faq__coach-media">
            <img
              :src="coachImage"
              alt="Максим Олегович Вершинин"
              class="faq__coach-img"
            >
          </div>
          <h3 class="faq__coach-name">Максим Олегович Вершинин</h3>
          <p class="faq__coach-role">Старший тренер</p>
          <button type="button" class="btn btn--red faq__ask-btn" @click="showQuestionForm = true">Задать вопрос</button>
          <p v-if="questionSent" class="faq__sent">
            Спасибо! Мы получили Ваш вопрос и тренер ответит на него в ближайшее время.
          </p>
        </aside>
      </div>
    </div>

    <div v-if="showQuestionForm" class="faq__modal" @click.self="showQuestionForm = false">
      <div class="faq__modal-inner">
        <h3 class="faq__modal-title">Задать вопрос тренеру</h3>
        <LeadForm
          variant="surface"
          submit-label="Отправить"
          :show-hint="false"
          mode="questions"
          @success="onFormSuccess"
        />
        <button type="button" class="faq__modal-close btn" @click="showQuestionForm = false">Закрыть</button>
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
const showQuestionForm = ref(false)
const questionSent = ref(false)

const coachImage =
  '/coaches/pqX2_np_3mOp0DE-fu_sYOAlcJRkcBs-qfaSF0qnz-btSlDAzuOuNSWVc5OKMzJtaU6Aa6YJVv8lc0zYWO0cBBZ6.jpg'

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

function onFormSuccess() {
  showQuestionForm.value = false
  questionSent.value = true
}
</script>

<style scoped>
.faq {
  background:
    radial-gradient(ellipse 600px 400px at 50% 0%, rgba(37, 99, 235, 0.07) 0%, transparent 70%),
    var(--color-bg-alt);
  position: relative;
}
.faq__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  align-items: start;
}
.faq__list {
  width: 100%;
}
.faq__item {
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
}
.faq__item--open {
  border-color: rgba(37, 99, 235, 0.45);
}
.faq__question {
  width: 100%;
  padding: 1.05rem 0;
  text-align: left;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: clamp(0.98rem, 0.95vw, 1.35rem);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: background 0.2s;
}
.faq__question:hover {
  color: var(--color-accent);
}
.faq__arrow {
  flex-shrink: 0;
  color: var(--color-accent);
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
  padding: 0.125rem 0 1rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}
.faq__coach {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.65rem;
}
.faq__coach-media {
  width: 126px;
  height: 126px;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid rgba(37, 99, 235, 0.25);
}
.faq__coach-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 20%;
  display: block;
}
.faq__coach-name {
  margin: 0.35rem 0 0;
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.25;
}
.faq__coach-role {
  margin: 0;
  color: var(--color-accent);
  font-size: 0.78rem;
}
.faq__ask-btn {
  margin-top: 1rem;
  width: 100%;
  max-width: 280px;
  border-radius: 999px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}
.faq__sent {
  margin: 0.25rem 0 0;
  color: #16a34a;
  font-size: 0.95rem;
  line-height: 1.45;
}
.faq__modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}
.faq__modal-inner {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: var(--radius);
  max-width: 440px;
  width: 100%;
  border: 1px solid var(--color-border);
}
.faq__modal-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  text-align: center;
  color: var(--color-text);
}
.faq__modal-close {
  width: 100%;
  margin-top: 1rem;
  background: var(--color-bg-alt);
  color: var(--color-text);
  box-shadow: none;
}
.faq__modal-close:hover {
  opacity: 1;
  background: var(--color-border);
}

@media (max-width: 960px) {
  .faq__layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .faq__coach {
    order: 2;
    max-width: 340px;
    margin: 0 auto;
  }

  .faq__question {
    font-size: 0.95rem;
    padding: 0.95rem 0;
    line-height: 1.3;
  }

  .faq__answer p {
    font-size: 0.95rem;
  }
}
</style>
