<script setup lang="ts">
import AffineMatrix from '@/components/playground/input-settings/distortion-settings/distortion-arguments/AffineMatrix';
import ArcArguments from '@/components/playground/input-settings/distortion-settings/distortion-arguments/ArcArguments';
import ControlPoints from '@/components/playground/input-settings/distortion-settings/distortion-arguments/control-points/ControlPoints';
import GenericArguments from '@/components/playground/input-settings/distortion-settings/distortion-arguments/GenericArguments';
import PerspectiveMatrix from '@/components/playground/input-settings/distortion-settings/distortion-arguments/PerspectiveMatrix';
import DistortionSelector from '@/components/playground/input-settings/distortion-settings/DistortionSelector';
import { useDistortionStore } from '@/store/distortion';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { ReversePixelMapperFactoriesPoolKeyMap } from '../../../../../../lens';

const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const distortionStore = useDistortionStore();
const { distortionName, distortionArguments } = storeToRefs(distortionStore);

const argumentsTitle = computed(() => {
  switch (distortionName.value) {
    case 'Affine':
    case 'Perspective':
      return 'Control points';
    case 'AffineProjection':
      return 'Affine matrix';
    case 'PerspectiveProjection':
      return 'Perspective matrix';
    default:
      return 'Arguments';
  }
});

const minControlPoints = computed(() => {
  switch (distortionName.value) {
    case 'Perspective':
      return 4;
    case 'Affine':
      return 1;
    default:
      return 0;
  }
});

const argumentsStorage = new Map<keyof ReversePixelMapperFactoriesPoolKeyMap | string, number[]>();

watch(
  distortionName,
  (
    name?: keyof ReversePixelMapperFactoriesPoolKeyMap | string,
    prev?: keyof ReversePixelMapperFactoriesPoolKeyMap | string
  ) => {
    if (prev) {
      argumentsStorage.set(prev, distortionArguments.value.slice());
    }
    if (name) {
      const storedArguments = argumentsStorage.get(name);
      if (storedArguments) {
        distortionArguments.value = storedArguments;
      } else {
        let numArguments = 0;
        switch (name) {
          case 'Affine':
            numArguments = 4;
            break;
          case 'AffineProjection':
            numArguments = 6;
            break;
          case 'Arc':
            numArguments = 1;
            break;
          case 'Perspective':
            numArguments = 16;
            break;
          case 'PerspectiveProjection':
            numArguments = 8;
            break;
        }
        distortionArguments.value = new Array(numArguments).fill(0);
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="distortion-settings">
    <DistortionSelector v-model="distortionStore.distortionName" :disabled="props.disabled" />

    <h5>{{ argumentsTitle }}</h5>

    <VExpandTransition>
      <ControlPoints
        v-if="distortionName === 'Affine' || distortionName === 'Perspective'"
        v-model="distortionArguments"
        :disabled="props.disabled"
        :min-control-points="minControlPoints"
      />

      <AffineMatrix
        v-else-if="distortionName === 'AffineProjection'"
        v-model="distortionArguments"
        :disabled="props.disabled"
      />

      <PerspectiveMatrix
        v-else-if="distortionName === 'PerspectiveProjection'"
        v-model="distortionArguments"
        :disabled="props.disabled"
      />

      <ArcArguments
        v-else-if="distortionName === 'Arc'"
        v-model="distortionArguments"
        :disabled="props.disabled"
      />

      <GenericArguments
        v-else-if="!!distortionName"
        v-model="distortionArguments"
        :disabled="props.disabled"
      />
    </VExpandTransition>
  </div>
</template>

<style scoped></style>
