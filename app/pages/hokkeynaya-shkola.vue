<template>
    <div class="page hokkeynaya-shkola-page">
        <div class="container">
            <Breadcrumbs
                :items="[
                    { title: 'Главная', to: '/' },
                    { title: 'Сведения' },
                ]"
            />
            <h1 class="page__title">Сведения об образовательной организации</h1>

            <section class="page-surface">
                <section class="school__main-info">
                    <h2 class="school__subtitle">Основные сведения</h2>
                    <dl class="school__info-list">
                        <dt>Полное и сокращенное наименование</dt>
                        <dd>Автономная некоммерческая физкультурно - спортивная организация «ВРЕМЯ ЗВЕЗД» (АНФСО «ВРЕМЯ ЗВЕЗД»)</dd>

                        <dt>Дата создания</dt>
                        <dd>2024 г.</dd>

                        <dt>Учредители / Члены организации</dt>
                        <dd>
                            <ul class="school__info-sublist">
                                <li>Вершинина Татьяна Вадимовна</li>
                            </ul>
                        </dd>

                        <dt>Место нахождения</dt>
                        <dd>
                            Российская Федерация, Ярославская область, город
                            Ярославль, Дядьковская улица, 7, 150006.
                        </dd>

                        <dt>Режим и график работы</dt>
                        <dd>понедельник — воскресенье с 09:00 до 21:00</dd>

                        <dt>Контактные телефоны</dt>
                        <dd>8-920-119-13-15</dd>

                        <dt>Адрес электронной почты</dt>
                        <dd>
                            <a
                                href="mailto:Time_of_the_stars@mail.ru"
                                class="school__info-link"
                                >Time_of_the_stars@mail.ru</a
                            >
                        </dd>
                    </dl>
                </section>

                <div class="school__intro">
                    <p>
                        Время Звезд-KIDS создан в 2024 году для воспитания профессиональных хоккеистов!
                    </p>
                    <p>
                        На сегодняшний день «Время Звезд-KIDS» — первая и единственная в России коммерческая школа, заявленная всеми возрастами в чемпионаты и первенства города Москвы!
                    </p>
                    <p>
                        Тренировочный процесс и домашние игры проходят в новом многофункциональном спортивном комплексе ФГБУ ПОО «ГУОР по хоккею».
                    </p>
                    <p>
                        Наша хоккейная школа принимает участие в официальных соревнованиях, проводимых Федерацией Хоккея Москвы (ФХМ).
                    </p>
                </div>
                <div class="school__cta">
                    <p class="school__cta-text">Идет набор 2010-2023 г.р.</p>
                    <p class="school__cta-price">
                        Стоимость абонемента от 9200 руб.
                    </p>
                    <a
                        href="https://timeofthestars-kids.ru/abonementy"
                        class="btn"
                        target="_blank"
                        rel="noopener noreferrer"
                        >Купить абонемент</a
                    >
                </div>
                <!-- <div class="school__media">
                    <div class="media-placeholder">Тут может быть картинка</div>
                </div> -->
                <h2 class="school__subtitle">
                    Для развития созданы отличные условия:
                </h2>
                <ul class="school__conditions">
                    <li>два больших льда;</li>
                    <li>залы функциональной подготовки;</li>
                    <li>игровые залы;</li>
                    <li>бросковые зоны;</li>
                    <li>зоны конькобежных тренажёров HST.</li>
                </ul>
                <div class="school__outro">
                    <p>
                        Тренировки спортсменов проходят в группах по году рождения
                        для детей от 3-х до 17-ти лет.
                    </p>
                    <p>
                        Продолжительность тренировки для детей составляет 60 минут и проводится от трех раз в неделю (лед+ОФП).
                    </p>
                    <p>
                        Обучение в школе платное. Начиная с 8 лет, наиболее
                        перспективные воспитанники переводятся на полное обеспечение
                        хоккейным клубом.
                    </p>
                </div>
                <h2 class="school__subtitle">Документы</h2>
                <div class="school__docs">
                    <a
                        v-for="(doc, i) in docs"
                        :key="i"
                        :href="doc.url"
                        target="_blank"
                        rel="noopener"
                        class="school__doc-link btn"
                        >{{ doc.title }}</a
                    >
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
})

const docs = [
    { title: 'Устав', url: '/docs/Устав.pdf' },
    { title: 'Свидетельство НКО', url: '/docs/Свидетельство НКО.pdf' },
    {
        title: 'Документ (объединённые)',
        url: '/docs/Otskanirovannyi_-объединены.pdf',
    },
]
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
.school__intro p {
    margin: 0 0 1rem;
    line-height: 1.6;
    color: var(--color-text-muted);
}
.school__cta {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1.5rem;
    margin: 2rem 0;
}
.school__cta-text {
    margin: 0 0 0.25rem;
    font-size: 1.1rem;
}
.school__cta-price {
    margin: 0 0 1rem;
    color: var(--color-text-muted);
}
.school__media {
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
.school__subtitle {
    font-size: 1.25rem;
    margin: 0 0 1rem;
}
.school__main-info {
    margin-bottom: 2rem;
}
.school__info-list {
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--color-text-muted);
    line-height: 1.6;
}
.school__info-list dt {
    font-weight: 600;
    color: var(--color-text);
    margin-top: 1rem;
    margin-bottom: 0.25rem;
}
.school__info-list dt:first-child {
    margin-top: 0;
}
.school__info-list dd {
    margin: 0;
    padding-left: 0;
}
.school__info-sublist {
    margin: 0;
    padding-left: 1.5rem;
}
.school__info-link {
    color: var(--color-primary, #2563eb);
    text-decoration: none;
}
.school__info-link:hover {
    text-decoration: underline;
}
.school__conditions {
    margin: 0 0 2rem;
    padding-left: 1.5rem;
    line-height: 1.7;
    color: var(--color-text-muted);
}
.school__outro p {
    margin: 0 0 1rem;
    line-height: 1.6;
    color: var(--color-text-muted);
}
.school__docs {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
}
.school__doc-link {
    display: inline-block;
    text-decoration: none;
}
</style>
