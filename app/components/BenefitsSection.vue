<template>
  <section class="benefits section">
    <div class="container">
      <h2 v-reveal class="section-title">Почему хоккей для ребенка - это ПОЛЕЗНО!</h2>
      <div class="benefits__grid">
        <article v-for="(item, i) in items" :key="i" v-reveal="{ delay: i * 100 }" class="benefit-card">
          <div class="benefit-card__icon">
            <Icon :name="item.icon" size="40" />
          </div>
          <h3 class="benefit-card__title">{{ item.title }}</h3>
          <button
            type="button"
            class="benefit-card__toggle btn btn--small"
            :aria-expanded="expandedIndex === i"
            @click="toggle(i)"
          >
            <span>{{ expandedIndex === i ? 'Свернуть' : 'Узнать больше' }}</span>
            <svg
              class="benefit-card__toggle-icon"
              :class="{ 'benefit-card__toggle-icon--open': expandedIndex === i }"
              width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="benefit-card__expand-wrap">
            <div class="benefit-card__expand" :class="{ 'benefit-card__expand--open': expandedIndex === i }">
              <p class="benefit-card__text">{{ item.text }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const items = [
  {
    icon: 'ph:heartbeat',
    title: 'Укрепляет здоровье и иммунитет, тренирует силу и выносливость',
    text: 'Сухой лед является лучшей профилактикой астмы и респираторных болезней, регулярные занятия формируют атлетичную фигуру и способствуют повышению выносливости. Во время тренировки задействованы абсолютно все группы мышц, отлично прорабатывается дыхательная система. Занятия хоккеем полезны для развития зрения, так как приходится постоянно следить за шайбой и стремительно перемещающимися игроками. Большое внимания уделяется общефизическому развитию детей: беговая подготовка, прыжковая, силовая.'
  },
  {
    icon: 'ph:hand-fist',
    title: 'Вырабатывает самостоятельность и дисциплину',
    text: 'Выходя на лед, хоккеист совершает индивидуальные действия, но при этом несет ответственность за исход матча. Хоккей учит правильно и серьезно подходить к своим решениям, ощущать их значимость для окружающих. Спортсмены должны следить за временем и ставить задачи, которые нужно выполнить в определенный период времени. В ходе тренировки ребёнок учится брать на себя ответственность за свои действия и признавать ошибки, если он их допустил. Мальчишки, которые играют в хоккей получают ценные навыки, которые будут полезны в будущем. Они становятся более дисциплинированными и самостоятельными, приобретают уверенность в своих силах и умение принимать решения в сложных ситуациях.'
  },
  {
    icon: 'ph:handshake',
    title: 'Учит коммуникациям, навыкам общения, взаимовыручки и поддержки',
    text: 'Хоккей — это не только игра на льду, но и настоящий способ развития навыков коммуникации, общения, взаимовыручки и поддержки. Во время тренировки ребёнок должен быть в постоянном контакте с партнерами по команде, чтобы правильно распределить задачи на поле и обеспечить эффективную игру. Хоккей требует быстрого принятия решений и коммуникаций на льду для выхода на общую тактику по игре. Кроме того, очень важен навык взаимовыручки и поддержки в команде. Когда ребёнок попадает в трудную ситуацию на льду, ему всегда нужно знать, что у него есть поддержка со стороны остальных игроков, которые готовы выйти на помощь. Этот аспект игры настраивает все команду на нужную волну взаимопомощи.'
  },
  {
    icon: 'ph:users-three',
    title: 'Борется с ленью и агрессией, учит настоящей дружбе и закаляет характер',
    text: 'Занятие хоккеем поможет ребенку победить в себе лень, выработать характер, стать целеустремленным, избавиться от стресса и агрессии. Игроки постоянно находятся в движении, совершают острые повороты, резкие удары по шайбе, а также физически борются за победу на поле. Именно поэтому хоккей может быть эффективным средством для борьбы с ленью и агрессией. Важным аспектом хоккея является развитие таких качеств, как настойчивость, решимость и смелость. Хоккеисты постоянно сталкиваются с соперниками, которые пытаются выиграть, используя все доступные им средства, и каждому игроку необходимо иметь сильный характер и не сдаваться перед трудностями.'
  }
]
const expandedIndex = ref<number | null>(null)
function toggle(i: number) {
  expandedIndex.value = expandedIndex.value === i ? null : i
}
</script>

<style scoped>
.benefits {
  background: var(--color-bg-alt);
  position: relative;
  overflow: hidden;
}
.benefits::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 700px 400px at 50% 100%, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
  pointer-events: none;
}
.benefits__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  align-items: stretch;
}
.benefit-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--color-border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}
.benefit-card:hover {
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2), 0 8px 32px rgba(37, 99, 235, 0.12);
  transform: translateY(-3px);
}
.benefit-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(37, 99, 235, 0.12);
  color: var(--color-accent);
  margin-bottom: 1rem;
  transition: background 0.25s, transform 0.25s;
}
.benefit-card:hover .benefit-card__icon {
  background: rgba(37, 99, 235, 0.22);
  transform: scale(1.08);
}
.benefit-card__title {
  font-size: 1.1rem;
  margin: 0 0 1rem;
  font-weight: 700;
  color: var(--color-text);
  flex: 1;
}
.benefit-card__toggle {
  margin-bottom: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: center;
}
.benefit-card__toggle-icon {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}
.benefit-card__toggle-icon--open {
  transform: rotate(180deg);
}
.benefit-card__expand-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}
.benefit-card__expand-wrap:has(.benefit-card__expand--open) {
  grid-template-rows: 1fr;
}
.benefit-card__expand {
  overflow: hidden;
  margin-top: 0;
  transition: margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.benefit-card__expand--open {
  margin-top: 0.5rem;
}
.benefit-card__text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  text-align: center;
}
.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}
</style>
