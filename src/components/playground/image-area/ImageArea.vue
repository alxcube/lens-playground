<script setup lang="ts">
import CursorPosition from '@/components/playground/image-area/CursorPosition';
import ImageViewer from '@/components/playground/image-area/ImageViewer';
import ImageViewerMenu from '@/components/playground/image-area/ImageViewerMenu';
import ZoomControl from '@/components/playground/image-area/ZoomControl';
import { useDistortionStore } from '@/store/distortion';
import { useImagePointsTransportStore } from '@/store/imagePointTransport';
import { storeToRefs } from 'pinia';
import { computed, ref, shallowRef, watch } from 'vue';

const imageViewer = shallowRef<InstanceType<typeof ImageViewer>>();
const scaleModel = ref(1);
const distortionStore = useDistortionStore();
const {
  sourceImage,
  distortedImage,
  distortionViewport,
  sourceImageViewport,
  isProcessingDistortion
} = storeToRefs(distortionStore);
const currentTab = ref(0);
const displayImage = computed(() => {
  return currentTab.value === 0 ? sourceImage.value : distortedImage.value;
});
const showAxes = ref(true);
const applyViewportOffset = ref(false);
const viewportOffset = computed(() => {
  if (!applyViewportOffset.value) {
    return { x: 0, y: 0 };
  }
  const vp = currentTab.value === 0 ? sourceImageViewport : distortionViewport;
  if (!vp.value) {
    return { x: 0, y: 0 };
  }
  const { x1: x, y1: y } = vp.value;
  return { x, y };
});
const imageOutline = ref(false);

watch(distortedImage, (val) => {
  if (val) {
    currentTab.value = 1;
  } else {
    currentTab.value = 0;
  }
});

function zoomIn() {
  imageViewer.value?.zoom(true);
}

function zoomOut() {
  imageViewer.value?.zoom(false);
}

function fitViewport() {
  imageViewer.value?.fitViewport();
}

const cursorPositionOverImage = ref<{ x: number | null; y: number | null }>({ x: null, y: null });
const imagePointTransportStore = useImagePointsTransportStore();
const { hasRequests: hasImagePointRequests } = storeToRefs(imagePointTransportStore);
const setCursorPositionOverImage = (point: { x: number | null; y: number | null }) =>
  (cursorPositionOverImage.value = point);
const noCursorOverImage = () => setCursorPositionOverImage({ x: null, y: null });
</script>

<template>
  <VCard class="image-area d-flex fill-height">
    <VToolbar>
      <VTabs color="white" v-model="currentTab" :disabled="isProcessingDistortion">
        <VTab> Original </VTab>

        <VTab :disabled="!distortedImage"> Distorted </VTab>
      </VTabs>

      <VSpacer />

      <ImageViewerMenu
        v-model:show-axes="showAxes"
        v-model:apply-viewport-offset="applyViewportOffset"
        v-model:image-outline="imageOutline"
        :disabled="isProcessingDistortion"
      />
    </VToolbar>

    <ImageViewer
      ref="imageViewer"
      v-if="displayImage"
      :image="displayImage"
      class="flex-grow-1 flex-shrink-1"
      v-model:scale="scaleModel"
      :disabled="isProcessingDistortion"
      :show-axes="showAxes"
      :offset="viewportOffset"
      :image-outline="imageOutline"
      @pointermove:image="setCursorPositionOverImage"
      @pointerout:image="noCursorOverImage"
    />

    <VCardActions class="pa-0">
      <VToolbar flat density="compact">
        <ZoomControl
          :scale="scaleModel"
          :disabled="isProcessingDistortion"
          @fit="fitViewport"
          @full-size="scaleModel = 1"
          @zoom-in="zoomIn"
          @zoom-out="zoomOut"
        />
        <CursorPosition
          v-if="hasImagePointRequests"
          :image-cursor-position="cursorPositionOverImage"
        />
      </VToolbar>
    </VCardActions>
  </VCard>
</template>

<style scoped>
.image-area {
  flex-direction: column;
}
</style>
