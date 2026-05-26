<template>
  <div>
    <p class="sr-only">
      Детская хоккейная школа «Время Звёзд KIDS» в Ярославле — секция хоккея с шайбой для детей 3–17 лет.
      Тренировки на льду ФГБУ ПОО «ГУОР по хоккею», ОФП, бросковая зона, индивидуальные занятия,
      хоккейные сборы и турниры.
    </p>
    <HeroSection />
    <LionsBlock />
    <BenefitsSection />
    <ArenaSlider />
    <TestimonialsSection />
    <FaqSection />
    <NewsSection />
    <MapSection />
    <ContactQuestionsSection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Хоккейная школа для детей в Ярославле — секция хоккея с шайбой «Время Звёзд KIDS»',
  meta: [
    {
      name: 'description',
      content:
        'Детская хоккейная школа в Ярославле для мальчиков и девочек 3–17 лет. Хоккей с шайбой, ОФП, бросковая зона, индивидуальные тренировки. Занятия на льду ФГБУ ПОО ГУОР по хоккею. Запись круглый год.'
    },
    {
      name: 'keywords',
      content:
        'хоккей дети Ярославль, детская хоккейная школа Ярославль, секция хоккея для детей, хоккей с шайбой для детей, хоккейные сборы Ярославль, ГУОР Ярославль'
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://timeofthestars-kids.ru/' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['SportsClub', 'SportsActivityLocation'],
        name: 'Время Звёзд KIDS',
        alternateName: 'АНФСО «ВРЕМЯ ЗВЕЗД»',
        description: 'Детская хоккейная школа в Ярославле для мальчиков и девочек 3–17 лет. Хоккей с шайбой, ОФП, бросковая зона, индивидуальные тренировки.',
        url: 'https://timeofthestars-kids.ru/',
        logo: 'https://timeofthestars-kids.ru/logo-star-kids.webp',
        image: 'https://timeofthestars-kids.ru/logo-star-kids.webp',
        telephone: '+79201191315',
        email: 'Time_of_the_stars@mail.ru',
        sport: 'Ice Hockey',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Дядьковская улица, 7',
          addressLocality: 'Ярославль',
          addressRegion: 'Ярославская область',
          postalCode: '150006',
          addressCountry: 'RU'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 57.583665,
          longitude: 39.902303
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '21:00'
        },
        sameAs: ['https://vk.com/club125696800'],
        areaServed: { '@type': 'City', name: 'Ярославль' }
      })
    }
  ]
})
</script>
