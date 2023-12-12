<script setup lang="ts">
import { useDistortionStore } from '@/store/distortion';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const distortionStore = useDistortionStore();
const { outputScalingOption } = storeToRefs(distortionStore);

const isEnabled = ref<boolean>(false);
watch(isEnabled, (val: boolean) => {
  if (!val && outputScalingOption.value !== undefined) {
    outputScalingOption.value = undefined;
  }
});
watch(
  outputScalingOption,
  (val?: number) => {
    if (val !== undefined && !isEnabled.value) {
      isEnabled.value = true;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="supersampling-options">
    <VRow dense>
      <VCol cols="3">
        <VCheckbox
          label="Enabled"
          v-model="isEnabled"
          :disabled="props.disabled"
          density="compact"
        />
      </VCol>
      <VCol cols="9">
        <VExpandTransition>
          <VTextField
            v-if="isEnabled"
            label="Factor"
            type="number"
            min="0.1"
            v-model.number="outputScalingOption"
            :disabled="props.disabled"
            density="compact"
            variant="outlined"
          />
        </VExpandTransition>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped></style>
