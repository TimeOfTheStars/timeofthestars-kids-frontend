<template>
    <div class="appointment-modal" @click.self="emit('close')">
        <div class="appointment-modal__inner">
            <div class="appointment-modal__top">
                <h3 class="appointment-modal__title">Записаться</h3>
                <button
                    type="button"
                    class="appointment-modal__close"
                    aria-label="Закрыть"
                    @click="emit('close')"
                >
                    ×
                </button>
            </div>

            <form v-if="!submitted" class="appointment-modal__form" @submit.prevent="onSubmit">
                <div class="appointment-modal__fields">
                    <input
                        v-model="phone"
                        type="tel"
                        inputmode="tel"
                        autocomplete="tel"
                        placeholder="+7 (___) ___-__-__"
                        class="appointment-modal__input"
                        @input="onPhoneInput"
                        required
                    />
                    <input
                        v-model="parentName"
                        type="text"
                        placeholder="ФИО родителя"
                        class="appointment-modal__input"
                        required
                    />
                    <input
                        v-model="childName"
                        type="text"
                        placeholder="ФИО ребёнка"
                        class="appointment-modal__input"
                        required
                    />
                    <input
                        v-model.number="childAge"
                        type="number"
                        min="1"
                        max="18"
                        inputmode="numeric"
                        placeholder="Возраст ребёнка"
                        class="appointment-modal__input"
                        required
                    />
                </div>

                <p v-if="errorText" class="appointment-modal__error" role="alert">
                    {{ errorText }}
                </p>

                <label class="appointment-modal__agree">
                    <input v-model="agree" type="checkbox" required />
                    <span>Согласие на обработку персональных данных</span>
                </label>

                <p class="appointment-modal__disclaimer">
                    Заполняя и отправляя форму, Вы даете
                    <NuxtLink
                        to="/politika-konfidencialnosti"
                        class="appointment-modal__disclaimer-link"
                        @click="emit('close')"
                        >Согласие на обработку персональных данных</NuxtLink
                    >.
                </p>

                <button type="submit" class="btn appointment-modal__submit" :disabled="loading">
                    Отправить
                </button>
            </form>

            <p v-else class="appointment-modal__thanks">
                Спасибо! Ожидайте звонка менеджера.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { postJson } from '~/utils/api'

const props = defineProps<{
    initialPhone?: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'success'): void
}>()

const phone = ref(props.initialPhone ?? '')
const parentName = ref('')
const childName = ref('')
const childAge = ref<number | null>(null)
const agree = ref(false)

const loading = ref(false)
const submitted = ref(false)
const errorText = ref<string | null>(null)

function normalizePhone(raw: string) {
    const digitsOnly = raw.replace(/\D/g, '')
    const hasPlus = raw.trim().startsWith('+')
    return `${hasPlus ? '+' : ''}${digitsOnly}`
}

function onPhoneInput(e: Event) {
    phone.value = normalizePhone((e.target as HTMLInputElement).value)
}

watch(
    () => props.initialPhone,
    (v) => {
        if (v) phone.value = v
    }
)

async function onSubmit() {
    if (loading.value) return
    errorText.value = null
    loading.value = true

    try {
        await postJson('/appointments', {
            phone: phone.value.trim(),
            parent_name: parentName.value.trim(),
            child_name: childName.value.trim(),
            child_age: childAge.value,
        })
        submitted.value = true
        emit('success')
    } catch (e) {
        errorText.value = 'Не удалось отправить. Попробуйте ещё раз.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.appointment-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 220;
    padding: 1rem;
}
.appointment-modal__inner {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    max-width: 520px;
    width: 100%;
    padding: 1.5rem;
}
.appointment-modal__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
}
.appointment-modal__title {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-text);
}
.appointment-modal__close {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    border: 1px solid var(--color-border);
    background: var(--color-bg-alt);
    color: var(--color-text);
    font-size: 28px;
    line-height: 1;
    padding: 0;
    cursor: pointer;
}
.appointment-modal__close:hover {
    background: var(--color-border);
}
.appointment-modal__form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
.appointment-modal__fields {
    display: grid;
    gap: 0.75rem;
}
.appointment-modal__input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: var(--radius);
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
}
.appointment-modal__input:focus {
    outline: none;
    border-color: var(--color-accent);
}
.appointment-modal__agree {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    cursor: pointer;
}
.appointment-modal__agree input {
    margin-top: 0.2rem;
}
.appointment-modal__disclaimer {
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.4;
}
.appointment-modal__disclaimer-link {
    color: var(--color-accent);
    text-decoration: underline;
}
.appointment-modal__submit {
    width: 100%;
}
.appointment-modal__error {
    margin: 0;
    color: #ef4444;
    font-size: 0.9rem;
}
.appointment-modal__thanks {
    margin: 0;
    color: #22c55e;
    font-weight: 600;
    line-height: 1.5;
}
</style>

