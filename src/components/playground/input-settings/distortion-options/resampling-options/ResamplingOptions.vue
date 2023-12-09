<script setup lang="ts">
import FilterOptions from '@/components/playground/input-settings/distortion-options/resampling-options/filter-options/FilterOptions';
import { useLensArgumentsStore } from '@/store/lensArguments';
import { storeToRefs } from 'pinia';

const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });
const lensArgumentsStore = useLensArgumentsStore();

const { resamplerOption, filterOption, filterBlurOption, filterWindowSupportOption } =
  storeToRefs(lensArgumentsStore);
</script>

<template>
  <div class="resampling-options">
    <VCheckbox
      label="EWA Resampling"
      :true-value="'ewa'"
      :false-value="'point'"
      v-model="resamplerOption"
      :disabled="props.disabled"
      density="compact"
    />

    <VExpandTransition>
      <FilterOptions
        v-if="lensArgumentsStore.resamplerOption === 'ewa'"
        v-model="filterOption"
        v-model:filter-blur="filterBlurOption"
        v-model:filter-window-support="filterWindowSupportOption"
        :disabled="props.disabled"
      />
    </VExpandTransition>
  </div>
</template>

<style scoped></style>
