<template>
  <div class="page abonementy-page">
    <div class="container">
      <Breadcrumbs :items="[{ title: 'Главная', to: '/' }, { title: 'Услуги' }]" />
      <h1 class="page__title">Услуги</h1>

      <section class="page-surface">
        <div class="abonementy__grid">
          <article v-for="(item, i) in services" :key="i" class="abonementy-card">
            <div class="abonementy-card__media">
              <img :src="item.image" :alt="item.title" class="abonementy-card__img" />
            </div>
            <div class="abonementy-card__body">
              <h3 class="abonementy-card__type">{{ item.title }}</h3>
              <p class="abonementy-card__price">{{ item.price }}</p>
              <p v-if="item.desc" class="abonementy-card__period">{{ item.desc }}</p>
              <div class="abonementy-card__actions">
                <button type="button" class="btn btn--secondary" @click="selectedService = item">Подробнее</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div v-if="selectedService" class="abonementy-modal" @click.self="selectedService = null">
        <div class="abonementy-modal__inner">
          <h3 class="abonementy-modal__title">{{ selectedService.title }}</h3>
          <p class="abonementy-modal__description">{{ selectedService.description }}</p>
          <div class="abonementy-modal__form">
            <h4 class="abonementy-modal__form-title">Оставить заявку</h4>
            <form v-if="!serviceRequestSent" class="service-request" @submit.prevent="submitServiceRequest">
              <div class="service-request__fields">
                <input v-model="servicePhone" type="tel" inputmode="tel" autocomplete="tel" class="service-request__input" placeholder="+7 (___) ___-__-__" @input="onServicePhoneInput" required />
                <input v-model="serviceParentName" type="text" class="service-request__input" placeholder="ФИО родителя" required />
                <input v-model="serviceChildName" type="text" class="service-request__input" placeholder="ФИО ребёнка" required />
                <input v-model.number="serviceChildAge" type="number" min="1" max="18" inputmode="numeric" class="service-request__input" placeholder="Возраст ребёнка" required />
              </div>
              <p v-if="serviceRequestError" class="service-request__error" role="alert">{{ serviceRequestError }}</p>
              <label class="service-request__agree">
                <input v-model="serviceAgree" type="checkbox" required />
                <span>Согласие на обработку персональных данных</span>
              </label>
              <p class="service-request__disclaimer">
                Заполняя и отправляя форму, Вы даете
                <NuxtLink to="/politika-konfidencialnosti" class="service-request__disclaimer-link">Согласие на обработку персональных данных</NuxtLink>.
              </p>
              <button type="submit" class="btn" :disabled="serviceRequestLoading">Отправить</button>
            </form>
            <p v-else class="service-request__thanks">Спасибо! Ожидайте звонка менеджера.</p>
          </div>
          <button type="button" class="btn btn--secondary" @click="selectedService = null">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { postJson } from '~/utils/api'

definePageMeta({
  layout: 'default'
})

const shopImages = [
  '/shop/_twVtVDKeoN3qCQ8AlLgTWJR-9q5bV8mf8DJXZ5-yx9k-lA1iryii5q5wQ3G8mw54s95N9k_Kh5kNlEVH4j6AmAp.jpg',
  '/shop/b-eJHU_jVRGTsdGZKq3NtgV8-_0NnCJabsmuSioIBdmZMAi2b-oOIlaNI_Qp9q_TOuDjyg_PcTfHaRpu2EU36WcG.jpg',
  '/shop/glcWrrXS8JSFO4wHnFV80Y-7qClgdcrjfH0DZdsLyTJrsfG1UDFeDfGqlPNp4USitpUnsv1ojqEuvadcInoFl5kl.jpg',
  '/shop/Oeof_tqrSe_uVQUpMuytHbJeA4Dt3ffEHVqBqy3UtrxC3yx_aQEbZHI1EHLejSn234R46fBJdxCaw2w5D5CoXNTC.jpg',
  '/shop/OpuOGPC8HYB-Acy601CdHzBhNPncsOazsNvB7jx0h565jFN2LdV2OuWcQ0N6iN9qCKrNjTdta3LNAQG2S73QgmNV.jpg',
  '/shop/ycpRUs57C3dTwqqEVs1JnZ6NHLMIAXISRWcORSL4zcxfqRw4ExBUuYAlICbJ3gXIcvlTw-Vv6gfY0liqQSGSEd1M.jpg'
]

const description1 = `🤗Открыт набор детей с 3-х лет для занятий хоккеем с шайбой на льду многофункционального комплекса

💪Поможем с формой на ПЕРВОЕ ЗАНЯТИЕ!

➡Обучение с нуля.
➡Разделение по группам по уровню подготовки.
➡Индивидуальный подход к каждому ребёнку.
➡Формирование команд по возрастам для участия в турнирах
➡Тренировки на льду и в зале ОФП проходят в игровой форме.

📍Адрес катка: ФГБУ ПОО ГУОР по хоккею, ул. Дядьковская 7, Фрунзенский район

🏒Тренируйтесь с лучшими - становитесь лучшими вместе с физкультурно-спортивной организацией "ВРЕМЯ ЗВЕЗД"`

const description2 = `✅SKATING ZONE

👉🏻Зона предназначена для развития индивидуальных навыков, таких как катание на коньках, броски, работа с клюшкой, передачи и периферическое зрение. Зона состоит из уникального конькобежного тренажера и других специализированных технологий, включая Skating analysis, Instructor, Live delay, Shooting navigation, Peripheral navidation, Laser education, Stride Power и многое другое.

‼Предназначение:
💡Улучшение техники катания
💡Развитие физических и координационных способностей – многозадачность, StridePower
💡Повышение качества передач
💡Развитие бросков (техника, точность, броски в движении и т.д.)
💡Развитие периферического зрения
💡Специальная хоккейная диагностика (Анализ техники катания, Stridepower, WinGate, VO2 max, PowerGate...)

‼Уникальность:
💡Быстрые результаты, основанные на более эффективном тренировочном процессе
💡Все необходимые технологии для тестирования и тренировок в одном комплексе
💡Качественный производственный процесс, обеспечивающий надежную работу
💡Комфортная рабочая среда для тренеров
💡Уникальный хоккейный конькобежный тренажер (Скорость, тишина работы на максимальных скоростях, надежность, универсальность, регулируемая настройка угла наклона, HST monitoring suite, …)`

const description3 = `☝️Бросковая и дриблинг — важные составляющие тренировочного процесса! Эти 💪 тренировки помогаю спортсменам 🏒развивать контроль над шайбой и точность ударов, что существенно влияет на их игру.

В хоккее важно не только прекрасно владеть техникой катания, но и уметь сделать решающий бросок, оказавшись у ворот соперника. Это умение зачастую решает исход матча и поднимает уверенность каждого хоккеиста.

🙌Наши занятия проходят очень увлекательно и динамично — мы стараемся вдохновлять ребят на новые достижения, делая каждую тренировку яркой и насыщенной!`

const description4 = `🍃ЛЕТНИЕ ХОККЕЙНЫЕ СБОРЫ "ВРЕМЯ ЗВЕЗД"
для полевых игроков и вратарей

ТОЛЬКО 30 мест к бронированию❗❗❗

Дата проведения:
✅1 смена 15-20 июня 2026
✅2 смена 22-27 июня 2026
✅3 смена 29-04 июля 2026

📍Место проведения: ФГБУ ПОО ГУОР по хоккею, ул. Дядьковская 7, Фрунзенский район

✏️Возраст участников: с 4 до 16 лет

💪В рамках сборов просмотр игроков в хоккейный клуб "ЛОКОМОТИВ" г. Ярославль

✔️В программе :
12 часов тренировок на льду
12 часов ОФП/акробатики/бросковая зона

➡ 4 тренера на льду
➡ Тренер по ОФП
➡ Тренер по акробатике и растяжке

🥋Именная джерси АНФСО "ВРЕМЯ ЗВЕЗД"
🎁Фирменный подарок каждому участнику
📷Фото и видео отчёты тренировочного процесса
🏅Ежедневно выделяем лучших игроков в группах
📈 Система поощрения для детей (собственная валюта сборов).
🏒Рекомендации по развитию,по итогам сборов

💰Стоимость сборов :
- 40000 рублей - без проживания и питания
- 60000 рублей - с проживанием и питанием на территории базы

☝️При раннем бронировании (до 1 марта 2026 г.) скидка 🏷️5% (38000 рублей)
☝️Для групп от 3-х человек скидка🏷️10% (36000 рублей)

*скидки не суммируются и не распространяются на проживание и питание.

📅Расписание тренировок (предварительно):
8:00 - 8:30 завтрак (для проживающих на базе)
9:00 -10:00 лед
10:30 -11:30 зал
12:00-13:00 обед
14:00 -15:00 зал
15:30 -16:30 лед
18:00-18:30 ужин (для проживающих на базе)
19:00-21:30 свободное время (для проживающих на базе, под контролем воспитателя)
22:00 - отбой (для проживающих на базе)

📣Основная направленность:
➡️"Эффективное катание"
-стартовая скорость
-скоростно-силовая работа
-маневренность
➡️Бросковая подготовка в бросковой зоне и на льду (кистевые броски с удобной и неудобной с различных положений, щелчки)
➡️Улучшение техники владения клюшкой
-скоростное ведение
- дриблинг
- приём и передача (культура паса)
➡️Технико-тактическая подготовка по амплуа защитники, нападающие (моделирование игровых ситуаций и доведение до автоматизма)
➡️Реализация голевых моментов
Работа с отягощениями
➡️Единоборства 1х1,2х2,3х3 (развитие чувства и контроля дистанции)
➡️Развитие функциональных качеств, выносливости, гибкости и координации, crossfit

‼️Для участия в тренировочных сборах необходимы:
1. Заполненная анкета спортсмена
2. Справка о допуске к занятиям хоккеем (спортивная справка установленного образца)
3. Согласие на обработку персональных данных
4. Свидетельства о рождении/паспорта
5. Копия паспорта родителя
6. Договор на проживание
7. Договор на участие в тренировочных сборах
8. В случае, если юниор приезжает на сборы без родителей, необходима доверенность на сопровождающего.

Готовим профессионалов 🔝`

const description5 = `🤗А лето 🍃 не за горами…
АНФСО «ВРЕМЯ ЗВЕЗД» 🥅🏒 проводит летний спортивный лагерь на базе МОУ ДООЦ им.А.Матросова в период с ☘️1 по 14 🍀августа 2026 года!
☝️2026 год - это 14-ые😃 по счёту сборы в нашем любимом лагере🥰!

🏒Летние хоккейные сборы в лагере им. А.Матросова - 🤗идеальное место для того, чтобы завести новых друзей, достичь новых успехов в хоккее, получить позитивный жизненный опыт.

☝️Специальный тренировочный лагерь поможет вашему ребенку, увлекающемуся игрой в хоккей, не потерять свою форму во время длительных летних каникул. Но это, конечно, не все явные преимущества подобных сборов.

💪ОСНОВНЫЕ ПЛЮСЫ:
✅ Благодаря профессионально подобранной подготовке, становится возможным полностью занять ребенка. В результате он будет в максимальной безопасности, даже когда не будет под присмотром со стороны папы и мамы.
✅ Юный хоккеист сможет продолжать заниматься своим любимым видом сорта. Кроме того, он будет получать удовольствие от других, не менее интересных мероприятий. Это касается творческих конкурсов, отрядных соревнований и незабываемых вечерних дискотек!

☀️Летние хоккейные сборы на базе лагеря им.А.Матросова - это 24-часовые сборы с 5-ти разовым питанием и проживанием в сосновом бору.

☝️Количество мест ограничено.`

const description6 = `✅кепка красная/синяя - 1400₽
✅комплект для занятий ОФП (шорты и футболка) - 2600₽
✅хоккейная Джерси - 2100₽ (до 42 размера), 2500₽ (после 42 размера)`

const services = [
  { code: 'abonement', title: 'Абонемент на тренировочные занятия', price: '9 200 ₽', image: shopImages[3], description: description1 },
  { code: 'hst', title: 'Индивидуально/групповые занятия на хоккейном тренажере HST', price: '4 200 ₽', image: shopImages[4], description: description2 },
  { code: 'broskovaya', title: 'Бросковая тренировка', price: 'от 600 ₽', desc: 'В зависимости от количества человек', image: shopImages[1], description: description3 },
  { code: 'sbory', title: 'Сборы', price: '40 000 ₽', image: shopImages[2], description: description4 },
  { code: 'lager', title: 'Летний спортивный лагерь', price: '46 000 ₽', image: shopImages[0], description: description5 },
  { code: 'atributika', title: 'Командная атрибутика', price: '1 400 ₽', image: shopImages[5], description: description6 }
]

const selectedService = ref<(typeof services)[number] | null>(null)

const servicePhone = ref('')
const serviceParentName = ref('')
const serviceChildName = ref('')
const serviceChildAge = ref<number | null>(null)
const serviceAgree = ref(false)
const serviceRequestLoading = ref(false)
const serviceRequestError = ref<string | null>(null)
const serviceRequestSent = ref(false)

function normalizePhone(raw: string) {
  const digitsOnly = raw.replace(/\D/g, '')
  const hasPlus = raw.trim().startsWith('+')
  return `${hasPlus ? '+' : ''}${digitsOnly}`
}

function onServicePhoneInput(e: Event) {
  servicePhone.value = normalizePhone((e.target as HTMLInputElement).value)
}

watch(selectedService, (v) => {
  if (!v) return
  serviceRequestLoading.value = false
  serviceRequestError.value = null
  serviceRequestSent.value = false
  serviceParentName.value = ''
  serviceChildName.value = ''
  serviceChildAge.value = null
  serviceAgree.value = false
})

async function submitServiceRequest() {
  if (!selectedService.value || serviceRequestLoading.value) return
  serviceRequestError.value = null
  serviceRequestLoading.value = true
  try {
    await postJson('/service-requests', {
      phone: servicePhone.value.trim(),
      parent_name: serviceParentName.value.trim(),
      child_name: serviceChildName.value.trim(),
      child_age: serviceChildAge.value,
      service: selectedService.value.title,
    })
    serviceRequestSent.value = true
  } catch (e) {
    serviceRequestError.value = 'Не удалось отправить. Попробуйте ещё раз.'
  } finally {
    serviceRequestLoading.value = false
  }
}
</script>

<style scoped>
.page {
  padding: 2rem 0 3rem;
}
.page__title {
  font-size: 2rem;
  margin: 0 0 2rem;
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
.abonementy__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.abonementy-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.abonementy-card__media {
  aspect-ratio: 16/10;
  background: var(--color-surface);
  overflow: hidden;
}
.abonementy-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}
.abonementy-card__body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.abonementy-card__type {
  font-size: clamp(1rem, 0.9rem + 0.4vw, 1.1rem);
  margin: 0 0 0.5rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
  hyphens: auto;
}
.abonementy-card__price {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}
.abonementy-card__period {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.abonementy-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}
.abonementy-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}
.abonementy-modal__inner {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: var(--radius);
  max-width: 560px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}
.abonementy-modal__title {
  font-size: 1.25rem;
  margin: 0 0 1rem;
}
.abonementy-modal__description {
  margin: 0 0 1.5rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  white-space: pre-line;
}
.abonementy-modal__form {
  margin: 0 0 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}
.abonementy-modal__form-title {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  color: var(--color-text);
}
.service-request {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.service-request__fields {
  display: grid;
  gap: 0.75rem;
}
.service-request__input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
}
.service-request__input:focus {
  outline: none;
  border-color: var(--color-accent);
}
.service-request__agree {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  cursor: pointer;
}
.service-request__agree input {
  margin-top: 0.2rem;
}
.service-request__disclaimer {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}
.service-request__disclaimer-link {
  color: var(--color-accent);
  text-decoration: underline;
}
.service-request__error {
  margin: 0;
  color: #ef4444;
  font-size: 0.9rem;
}
.service-request__thanks {
  margin: 0;
  color: #22c55e;
  font-weight: 600;
  line-height: 1.5;
}
</style>
