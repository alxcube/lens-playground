<script setup lang="ts">
import ImageArea from '@/components/playground/image-area/ImageArea';
import FileSelectionArea from '@/components/playground/FileSelectionArea';
import InputSettings from '@/components/playground/input-settings/InputSettings';
import OuptutInfo from '@/components/playground/OuptutInfo';
import SidePanel from '@/components/playground/SidePanel';
import { useDistortionStore } from '@/store/distortion';

const distortionStore = useDistortionStore();
const { loadSourceImage, processDistortion } = distortionStore;

const onFileSelected = (file: File) => loadSourceImage(file);
</script>

<template>
  <FileSelectionArea
    v-if="!distortionStore.sourceImage && !distortionStore.isLoadingSourceImage"
    @file-selected="onFileSelected"
  />

  <VRow v-if="distortionStore.sourceImage" class="fill-height">
    <VCol cols="12" md="8" lg="9" xl="10" xxl="11" class="pa-0">
      <ImageArea />
    </VCol>
    <VCol cols="12" md="4" lg="3" xl="2" xxl="1" class="d-none d-md-flex">
      <div class="relative-wrapper">
        <div class="absolute-wrapper">
          <SidePanel>
            <template #default>
              <VBtn @click="processDistortion">Distort</VBtn>
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
</template>

<style scoped lang="scss">
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
