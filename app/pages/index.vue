<template>
  <div>
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
  title: 'Время Звёзд KIDS — Хоккейная школа для детей в Ярославле',
  meta: [
    {
      name: 'description',
      content:
        'Хоккейная школа для детей 3–17 лет в Ярославле. Тренировки в ФГБУ ПОО ГУОР по хоккею: лёд, ОФП, бросковая зона, индивидуальные занятия.'
    }
  ]
})
</script>
