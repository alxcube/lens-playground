<script setup lang="ts">
import type { AffineMatrix } from '@alxcube/lens';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue: AffineMatrix;
    disabled?: boolean;
    errorIndexes?: number[];
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: AffineMatrix): void;
}>();

const matrix = useVModel(props, 'modelValue', emit, { passive: true });

// Notice indexes: arguments order is [sx, ry, rx, sy, tx, ty]
const argsMap = [
  { label: 'sx', index: 0 },
  { label: 'rx', index: 2 },
  { label: 'tx', index: 4 },
  { label: 'ry', index: 1 },
  { label: 'sy', index: 3 },
  { label: 'ty', index: 5 }
];

const getIsError = (index: number) =>
  props.errorIndexes !== undefined && props.errorIndexes.includes(index);
const setValue = (index: number, value: string) => (matrix.value[index] = Number(value));
</script>

<template>
  <div class="affine-matrix">
    <VRow dense>
      <VCol cols="2" v-for="{ label, index } in argsMap" :key="label">
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
