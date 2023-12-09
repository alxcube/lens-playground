<script setup lang="ts">
import { useLensArgumentsStore } from '@/store/lensArguments';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const lensArgumentsStore = useLensArgumentsStore();
const { distortionDuration, distortionViewport } = storeToRefs(lensArgumentsStore);
const { useResultAsSource } = lensArgumentsStore;

const processingTimeString = computed(() => {
  if (distortionDuration.value === undefined) {
    return '-';
  }

  let msec = distortionDuration.value;
  let hours = Math.floor(msec / 3600000);
  msec -= hours * 3600000;
  let minutes = Math.floor(msec / 60000);
  msec -= minutes * 60000;
  let seconds = Math.floor(msec / 1000);
  msec -= seconds * 1000;
  let time = [];

  if (hours) {
    time.push(hours + ' h');
  }

  if (hours || minutes) {
    time.push((minutes < 10 ? '0' : '') + minutes + ' min');
  }

  let msecStr = (msec < 10 ? '00' : msec < 100 ? '0' : '') + msec;

  time.push(((hours || minutes) && seconds < 10 ? '0' : '') + seconds + '.' + msecStr + ' sec');

  return time.join(',');
});

const viewportCols = computed(() => {
  if (!distortionViewport.value) {
    return;
  }
  const { x1, y1, x2, y2 } = distortionViewport.value;
  return [
    { key: 'x1', value: x1, cols: 3 },
    { key: 'y1', value: y1, cols: 3 },
    { key: 'x2', value: x2, cols: 3 },
    { key: 'y2', value: y2, cols: 3 },
    { key: 'width', value: x2 - x1 + 1, cols: 6 },
    { key: 'height', value: y2 - y1 + 1, cols: 6 }
  ];
});
</script>

<template>
  <VTextField
    label="Processing time"
    :model-value="processingTimeString"
    disabled
    density="compact"
    variant="outlined"
  />

  <VRow v-if="viewportCols" dense>
    <VCol v-for="{ key, value, cols } in viewportCols" :key="key" :cols="cols">
      <VTextField :label="key" :model-value="value" disabled density="compact" variant="outlined" />
    </VCol>
  </VRow>

  <VBtn @click="useResultAsSource">Use as source image</VBtn>
</template>

<style scoped></style>
