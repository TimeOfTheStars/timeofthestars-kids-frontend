<template>
    <div class="page trenery-page">
        <div class="container">
            <Breadcrumbs
                :items="[{ title: 'Главная', to: '/' }, { title: 'Тренеры' }]"
            />
            <h1 class="page__title">Тренеры</h1>

            <section class="trenery__section">
                <div class="trenery__grid">
                    <article
                        v-for="coach in coaches"
                        :key="coach.name"
                        class="trenery-card"
                        role="button"
                        tabindex="0"
                        @click="openCoach(coach)"
                        @keydown.enter.prevent="openCoach(coach)"
                        @keydown.space.prevent="openCoach(coach)"
                    >
                        <div class="trenery-card__media">
                            <img
                                :src="coach.pic"
                                :alt="coach.name"
                                class="trenery-card__img"
                            />
                        </div>
                        <div class="trenery-card__body">
                            <h3 class="trenery-card__name">{{ coach.name }}</h3>
                        </div>
                    </article>
                </div>
            </section>
        </div>

        <CoachDetailsModal :open="modalOpen" :coach="selectedCoach" @close="closeModal" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Coach = {
    name: string
    pic: string
    description: string
}

const coaches = ref<Coach[]>([])

const modalOpen = ref(false)
const selectedCoach = ref<Coach | null>(null)

function openCoach(coach: Coach) {
    selectedCoach.value = coach
    modalOpen.value = true
}

function closeModal() {
    modalOpen.value = false
}

onMounted(async () => {
    try {
        const res = await fetch('/main_coaches.json')
        const json = (await res.json()) as { main_coaches?: Coach[] }
        coaches.value = json.main_coaches ?? []
    } catch {
        coaches.value = []
    }
})
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
.trenery__section {
    position: relative;
    padding: 2rem 0 2.5rem;
}
.trenery__section::before {
    content: '';
    position: absolute;
    inset: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    background: var(--color-bg);
    z-index: 0;
}
.trenery__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    position: relative;
    z-index: 1;
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
    cursor: pointer;
    outline: none;
}
.trenery-card:hover {
    border-color: rgba(220, 38, 38, 0.35);
    box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.12), 0 8px 24px rgba(220, 38, 38, 0.1);
    transform: translateY(-2px);
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}
.trenery-card:focus-visible {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.22);
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
