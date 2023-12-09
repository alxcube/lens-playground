<script setup lang="ts">
import ColorPicker from '@/components/playground/ColorPicker';
import { useLensArgumentsStore } from '@/store/lensArguments';
import { storeToRefs } from 'pinia';

const props = defineProps<{ disabled?: boolean }>();

const lensArgumentsStore = useLensArgumentsStore();
const { matteColorOption } = storeToRefs(lensArgumentsStore);
</script>

<template>
  <div class="matte-color-picker">
    <ColorPicker v-model="matteColorOption" :disabled="props.disabled" />
  </div>
</template>

<style scoped></style>
