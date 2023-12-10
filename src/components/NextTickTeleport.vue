<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps<{
  to: string;
  disabled?: boolean;
}>();
const shouldRender = ref(false);

onMounted(() => {
  nextTick(() => {
    shouldRender.value = true;
  });
});
</script>

<template>
  <Teleport v-if="shouldRender" :to="props.to" :disabled="props.disabled">
    <slot />
  </Teleport>
</template>

<style scoped></style>
