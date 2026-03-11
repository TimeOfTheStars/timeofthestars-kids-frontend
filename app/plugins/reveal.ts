export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    },
    mounted(el: HTMLElement, binding) {
      const delay: number = binding.value?.delay ?? 0
      el.style.setProperty('--reveal-delay', `${delay}ms`)
      el.classList.add('v-reveal')

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('v-reveal--visible')
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      )
      observer.observe(el)
    }
  })
})
