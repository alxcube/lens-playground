<script setup lang="ts">
import ResamplingOptions from '@/components/playground/input-settings/distortion-options/resampling-options/ResamplingOptions';
import SupersamplingOptions from '@/components/playground/input-settings/distortion-options/SupersamplingOptions';
import DistortionSettings from '@/components/playground/input-settings/distortion-settings/DistortionSettings';
import ImageSettings from '@/components/playground/input-settings/image-settings/ImageSettings';
import ViewportSettings from '@/components/playground/input-settings/distortion-options/viewport-settings/ViewportSettings';
import MatteColorPicker from '@/components/playground/input-settings/MatteColorPicker';
</script>

<template>
  <div class="input-settings">
    <ImageSettings />
    <DistortionSettings />
    <ResamplingOptions />
    <SupersamplingOptions />
    <ViewportSettings />
    <MatteColorPicker />
  </div>
</template>

<style scoped></style>
