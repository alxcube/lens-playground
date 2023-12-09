<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    x?: number;
    y?: number;
    xLabel?: string;
    yLabel?: string;
    disabled?: boolean;
    xError?: boolean;
    yError?: boolean;
  }>(),
  {
    x: 0,
    y: 0,
    xLabel: 'x',
    yLabel: 'y',
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:x', value: number): void;
  (e: 'update:y', value: number): void;
}>();

const xModel = useVModel(props, 'x', emit);
const yModel = useVModel(props, 'y', emit);
</script>

<template>
  <VRow dense>
    <VCol cols="6">
      <VTextField
        type="number"
        v-model.number="xModel"
        :label="props.xLabel"
        :disabled="props.disabled"
        :error="props.xError"
        density="compact"
        variant="outlined"
      />
    </VCol>
    <VCol cols="6">
      <VTextField
        type="number"
        v-model.number="yModel"
        :label="props.yLabel"
        :disabled="props.disabled"
        :error="props.yError"
        density="compact"
        variant="outlined"
      />
    </VCol>
  </VRow>
</template>

<style scoped></style>
