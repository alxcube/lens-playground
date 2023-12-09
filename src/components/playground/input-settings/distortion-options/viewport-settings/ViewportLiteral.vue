<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue: { x1: number; y1: number; x2: number; y2: number };
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: { x1: number; y1: number; x2: number; y2: number }): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit, { passive: true });
</script>

<template>
  <VRow dense>
    <VCol cols="3">
      <VTextField
        label="x1"
        v-model.number="valueModel.x1"
        type="number"
        :disabled="props.disabled"
        density="compact"
        variant="outlined"
      />
    </VCol>
    <VCol cols="3">
      <VTextField
        label="y1"
        v-model.number="valueModel.y1"
        type="number"
        :disabled="props.disabled"
        density="compact"
        variant="outlined"
      />
    </VCol>
    <VCol cols="3">
      <VTextField
        label="x2"
        v-model.number="valueModel.x2"
        type="number"
        :disabled="props.disabled"
        density="compact"
        variant="outlined"
      />
    </VCol>
    <VCol cols="3">
      <VTextField
        label="y2"
        v-model.number="valueModel.y2"
        type="number"
        :disabled="props.disabled"
        density="compact"
        variant="outlined"
      />
    </VCol>
  </VRow>
</template>

<style scoped></style>
