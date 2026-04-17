<template>
  <section class="contact-questions section">
    <div class="container">
      <h2 v-reveal class="section-title">Остались вопросы?</h2>
      <div v-reveal="{ delay: 100 }" class="contact-questions__form-wrap">
        <div v-if="!submitted" class="contact-questions__cta">
          <button type="button" class="btn contact-questions__btn" @click="modalOpen = true">
            Записаться
          </button>
          <p class="contact-questions__disclaimer">
            Нажимая «Записаться», Вы даете
            <NuxtLink to="/politika-konfidencialnosti" class="contact-questions__disclaimer-link"
              >Согласие на обработку персональных данных</NuxtLink
            >.
          </p>
        </div>
        <p v-else class="contact-questions__thanks">Спасибо! Ожидайте звонка менеджера.</p>
      </div>
      <p v-reveal="{ delay: 180 }" class="contact-questions__phone">
        <span class="contact-questions__phone-label">Задать вопрос можно по телефону —</span>
        <a :href="`tel:${CONTACT_PHONE_TEL}`" class="contact-questions__phone-link">{{ CONTACT_PHONE_DISPLAY }}</a>
      </p>
    </div>

    <AppointmentModal
      v-if="modalOpen"
      @close="modalOpen = false"
      @success="onSuccess"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '~/constants/contacts'
import AppointmentModal from '~/components/AppointmentModal.vue'

const modalOpen = ref(false)
const submitted = ref(false)

function onSuccess() {
  modalOpen.value = false
  submitted.value = true
}
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
.contact-questions__cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}
.contact-questions__btn {
  width: 100%;
  max-width: 340px;
}
.contact-questions__disclaimer {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.45;
}
.contact-questions__disclaimer-link {
  color: var(--color-accent);
  text-decoration: underline;
}
.contact-questions__thanks {
  margin: 0;
  color: #22c55e;
  font-weight: 600;
  text-align: center;
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
