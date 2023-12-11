<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <VCard class="mb-1">
    <VCardTitle class="text-subtitle-1">{{ props.title }}</VCardTitle>
    <VCardText><slot /></VCardText>
  </VCard>
</template>

<style scoped></style>
