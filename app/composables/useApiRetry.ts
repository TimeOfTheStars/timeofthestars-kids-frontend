import { onMounted } from 'vue'

/**
 * Флаг «последний запрос не удался». Общий для composable и его обработчика:
 * ключ один, значение попадает в SSR-payload и доезжает до клиента.
 */
export function useApiFailure(name: string) {
  return useState(`${name}-failed`, () => false)
}

/**
 * Запрос, упавший на сервере, повторяем на клиенте: иначе страница остаётся
 * пустой до ручного обновления. `retryDone` говорит, что попытка уже сделана —
 * до этого момента страница показывает загрузку, а не ошибку.
 */
export function useRetryOnFail(name: string, query: { refresh: () => Promise<unknown> }) {
  const failed = useApiFailure(name)
  const retryDone = useState(`${name}-retry-done`, () => false)

  if (import.meta.client) {
    onMounted(async () => {
      if (retryDone.value) return
      if (!failed.value) {
        retryDone.value = true
        return
      }
      try {
        await query.refresh()
      } finally {
        retryDone.value = true
      }
    })
  }

  return { failed, retryDone }
}

