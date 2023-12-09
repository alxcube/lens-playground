<script setup lang="ts">
import { nextTick, onBeforeUnmount, shallowRef, watch } from 'vue';

const props = defineProps<{
  canvas: HTMLCanvasElement;
}>();

const container = shallowRef<HTMLDivElement>();

function handleCanvasPropChange(insert?: HTMLCanvasElement, previous?: HTMLCanvasElement): void {
  if (!container.value) {
    nextTick(() => handleCanvasPropChange(insert));
    return;
  }
  if (previous && previous !== insert) {
    if (container.value.contains(previous)) {
      container.value.removeChild(previous);
    }
  }
  if (insert && (!previous || previous !== insert)) {
    container.value.appendChild(insert);
  }
}

watch(() => props.canvas, handleCanvasPropChange, { immediate: true });

onBeforeUnmount(() => {
  if (container.value && props.canvas && container.value.contains(props.canvas)) {
    container.value.removeChild(props.canvas);
  }
});
</script>

<template>
  <div ref="container" class="canvas-wrapper"></div>
</template>

<style scoped></style>
