<script setup lang="ts">
import FilterPresetEditor from '@/components/playground/input-settings/distortion-options/resampling-options/filter-options/filter-preset-editor/FilterPresetEditor';
import FilterPresetSelector from '@/components/playground/input-settings/distortion-options/resampling-options/filter-options/FilterPresetSelector';
import {
  type ResampleFilterPreset,
  ResampleFilterPresetsPoolKeyMap,
  serviceContainer
} from '@alxcube/lens';
import { useVModel } from '@vueuse/core';
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: ResampleFilterPreset;
    filterBlur?: number;
    filterWindowSupport?: number;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: ResampleFilterPreset): void;
  (e: 'update:filterBlur', value?: number): void;
  (e: 'update:filterWindowSupport', value?: number): void;
}>();

const presetsPool = serviceContainer.resolve('ResampleFilterPresetsPool');
const presetName = ref<keyof ResampleFilterPresetsPoolKeyMap | string>('Robidoux');
const valueModel = useVModel(props, 'modelValue', emit, { passive: true });
const filterBlurModel = useVModel(props, 'filterBlur', emit);
const filterWindowSupportModel = useVModel(props, 'filterWindowSupport', emit);
const shouldDisplayFilterPresetEditor = ref<boolean>(false);
const shouldDisplayExpertSettings = ref<boolean>(false);

const clonePreset = (preset: ResampleFilterPreset): ResampleFilterPreset => {
  const clone = { ...preset };
  clone.filterFunctionFactoryArgs = preset.filterFunctionFactoryArgs.slice();
  clone.windowFunctionFactoryArgs = preset.windowFunctionFactoryArgs.slice();
  return clone;
};

// Load fresh preset when preset name changes.
watch(presetName, (name?: keyof ResampleFilterPresetsPoolKeyMap | string) => {
  if (name) {
    valueModel.value = clonePreset(presetsPool.get(name));
  }
});

// Reload preset when editor visibility changes
watch(shouldDisplayFilterPresetEditor, () => {
  valueModel.value = clonePreset(presetsPool.get(presetName.value));
});

// Clear filter blur and window support when expert settings visibility changes to false
watch(shouldDisplayExpertSettings, (val: boolean) => {
  if (!val) {
    filterBlurModel.value = undefined;
    filterWindowSupportModel.value = undefined;
  }
});
</script>

<template>
  <div class="filter-options">
    <FilterPresetSelector v-model="presetName" :disabled="props.disabled" />

    <VCheckbox label="Customize" v-model="shouldDisplayFilterPresetEditor" density="compact" />

    <VExpandTransition>
      <FilterPresetEditor
        v-if="shouldDisplayFilterPresetEditor"
        v-model="valueModel"
        :disabled="props.disabled"
      />
    </VExpandTransition>

    <VCheckbox
      label="Expert settings"
      hint="More expert than above)"
      v-model="shouldDisplayExpertSettings"
      :disabled="props.disabled"
      density="compact"
    />

    <VExpandTransition>
      <VRow v-if="shouldDisplayExpertSettings" dense>
        <VCol cols="6">
          <VTextField
            label="Filter blur"
            type="number"
            v-model.number="filterBlurModel"
            :disabled="props.disabled"
            density="compact"
            variant="outlined"
          />
        </VCol>
        <VCol cols="6">
          <VTextField
            label="Filter window support"
            type="number"
            v-model.number="filterWindowSupportModel"
            :disabled="props.disabled"
            density="compact"
            variant="outlined"
          />
        </VCol>
      </VRow>
    </VExpandTransition>
  </div>
</template>

<style scoped></style>
