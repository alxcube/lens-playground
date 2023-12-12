<script setup lang="ts">
import CursorPosition from '@/components/playground/image-area/CursorPosition.vue';
import ImageViewer from '@/components/playground/image-area/ImageViewer.vue';
import ImageViewerMenu from '@/components/playground/image-area/ImageViewerMenu.vue';
import ZoomControl from '@/components/playground/image-area/ZoomControl.vue';
import { useAppStore } from '@/store/app';
import { useDistortionStore } from '@/store/distortion';
import { useImagePointsTransportStore } from '@/store/imagePointTransport';
import { useFileDialog } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, ref, shallowRef, watch } from 'vue';

const distortionStore = useDistortionStore();
const { sourceImage, distortedImage, distortionViewport, sourceImageViewport } =
  storeToRefs(distortionStore);
const { processDistortion, loadSourceImage } = distortionStore;
const { isLoading } = storeToRefs(useAppStore());

const currentTab = ref(0);
const displayImage = computed(() => {
  return currentTab.value === 0 ? sourceImage.value : distortedImage.value;
});
watch(distortedImage, (val) => {
  if (val) {
    currentTab.value = 1;
  } else {
    currentTab.value = 0;
  }
});

const imageViewer = shallowRef<InstanceType<typeof ImageViewer>>();
const scaleModel = ref(1);
const showAxes = ref(true);
const applyViewportOffset = ref(true);
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
watch(hasImagePointRequests, (value) => {
  if (value && currentTab.value !== 0) {
    currentTab.value = 0;
  }
});
const setCursorPositionOverImage = (point: { x: number | null; y: number | null }) =>
  (cursorPositionOverImage.value = point);
const noCursorOverImage = () => setCursorPositionOverImage({ x: null, y: null });

const { open: openFileDialog, onChange: onFileSelected } = useFileDialog({ accept: 'image/*' });
onFileSelected((files) => {
  if (files && files.length) {
    loadSourceImage(files[0]);
  }
});
</script>

<template>
  <VCard class="image-area d-flex fill-height">
    <VToolbar>
      <VTabs color="white" v-model="currentTab" :disabled="isLoading || hasImagePointRequests">
        <VTab> Original </VTab>

        <VTab :disabled="!distortedImage"> Distorted </VTab>
      </VTabs>

      <VSpacer />

      <VBtn
        @click="processDistortion"
        :disabled="isLoading || hasImagePointRequests"
        color="primary"
        variant="tonal"
        class="hidden-sm-and-down"
      >
        <VIcon>mdi-camera-iris</VIcon>
        Distort
      </VBtn>
      <VBtn
        @click="processDistortion"
        :disabled="isLoading || hasImagePointRequests"
        color="primary"
        variant="tonal"
        icon
        class="hidden-md-and-up"
      >
        <VIcon>mdi-camera-iris</VIcon>
      </VBtn>

      <VBtn @click="openFileDialog" icon :disabled="isLoading || hasImagePointRequests">
        <VIcon>mdi-image-sync</VIcon>
        <VTooltip activator="parent">Load other image</VTooltip>
      </VBtn>

      <ImageViewerMenu
        v-model:show-axes="showAxes"
        v-model:apply-viewport-offset="applyViewportOffset"
        v-model:image-outline="imageOutline"
        :disabled="isLoading"
      />
    </VToolbar>

    <ImageViewer
      ref="imageViewer"
      v-if="displayImage"
      :image="displayImage"
      class="flex-grow-1 flex-shrink-1"
      v-model:scale="scaleModel"
      :disabled="isLoading"
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
          :disabled="isLoading"
          @fit="fitViewport"
          @full-size="scaleModel = 1"
          @zoom-in="zoomIn"
          @zoom-out="zoomOut"
        />

        <VSpacer />

        <slot name="bottom-right" />

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
