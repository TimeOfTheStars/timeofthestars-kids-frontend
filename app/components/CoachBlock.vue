<template>
  <section class="coach section">
    <div class="container coach__inner">
      <div class="coach__media">
        <img
          :src="coachImage"
          alt="Максим Олегович Вершинин"
          class="coach__img"
        />
      </div>
      <div class="coach__content">
        <h2 class="coach__name">Максим Олегович Вершинин</h2>
        <p class="coach__role">Старший тренер</p>
        <button type="button" class="btn" @click="showQuestionForm = true">Задать вопрос</button>
      </div>
      <p v-if="questionSent" class="coach__sent">Спасибо! Мы получили Ваш вопрос и тренер ответит на него в ближайшее время. Ожидайте ответ на Вашу почту.</p>
    </div>
    <div v-if="showQuestionForm" class="coach__modal" @click.self="showQuestionForm = false">
      <div class="coach__modal-inner">
        <h3 class="coach__modal-title">Задать вопрос тренеру</h3>
        <LeadForm
          variant="surface"
          submit-label="Отправить"
          :show-hint="false"
          mode="questions"
          @success="onFormSuccess"
        />
        <button type="button" class="coach__modal-close btn btn--secondary" @click="showQuestionForm = false">Закрыть</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const coachImage =
  '/coaches/pqX2_np_3mOp0DE-fu_sYOAlcJRkcBs-qfaSF0qnz-btSlDAzuOuNSWVc5OKMzJtaU6Aa6YJVv8lc0zYWO0cBBZ6.jpg'

const showQuestionForm = ref(false)
const questionSent = ref(false)

function onFormSuccess() {
  showQuestionForm.value = false
  questionSent.value = true
}
</script>

<style scoped>
.coach__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
  gap: 1.25rem;
}
.coach__media {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 3/4;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}
.coach__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.coach__name {
  font-size: 1.5rem;
  margin: 0;
  color: var(--color-text);
}
.coach__role {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 1.05rem;
}
.coach__content .btn {
  margin-top: 0.25rem;
}
.coach__sent {
  color: #22c55e;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 36rem;
}
.coach__modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}
.coach__modal-inner {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: var(--radius);
  max-width: 440px;
  width: 100%;
  border: 1px solid var(--color-border);
}
.coach__modal-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  text-align: center;
  color: var(--color-text);
}
.coach__modal-close {
  --btn-secondary-bg: var(--color-border);
  width: 100%;
  margin-top: 1rem;
  background: var(--color-bg-alt);
  color: var(--color-text);
  box-shadow: none;
}
.coach__modal-close:hover {
  opacity: 1;
  background: var(--color-border);
}
</style>
