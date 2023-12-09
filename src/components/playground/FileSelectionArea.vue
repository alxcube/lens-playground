<script setup lang="ts">
import { useDropZone, useFileDialog } from '@vueuse/core';
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'file-selected', file: File): void;
}>();

const dropZoneRef = ref<HTMLElement>();

const onFileSelected = (files: File[] | FileList | null) => {
  if (files !== null && files.length) {
    emit('file-selected', files[0]);
  }
};

const { isOverDropZone } = useDropZone(dropZoneRef, {
  dataTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  onDrop: onFileSelected
});

const { open: openFileDialog, onChange: onFilesChange } = useFileDialog({ accept: 'image/*' });

onFilesChange(onFileSelected);

const onContainerClick = () => openFileDialog();
</script>

<template>
  <div @click="onContainerClick" class="fill-height">
    <div
      ref="dropZoneRef"
      class="d-flex align-content-center fill-height justify-center align-center"
    >
      <p class="text-center">
        <VIcon size="100">mdi-image</VIcon>
        <br />
        Drag image here or click to select
      </p>
    </div>
  </div>
</template>

<style scoped></style>
