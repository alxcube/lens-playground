<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue: number[];
    disabled?: boolean;
  }>(),
  { disabled: false }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void;
}>();

const args = useVModel(props, 'modelValue', emit, { passive: true });
</script>

<template>
  <div class="cubic-b-c-arguments">
    <VRow dense>
      <VCol cols="6">
        <VTextField
          label="b"
          type="number"
          v-model.number="args[0]"
          :disabled="props.disabled"
          density="compact"
          variant="outlined"
        />
      </VCol>
      <VCol cols="6">
        <VTextField
          label="c"
          type="number"
          v-model.number="args[1]"
          :disabled="props.disabled"
          density="compact"
          variant="outlined"
        />
      </VCol>
    </VRow>
  </div>
</template>

<style scoped></style>
