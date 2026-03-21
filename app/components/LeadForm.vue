<template>
    <form
        v-if="!submitted"
        :class="['lead-form', { 'lead-form--surface': variant === 'surface' }]"
        @submit.prevent="onSubmit"
    >
        <p v-if="showHint" class="lead-form__hint">{{ hint }}</p>
        <div class="lead-form__fields">
            <input
                v-model="name"
                type="text"
                placeholder="Имя"
                class="lead-form__input lead-form__name-input"
                required
            />
            <input
                v-model="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                class="lead-form__input lead-form__phone-input"
                required
            />
            <button type="submit" class="lead-form__submit-btn">
                {{ submitLabel }}
            </button>
        </div>
        <label class="lead-form__agree">
            <input v-model="agree" type="checkbox" required />
            <span>Согласие на обработку персональных данных</span>
        </label>
    </form>
    <p v-else class="lead-form__thanks">Спасибо! Ожидайте звонка менеджера.</p>
    <p v-if="!submitted" class="lead-form__disclaimer">
        Заполняя и отправляя форму, Вы даете
        <NuxtLink to="/politika-konfidencialnosti" class="lead-form__disclaimer-link">Согласие на обработку персональных данных</NuxtLink>.
    </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits<{ (e: 'success'): void }>()

withDefaults(
    defineProps<{
        variant?: 'default' | 'surface'
        submitLabel?: string
        showHint?: boolean
        hint?: string
    }>(),
    {
        variant: 'default',
        submitLabel: 'Записаться',
        showHint: true,
        hint: 'Стань частью нашей команды',
    }
)

const name = ref('')
const phone = ref('')
const agree = ref(false)
const submitted = ref(false)

function onSubmit() {
    submitted.value = true
    emit('success')
}
</script>

<style scoped>
.lead-form {
    max-width: 520px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.lead-form__hint {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.9rem;
}
.lead-form__fields {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    margin: 1rem 0;
}
.lead-form__input {
    flex: 1;
    min-width: 120px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    color: #fff;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    transition: all 0.3s ease;
}
.lead-form__name-input {
    max-width: 180px;
}
.lead-form__phone-input {
    min-width: 160px;
}
.lead-form__input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}
.lead-form__input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
}
.lead-form__submit-btn {
    background: #2563eb;
    border: none;
    border-radius: 50px;
    color: #fff;
    padding: 0.625rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    white-space: nowrap;
}
.lead-form__submit-btn:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
}
.lead-form__agree {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    cursor: pointer;
}
.lead-form__agree input {
    margin-top: 0.2rem;
}
.lead-form__thanks {
    color: #22c55e;
    font-weight: 600;
    margin: 0;
}
.lead-form__disclaimer {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--color-text-muted);
}
.lead-form__disclaimer-link {
    color: var(--color-accent);
    text-decoration: underline;
}

.lead-form--surface .lead-form__fields {
    margin: 0 0 0.5rem;
}
.lead-form--surface .lead-form__input {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text);
}
.lead-form--surface .lead-form__input::placeholder {
    color: var(--color-text-muted);
}
.lead-form--surface .lead-form__input:focus {
    background: var(--color-bg);
    border-color: var(--color-accent);
}
.lead-form--surface .lead-form__agree {
    color: var(--color-text-muted);
}
.lead-form--surface .lead-form__disclaimer {
    color: var(--color-text-muted);
}
.lead-form--surface .lead-form__disclaimer-link {
    color: var(--color-accent);
}
</style>
