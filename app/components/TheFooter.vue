<template>
    <footer class="footer">
        <div class="footer__inner">
            <div class="footer__top">
                <NuxtLink to="/" class="footer__logo"><BrandName /></NuxtLink>
                <div class="footer__contacts">
                    <span class="footer__address">{{ address }}</span>
                    <a :href="`mailto:${email}`" class="footer__email">{{
                        email
                    }}</a>
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
                <span class="footer__copy">© 2026, <BrandName /></span>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const address = 'Дядьковская улица, 7, Ярославль, 150006'
const email = 'Time-of-the-stars@mail.ru'
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
.footer__email {
    color: var(--color-accent);
    text-decoration: none;
}
.footer__email:hover {
    text-decoration: underline;
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
@media (max-width: 768px) {
    .footer__top {
        grid-template-columns: 1fr;
    }
}
</style>
