<script setup lang="ts">
import ColorPicker from '@/components/playground/ColorPicker.vue';
import ImageViewportOffset from '@/components/playground/input-settings/image-settings/ImageViewportOffset.vue';
import InterpolationMethodSelector from '@/components/playground/input-settings/image-settings/InterpolationMethodSelector.vue';
import VirtualPixelMethodSelector from '@/components/playground/input-settings/image-settings/VirtualPixelMethodSelector.vue';
import { useDistortionStore } from '@/store/distortion';
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

    <ImageViewportOffset v-model="imageViewportOffsetOption" :disabled="props.disabled" />

    <ColorPicker
      label="Image background color"
      v-model="imageBackgroundColorOption"
      :disabled="props.disabled"
    />
  </div>
</template>

<style scoped></style>
