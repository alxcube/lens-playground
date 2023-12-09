<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  scale: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'fit'): void;
  (e: 'zoom-in'): void;
  (e: 'zoom-out'): void;
  (e: 'full-size'): void;
}>();

const scalePercent = computed(() => {
  return Math.round(props.scale * 100);
});
</script>

<template>
  <VBtn :disabled="props.disabled" icon small @click="emit('zoom-out')">
    <VIcon>mdi-magnify-minus-outline</VIcon>
  </VBtn>

  <VBtn :disabled="props.disabled" small width="30" class="ml-2">
    {{ scalePercent }}%
    <VMenu :disabled="props.disabled" activator="parent">
      <VList>
        <VListItem title="100%" @click="emit('full-size')" />
        <VListItem title="Fit" @click="emit('fit')" />
      </VList>
    </VMenu>
  </VBtn>

  <VBtn :disabled="props.disabled" icon small class="ml-2" @click="emit('zoom-in')">
    <VIcon>mdi-magnify-plus-outline</VIcon>
  </VBtn>
</template>

<style scoped></style>
