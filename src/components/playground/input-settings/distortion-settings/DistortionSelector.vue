<script setup lang="ts">
import { type ReversePixelMapperFactoriesPoolKeyMap, serviceContainer } from '@alxcube/lens';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue?: keyof ReversePixelMapperFactoriesPoolKeyMap | string;
    disabled?: boolean;
    errors?: string[];
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value?: keyof ReversePixelMapperFactoriesPoolKeyMap | string): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit);

const distortionNames = serviceContainer.resolve('ReversePixelMapperFactoriesPool').keys();
</script>

<template>
  <VSelect
    label="Distortion"
    :items="distortionNames"
    v-model="valueModel"
    :disabled="props.disabled"
    :error-messages="props.errors"
    density="compact"
  />
</template>

<style scoped></style>
