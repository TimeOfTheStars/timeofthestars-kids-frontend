<template>
    <section class="lions section">
        <div class="container lions__inner">
            <div v-reveal class="lions__title-wrap">
                <h2 class="lions__title">
                    <BrandName /> приглашает на просмотр!
                </h2>
            </div>
            <div v-reveal="{ delay: 100 }" class="lions__media">
                <img
                    src="/logo-star-kids.webp"
                    alt="Время Звезд-Kids"
                    class="lions__logo"
                />
            </div>
            <div v-reveal="{ delay: 200 }" class="lions__content">
                <p class="lions__text">Продолжается набор детей с 3-х лет и старше </p>
            </div>
            <div v-reveal="{ delay: 300 }" class="lions__action">
                <NuxtLink to="/abonementy" class="btn">Подробнее</NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.section {
    padding: 3rem 0;
    background: linear-gradient(135deg, #111126 0%, #0f0f1a 60%, #12112a 100%);
    border-top: 1px solid rgba(37, 99, 235, 0.2);
    border-bottom: 1px solid rgba(37, 99, 235, 0.2);
    position: relative;
    overflow: hidden;
}
.section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 500px 300px at 50% 100%, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
    pointer-events: none;
}
.lions__inner {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
}
.lions__title-wrap {
    text-align: right;
    min-width: 0;
}
.lions__title {
    font-size: 1.75rem;
    margin: 0;
}
.lions__media {
    width: 140px;
    aspect-ratio: 1;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.lions__logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}
.lions__content {
    min-width: 0;
    text-align: left;
}
.lions__text {
    margin: 0;
    font-size: 1.75rem;
    line-height: 1.2;
    font-weight: 700;
    color: var(--color-text);
}
.lions__action {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
}
@media (max-width: 768px) {
    .lions__inner {
        grid-template-columns: 1fr;
    }
    .lions__title-wrap {
        text-align: center;
        order: 1;
    }
    .lions__media {
        margin: 0 auto;
        order: 2;
    }
    .lions__content {
        text-align: center;
        order: 3;
    }
    .lions__action {
        order: 4;
    }
}
</style>
