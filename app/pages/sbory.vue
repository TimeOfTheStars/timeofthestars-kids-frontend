<template>
  <div class="page sbory-page">
    <div class="container">
      <div v-reveal class="sbory-page__breadcrumbs-wrap">
        <Breadcrumbs :items="[{ title: 'Главная', to: '/' }, { title: 'Сборы' }]" />
      </div>

      <!-- Hero -->
      <section class="sbory-hero">
        <div class="sbory-hero__inner">
          <div class="sbory-hero__left">
            <h1 v-reveal class="sbory-hero__title">Летние сборы<br />в Ярославле</h1>
            <p v-reveal="{ delay: 70 }" class="sbory-hero__subtitle">для полевых игроков и вратарей с 4 до 16 лет!</p>

            <div class="sbory-hero__stats">
              <div v-reveal="{ delay: 0 }" class="stat-badge stat-badge--hero">
                <span class="stat-badge__value">12 часов</span>
                <span class="stat-badge__label">льда</span>
              </div>
              <div v-reveal="{ delay: 75 }" class="stat-badge stat-badge--hero">
                <span class="stat-badge__value">12 часов</span>
                <span class="stat-badge__label">«Земли»</span>
              </div>
              <div v-reveal="{ delay: 150 }" class="stat-badge stat-badge--hero">
                <span class="stat-badge__value">6 дней</span>
                <span class="stat-badge__label">смена</span>
              </div>
              <div v-reveal="{ delay: 225 }" class="stat-badge stat-badge--hero">
                <span class="stat-badge__value">5 тренеров</span>
                <span class="stat-badge__label">на льду</span>
              </div>
            </div>

            <div v-reveal="{ delay: 280 }" class="sbory-hero__actions">
              <a
                href="https://forms.gle/8zcE1px3hvrEKjbd6"
                target="_blank"
                rel="noopener noreferrer"
                class="btn"
              >Принять участие</a>
              <button type="button" class="btn btn--secondary" @click="openQrModal">
                Оплатить онлайн
              </button>
            </div>
          </div>

          <div v-reveal="{ delay: 90 }" class="sbory-hero__right">
            <img
              src="/logo-star-kids.webp"
              alt="Время Звезд"
              class="sbory-hero__logo"
              width="220"
              height="220"
            />
          </div>
        </div>
      </section>

      <!-- Training tasks -->
      <section class="sbory-tasks">
        <h2 v-reveal class="sbory-tasks__title">Задачи тренировок</h2>
        <div v-reveal="{ delay: 90 }" class="sbory-tasks__card">
          <h3 class="sbory-tasks__card-title">В программе сборов:</h3>
          <ul class="sbory-tasks__list">
            <li class="sbory-tasks__item">14 часов - тренировок на льду</li>
            <li class="sbory-tasks__item">12 часов - функциональной подготовки в зале</li>
          </ul>

          <p class="sbory-tasks__text">
            В зависимости от задач тренировок, полевые игроки делятся на 5 групп по 5-6 человек или по парам. Группы формируются по возрасту (5-6 лет, 7-8 лет, 9-10 лет, 11-12 лет, 13-14 лет) и по уровню подготовки. Вратари тренируются отдельно в группе до 6 человек.
          </p>
        </div>
        <div v-reveal="{ delay: 160 }" class="sbory-tasks__slider-wrap">
          <SboryTasksFirstSlider />
        </div>
      </section>

      <!-- CTA -->
      <section class="sbory-cta" aria-hidden="true" />

      <!-- Photo + text -->
      <section class="sbory-promo">
        <h2 v-reveal class="sbory-section-title">Готовим профессионалов</h2>

        <div class="sbory-promo__layout">
          <div v-reveal="{ delay: 80 }" class="sbory-promo__left">
            <div class="sbory-promo__media">
              <img src="/sbory/boy.jpg" alt="Юный хоккеист на льду" class="sbory-promo__img" />
            </div>
            <div class="sbory-promo__prices">
              <div class="price-row">
                <span class="price-row__label">Без проживания и питания</span>
                <span class="price-row__value">40 000 ₽</span>
              </div>
              <div class="price-row">
                <span class="price-row__label">С проживанием и питанием</span>
                <span class="price-row__value">60 000 ₽</span>
              </div>
            </div>
            <a
              href="https://forms.gle/8zcE1px3hvrEKjbd6"
              target="_blank"
              rel="noopener noreferrer"
              class="btn sbory-promo__cta"
            >Принять участие</a>
          </div>

          <div class="sbory-promo__right">
            <div class="sbory-promo__cards">
              <article
                v-for="(c, i) in promoCards"
                :key="c.title"
                v-reveal="{ delay: 100 + i * 85 }"
                class="promo-card"
              >
                <img :src="c.icon" alt="" class="promo-card__icon" aria-hidden="true" />
                <h3 class="promo-card__title">{{ c.title }}</h3>
                <p class="promo-card__text">{{ c.text }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Coaches -->
      <section class="sbory-coaches">
        <h2 v-reveal class="sbory-section-title">Тренерский состав</h2>
        <div class="sbory-coaches__layout">
          <aside class="sbory-coaches__list" aria-label="Список тренеров">
            <button
              v-for="(coach, i) in summerCoachesResolved"
              :key="coach.name"
              v-reveal="{ delay: Math.min(i * 42, 380) }"
              type="button"
              class="sbory-coaches__item"
              :class="{ 'sbory-coaches__item--active': selectedCoachIndex === i }"
              @click="selectedCoachIndex = i"
            >
              <span class="sbory-coaches__avatar">
                <img v-if="coach.pic" :src="coach.pic" :alt="coach.name" class="sbory-coaches__avatar-img" />
                <span v-else class="sbory-coaches__avatar-placeholder" aria-hidden="true">{{ coach.name.slice(0, 1) }}</span>
              </span>
              <span class="sbory-coaches__item-text">
                <span class="sbory-coaches__item-name">{{ coach.name }}</span>
              </span>
            </button>
          </aside>

          <div v-if="selectedSummerCoach" v-reveal="{ delay: 120 }" class="sbory-coaches__details">
            <div class="sbory-coaches__details-media">
              <img
                v-if="selectedSummerCoach.pic"
                :src="selectedSummerCoach.pic"
                :alt="selectedSummerCoach.name"
                class="sbory-coaches__details-img"
              />
              <div v-else class="sbory-coaches__details-placeholder">Фото скоро</div>
            </div>
            <div class="sbory-coaches__details-content">
              <h3 class="sbory-coaches__details-name">{{ selectedSummerCoach.name }}</h3>
              <p class="sbory-coaches__details-desc">{{ selectedSummerCoach.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Schedule -->
      <section class="sbory-schedule">
        <h2 v-reveal class="sbory-section-title">Примерное расписание</h2>
        <div class="sbory-schedule__grid">
          <article v-reveal="{ delay: 95 }" class="schedule-card schedule-card--single">
            <header class="schedule-card__head">
              <img src="/sbory/icon-2.png" alt="" class="schedule-card__icon" aria-hidden="true" />
            </header>
            <div class="schedule-card__body">
              <template v-for="(item, i) in schedule" :key="item.time + item.label">
                <div class="schedule-item">
                  <div class="schedule-item__time">{{ item.time }}</div>
                  <div class="schedule-item__label">{{ item.label }}</div>
                </div>
                <div
                  v-if="i < schedule.length - 1"
                  class="schedule-item__divider"
                  aria-hidden="true"
                />
              </template>
            </div>
          </article>
        </div>
        <div v-reveal="{ delay: 140 }" class="sbory-schedule__footer">
          <p class="sbory-schedule__note">
            Расписание ориентировочное: время блоков может незначительно сдвигаться по решению тренерского штаба. Состав и объём тренировок сохраняются.
          </p>
          <p class="sbory-schedule__warning">
            ВНИМАНИЕ! РАСПИСАНИЕ ТРЕНИРОВОК МОЖЕТ НЕЗНАЧИТЕЛЬНО МЕНЯТЬСЯ. КОЛИЧЕСТВО ТРЕНИРОВОК ОСТАНЕТСЯ НЕИЗМЕННЫМ.
          </p>
        </div>
      </section>

      <!-- Bright moments -->
      <section class="sbory-moments">
        <h2 v-reveal class="sbory-section-title">Яркие моменты</h2>
        <div v-reveal="{ delay: 100 }" class="sbory-moments__slider-outer">
          <SboryMomentsSlider />
        </div>
        <div v-reveal="{ delay: 220 }" class="sbory-moments__more">
          <a
            href="https://vk.ru/album-125696800_307657374"
            target="_blank"
            rel="noopener noreferrer"
            class="sbory-moments__more-link"
          >
            Показать ещё
          </a>
        </div>
      </section>

      <!-- Venue -->
      <section class="sbory-venue">
        <h2 v-reveal class="sbory-section-title">Место проведения и проживание</h2>
        <div v-reveal="{ delay: 75 }" class="sbory-venue__lead-photo">
          <img
            :src="venueLivingImg"
            alt="Участник летних сборов на льду"
            class="sbory-venue__lead-img"
            width="960"
            height="600"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div v-reveal="{ delay: 130 }" class="sbory-venue__info">
          <p class="sbory-venue__name">ФГБУ ПОО «ГУОР по хоккею»</p>
          <p class="sbory-venue__address">ул. Дядьковская 7, Фрунзенский район, Ярославль</p>
          <p class="sbory-venue__desc">Тренировки на льду и проживание участников — на одной базе. Современный ледовый комплекс, оборудованные залы ОФП, бросковая зона.</p>
        </div>
        <ArenaSlider />
      </section>

      <!-- Shift choice -->
      <section class="sbory-shift-choice">
        <h2 v-reveal class="sbory-section-title">Выбор смены</h2>
        <div class="sbory-shift-choice__grid">
          <article
            v-for="(card, i) in shiftChoiceCards"
            :key="card.title"
            v-reveal="{ delay: 90 + i * 100 }"
            class="choice-card"
          >
            <div v-if="card.stickerSrc" class="choice-card__sticker">
              <img :src="card.stickerSrc" :alt="card.stickerAlt || ''" class="choice-card__sticker-img" />
            </div>
            <h3 class="choice-card__title">{{ card.title }}</h3>

            <ul v-if="card.items?.length" class="choice-card__list">
              <li v-for="(it, i) in card.items" :key="i" class="choice-card__item">
                {{ it }}
              </li>
            </ul>

            <p v-else class="choice-card__text">
              {{ card.text }}
            </p>

            <div v-if="card.price" class="choice-card__price">
              {{ card.price }}
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>

  <div
    v-if="showQrModal"
    class="qr-modal"
    role="dialog"
    aria-modal="true"
    aria-label="Оплата онлайн"
    @click.self="closeQrModal"
  >
    <div class="qr-modal__inner">
      <button type="button" class="qr-modal__close" aria-label="Закрыть" @click="closeQrModal">
        ×
      </button>
      <h3 class="qr-modal__title">Оплата онлайн</h3>
      <img src="/sbory/qr.jpg" alt="QR-код для оплаты" class="qr-modal__img" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import venueLivingImg from '~/assets/fKu8dAF2SN8hISgv_pDOBWz85Pq3fDAK6sPt366ceFxNPM4efhxblQjPHr_uX7XS6k26s6iWVt24N9XEey_rkwAk.jpg'

const showQrModal = ref(false)

function openQrModal() {
  showQrModal.value = true
}

function closeQrModal() {
  showQrModal.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showQrModal.value) closeQrModal()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

type CoachJson = {
  name: string
  pic: string
  description: string
}

const summerCoaches = ref<CoachJson[]>([])
const mainCoaches = ref<CoachJson[]>([])

const mainPicByName = computed(() => {
  const m = new Map<string, string>()
  for (const c of mainCoaches.value) m.set(c.name, c.pic)
  return m
})

const summerCoachesResolved = computed(() =>
  summerCoaches.value.map((c) => ({
    ...c,
    pic: c.pic?.trim() ? c.pic : mainPicByName.value.get(c.name) || '',
  }))
)

const selectedCoachIndex = ref(0)
const selectedSummerCoach = computed(() => summerCoachesResolved.value[selectedCoachIndex.value] ?? null)

onMounted(async () => {
  try {
    const [summerRes, mainRes] = await Promise.all([fetch('/summer_camp_coaches.json'), fetch('/main_coaches.json')])
    const summerJson = (await summerRes.json()) as { summer_camp_coaches?: CoachJson[] }
    const mainJson = (await mainRes.json()) as { main_coaches?: CoachJson[] }
    summerCoaches.value = summerJson.summer_camp_coaches ?? []
    mainCoaches.value = mainJson.main_coaches ?? []
    selectedCoachIndex.value = 0
  } catch {
    summerCoaches.value = []
    mainCoaches.value = []
    selectedCoachIndex.value = 0
  }
})

const schedule = [
  { time: '8:00 – 8:30', label: 'Завтрак (для проживающих на базе)' },
  { time: '9:00 – 10:00', label: 'Лёд' },
  { time: '10:30 – 11:30', label: 'Зал' },
  { time: '12:00 – 13:00', label: 'Обед' },
  { time: '14:00 – 15:00', label: 'Зал' },
  { time: '15:30 – 16:30', label: 'Лёд' },
  { time: '18:00 – 18:30', label: 'Ужин (для проживающих на базе)' },
  { time: '19:00 – 21:30', label: 'Свободное время (для проживающих на базе, под контролем воспитателя)' },
  { time: '22:00', label: 'Отбой (для проживающих на базе)' },
]

const promoCards = [
  {
    icon: '/sbory/konek.png',
    title: 'Техника катания',
    text: 'Прокачаем баланс, стартовую скорость, манёвренность и эффективность катания.',
  },
  {
    icon: '/sbory/ice-hokkei-1.png',
    title: 'Техника паса',
    text: 'Культура паса: приём и передача в движении, точность и темп.',
  },
  {
    icon: '/sbory/klushki.png',
    title: 'Владение клюшкой',
    text: 'Дриблинг, контроль шайбы, скоростное ведение и работа с неудобной.',
  },
  {
    icon: '/sbory/goal.png',
    title: 'Техника броска',
    text: 'Кистевые и щелчки: сила, точность, броски с разных положений.',
  },
  {
    icon: '/sbory/vrata.png',
    title: 'Тренировки для вратарей',
    text: 'Спецподготовка: стойка, перемещения, реакция и игра на выходе.',
  },
  {
    icon: '/sbory/futbolka.png',
    title: 'Физическая подготовка',
    text: 'Координация, растяжка, функционал и силовая работа «на земле».',
  },
]

const shiftChoiceCommonItems = [
  '12 часов тренировок на льду',
  '12 часов ОФП / акробатики / бросковая зона',
  'Именная джерси АНФСО «ВРЕМЯ ЗВЕЗД»',
  'Фирменный подарок каждому участнику',
  'Фото и видео отчёты тренировочного процесса',
  'Ежедневно выделяем лучших игроков в группах',
  'Система поощрения для детей (собственная валюта сборов)',
  'Рекомендации по развитию по итогам сборов',
]

const shiftChoiceCards: Array<{
  title: string
  stickerSrc?: string
  stickerAlt?: string
  items?: string[]
  text?: string
  price?: string
}> = [
  {
    title: 'В стоимость участия с проживанием входит:',
    stickerSrc: '/stickers/otel.png',
    stickerAlt: 'Проживание',
    items: ['Проживание на территории базы', 'Питание на базе', ...shiftChoiceCommonItems],
    price: '60 000 ₽',
  },
  {
    title: 'В стоимость участия без проживания входят:',
    stickerSrc: '/stickers/84-chasa-lda.png',
    stickerAlt: 'Тренировки',
    items: shiftChoiceCommonItems,
    price: '40 000 ₽',
  },
  {
    title: 'Стоимость проживания одного сопровождающего:',
    stickerSrc: '/stickers/divan.png',
    stickerAlt: 'Сопровождающий',
    text: 'Уточняйте условия и стоимость у менеджера.',
  },
]
</script>

<style scoped>
.page {
  padding: 2rem 0 4rem;
}

/* Breadcrumbs (on dark top background) */
:deep(.breadcrumbs) {
  color: rgba(255, 255, 255, 0.78);
}
:deep(.breadcrumbs__link) {
  color: rgba(255, 255, 255, 0.78);
}
:deep(.breadcrumbs__link:hover) {
  color: rgba(255, 255, 255, 0.92);
}
:deep(.breadcrumbs__sep) {
  opacity: 0.8;
}
:deep(.breadcrumbs__current) {
  color: rgba(255, 255, 255, 0.92);
}

/* Hero */
.sbory-hero {
  padding: clamp(1.5rem, 3.25vw, 2.5rem) 0;
}
.sbory-hero__inner {
  position: relative;
  overflow: visible;
  border-radius: 0;
  border: none;
  background: transparent;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
.sbory-hero__inner::after {
  content: none;
}
.sbory-hero__left,
.sbory-hero__right {
  position: relative;
  z-index: 1;
}
.sbory-hero__left {
  text-align: center;
}
.sbory-hero__right {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (min-width: 900px) {
  .sbory-hero__inner {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: center;
    gap: 2rem;
  }
  .sbory-hero__right {
    justify-content: flex-end;
  }
}
.sbory-hero__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1.1;
  margin: 0 0 0.75rem;
  color: rgba(255, 255, 255, 0.92);
}
.sbory-hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.72);
  margin: 0 0 1.25rem;
}
.sbory-hero__stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
.stat-badge {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius);
  padding: 0.65rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}
.stat-badge__value {
  font-size: 1.15rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.2;
}
.stat-badge__label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.66);
  margin-top: 0.2rem;
}
.sbory-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.sbory-hero__actions .btn {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}
.sbory-hero__actions .btn--secondary {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.92);
  box-shadow: none;
}
.sbory-hero__actions .btn--secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}
.sbory-hero__logo {
  height: clamp(120px, 20vw, 220px);
  width: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 16px 44px rgba(0, 0, 0, 0.35));
}

/* Training tasks */
.sbory-tasks {
  padding: 2.5rem 0 1rem;
  position: relative;
  z-index: 2;
}
.sbory-tasks::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  background: var(--color-bg);
  z-index: -1;
}
.sbory-tasks__title {
  font-size: clamp(1.6rem, 2.6vw, 2.1rem);
  margin: 0 0 1.25rem;
  color: var(--color-text);
}
.sbory-tasks__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 6px);
  padding: clamp(1.1rem, 2.5vw, 1.6rem);
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}
.sbory-tasks__card-title {
  margin: 0 0 0.75rem;
  font-weight: 800;
  color: var(--color-text);
  font-size: 1rem;
}
.sbory-tasks__list {
  margin: 0 0 0.9rem;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.35rem;
}
.sbory-tasks__item {
  color: var(--color-text-muted);
  line-height: 1.55;
  font-size: 0.98rem;
}
.sbory-tasks__text {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
  font-size: 1rem;
}

/* CTA */
.sbory-cta {
  display: none;
}

/* Promo */
.sbory-promo {
  padding: 3.25rem 0;
}
.sbory-promo__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: stretch;
}
@media (min-width: 900px) {
  .sbory-promo__layout {
    grid-template-columns: 0.95fr 1.55fr;
    gap: 2rem;
  }
}
.sbory-promo__left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  height: 100%;
}
.sbory-promo__cta {
  width: 100%;
  max-width: 420px;
  text-align: center;
}
.sbory-promo__media {
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--color-border);
  width: 100%;
  max-width: 520px;
  background: var(--color-surface);
  flex: 1;
  min-height: clamp(320px, 45vh, 560px);
}
.sbory-promo__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.sbory-promo__right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.sbory-promo__cards {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 600px) {
  .sbory-promo__cards {
    grid-template-columns: repeat(2, minmax(260px, 1fr));
    gap: 1.5rem;
  }
}
.promo-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 6px);
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
  text-align: left;
  min-height: 190px;
}
.promo-card__icon {
  width: 56px;
  height: 56px;
  object-fit: contain;
  display: block;
  margin-bottom: 0.9rem;
}
.promo-card__title {
  margin: 0 0 0.4rem;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-text);
}
.promo-card__text {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.55;
  font-size: 1.02rem;
}
.sbory-promo__prices {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  max-width: 520px;
  width: 100%;
}
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.price-row__label {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
.price-row__value {
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--color-text);
}

/* Section title */
.sbory-section-title {
  font-size: 1.75rem;
  margin: 0 0 1.5rem;
  text-align: center;
}

/* Coaches */
.sbory-coaches {
  padding: 2rem 0;
}
.sbory-coaches__layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: start;
}
.sbory-coaches__list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0;
  height: 520px;
  overflow: auto;
  padding-right: 0.25rem;
}
.sbory-coaches__item {
  width: 100%;
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 6px);
  padding: 0.75rem;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 0.75rem;
  align-items: center;
  cursor: pointer;
  outline: none;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}
.sbory-coaches__item:hover {
  border-color: rgba(220, 38, 38, 0.35);
  box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.12), 0 8px 24px rgba(220, 38, 38, 0.1);
  transform: translateY(-2px);
}
.sbory-coaches__item--active {
  border-color: rgba(37, 99, 235, 0.55);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
}
.sbory-coaches__item:focus-visible {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.22);
}
.sbory-coaches__avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  display: block;
}
.sbory-coaches__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 20%;
  display: block;
}
.sbory-coaches__avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-weight: 900;
  font-size: 1.25rem;
}
.sbory-coaches__item-name {
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.25;
  font-size: 0.95rem;
}
.sbory-coaches__details {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 6px);
  overflow: hidden;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  height: 520px;
}
.sbory-coaches__details-media {
  background: var(--color-bg);
  border-right: 1px solid var(--color-border);
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.sbory-coaches__details-img {
  width: 100%;
  height: 100%;
  max-height: 480px;
  object-fit: contain;
  object-position: center;
  display: block;
}
.sbory-coaches__details-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-weight: 700;
  letter-spacing: 0.01em;
}
.sbory-coaches__details-content {
  padding: clamp(1rem, 2.5vw, 1.75rem);
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.sbory-coaches__details-name {
  margin: 0 0 0.75rem;
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--color-text);
}
.sbory-coaches__details-desc {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
  white-space: pre-line;
  overflow: auto;
  padding-right: 0.25rem;
}

@media (max-width: 920px) {
  .sbory-coaches__layout {
    grid-template-columns: 1fr;
  }
  .sbory-coaches__list {
    height: auto;
    overflow: visible;
    padding-right: 0;
  }
  .sbory-coaches__details {
    grid-template-columns: 1fr;
    height: auto;
  }
  .sbory-coaches__details-media {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    height: 320px;
  }
}

/* Schedule */
.sbory-schedule {
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sbory-schedule__grid {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
.schedule-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 6px);
  padding: 1.5rem 1.25rem;
}
.schedule-card--single {
  width: 100%;
}
.schedule-card__head {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}
.schedule-card__icon {
  width: clamp(40px, 6vw, 56px);
  height: auto;
  display: block;
  object-fit: contain;
  opacity: 0.9;
}
.schedule-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.schedule-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}
.schedule-item__time {
  font-weight: 900;
  color: var(--color-accent);
  font-size: clamp(1.02rem, 2.4vw, 1.15rem);
  line-height: 1.3;
  margin: 0 0 0.4rem;
  letter-spacing: 0.02em;
}
.schedule-item__label {
  color: var(--color-text);
  font-size: 1.02rem;
  line-height: 1.45;
  margin: 0;
}
.schedule-item__divider {
  width: 2px;
  height: 1.1rem;
  margin: 0.85rem auto;
  flex-shrink: 0;
  background: var(--color-text);
  opacity: 0.22;
  border-radius: 2px;
}
.sbory-schedule__footer {
  margin-top: 1.5rem;
  max-width: 640px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.sbory-schedule__note {
  margin: 0 0 1rem;
  color: var(--color-text-muted);
  line-height: 1.65;
  font-size: 1.05rem;
}
.sbory-schedule__warning {
  margin: 0;
  font-weight: 800;
  font-size: 1rem;
  line-height: 1.45;
  letter-spacing: 0.02em;
  color: var(--color-text);
}

/* Bright moments */
.sbory-moments {
  padding: 2rem 0 2.5rem;
}
.sbory-moments__more {
  text-align: center;
  margin-top: 1rem;
}
.sbory-moments__more-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-accent);
  text-decoration: none;
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius);
  border: 1px solid color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  background: var(--color-surface);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.sbory-moments__more-link:hover {
  background: color-mix(in srgb, var(--color-accent) 8%, var(--color-surface));
  border-color: color-mix(in srgb, var(--color-accent) 65%, var(--color-border));
  transform: translateY(-1px);
}

/* Venue */
.sbory-venue {
  padding: 2rem 0;
}
.sbory-venue__lead-photo {
  max-width: 640px;
  margin: 0 auto 1.25rem;
  border-radius: calc(var(--radius) + 6px);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}
.sbory-venue__lead-img {
  width: 100%;
  height: auto;
  max-height: min(420px, 55vh);
  object-fit: cover;
  object-position: center 30%;
  display: block;
}
.sbory-venue__info {
  margin-bottom: 1rem;
  text-align: center;
}
.sbory-venue__name {
  margin: 0 0 0.25rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
}
.sbory-venue__address {
  margin: 0 0 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
.sbory-venue__desc {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

/* Shift choice */
.sbory-shift-choice {
  padding: 3rem 0 2rem;
}
.sbory-shift-choice__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  align-items: stretch;
}
.choice-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 6px);
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.choice-card__sticker {
  display: flex;
  justify-content: center;
  margin: -0.25rem 0 1rem;
}
.choice-card__sticker-img {
  width: 92px;
  height: 92px;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 10px 18px rgba(15, 23, 42, 0.12));
}
.choice-card__title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.3;
}
.choice-card__list {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.5rem;
}
.choice-card__item {
  color: var(--color-text-muted);
  line-height: 1.55;
  font-size: 0.98rem;
}
.choice-card__text {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
  font-size: 1rem;
}
.choice-card__price {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  font-weight: 900;
  font-size: 1.25rem;
  color: var(--color-accent);
  letter-spacing: 0.01em;
}

/* QR modal */
.qr-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 220;
  padding: 1rem;
}
.qr-modal__inner {
  position: relative;
  width: min(420px, 100%);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 6px);
  padding: 1.5rem;
  text-align: center;
}
.qr-modal__title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: var(--color-text);
}
.qr-modal__img {
  width: 220px;
  height: 220px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.75rem;
}
.qr-modal__close {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  font-size: 1.35rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.qr-modal__close:hover {
  background: var(--color-border);
}
</style>
