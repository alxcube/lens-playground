<script setup lang="ts">
import { useLensArgumentsStore } from '@/store/lensArguments';
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

const emit = defineEmits<{
  (e: 'update:modelValue', value?: number): void;
}>();

const lensArgumentsStore = useLensArgumentsStore();
const { outputScalingOption } = storeToRefs(lensArgumentsStore);

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
