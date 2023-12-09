<script setup lang="ts">
import { useDistortionStore } from '@/store/distortion';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const selectedTab = ref(0);

const distortionStore = useDistortionStore();
const { distortedImage } = storeToRefs(distortionStore);

watch(distortedImage, (val) => {
  if (val) {
    // switch to output info tab when distortion result is ready
    selectedTab.value = 1;
  } else {
    selectedTab.value = 0;
  }
});
</script>

<template>
  <VTabs v-model="selectedTab">
    <VTab>Input settings</VTab>
    <VTab :disabled="!distortedImage">Output info</VTab>
  </VTabs>
  <VWindow v-model="selectedTab">
    <VWindowItem>
      <VCard>
        <VCardText>
          <slot name="default" />
        </VCardText>
      </VCard>
    </VWindowItem>
    <VWindowItem>
      <VCard>
        <VCardText>
          <slot name="output-info" />
        </VCardText>
      </VCard>
    </VWindowItem>
  </VWindow>
</template>

<style scoped></style>
