<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppNav from '@/components/AppNav.vue';
</script>

<template>
    <div class="home-layout">
        <app-nav></app-nav>
        <div class="home-layout__right">
            <app-header></app-header>
            <div class="home-layout__content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home-layout {
    display: flex;
    gap: 20px;
}

.home-layout__right {
    margin-top: 10px;
    width: 100%;
}

.home-layout__content {
    margin-top: 20px;
}
</style>
