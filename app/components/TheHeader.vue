<template>
    <header class="header" :class="{ 'header--scrolled': showScrolledStyle }">
        <div class="header__top">
            <NuxtLink to="/" class="header__logo">
                <img
                    src="/logo-star-kids.webp"
                    alt=""
                    class="header__logo-img"
                />
                <BrandName />
            </NuxtLink>
            <button
                type="button"
                class="header__burger"
                :class="{ 'header__burger--open': menuOpen }"
                :aria-label="menuOpen ? 'Закрыть меню' : 'Меню'"
                :aria-expanded="menuOpen"
                @click="menuOpen = !menuOpen"
            >
                <span class="header__burger-line"></span>
                <span class="header__burger-line"></span>
                <span class="header__burger-line"></span>
            </button>
        </div>
        <div class="header__divider"></div>
        <div class="header__nav-row">
            <nav class="header__nav" :class="{ 'header__nav--open': menuOpen }">
                <NuxtLink
                    to="/hokkeynaya-shkola"
                    class="header__link"
                    @click="menuOpen = false"
                    >Сведения об образовательной организации</NuxtLink
                >
                <NuxtLink
                    to="/abonementy"
                    class="header__link"
                    @click="menuOpen = false"
                    >Услуги</NuxtLink
                >
                <NuxtLink
                    to="/individualnye-trenirovki"
                    class="header__link"
                    @click="menuOpen = false"
                    >Индивидуальные тренировки</NuxtLink
                >
                <NuxtLink
                    to="/trenery"
                    class="header__link"
                    @click="menuOpen = false"
                    >Тренеры</NuxtLink
                >
                <NuxtLink
                    to="/kontakty"
                    class="header__link"
                    @click="menuOpen = false"
                    >Контакты</NuxtLink
                >
            </nav>
        </div>
        <div
            class="header__backdrop"
            :class="{ 'header__backdrop--open': menuOpen }"
            aria-hidden="true"
            @click="menuOpen = false"
        ></div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuOpen = ref(false)
const isScrolled = ref(false)

const isHomePage = computed(() => route.path === '/')
const showScrolledStyle = computed(() => !isHomePage.value || isScrolled.value)

const scrollThreshold = 20

function onScroll() {
    isScrolled.value = typeof window !== 'undefined' && window.scrollY > scrollThreshold
}

onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.header {
    background: transparent;
    color: #eee;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 102;
    width: 100%;
    transition: background-color 0.2s ease;
}

.header.header--scrolled {
    background: rgba(248, 250, 252, 0.96);
    color: var(--color-text);
}
.header.header--scrolled .header__logo {
    color: var(--color-text);
}
.header.header--scrolled .header__logo:hover {
    color: var(--color-accent);
}
.header.header--scrolled .header__divider {
    border-top-color: var(--color-border);
}
.header.header--scrolled .header__burger-line {
    background: var(--color-text);
}
.header.header--scrolled .header__burger {
    border-color: var(--color-border);
}
.header.header--scrolled .header__link {
    color: var(--color-text-muted);
}
.header.header--scrolled .header__link:hover,
.header.header--scrolled .header__link.router-link-active {
    color: var(--color-accent);
}

.header__top {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 1rem 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    font-size: 1.5rem;
    color: #fff;
    text-decoration: none;
    flex-shrink: 0;
}

.header__logo:hover {
    color: #ccc;
}

.header__logo-img {
    height: 40px;
    width: auto;
    display: block;
}

.header__divider {
    max-width: 1200px;
    margin: 0 auto;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.header__nav-row {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 1rem 1rem 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header__burger {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 44px;
    height: 44px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0;
    cursor: pointer;
    border-radius: 4px;
    flex-shrink: 0;
}
.header__burger-line {
    display: block;
    width: 22px;
    height: 2px;
    background: #fff;
    border-radius: 1px;
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.header__burger--open .header__burger-line:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}
.header__burger--open .header__burger-line:nth-child(2) {
    opacity: 0;
}
.header__burger--open .header__burger-line:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}

.header__backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}
.header__backdrop--open {
    opacity: 1;
    pointer-events: auto;
}

.header__nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex: 1;
    justify-content: space-between;
}

.header__link {
    color: #ddd;
    text-decoration: none;
    white-space: nowrap;
}

.header__link:hover,
.header__link.router-link-active {
    color: #fff;
}

@media (max-width: 768px) {
    .header__top {
        padding: 0.75rem 1rem 0.5rem 1rem;
    }

    .header__burger {
        display: flex;
    }

    .header__nav-row {
        padding: 0;
        min-height: 0;
    }

    .header__backdrop {
        display: block;
    }

    .header__nav {
        position: fixed;
        top: 0;
        right: 0;
        width: min(320px, 85vw);
        height: 100vh;
        background: var(--color-surface);
        color: var(--color-text);
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        padding: 5rem 1.25rem 1.5rem;
        gap: 0;
        flex: none;
        z-index: 101;
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
        transform: translateX(100%);
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .header__nav--open {
        transform: translateX(0);
    }

    .header__link {
        padding: 0.85rem 0;
        border-bottom: 1px solid var(--color-border);
        font-size: 1rem;
        color: var(--color-text);
    }

    .header__link:hover,
    .header__link.router-link-active {
        color: var(--color-accent);
    }

    .header__link:last-child {
        border-bottom: none;
    }
}
</style>
