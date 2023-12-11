<script setup lang="ts">
import ResamplingOptions from '@/components/playground/input-settings/distortion-options/resampling-options/ResamplingOptions';
import SupersamplingOptions from '@/components/playground/input-settings/distortion-options/SupersamplingOptions';
import DistortionSettings from '@/components/playground/input-settings/distortion-settings/DistortionSettings';
import ImageSettings from '@/components/playground/input-settings/image-settings/ImageSettings';
import ViewportSettings from '@/components/playground/input-settings/distortion-options/viewport-settings/ViewportSettings';
import InputOptionsGroup from '@/components/playground/input-settings/OptionsGroup';
import MatteColorPicker from '@/components/playground/input-settings/MatteColorPicker';
import { useDistortionStore } from '@/store/distortion';
import { storeToRefs } from 'pinia';

const distortionStore = useDistortionStore();
const { isProcessingDistortion } = storeToRefs(distortionStore);
</script>

<template>
  <div class="input-settings">
    <InputOptionsGroup title="Distortion Settings">
      <DistortionSettings :disabled="isProcessingDistortion" />
    </InputOptionsGroup>
    <InputOptionsGroup title="Image Options">
      <ImageSettings :disabled="isProcessingDistortion" />
    </InputOptionsGroup>
    <InputOptionsGroup title="Resampling Options">
      <ResamplingOptions :disabled="isProcessingDistortion" />
      <h5 class="text-subtitle-2 mb-1">Supersampling</h5>
      <SupersamplingOptions :disabled="isProcessingDistortion" />
    </InputOptionsGroup>
    <InputOptionsGroup title="Output Image Viewport">
      <ViewportSettings :disabled="isProcessingDistortion" />
    </InputOptionsGroup>
    <InputOptionsGroup title="Other">
      <MatteColorPicker :disabled="isProcessingDistortion" />
    </InputOptionsGroup>
  </div>
</template>

<style scoped></style>
