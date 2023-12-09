<script setup lang="ts">
import ImageViewer from '@/components/playground/image-area/ImageViewer';
import ImageViewerMenu from '@/components/playground/image-area/ImageViewerMenu';
import ZoomControl from '@/components/playground/image-area/ZoomControl';
import { useLensArgumentsStore } from '@/store/lensArguments';
import { storeToRefs } from 'pinia';
import { computed, ref, shallowRef, watch } from 'vue';

const props = defineProps<{
  disabled?: boolean;
}>();
const imageViewer = shallowRef<InstanceType<typeof ImageViewer>>();
const scaleModel = ref(1);
const lensArgumentsStore = useLensArgumentsStore();
const { sourceImage, distortedImage, distortionViewport, sourceImageViewport } =
  storeToRefs(lensArgumentsStore);
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
</script>

<template>
  <VCard class="image-area d-flex fill-height">
    <VToolbar>
      <VTabs color="white" v-model="currentTab" :disabled="props.disabled">
        <VTab> Original </VTab>

        <VTab :disabled="!distortedImage"> Distorted </VTab>
      </VTabs>

      <VSpacer />

      <ImageViewerMenu
        v-model:show-axes="showAxes"
        v-model:apply-viewport-offset="applyViewportOffset"
        v-model:image-outline="imageOutline"
        :disabled="props.disabled"
      />
    </VToolbar>

    <ImageViewer
      ref="imageViewer"
      v-if="displayImage"
      :image="displayImage"
      class="flex-grow-1 flex-shrink-1"
      v-model:scale="scaleModel"
      :disabled="props.disabled"
      :show-axes="showAxes"
      :offset="viewportOffset"
      :image-outline="imageOutline"
    />

    <VCardActions class="pa-0">
      <VToolbar flat density="compact">
        <ZoomControl
          :scale="scaleModel"
          :disabled="disabled"
          @fit="fitViewport"
          @full-size="scaleModel = 1"
          @zoom-in="zoomIn"
          @zoom-out="zoomOut"
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
