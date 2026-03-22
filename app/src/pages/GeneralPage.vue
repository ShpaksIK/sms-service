<script setup lang="ts">
import HomeLayout from '../layouts/HomeLayout.vue';
</script>

<template>
    <home-layout>
        <h2>Статистика</h2>
        <div class="general__stats">
            <div class="general__stats__stat">
                <b>0</b>
                <p class="general__stats__stat_blue">Отправлено всего</p>
            </div>

            <div class="general__stats__stat">
                <b>0</b>
                <p class="general__stats__stat_green">Доставлено</p>
            </div>

            <div class="general__stats__stat">
                <b>0</b>
                <p class="general__stats__stat_light-blue">Не доставлено</p>
            </div>

            <div class="general__stats__stat">
                <b>0</b>
                <p class="general__stats__stat_red">С ошибкой отправки</p>
            </div>

            <div class="general__stats__stat">
                <b>0</b>
                <p class="general__stats__stat_yellow">С ошибкой доставки</p>
            </div>
        </div>
    </home-layout>
</template>

<style scoped>
.general__stats {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.general__stats__stat {
    border-radius: var(--border-radius-large);
    background-color: var(--color-block);
    padding: 20px 10px;
    flex-grow: 1;
}

.general__stats__stat b {
    font-size: var(--font-size-accent);
    font-weight: normal;
}

.general__stats__stat p {
    font-weight: bold;
}

.general__stats__stat_blue {
    color: #1374ce;
}

.general__stats__stat_green {
    color: rgb(40 199 111);
}

.general__stats__stat_light-blue {
    color: rgb(6, 182, 212);
}

.general__stats__stat_red {
    color: rgb(255, 67, 67);
}

.general__stats__stat_yellow {
    color: rgb(255 159 67);
}
</style>
