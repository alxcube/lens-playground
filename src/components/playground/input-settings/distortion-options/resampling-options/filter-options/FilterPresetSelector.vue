<script setup lang="ts">
import { type ResampleFilterPresetsPoolKeyMap, serviceContainer } from '@alxcube/lens';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue: keyof ResampleFilterPresetsPoolKeyMap | string;
    disabled?: boolean;
  }>(),
  { modelValue: 'Robidoux', disabled: false }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: keyof ResampleFilterPresetsPoolKeyMap | string): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit);

const options = serviceContainer.resolve('ResampleFilterPresetsPool').keys();
</script>

<template>
  <VSelect label="Filter Preset" v-model="valueModel" :items="options" :disabled="props.disabled" />
</template>

<style scoped></style>
