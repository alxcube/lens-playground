<script setup lang="ts">
import ArgumentsHelpLink from '@/components/playground/input-settings/distortion-settings/ArgumentsHelpLink.vue';
import AffineMatrixInput from '@/components/playground/input-settings/distortion-settings/distortion-arguments/AffineMatrixInput.vue';
import ArcArgumentsInput from '@/components/playground/input-settings/distortion-settings/distortion-arguments/ArcArgumentsInput.vue';
import ControlPoints from '@/components/playground/input-settings/distortion-settings/distortion-arguments/control-points/ControlPoints.vue';
import GenericArguments from '@/components/playground/input-settings/distortion-settings/distortion-arguments/GenericArguments.vue';
import PerspectiveMatrixInput from '@/components/playground/input-settings/distortion-settings/distortion-arguments/PerspectiveMatrixInput.vue';
import PolynomialArguments from '@/components/playground/input-settings/distortion-settings/distortion-arguments/PolynomialArguments.vue';
import DistortionSelector from '@/components/playground/input-settings/distortion-settings/DistortionSelector.vue';
import { useDistortionStore } from '@/store/distortion';
import { storeToRefs } from 'pinia';
import { computed, ComputedRef, ref, watch } from 'vue';
import type {
  ReversePixelMapperFactoriesPoolKeyMap,
  AffineMatrix,
  PerspectiveMatrix,
  ArcDistortionArgs
} from '@alxcube/lens';

const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const distortionStore = useDistortionStore();
const { distortionName, distortionArguments, validationErrors } = storeToRefs(distortionStore);

const genericArguments = ref(false);

const argumentsTitle = computed(() => {
  if (genericArguments.value) {
    return 'Arguments';
  }
  switch (distortionName.value) {
    case 'Affine':
    case 'Perspective':
      return 'Control points';
    case 'AffineProjection':
      return 'Affine matrix';
    case 'PerspectiveProjection':
      return 'Perspective matrix';
    case 'Polynomial':
      return 'Polynomial arguments';
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
          case 'Polynomial':
            numArguments = 13;
            break;
        }
        distortionArguments.value = new Array(numArguments).fill(0);
        if (name === 'Polynomial') {
          distortionArguments.value[0] = 1;
        }
      }
    }
  },
  { immediate: true, flush: 'sync' }
);

const affineMatrix = computed(() => distortionArguments.value) as ComputedRef<AffineMatrix>;
const perspectiveMatrix = computed(
  () => distortionArguments.value
) as ComputedRef<PerspectiveMatrix>;
const arcArguments = computed(() => distortionArguments.value) as ComputedRef<ArcDistortionArgs>;
</script>

<template>
  <div class="distortion-settings">
    <DistortionSelector
      v-model="distortionName"
      :disabled="props.disabled"
      :errors="validationErrors.distortionName"
    />

    <VSwitch label="Generic arguments" v-model="genericArguments" density="compact" />

    <h5 class="text-subtitle-2" v-if="distortionName">
      {{ argumentsTitle }}
      <ArgumentsHelpLink :distortion-name="distortionName" />
    </h5>
    <VMessages
      :messages="validationErrors.args"
      :active="!!validationErrors.args"
      color="rgb(var(--v-theme-error))"
    />

    <GenericArguments
      v-if="genericArguments"
      v-model="distortionArguments"
      :disabled="props.disabled"
    />

    <template v-else>
      <VExpandTransition>
        <ControlPoints
          v-if="distortionName === 'Affine' || distortionName === 'Perspective'"
          v-model="distortionArguments"
          :disabled="props.disabled"
          :min-control-points="minControlPoints"
          :error-indexes="validationErrors.invalidArgs"
        />

        <AffineMatrixInput
          v-else-if="distortionName === 'AffineProjection'"
          v-model="affineMatrix"
          :disabled="props.disabled"
          :error-indexes="validationErrors.invalidArgs"
        />

        <PerspectiveMatrixInput
          v-else-if="distortionName === 'PerspectiveProjection'"
          v-model="perspectiveMatrix"
          :disabled="props.disabled"
          :error-indexes="validationErrors.invalidArgs"
        />

        <ArcArgumentsInput
          v-else-if="distortionName === 'Arc'"
          v-model="arcArguments"
          :disabled="props.disabled"
          :error-indexes="validationErrors.invalidArgs"
        />

        <PolynomialArguments
          v-else-if="distortionName === 'Polynomial'"
          v-model="distortionArguments"
          :disabled="props.disabled"
        />

        <GenericArguments
          v-else-if="!!distortionName"
          v-model="distortionArguments"
          :disabled="props.disabled"
        />
      </VExpandTransition>
    </template>
  </div>
</template>

<style scoped></style>
