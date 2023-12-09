<script setup lang="ts">
import { InterpolationMethod } from '@alxcube/lens';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue?: InterpolationMethod;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value?: InterpolationMethod): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit);

const options = Object.entries(InterpolationMethod)
  .filter(([, value]) => !Number.isNaN(Number(value)))
  .map(([title, value]) => ({ title, value }));
</script>

<template>
  <VSelect
    label="Interpolation method"
    v-model="valueModel"
    :items="options"
    :disabled="props.disabled"
    density="compact"
  />
</template>

<style scoped></style>
