<script setup lang="ts">
import { serviceContainer, type WeightingFunctionFactoriesPoolKeyMap } from '@alxcube/lens';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue?: keyof WeightingFunctionFactoriesPoolKeyMap | string;
    disabled?: boolean;
    label: string;
  }>(),
  { modelValue: 'Box', disabled: false }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: keyof WeightingFunctionFactoriesPoolKeyMap | string): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit);

const options = serviceContainer.resolve('WeightingFunctionFactoriesPool').keys();
</script>

<template>
  <VSelect
    :items="options"
    v-model="valueModel"
    :label="props.label"
    :disabled="props.disabled"
    density="compact"
  />
</template>

<style scoped></style>
