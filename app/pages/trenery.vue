<template>
    <div class="page trenery-page">
        <div class="container">
            <Breadcrumbs
                :items="[{ title: 'Главная', to: '/' }, { title: 'Тренеры' }]"
            />
            <h1 class="page__title">Тренеры</h1>

            <div class="trenery__grid">
                <article
                    v-for="(coach, i) in coaches"
                    :key="i"
                    class="trenery-card"
                >
                    <div class="trenery-card__media">
                        <img
                            :src="coach.image"
                            :alt="coach.name"
                            class="trenery-card__img"
                        />
                    </div>
                    <div class="trenery-card__body">
                        <h3 class="trenery-card__name">{{ coach.name }}</h3>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
})

const coachTopicUrl = 'https://vk.ru/topic-125696800_56701933'

const coaches = [
    {
        name: 'Максим Олегович Вершинин',
        image: '/coaches/pqX2_np_3mOp0DE-fu_sYOAlcJRkcBs-qfaSF0qnz-btSlDAzuOuNSWVc5OKMzJtaU6Aa6YJVv8lc0zYWO0cBBZ6.jpg',
    },

    {
        name: 'Дмитрий Олегович Вершинин',
        image: '/coaches/oh_4JtnGs2Dswjo1hZfXbK3kA-dmAEGfsFVZ396wnqzBId1RkzrIKI9pLCY-Hn-SQ1Qu2rkrC9s7wM-LkKwGd1lD.jpg',
    },

    {
        name: 'Семён Антонович Майков',
        image: '/coaches/u-7gF0Ca8dfisqbMa47rX3uDMTBTH0OID5VEbum5qaNINZUZShGkz0PaxTpJV4y8Vze32iE-N5UdRpgIGNDByXmd.jpg',
    },
    {
        name: 'Роман Анатольевич Желтов',
        image: '/coaches/photo_2026-02-05_13-35-28.jpg',
    },
    {
        name: 'Антон Вячеславович Коленкин',
        image: '/coaches/photo_2026-02-05_13-35-29.jpg',
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
}
.trenery__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
}
.trenery-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    gap: 1rem;
    text-align: center;
}
.trenery-card__media {
    width: clamp(104px, 22vw, 140px);
    height: clamp(104px, 22vw, 140px);
    margin: 0 auto;
    border-radius: 9999px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
}
.trenery-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 20%;
    display: block;
}
.trenery-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.trenery-card__name {
    font-size: 1.25rem;
    margin: 0;
}
</style>
