<script setup lang="ts">
import type { ReversePixelMapperFactoriesPoolKeyMap } from '@alxcube/lens';
import { computed } from 'vue';

const props = defineProps<{
  distortionName?: keyof ReversePixelMapperFactoriesPoolKeyMap;
}>();

const helpUrl = computed(() => {
  switch (props.distortionName) {
    case 'Affine':
      return 'https://alxcube.github.io/lens/guide/distortions/affine.html#affine-distortion-using-control-points';
    case 'AffineProjection':
      return 'https://alxcube.github.io/lens/guide/distortions/affine.html#affine-distortion-using-affine-matrix';
    case 'Arc':
      return 'https://alxcube.github.io/lens/guide/distortions/arc.html';
    case 'Perspective':
      return 'https://alxcube.github.io/lens/guide/distortions/perspective.html#using-control-points';
    case 'PerspectiveProjection':
      return 'https://alxcube.github.io/lens/guide/distortions/perspective.html#using-forward-mapping-perspective-matrix';
    case 'Polynomial':
      return 'https://alxcube.github.io/lens/guide/distortions/polynomial.html';
    default:
      return '';
  }
});
</script>

<template>
  <VBtn icon v-if="helpUrl" :href="helpUrl" target="_blank" density="compact">
    <VIcon>mdi-help-circle</VIcon>
  </VBtn>
</template>

<style scoped></style>
