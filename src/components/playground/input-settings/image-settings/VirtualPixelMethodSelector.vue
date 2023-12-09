<script setup lang="ts">
import { VirtualPixelMethod } from '@alxcube/lens';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue?: VirtualPixelMethod;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value?: VirtualPixelMethod): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit);

const options = Object.entries(VirtualPixelMethod)
  .filter(([, value]) => !Number.isNaN(Number(value)))
  .map(([title, value]) => ({ title, value }));
</script>

<template>
  <VSelect
    label="Virtual pixel method"
    v-model="valueModel"
    :items="options"
    :disabled="props.disabled"
    density="compact"
  />
</template>

<style scoped></style>
