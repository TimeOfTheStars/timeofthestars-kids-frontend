<template>
  <section class="contact-questions section">
    <div class="container">
      <h2 v-reveal class="section-title">Остались вопросы?</h2>
      <div v-reveal="{ delay: 100 }" class="contact-questions__form-wrap">
        <LeadForm
          variant="surface"
          submit-label="Отправить"
          hint="Напишите, как с вами связаться — перезвоним и ответим на вопросы."
          :show-hint="true"
        />
      </div>
      <p v-reveal="{ delay: 180 }" class="contact-questions__phone">
        <span class="contact-questions__phone-label">Задать вопрос можно по телефону —</span>
        <a :href="`tel:${CONTACT_PHONE_TEL}`" class="contact-questions__phone-link">{{ CONTACT_PHONE_DISPLAY }}</a>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '~/constants/contacts'
</script>

<style scoped>
.contact-questions {
  background: var(--color-bg-alt);
  border-top: 1px solid var(--color-border);
}
.contact-questions__form-wrap {
  max-width: 560px;
  margin: 0 auto 2rem;
}
.contact-questions__phone {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.35rem 0.5rem;
  text-align: center;
}
.contact-questions__phone-label {
  font-size: 1.05rem;
  color: var(--color-text-muted);
}
.contact-questions__phone-link {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s;
}
.contact-questions__phone-link:hover {
  color: var(--color-accent);
}
@media (max-width: 480px) {
  .contact-questions__phone {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .contact-questions__phone-label {
    font-size: 0.95rem;
  }
  .contact-questions__phone-link {
    font-size: 1.25rem;
  }
}
</style>
