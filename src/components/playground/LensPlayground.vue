<script setup lang="ts">
import NextTickTeleport from '@/components/NextTickTeleport';
import ImageArea from '@/components/playground/image-area/ImageArea';
import FileSelectionArea from '@/components/playground/FileSelectionArea';
import InputSettings from '@/components/playground/input-settings/InputSettings';
import MobileDialog from '@/components/playground/MobileDialog';
import OuptutInfo from '@/components/playground/OuptutInfo';
import PlaygroundTopMenu from '@/components/playground/PlaygroundTopMenu';
import SidePanel from '@/components/playground/SidePanel';
import { useAppStore } from '@/store/app';
import { useDistortionStore } from '@/store/distortion';
import { usePlaygroundStore } from '@/store/playground';
import { useDropZone } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { shallowRef } from 'vue';

const playgroundContainer = shallowRef<HTMLDivElement>();

const distortionStore = useDistortionStore();
const { sourceImage, distortedImage, isLoadingSourceImage } = storeToRefs(distortionStore);
const { loadSourceImage } = distortionStore;

const { isOverDropZone } = useDropZone(playgroundContainer, {
  dataTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
  onDrop: (files) => {
    if (files && files.length) {
      loadSourceImage(files[0]);
    }
  }
});

const onFileSelected = (file: File) => loadSourceImage(file);

const appStore = useAppStore();
const { isMobile } = storeToRefs(appStore);
const playgroundStore = usePlaygroundStore();
const { isShowInputSettingsDialog, isShowOutputInfoDialog } = storeToRefs(playgroundStore);
</script>

<template>
  <div ref="playgroundContainer" class="lens-playground fill-height">
    <FileSelectionArea
      v-if="!sourceImage && !isLoadingSourceImage"
      @file-selected="onFileSelected"
    />

    <VRow v-if="sourceImage" class="fill-height ma-0">
      <VCol cols="12" md="8" lg="9" xl="10" xxl="11" class="pa-0">
        <ImageArea />
      </VCol>
      <VCol cols="12" md="4" lg="3" xl="2" xxl="1" class="d-none d-md-flex">
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

    <NextTickTeleport to="#topmenu"><PlaygroundTopMenu /></NextTickTeleport>

    <template v-if="sourceImage && isMobile">
      <MobileDialog title="Input Settings" v-model="isShowInputSettingsDialog">
        <InputSettings />
      </MobileDialog>

      <MobileDialog title="Output Info" v-if="distortedImage" v-model="isShowOutputInfoDialog">
        <OuptutInfo />
      </MobileDialog>
    </template>

    <div class="drop-zone-overlay" v-if="isOverDropZone" />
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
