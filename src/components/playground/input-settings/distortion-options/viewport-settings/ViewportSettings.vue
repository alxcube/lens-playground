<script setup lang="ts">
import ViewportLiteral from '@/components/playground/input-settings/distortion-options/viewport-settings/ViewportLiteral';
import { useDistortionStore } from '@/store/distortion';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  { disabled: false }
);

type ViewportLiteral = { x1: number; y1: number; x2: number; y2: number };

type ViewportSwitchValue = 'source' | 'best-fit' | 'custom';

interface ViewportRadioOption {
  title: string;
  value: ViewportSwitchValue;
}

const getRadioValueFromViewportOption = (
  option?: 'bestFit' | ViewportLiteral
): ViewportSwitchValue => {
  if (!option) {
    return 'source';
  }
  if (option === 'bestFit') {
    return 'best-fit';
  }
  return 'custom';
};

const distortionStore = useDistortionStore();
const { viewportOption, sourceImageViewport } = storeToRefs(distortionStore);
const customViewport = ref(ViewportLiteral);
const isEqualViewport = (vp1: ViewportLiteral, vp2: ViewportLiteral): boolean => {
  return vp1.x1 === vp2.x1 && vp1.y1 === vp2.y1 && vp1.x2 === vp2.x2 && vp1.y2 === vp2.y2;
};

const radioOptions: ViewportRadioOption[] = [
  { title: 'Source Image Viewport', value: 'source' },
  { title: 'Best-Fit', value: 'best-fit' },
  { title: 'Custom Viewport', value: 'custom' }
];
const selectedRadioOption = computed<ViewportSwitchValue>({
  get(): ViewportSwitchValue {
    if (!viewportOption.value) {
      return 'source';
    } else if (viewportOption.value === 'bestFit') {
      return 'best-fit';
    } else {
      return 'custom';
    }
  },
  set(value: ViewportSwitchValue) {
    switch (value) {
      case 'best-fit':
        viewportOption.value = 'bestFit';
        break;
      case 'custom':
        viewportOption.value = { ...customViewport.value };
        break;
      default:
        viewportOption.value = undefined;
        break;
    }
  }
});

watch(
  sourceImageViewport,
  (vp) => {
    if (vp && selectedRadioOption.value !== 'custom') {
      customViewport.value = { ...vp };
    }
  },
  { immediate: true }
);

watch(
  viewportOption,
  (vp) => {
    if (typeof vp === 'object' && !isEqualViewport(vp, customViewport.value)) {
      customViewport.value = { ...vp };
    }
  },
  { immediate: true, deep: true }
);

watch(
  customViewport,
  (vp) => {
    if (typeof viewportOption.value === 'object') {
      if (!isEqualViewport(viewportOption.value, vp)) {
        viewportOption.value = { ...vp };
      }
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="viewport-settings">
    <VRadioGroup :disabled="props.disabled" v-model="selectedRadioOption" density="compact">
      <VRadio v-for="{ title, value } in radioOptions" :key="value" :label="title" :value="value" />
    </VRadioGroup>
    <VExpandTransition>
      <ViewportLiteral
        v-if="selectedRadioOption === 'custom'"
        v-model="customViewport"
        :disabled="props.disabled"
      />
    </VExpandTransition>
  </div>
</template>

<style scoped></style>
