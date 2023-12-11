<script setup lang="ts">
import CanvasWrapper from '@/components/playground/image-area/CanvasWrapper';
import PanableContainer from '@/components/playground/image-area/PanableContainer';
import { useImagePointsTransportStore } from '@/store/imagePointTransport';
import { useVModel } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, nextTick, ref, shallowRef, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    image: HTMLCanvasElement;
    showAxes?: boolean;
    offset?: { x: number; y: number };
    disabled?: boolean;
    scale?: number;
    imageOutline?: boolean;
  }>(),
  {
    offset() {
      return { x: 0, y: 0 };
    },
    scale: 1
  }
);

const emit = defineEmits<{
  (e: 'update:scale', value: number): void;
  (e: 'pointermove:image', value: { x: number; y: number }): void;
  (e: 'pointerout:image'): void;
}>();

const container = shallowRef<HTMLDivElement>();
const positionModel = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const scaleModel = useVModel(props, 'scale', emit);

const yAxisStyle = computed(() => ({
  top: `${positionModel.value.y}px`
}));
const xAxisStyle = computed(() => ({
  left: `${positionModel.value.x}px`
}));
const offsetStyle = computed(() => {
  return {
    top: `${props.offset.y}px`,
    left: `${props.offset.x}px`
  };
});

watch(
  () => props.image,
  (image) => {
    if (image) {
      nextTick(fitViewport);
    }
  },
  { immediate: true }
);

function fitViewport() {
  if (container.value) {
    const { width: vpWidth, height: vpHeight } = container.value.getBoundingClientRect();
    let { width, height } = props.image;
    const ratio = width / height;

    if (width > vpWidth) {
      width = vpWidth;
      height = width / ratio;
    }

    if (height > vpHeight) {
      height = vpHeight;
      width = height * ratio;
    }

    const { x: offsetX, y: offsetY } = props.offset;
    const x = vpWidth / 2 - width / 2 - offsetX;
    const y = vpHeight / 2 - height / 2 - offsetY;

    const scale = width / props.image.width;

    if (scaleModel.value !== scale) {
      scaleModel.value = scale;
    }

    nextTick(() => {
      positionModel.value = { x, y };
    });
  }
}

function zoom(zoomIn = false) {
  scaleModel.value = scaleModel.value * (zoomIn ? 1.25 : 0.8);
}

const imagePointTransportStore = useImagePointsTransportStore();
const { hasRequests: hasImagePointRequests } = storeToRefs(imagePointTransportStore);
const { feed: feedImagePoint } = imagePointTransportStore;

function pagePointToImagePoint(pagePoint: { pageX: number; pageY: number }): {
  x: number;
  y: number;
} {
  if (!container.value) {
    throw new Error("It shouldn't happen, but container ref is empty");
  }
  const { pageX, pageY } = pagePoint;
  const { top, left } = container.value.getBoundingClientRect();
  const containerX = pageX - left;
  const containerY = pageY - top;
  const scale = 1 / scaleModel.value;
  const x = (containerX - positionModel.value.x) * scale - props.offset.x;
  const y = (containerY - positionModel.value.y) * scale - props.offset.y;
  return { x, y };
}

const pointerStartCoords = ref<{ pageX: number; pageY: number }>();

const onContainerPointerDown = (event: PointerEvent) => {
  const { pageX, pageY } = event;
  pointerStartCoords.value = { pageX, pageY };
};

const onContainerPointerUp = (event: PointerEvent) => {
  if (pointerStartCoords.value) {
    if (
      event.pageX === pointerStartCoords.value.pageX &&
      event.pageY === pointerStartCoords.value.pageY &&
      hasImagePointRequests.value
    ) {
      feedImagePoint(pagePointToImagePoint(event));
    }
  }
};

const onContainerPointerCancel = () => (pointerStartCoords.value = undefined);

const onContainerPointerMove = (event: PointerEvent) =>
  emit('pointermove:image', pagePointToImagePoint(event));

const onContainerPointerLeave = () => emit('pointerout:image');

const isPanning = ref(false);
const onPanStart = () => (isPanning.value = true);
const onPanEnd = () => (isPanning.value = false);

const classes = computed(() => {
  return {
    'image-outline': !!props.imageOutline,
    grabbing: isPanning.value,
    crosshair: hasImagePointRequests.value
  };
});

defineExpose({
  fitViewport,
  zoom
});
</script>

<template>
  <div
    ref="container"
    class="image-viewer-container"
    :class="classes"
    @pointerdown="onContainerPointerDown"
    @pointerup="onContainerPointerUp"
    @pointercancel="onContainerPointerCancel"
    @pointermove="onContainerPointerMove"
    @pointerleave="onContainerPointerLeave"
  >
    <VSheet class="image-viewer" height="100%">
      <div v-if="props.showAxes" class="axis x" :style="xAxisStyle" />
      <div v-if="props.showAxes" class="axis y" :style="yAxisStyle" />
      <PanableContainer
        v-model:position="positionModel"
        v-model:scale="scaleModel"
        :disabled="props.disabled"
        @panstart="onPanStart"
        @panend="onPanEnd"
      >
        <CanvasWrapper :canvas="props.image" :style="offsetStyle" />
      </PanableContainer>
    </VSheet>
  </div>
</template>

<style scoped lang="scss">
.image-viewer-container {
  height: 100%;
  cursor: grab;

  &.grabbing {
    cursor: grabbing;
  }

  &.crosshair,
  &.grabbing.crosshair {
    cursor: crosshair;
  }

  &.image-outline :deep(canvas) {
    outline: goldenrod 1px solid;
  }
}

.canvas-wrapper {
  position: relative;
}

.image-viewer {
  overflow: hidden;
  position: relative;
}

.axis {
  position: absolute;
  background-color: aquamarine;

  &.x {
    top: 0;
    height: 100%;
    width: 1px;
    margin-left: -0.5px;
    will-change: left;
  }

  &.y {
    left: 0;
    width: 100%;
    height: 1px;
    margin-top: -0.5px;
    will-change: top;
  }
}

:deep(.panable-container) {
  position: absolute;
}
</style>
