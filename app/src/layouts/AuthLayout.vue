<script setup lang="ts"></script>

<template>
  <div class="auth__bg">
    <div class="auth__box">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.auth__bg {
  min-height: 100vh;
  background: linear-gradient(
    45deg,
    var(--color-element-transparent),
    var(--color-element),
    var(--color-element-hover)
  );
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.auth__box {
  padding: 20px;
  border-radius: var(--border-radius-large);
  background-color: var(--color-block);
  max-width: 500px;
  min-width: 350px;
}
</style>
