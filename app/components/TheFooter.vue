<template>
    <footer class="footer">
        <div class="footer__inner">
            <div class="footer__top">
                <NuxtLink to="/" class="footer__logo"><BrandName /></NuxtLink>
                <div class="footer__contacts">
                    <span class="footer__address">{{ address }}</span>
                    <a :href="`tel:${CONTACT_PHONE_TEL}`" class="footer__phone">{{ CONTACT_PHONE_DISPLAY }}</a>
                    <span class="footer__hours">{{ hours }}</span>
                    <span class="footer__feedback">
                        Обратная связь:
                        <a :href="`mailto:${feedbackEmail}`" class="footer__feedback-link">{{ feedbackEmail }}</a>
                    </span>
                    <a
                        :href="vkGroupUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="footer__vk"
                        aria-label="Группа ВКонтакте"
                    >
                        <img
                            src="/icons8-vk.svg"
                            alt=""
                            class="footer__vk-icon"
                            width="32"
                            height="32"
                            decoding="async"
                        />
                    </a>
                </div>
                <nav class="footer__nav">
                    <NuxtLink to="/hokkeynaya-shkola"
                        >Сведения об образовательной организации</NuxtLink
                    >
                    <NuxtLink to="/abonementy">Услуги</NuxtLink>
                    <NuxtLink to="/individualnye-trenirovki"
                        >Индивидуальные тренировки</NuxtLink
                    >
                    <NuxtLink to="/trenery">Тренеры</NuxtLink>
                    <NuxtLink to="/kontakty">Контакты</NuxtLink>
                </nav>
            </div>
            <div class="footer__bottom">
                <span class="footer__copy">© 2026 Время Звёзд Kids</span>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '~/constants/contacts'

const address = 'Дядьковская улица, 7, Ярославль, 150006'
const hours = 'Работаем ежедневно с 6:00 до 24:00'
const feedbackEmail = 'Time_of_the_stars@mail.ru'
const vkGroupUrl = 'https://vk.com/club125696800'
</script>

<style scoped>
.footer {
    background: var(--color-bg-alt);
    color: var(--color-text-muted);
    padding: 2rem 1rem 1rem;
    margin-top: auto;
    border-top: 1px solid var(--color-border);
}
.footer__inner {
    max-width: 1200px;
    margin: 0 auto;
}
.footer__top {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 2rem;
    align-items: start;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border);
}
.footer__logo {
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--color-text);
    text-decoration: none;
}
.footer__contacts {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.footer__phone {
    color: var(--color-accent);
    text-decoration: none;
    font-weight: 600;
}
.footer__phone:hover {
    text-decoration: underline;
}
.footer__hours {
    font-size: 0.9rem;
}
.footer__feedback {
    font-size: 0.9rem;
}
.footer__feedback-link {
    color: var(--color-accent);
    text-decoration: none;
}
.footer__feedback-link:hover {
    text-decoration: underline;
}
.footer__vk {
    display: inline-flex;
    align-items: center;
    margin-top: 0.25rem;
    text-decoration: none;
    transition: opacity 0.2s, transform 0.2s;
}
.footer__vk:hover {
    opacity: 0.9;
    transform: scale(1.05);
}
.footer__vk-icon {
    display: block;
    width: 32px;
    height: 32px;
}
.footer__nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.footer__nav a {
    color: var(--color-text-muted);
    text-decoration: none;
}
.footer__nav a:hover {
    color: var(--color-accent);
}
.footer__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding-top: 1rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
}
.footer__copy {
    color: var(--color-text-muted);
}
@media (max-width: 768px) {
    .footer__top {
        grid-template-columns: 1fr;
    }
}
</style>
