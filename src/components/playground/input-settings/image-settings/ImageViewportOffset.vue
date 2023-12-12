<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue: [number, number];
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: [number, number]): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit, { passive: true });
</script>

<template>
  <VRow dense>
    <VCol cols="6">
      <VTextField
        label="x"
        type="number"
        v-model.number="valueModel[0]"
        :disabled="props.disabled"
        density="compact"
        variant="outlined"
      />
    </VCol>
    <VCol cols="6">
      <VTextField
        label="y"
        type="number"
        v-model.number="valueModel[1]"
        :disabled="props.disabled"
        density="compact"
        variant="outlined"
      />
    </VCol>
  </VRow>
</template>

<style scoped></style>
