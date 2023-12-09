<script setup lang="ts">
import CanvasWrapper from '@/components/playground/image-area/CanvasWrapper';
import PanableContainer from '@/components/playground/image-area/PanableContainer';
import { useVModel } from '@vueuse/core';
import { computed, nextTick, ref, shallowRef } from 'vue';

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
    marginTop: `${props.offset.y}px`,
    marginLeft: `${props.offset.x}px`
  };
});

const classes = computed(() => {
  return {
    'image-outline': !!props.imageOutline
  };
});

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

defineExpose({
  fitViewport,
  zoom
});
</script>

<template>
  <div ref="container" class="image-viewer-container" :class="classes">
    <VSheet class="image-viewer" height="100%">
      <div v-if="props.showAxes" class="axis x" :style="xAxisStyle" />
      <div v-if="props.showAxes" class="axis y" :style="yAxisStyle" />
      <PanableContainer
        v-model:position="positionModel"
        v-model:scale="scaleModel"
        :disabled="props.disabled"
      >
        <CanvasWrapper :canvas="props.image" :style="offsetStyle" />
      </PanableContainer>
    </VSheet>
  </div>
</template>

<style scoped lang="scss">
.image-viewer-container {
  height: 100%;

  &.image-outline :deep(canvas) {
    outline: goldenrod 1px solid;
  }
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
</style>
