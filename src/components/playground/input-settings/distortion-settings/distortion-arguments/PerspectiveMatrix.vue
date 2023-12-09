<script setup lang="ts">
import type { PerspectiveMatrix } from '@alxcube/lens';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue: PerspectiveMatrix;
    disabled?: boolean;
    errorIndexes?: number[];
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: PerspectiveMatrix): void;
}>();

const matrix = useVModel(props, 'modelValue', emit, { passive: true });

const coefficientNames = ['sx', 'ry', 'tx', 'rx', 'sy', 'ty', 'px', 'py'];

const setValue = (index: number, value: string) => (matrix.value[index] = Number(value));

const getIsError = (index: number) =>
  props.errorIndexes !== undefined && props.errorIndexes.includes(index);
</script>

<template>
  <div class="perspective-matrix">
    <VRow dense>
      <VCol cols="4" v-for="(label, index) in coefficientNames" :key="label">
        <VTextField
          :label="label"
          type="number"
          :model-value="matrix[index]"
          :disabled="props.disabled"
          :error="getIsError(index)"
          @update:model-value="setValue(index, $event)"
          density="compact"
          variant="outlined"
        />
      </VCol>
    </VRow>
  </div>
</template>

<style scoped></style>
