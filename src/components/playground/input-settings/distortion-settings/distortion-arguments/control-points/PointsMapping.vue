<script setup lang="ts">
import CoordsPair from '@/components/playground/input-settings/distortion-settings/distortion-arguments/control-points/CoordsPair';
import PointsMappingMenu from '@/components/playground/input-settings/distortion-settings/distortion-arguments/control-points/PointsMappingMenu';
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    u?: number;
    v?: number;
    x?: number;
    y?: number;
    index?: number;
    disabled?: boolean;
    allowDelete?: boolean;
    errorIndexes?: number[];
  }>(),
  {
    u: 0,
    v: 0,
    x: 0,
    y: 0,
    index: 0,
    disabled: false,
    allowDelete: false
  }
);

const emit = defineEmits<{
  (e: 'update:u', value: number): void;
  (e: 'update:v', value: number): void;
  (e: 'update:x', value: number): void;
  (e: 'update:y', value: number): void;
  (e: 'delete-mapping', value: number): void;
}>();

const uModel = useVModel(props, 'u', emit);
const vModel = useVModel(props, 'v', emit);
const xModel = useVModel(props, 'x', emit);
const yModel = useVModel(props, 'y', emit);

const getLabel = (letter: string) => `${letter}${props.index}`;

const getIsError = (letter: string): boolean => {
  if (props.errorIndexes === undefined) {
    return false;
  }
  const offset = props.index + 'uvxy'.indexOf(letter);
  return props.errorIndexes.includes(offset);
};
</script>

<template>
  <div class="points-mapping d-flex">
    <VRow dense class="flex-grow-1">
      <VCol cols="6">
        <CoordsPair
          v-model:x="uModel"
          v-model:y="vModel"
          :x-label="getLabel('u')"
          :y-label="getLabel('v')"
          :x-error="getIsError('u')"
          :y-error="getIsError('v')"
          :disabled="props.disabled"
        />
      </VCol>
      <VCol cols="6">
        <CoordsPair
          v-model:x="xModel"
          v-model:y="yModel"
          :x-label="getLabel('x')"
          :y-label="getLabel('y')"
          :x-error="getIsError('x')"
          :y-error="getIsError('y')"
          :disabled="props.disabled"
        />
      </VCol>
    </VRow>
    <PointsMappingMenu
      :disabled="props.disabled"
      @delete-mapping="emit('delete-mapping', props.index)"
    />
  </div>
</template>

<style scoped></style>
