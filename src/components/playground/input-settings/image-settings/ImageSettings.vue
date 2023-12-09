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
const { loadSourceImage } = distortionStore;

const { open: openFileDialog, onChange: onFilesChange } = useFileDialog({ accept: 'image/*' });
onFilesChange((files) => {
  if (files && files.length) {
    loadSourceImage(files[0]);
  }
});
</script>

<template>
  <div class="image-settings">
    <VBtn @click="() => openFileDialog()">Load another image</VBtn>

    <VirtualPixelMethodSelector
      v-model="imageVirtualPixelMethodOption"
      :disabled="props.disabled"
    />

    <InterpolationMethodSelector
      v-model="imageInterpolationMethodOption"
      :disabled="props.disabled"
    />

    <ImageVieportOffset v-model="imageViewportOffsetOption" />

    <ColorPicker v-model="imageBackgroundColorOption" />
  </div>
</template>

<style scoped></style>
