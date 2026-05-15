// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['nuxt-swiper', '@nuxt/icon'],
  routeRules: {
    '/abonementy': { redirect: { to: '/services', statusCode: 301 } },
    '/abonementy/': { redirect: { to: '/services', statusCode: 301 } },
    '/hokkeynaya-shkola': { redirect: { to: '/about', statusCode: 301 } },
    '/hokkeynaya-shkola/': { redirect: { to: '/about', statusCode: 301 } },
    '/sbory': { redirect: { to: '/camps', statusCode: 301 } },
    '/sbory/': { redirect: { to: '/camps', statusCode: 301 } },
    '/turniry': { redirect: { to: '/tournaments', statusCode: 301 } },
    '/turniry/': { redirect: { to: '/tournaments', statusCode: 301 } },
    '/trenery': { redirect: { to: '/coaches', statusCode: 301 } },
    '/trenery/': { redirect: { to: '/coaches', statusCode: 301 } },
    '/kontakty': { redirect: { to: '/contacts', statusCode: 301 } },
    '/kontakty/': { redirect: { to: '/contacts', statusCode: 301 } },
    '/arenda': { redirect: { to: '/rent', statusCode: 301 } },
    '/arenda/': { redirect: { to: '/rent', statusCode: 301 } },
    '/individualnye-trenirovki': { redirect: { to: '/individual-training', statusCode: 301 } },
    '/individualnye-trenirovki/': { redirect: { to: '/individual-training', statusCode: 301 } },
    '/politika-konfidencialnosti': { redirect: { to: '/privacy-policy', statusCode: 301 } },
    '/politika-konfidencialnosti/': { redirect: { to: '/privacy-policy', statusCode: 301 } },
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/webp', href: '/logo-star-kids.webp' },
      ],
    },
  },
})
