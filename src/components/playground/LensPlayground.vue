<script setup lang="ts">
import ImageArea from '@/components/playground/image-area/ImageArea';
import InputSettings from '@/components/playground/input-settings/InputSettings';
import MobileDialog from '@/components/playground/MobileDialog';
import OuptutInfo from '@/components/playground/OuptutInfo';
import SidePanel from '@/components/playground/SidePanel';
import { useAppStore } from '@/store/app';
import { useDistortionStore } from '@/store/distortion';
import { useImagePointsTransportStore } from '@/store/imagePointTransport';
import { useDropZone, useFileDialog } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { ref, shallowRef, watch } from 'vue';

const playgroundContainer = shallowRef<HTMLDivElement>();

const appStore = useAppStore();
const { isMobile, isLoading } = storeToRefs(appStore);

const distortionStore = useDistortionStore();
const { sourceImage, distortedImage, isLoadingSourceImage } = storeToRefs(distortionStore);
const { loadSourceImage } = distortionStore;

const onFilesSelected = (files: ArrayLike<File> | null) => {
  if (files && files.length && !isLoading.value) {
    loadSourceImage(files[0]);
  }
};

const { isOverDropZone } = useDropZone(playgroundContainer, {
  dataTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
  onDrop: onFilesSelected
});

const { open: openFileDialog, onChange: onFileDialogChange } = useFileDialog({ accept: 'image/*' });
onFileDialogChange(onFilesSelected);

const isShowInputSettingsDialog = ref(false);
const isShowOutputInfoDialog = ref(false);

const { hasRequests: isSelectingImagePoint } = storeToRefs(useImagePointsTransportStore());
const shouldRestoreInputSettingsDialog = ref(false);
watch(isSelectingImagePoint, (value) => {
  if (value && isShowInputSettingsDialog.value) {
    shouldRestoreInputSettingsDialog.value = true;
    isShowInputSettingsDialog.value = false;
  } else if (!value && shouldRestoreInputSettingsDialog.value) {
    shouldRestoreInputSettingsDialog.value = false;
    if (!isShowInputSettingsDialog.value) {
      isShowInputSettingsDialog.value = true;
    }
  }
});
</script>

<template>
  <div ref="playgroundContainer" class="lens-playground fill-height">
    <div
      v-if="!sourceImage && !isLoadingSourceImage"
      class="fill-height"
      @click="() => openFileDialog()"
    >
      <div class="d-flex align-content-center fill-height justify-center align-center">
        <p class="text-center" v-if="!isOverDropZone">
          <VIcon size="100">mdi-image</VIcon>
          <br />
          <span class="hidden-sm-and-down">Drag image here or click to select</span>
          <span class="hidden-md-and-up">Tap to select image</span>
        </p>
      </div>
    </div>
    <VRow v-if="sourceImage" class="fill-height ma-0">
      <VCol cols="12" md="8" lg="9" xl="10" xxl="11" class="pa-0">
        <ImageArea>
          <template v-if="isMobile" #bottom-right>
            <VBtn icon @click="isShowInputSettingsDialog = true" :disabled="isLoading">
              <VIcon>mdi-cogs</VIcon>
            </VBtn>
            <VBtn
              icon
              @click="isShowOutputInfoDialog = true"
              :disabled="isLoading || !distortedImage || isSelectingImagePoint"
            >
              <VIcon>mdi-information-outline</VIcon>
            </VBtn>
          </template>
        </ImageArea>
      </VCol>
      <VCol cols="12" md="4" lg="3" xl="2" xxl="1" class="d-none d-md-flex py-0 pr-0">
        <div class="relative-wrapper">
          <div class="absolute-wrapper">
            <SidePanel>
              <template #default>
                <InputSettings />
              </template>

              <template #output-info>
                <OuptutInfo />
              </template>
            </SidePanel>
          </div>
        </div>
      </VCol>
    </VRow>

    <template v-if="sourceImage && isMobile">
      <MobileDialog title="Input Settings" v-model="isShowInputSettingsDialog">
        <InputSettings />
      </MobileDialog>

      <MobileDialog title="Output Info" v-if="distortedImage" v-model="isShowOutputInfoDialog">
        <OuptutInfo />
      </MobileDialog>
    </template>

    <div
      v-if="isOverDropZone && !isLoading"
      class="drop-zone-overlay d-flex align-center justify-center"
    >
      <p class="text-center">
        <VIcon size="100">mdi-chevron-triple-down</VIcon>
        <br />
        Drop image to load
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drop-zone-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: rgba(29, 118, 9, 0.21);
}
.relative-wrapper {
  position: relative;
  max-height: 100%;
  height: 100%;
  width: 100%;

  .absolute-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
}
</style>

<style lang="scss">
// remove scrollbar
html {
  overflow-y: auto;
}
</style>
