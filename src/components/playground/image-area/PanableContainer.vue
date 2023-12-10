<script setup lang="ts">
import panzoom, { PanZoom } from 'panzoom';
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    position?: { x: number; y: number };
    scale?: number;
    disabled?: boolean;
  }>(),
  {
    position() {
      return { x: 0, y: 0 };
    },
    scale: 1
  }
);

const emit = defineEmits<{
  (e: 'update:position', value: { x: number; y: number }): void;
  (e: 'update:scale', value: number): void;
}>();

const container = shallowRef<HTMLElement>();
const panzoomInstance = shallowRef<PanZoom>();
const positionModel = ref<{ x: number; y: number }>({ ...props.position });
const scaleModel = ref<number>(props.scale);

watch(
  () => props.position,
  ({ x, y }) => {
    if (panzoomInstance.value && (positionModel.value.x !== x || positionModel.value.y !== y)) {
      panzoomInstance.value.moveTo(x, y);
    }
  }
);

watch(
  () => props.scale,
  (scale) => {
    if (scale !== scaleModel.value) {
      const newScale = scale / scaleModel.value;
      if (container.value && container.value.parentElement && panzoomInstance.value) {
        const { x, y, width, height } = container.value.getBoundingClientRect();
        const { x: px, y: py } = container.value.parentElement.getBoundingClientRect();
        const clientX = x - px + width / 2;
        const clientY = y - py + height / 2;
        panzoomInstance.value.zoomTo(clientX, clientY, newScale);
      }
    }
  }
);

watch(
  () => props.disabled,
  (disabled) => {
    if (panzoomInstance.value) {
      if (disabled && !panzoomInstance.value.isPaused()) {
        panzoomInstance.value.pause();
      } else if (!disabled && panzoomInstance.value.isPaused()) {
        panzoomInstance.value.resume();
      }
    }
  }
);

onMounted(() => {
  if (container.value) {
    const pz = panzoom(container.value);
    pz.on('transform', () => {
      const { x, y, scale } = pz.getTransform();
      positionModel.value = { x, y };
      scaleModel.value = scale;
      emit('update:position', { x, y });
      emit('update:scale', scale);
    });

    if (props.disabled) {
      pz.pause();
    }

    panzoomInstance.value = pz;
  }
});

onBeforeUnmount(() => {
  if (panzoomInstance.value) {
    panzoomInstance.value.dispose();
  }
});
</script>

<template>
  <div ref="container" class="panable-container"><slot /></div>
</template>
