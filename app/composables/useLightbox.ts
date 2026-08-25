export interface LightboxPhoto {
  src: string
  /** Подпись под фотографией и текст для alt */
  title?: string | null
}

/**
 * Просмотр фотографии на весь экран. Общее состояние, потому что открывают
 * и модалка команды, и страница игрока, а рисует компонент в лэйауте.
 */
export function useLightbox() {
  const photo = useState<LightboxPhoto | null>('lightbox', () => null)

  function openPhoto(next: LightboxPhoto) {
    if (!next.src) return
    photo.value = next
  }

  function closePhoto() {
    photo.value = null
  }

  return { photo, openPhoto, closePhoto }
}
