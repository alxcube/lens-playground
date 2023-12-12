<script setup lang="ts">
import ResamplingOptions from '@/components/playground/input-settings/distortion-options/resampling-options/ResamplingOptions.vue';
import SupersamplingOptions from '@/components/playground/input-settings/distortion-options/SupersamplingOptions.vue';
import DistortionSettings from '@/components/playground/input-settings/distortion-settings/DistortionSettings.vue';
import ImageSettings from '@/components/playground/input-settings/image-settings/ImageSettings.vue';
import ViewportSettings from '@/components/playground/input-settings/distortion-options/viewport-settings/ViewportSettings.vue';
import InputOptionsGroup from '@/components/playground/input-settings/OptionsGroup.vue';
import MatteColorPicker from '@/components/playground/input-settings/MatteColorPicker.vue';
import { useAppStore } from '@/store/app';
import { useImagePointsTransportStore } from '@/store/imagePointTransport';
import { storeToRefs } from 'pinia';

const { isLoading } = storeToRefs(useAppStore());
const { hasRequests: hasImagePointRequests } = storeToRefs(useImagePointsTransportStore());
</script>

<template>
  <div class="input-settings">
    <InputOptionsGroup title="Distortion Settings">
      <DistortionSettings :disabled="isLoading" />
    </InputOptionsGroup>
    <InputOptionsGroup title="Image Options">
      <ImageSettings :disabled="isLoading || hasImagePointRequests" />
    </InputOptionsGroup>
    <InputOptionsGroup title="Resampling Options">
      <ResamplingOptions :disabled="isLoading || hasImagePointRequests" />
      <h5 class="text-subtitle-2 mb-1">Supersampling</h5>
      <SupersamplingOptions :disabled="isLoading || hasImagePointRequests" />
    </InputOptionsGroup>
    <InputOptionsGroup title="Output Image Viewport">
      <ViewportSettings :disabled="isLoading || hasImagePointRequests" />
    </InputOptionsGroup>
    <InputOptionsGroup title="Other">
      <MatteColorPicker :disabled="isLoading || hasImagePointRequests" />
    </InputOptionsGroup>
  </div>
</template>

<style scoped></style>
