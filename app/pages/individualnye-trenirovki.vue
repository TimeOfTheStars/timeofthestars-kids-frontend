<template>
    <div class="page individual-page">
        <div class="container">
            <Breadcrumbs
                :items="[
                    { title: 'Главная', to: '/' },
                    { title: 'Индивидуальные тренировки' },
                ]"
            />
            <h1 class="page__title">Индивидуальные тренировки</h1>
            <section class="page-surface">
                <div class="individual__intro">
                    <p>
                        В <BrandName /> работают профессиональные тренеры, есть вся
                        необходимая инфраструктура и мы будем рады помочь Вам
                        развить профессиональные навыки:
                    </p>
                    <ul>
                        <li>техника катания,</li>
                        <li>техника владения клюшкой/шайбой,</li>
                        <li>постановка техники броска,</li>
                        <li>прием и передача шайбы,</li>
                        <li>функциональная подготовка и многое другое.</li>
                    </ul>
                    <p>
                        Для многих спортсменов более комфортными являются групповые
                        тренировки, это дополнительная мотивация быть быстрее и
                        сильнее, а также легче переносить сам процесс тренировок,
                        так как они проходят в кругу таких же как и Вы —
                        трудолюбивых и жизнерадостных людей!
                    </p>
                </div>

                <h2 class="individual__subtitle">Важно знать</h2>
                <div class="individual__accordion">
                    <div
                        v-for="(item, i) in accordionItems"
                        :key="i"
                        class="accordion-item"
                        :class="{ 'accordion-item--open': openIndex === i }"
                    >
                        <button
                            type="button"
                            class="accordion-item__trigger"
                            :aria-expanded="openIndex === i"
                            @click="toggle(i)"
                        >
                            {{ item.title }}
                            <span class="accordion-item__arrow">{{
                                openIndex === i ? '▲' : '▼'
                            }}</span>
                        </button>
                        <div
                            v-show="openIndex === i"
                            class="accordion-item__content"
                        >
                            <p>{{ item.text }}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
const accordionItems = [
    {
        title: 'Индивидуальная тренировка на технику катания',
        text: 'Правильная техника катания является базой хоккеиста и основой его будущих достижений. Она заметно ускоряет прогресс спортсмена и устраняет целый ряд сложностей характерных для начального этапа.',
    },
    {
        title: 'Индивидуальная тренировка на технику владения клюшкой',
        text: 'Отрабатываются такие технические приемы как: обучение правильного хвата клюшки, ведение, передача и прием шайбы партнера, дриблинг, скоростное ведению шайбы.',
    },
    {
        title: 'Индивидуальная бросковая тренировка на льду',
        text: 'Благодаря индивидуальному подходу и современному оснащению наших центров, вы быстро улучшите все хоккейные броски: кистевые, щелчки, из-под обводки, с удобной и неудобной стороны крюка, броски и щелчки сходу. Помимо этого, вы улучшите контроль шайбы, отработаете правильную стойку для атаки ворот и научитесь бросать с «поднятой головой». Эти навыки поднимут ваш уровень игры на заключительной стадии атаки и еще больше повысят вашу результативность.',
    },
    {
        title: 'Индивидуальная бросковая тренировка на синтетическом льду',
        text: 'На бросковой тренировке спортсмены осваивают все основные виды бросков (классический, кистевой, щелчок, с неудобной руки) и их разновидностей (например, кистевой бросок с ближней ноги), а также практикуются в их применении в различных игровых ситуациях – сходу, с обводки, в движении, с разворота и др. Ключевыми факторами успешного освоения бросков являются: а) правильное исполнение и б) закрепление путем многократного повторения.',
    },
    {
        title: 'Тренировка на тренажере HST',
        text: 'Для оценки техники катания используется видеоанализ. Кроме техники катания отрабатываются специальные навыки: дриблинг, бросок, координация, баланс, выносливость. Тренировки на конькобежном тренажере «HST».',
    },
    {
        title: 'Тестирование хоккеистов',
        text: 'Применением набора нормированных тестов с описанием их точного проведения определяется индивидуальная готовность отдельных игроков, их кондиционно-координационные способности. Сравнение результатов целенаправленно помогает индивидуализации тренировочного процесса и обеспечивает получение обратной связи об удобстве способа, системы и цели тренировки. Тестирование возможно проводить и в большой группе.',
    },
    {
        title: 'Индивидуальная тренировка в зале',
        text: 'Индивидуальные тренировки по хоккею в корне отличаются от привычной системы подготовки. Они подразумевают плотную работу тренера с одним спортсменом на протяжении всего отведенного времени. К преимуществам такого подхода относятся: учет уровня возможностей и амплуа игрока, а также целей, которые перед собой ставит хоккеист; быстрое выявление и устранение игровых проблем, доведение мастерства практически до любого уровня; быстрый прогресс: навыки спортсмена прогрессируют с каждой тренировкой по хоккею; настоящее удовольствие от занятий и полученных результатов.',
    },
]
const openIndex = ref<number | null>(0)

function toggle(i: number) {
    openIndex.value = openIndex.value === i ? null : i
}
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
.individual__intro {
    margin-bottom: 2rem;
}
.individual__intro p,
.individual__intro ul {
    margin: 0 0 1rem;
    line-height: 1.6;
    color: var(--color-text-muted);
}
.individual__intro ul {
    padding-left: 1.5rem;
}
.individual__subtitle {
    font-size: 1.5rem;
    margin: 2rem 0 1rem;
}
.individual__accordion {
    max-width: 800px;
}
.accordion-item {
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    margin-bottom: 0.5rem;
    overflow: hidden;
    background: var(--color-surface);
}
.accordion-item__trigger {
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
}
.accordion-item__trigger:hover {
    background: rgba(255, 255, 255, 0.05);
}
.accordion-item__arrow {
    flex-shrink: 0;
    font-size: 0.75rem;
    color: var(--color-text-muted);
}
.accordion-item__content {
    padding: 0 1.25rem 1rem;
    border-top: 1px solid var(--color-border);
}
.accordion-item__content p {
    margin: 0;
    padding-top: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.5;
}
</style>
