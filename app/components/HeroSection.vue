<template>
    <section class="hero">
        <video class="hero__video" autoplay muted loop playsinline>
            <source src="/IMG_5223.mp4" type="video/mp4" />
            Ваш браузер не поддерживает видео
        </video>
        <div class="hero__overlay" aria-hidden="true"></div>

        <div class="hero__inner container">
            <h1 class="hero__title">Стань частью нашей команды!</h1>
            <img
                src="/logo-star-kids.webp"
                alt=""
                class="hero__league-icon"
            />
            <div class="hero__cta-block">
                <template v-if="!mobileFormSubmitted">
                    <button type="button" class="btn hero__form-btn" @click="openModal">Записаться</button>
                    <p class="hero__form-disclaimer">
                        Заполняя и отправляя форму, Вы даете
                        <NuxtLink to="/politika-konfidencialnosti" class="hero__form-link">Согласие на обработку персональных данных</NuxtLink>.
                    </p>
                    <div class="hero__game-circle" aria-hidden="true">
                        <span class="hero__game-line hero__game-line--top"></span>
                        <span class="hero__game-line hero__game-line--bottom"></span>
                        <div class="hero__game-circle-inner">
                            <span class="hero__game-word hero__game-word--large">ИГРА</span>
                            <span class="hero__game-word hero__game-word--small">НАЧИНАЕТСЯ</span>
                            <span class="hero__game-word hero__game-word--large">ЗДЕСЬ</span>
                        </div>
                    </div>
                </template>
                <p v-else class="hero__form-thanks">Спасибо! Ожидайте звонка менеджера.</p>
            </div>
        </div>

        <AppointmentModal
            v-if="modalOpen"
            @close="modalOpen = false"
            @success="onAppointmentSuccess"
        />
    </section>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import AppointmentModal from '~/components/AppointmentModal.vue'

const mobileFormSubmitted = ref(false)
const modalOpen = ref(false)

function openModal() {
    modalOpen.value = true
}

function onAppointmentSuccess() {
    modalOpen.value = false
    mobileFormSubmitted.value = true
}
</script>

<style scoped>
.hero {
    position: relative;
    padding: 4rem 0;
    padding-top: calc(70px + 4rem);
    text-align: center;
    overflow: hidden;
    min-height: 700px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero__video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

.hero__overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background-color: rgba(0, 18, 50, 0.82);
    background-image: radial-gradient(
        circle at center,
        rgba(255, 255, 255, 0.15) 1px,
        transparent 1px
    );
    background-size: 12px 12px;
}

.hero__inner {
    max-width: 600px;
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.hero__title {
    font-size: 2.5rem;
    margin: 0;
    line-height: 1.2;
    color: white;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
}

.hero__league-icon {
    display: block;
    width: 260px;
    height: auto;
    margin: 1rem auto 0;
}

.hero__cta-block {
    width: 100%;
    margin-top: 1.5rem;
}

.hero__form-btn {
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
}
.hero__form-disclaimer {
    margin: 0.75rem 0 0;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.4;
}
.hero__form-link {
    color: #fff;
    text-decoration: underline;
}
.hero__form-link:hover {
    opacity: 0.9;
}
.hero__form-thanks {
    margin: 0;
    color: #86efac;
    font-weight: 600;
}

.hero__game-circle {
    position: relative;
    width: 220px;
    height: 220px;
    margin: 2.5rem auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.hero__game-line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    background: #fff;
    border-radius: 6px;
    z-index: 3;
}
.hero__game-line--top {
    bottom: 100%;
    height: 50px;
    margin-bottom: -26px;
}
.hero__game-line--bottom {
    top: 100%;
    height: 50px;
    margin-top: -26px;
}
.hero__game-circle-inner {
    position: relative;
    z-index: 1;
    width: 220px;
    height: 220px;
    border: 5px solid var(--color-accent);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 18, 50, 0.4);
}
.hero__game-word {
    color: #fff;
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}
.hero__game-word--large {
    font-size: 1.5rem;
}
.hero__game-word--small {
    font-size: 0.95rem;
    font-weight: 600;
}

@media (max-width: 600px) {
    .hero__league-icon {
        order: -1;
        width: 240px;
        margin: 0 auto 1.25rem;
    }

    .hero__title {
        font-size: 1.75rem;
    }

    .hero__cta-block {
        margin-top: 1.25rem;
    }

    .hero__form-btn {
        max-width: 280px;
    }

    .hero__game-circle {
        width: 160px;
        height: 160px;
        margin-top: 2.75rem;
    }

    .hero__game-line {
        width: 10px;
        border-radius: 5px;
    }

    .hero__game-line--top {
        height: 40px;
        margin-bottom: -20px;
    }

    .hero__game-line--bottom {
        height: 40px;
        margin-top: -20px;
    }

    .hero__game-circle-inner {
        width: 160px;
        height: 160px;
        border-width: 4px;
    }

    .hero__game-word--large {
        font-size: 1.1rem;
    }

    .hero__game-word--small {
        font-size: 0.7rem;
    }

    .hero {
        min-height: 350px;
    }
}
</style>
