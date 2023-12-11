<script setup lang="ts">
import ColorPicker from '@/components/playground/ColorPicker';
import ImageVieportOffset from '@/components/playground/input-settings/image-settings/ImageVieportOffset';
import InterpolationMethodSelector from '@/components/playground/input-settings/image-settings/InterpolationMethodSelector';
import VirtualPixelMethodSelector from '@/components/playground/input-settings/image-settings/VirtualPixelMethodSelector';
import { useDistortionStore } from '@/store/distortion';
import { useFileDialog } from '@vueuse/core';
import { storeToRefs } from 'pinia';

const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const distortionStore = useDistortionStore();
const {
  imageInterpolationMethodOption,
  imageVirtualPixelMethodOption,
  imageViewportOffsetOption,
  imageBackgroundColorOption
} = storeToRefs(distortionStore);
</script>

<template>
  <div class="image-settings">
    <VirtualPixelMethodSelector
      v-model="imageVirtualPixelMethodOption"
      :disabled="props.disabled"
    />

    <InterpolationMethodSelector
      v-model="imageInterpolationMethodOption"
      :disabled="props.disabled"
    />

    <h5 class="text-subtitle-2 mb-1">Initial viewport offset</h5>

    <ImageVieportOffset v-model="imageViewportOffsetOption" :disabled="props.disabled" />

    <ColorPicker v-model="imageBackgroundColorOption" :disabled="props.disabled" />
  </div>
</template>

<style scoped></style>
