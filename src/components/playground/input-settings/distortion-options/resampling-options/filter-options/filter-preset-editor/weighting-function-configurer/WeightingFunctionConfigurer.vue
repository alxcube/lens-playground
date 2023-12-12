<script setup lang="ts">
import CubicBcArguments from '@/components/playground/input-settings/distortion-options/resampling-options/filter-options/filter-preset-editor/weighting-function-configurer/CubicBcArguments.vue';
import WeightingFunctionSelector from '@/components/playground/input-settings/distortion-options/resampling-options/filter-options/filter-preset-editor/weighting-function-configurer/WeightingFunctionSelector.vue';
import type { WeightingFunctionFactoriesPoolKeyMap } from '@alxcube/lens';
import { useVModel } from '@vueuse/core';
import { watch } from 'vue';

const props = withDefaults(
  defineProps<{
    functionName: keyof WeightingFunctionFactoriesPoolKeyMap | string;
    functionArgs: number[];
    label: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:functionName', value: keyof WeightingFunctionFactoriesPoolKeyMap | string): void;
  (e: 'update:functionArgs', value: number[]): void;
}>();

const functionNameModel = useVModel(props, 'functionName', emit);
const functionArgsModel = useVModel(props, 'functionArgs', emit, { passive: true });

watch(functionNameModel, (name?: keyof WeightingFunctionFactoriesPoolKeyMap | string) => {
  switch (name) {
    case 'CubicBC':
      functionArgsModel.value = [0, 0];
      break;
    default:
      functionArgsModel.value = [];
      break;
  }
});
</script>

<template>
  <div class="weighting-function-configurer">
    <WeightingFunctionSelector
      :label="props.label"
      v-model="functionNameModel"
      :disabled="props.disabled"
    />

    <VExpandTransition>
      <CubicBcArguments
        v-if="functionNameModel === 'CubicBC'"
        v-model="functionArgsModel"
        :disabled="props.disabled"
      />
    </VExpandTransition>
  </div>
</template>

<style scoped></style>
