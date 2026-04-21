<template>
  <div class="page kontakty-page">
    <div class="container">
      <Breadcrumbs :items="[{ title: 'Главная', to: '/' }, { title: 'Контакты' }]" />
      <h1 class="page__title">Контакты</h1>

      <section class="page-surface">
        <div class="kontakty__content">
          <p><strong>Адрес:</strong> {{ address }}</p>
          <p>
            <strong>Телефон:</strong>
            <a :href="`tel:${CONTACT_PHONE_TEL}`" class="kontakty__phone">{{ CONTACT_PHONE_DISPLAY }}</a>
          </p>
          <p><strong>E-mail:</strong> <a :href="`mailto:${email}`">{{ email }}</a></p>
        </div>
        <div class="kontakty__map">
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=39.902303%2C57.583665&z=16&pt=39.902303%2C57.583665"
            width="100%"
            height="100%"
            allowfullscreen
            title="Карта"
            class="kontakty__map-iframe"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '~/constants/contacts'

const address = 'Дядьковская улица, 7, Ярославль, 150006'
const email = 'Time_of_the_stars@mail.ru'
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
.kontakty__content p {
  margin: 0 0 0.75rem;
  line-height: 1.5;
}
.kontakty__content a {
  color: var(--color-accent);
  text-decoration: none;
}
.kontakty__content a:hover {
  text-decoration: underline;
}
.kontakty__phone {
  margin-left: 0.35rem;
  font-weight: 600;
}
.kontakty__map {
  margin-top: 2rem;
  aspect-ratio: 16/9;
  max-width: 800px;
  border-radius: var(--radius);
  overflow: hidden;
  position: relative;
}
.kontakty__map-iframe {
  position: absolute;
  inset: 0;
  border: 0;
  border-radius: inherit;
}
</style>
