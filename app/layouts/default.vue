<template>
    <div class="layout">
        <div class="bg-orbs" aria-hidden="true">
            <span class="bg-orb bg-orb--1"></span>
            <span class="bg-orb bg-orb--2"></span>
            <span class="bg-orb bg-orb--3"></span>
        </div>
        <TheHeader />
        <main class="main" :class="{ 'main--with-offset': !isHomePage }">
            <slot />
        </main>
        <TheFooter />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

<style scoped>
.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
}
.main {
    flex: 1;
    padding-top: 0;
    position: relative;
    z-index: 1;
}
.main.main--with-offset {
    padding-top: 120px;
}

.bg-orbs {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
}
.bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.08;
}
.bg-orb--1 {
    width: 650px;
    height: 650px;
    background: #2563eb;
    top: -15%;
    left: -8%;
    animation: drift-1 22s ease-in-out infinite alternate;
}
.bg-orb--2 {
    width: 550px;
    height: 550px;
    background: #7c3aed;
    bottom: 0%;
    right: -8%;
    animation: drift-2 28s ease-in-out infinite alternate;
    animation-delay: -10s;
}
.bg-orb--3 {
    width: 400px;
    height: 400px;
    background: #1d4ed8;
    top: 45%;
    left: 40%;
    animation: drift-3 35s ease-in-out infinite alternate;
    animation-delay: -18s;
    opacity: 0.05;
}

@keyframes drift-1 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(50px, 70px) scale(1.1); }
}
@keyframes drift-2 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-60px, -50px) scale(1.12); }
}
@keyframes drift-3 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, -80px) scale(0.9); }
}
</style>
