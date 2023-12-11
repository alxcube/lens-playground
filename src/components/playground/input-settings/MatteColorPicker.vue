<script setup lang="ts">
import ColorPicker from '@/components/playground/ColorPicker';
import { useDistortionStore } from '@/store/distortion';
import { storeToRefs } from 'pinia';

const props = defineProps<{ disabled?: boolean }>();

const distortionStore = useDistortionStore();
const { matteColorOption } = storeToRefs(distortionStore);
</script>

<template>
  <div class="matte-color-picker">
    <ColorPicker label="Matte color" v-model="matteColorOption" :disabled="props.disabled" />
  </div>
</template>

<style scoped></style>
