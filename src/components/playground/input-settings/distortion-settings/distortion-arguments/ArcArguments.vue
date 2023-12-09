<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { ArcDistortionArgs } from '@alxcube/lens';

const props = withDefaults(
  defineProps<{
    modelValue: ArcDistortionArgs;
    disabled?: boolean;
    errorIndexes?: number[];
  }>(),
  { disabled: false }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: ArcDistortionArgs): void;
}>();

const args = useVModel(props, 'modelValue', emit, { passive: true });

const setValue = (index: number, value?: string | number | null) => {
  const numValue = Number(value);
  if (index > 0) {
    if (args.value[index - 1] === undefined) {
      setValue(index - 1, 0);
    }
  }
  if (Number.isNaN(numValue) || value === null) {
    if (index === 0) {
      args.value[index] = 0;
    } else {
      args.value.splice(index);
    }
  } else {
    args.value[index] = numValue;
  }
};

interface ArgDefinition {
  label: string;
  clearable: boolean;
  min?: number;
  max?: number;
}

const argsDefinitions: ArgDefinition[] = [
  {
    label: 'Arc Angle',
    clearable: false,
    min: 0.1,
    max: 360
  },
  {
    label: 'Rotation Angle',
    clearable: true
  },
  {
    label: 'Outer Radius',
    clearable: true
  },
  {
    label: 'Inner Radius',
    clearable: true,
    min: 0
  }
];

const getIsError = (index: number) =>
  props.errorIndexes !== undefined && props.errorIndexes.includes(index);
</script>

<template>
  <div class="arc-arguments">
    <VRow dense>
      <VCol
        v-for="({ label, clearable, min, max }, index) in argsDefinitions"
        cols="6"
        :key="label"
      >
        <VTextField
          type="number"
          :label="label"
          :model-value="args[index]"
          @update:model-value="setValue(index, $event)"
          :clearable="clearable"
          density="compact"
          variant="outlined"
          :min="min"
          :max="max"
          :disabled="disabled"
          :error="getIsError(index)"
        />
      </VCol>
    </VRow>
  </div>
</template>

<style scoped></style>
