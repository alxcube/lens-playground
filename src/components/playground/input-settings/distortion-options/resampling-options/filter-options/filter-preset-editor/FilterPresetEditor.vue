<script setup lang="ts">
import WeightingFunctionConfigurer from '@/components/playground/input-settings/distortion-options/resampling-options/filter-options/filter-preset-editor/weighting-function-configurer/WeightingFunctionConfigurer';
import type { ResampleFilterPreset } from '@alxcube/lens';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue: ResampleFilterPreset;
    disabled?: boolean;
  }>(),
  { disabled: false }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: ResampleFilterPreset): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit, { passive: true });
</script>

<template>
  <div class="filter-preset-editor">
    <WeightingFunctionConfigurer
      label="Filter weighting function"
      v-model:function-name="valueModel.filterFunctionFactory"
      v-model:function-args="valueModel.filterFunctionFactoryArgs"
      :disabled="props.disabled"
    />

    <WeightingFunctionConfigurer
      label="Window weighting function"
      v-model:function-name="valueModel.windowFunctionFactory"
      v-model:function-args="valueModel.windowFunctionFactoryArgs"
      :disabled="props.disabled"
    />

    <VRow dense>
      <VCol cols="6">
        <VTextField
          label="Support"
          type="number"
          v-model.number="valueModel.support"
          :disabled="props.disabled"
          density="compact"
          variant="outlined"
        />
      </VCol>
      <VCol cols="6">
        <VTextField
          label="Scale"
          type="number"
          v-model.number="valueModel.scale"
          :disabled="props.disabled"
          density="compact"
          variant="outlined"
        />
      </VCol>
    </VRow>
  </div>
</template>

<style scoped></style>
