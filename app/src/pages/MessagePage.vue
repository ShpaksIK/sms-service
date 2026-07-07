<script setup lang="ts">
import SmsHistoryTable from '@/components/SmsHistoryTable.vue';
import HomeLayout from './../layouts/HomeLayout.vue';
</script>

<template>
  <home-layout>
    <h1>История сообщений</h1>
    <sms-history-table></sms-history-table>
  </home-layout>
</template>

<style scoped></style>
