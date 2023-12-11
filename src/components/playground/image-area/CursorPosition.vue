<script setup lang="ts">
import { useDistortionStore } from '@/store/distortion';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const props = defineProps<{
  imageCursorPosition: { x: number | null; y: number | null };
}>();

const distortionStore = useDistortionStore();
const { sourceImageViewport } = storeToRefs(distortionStore);

const cursorPositionOverViewport = computed<{ x: number | null; y: number | null }>(() => {
  if (
    !sourceImageViewport.value ||
    props.imageCursorPosition.x === null ||
    props.imageCursorPosition.y === null
  ) {
    return { x: null, y: null };
  }
  return {
    x: props.imageCursorPosition.x + sourceImageViewport.value.x1,
    y: props.imageCursorPosition.y + sourceImageViewport.value.y1
  };
});

const formatPosition = (pos: number | null): string => {
  if (pos === null) {
    return '-';
  }
  return `${Math.round(pos * 100) / 100}`;
};

const imageXString = computed(() => formatPosition(props.imageCursorPosition.x));
const imageYString = computed(() => formatPosition(props.imageCursorPosition.y));
const vpXString = computed(() => formatPosition(cursorPositionOverViewport.value.x));
const vpYString = computed(() => formatPosition(cursorPositionOverViewport.value.y));
</script>

<template>
  <div class="cursor-position hidden-sm-and-down">
    <VRow no-gutters class="justify-end align-center fill-height">
      <VCol cols="6">
        <VSheet class="pa-1">
          <div class="text-caption">Image:</div>
          <VRow no-gutters class="text-body-2">
            <VCol cols="6"> x: {{ imageXString }} </VCol>
            <VCol cols="6"> y: {{ imageYString }} </VCol>
          </VRow>
        </VSheet>
      </VCol>
      <VCol cols="6">
        <VSheet class="pa-1">
          <div class="text-caption">Viewport:</div>
          <VRow no-gutters class="text-body-2">
            <VCol cols="6"> x: {{ vpXString }} </VCol>
            <VCol cols="6"> y: {{ vpYString }} </VCol>
          </VRow>
        </VSheet>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped lang="scss">
:deep(.v-sheet) {
  max-width: 200px;
}
.cursor-position {
  width: 420px;
}
</style>
