<script setup lang="ts">
import PointsMapping from '@/components/playground/input-settings/distortion-settings/distortion-arguments/control-points/PointsMapping';
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: number[];
    disabled?: boolean;
    minControlPoints?: number;
    errorIndexes?: number[];
  }>(),
  {
    disabled: false,
    minControlPoints: 1
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: number[]): void;
}>();

const args = useVModel(props, 'modelValue', emit, { passive: true });

const mappings = computed<[number, number, number, number][]>(() => {
  const groups: [number, number, number, number][] = [];
  for (let offset = 0; offset < args.value.length; offset += 4) {
    let group = args.value.slice(offset, offset + 4);
    const missingCount = 4 - group.length;
    if (missingCount) {
      group = group.concat(new Array(missingCount).fill(0));
    }
    groups.push(group as [number, number, number, number]);
  }
  return groups;
});

const allowDelete = computed<boolean>(() => props.minControlPoints <= mappings.value.length - 1);

const setValue = (groupIndex: number, letter: string, value: number) => {
  const offset = groupIndex * 4 + 'uvxy'.indexOf(letter);
  args.value[offset] = value;
};

const addControlPoint = () => args.value.push(0, 0, 0, 0);
const removeControlPoint = (index: number) => allowDelete.value && args.value.splice(index * 4, 4);
</script>

<template>
  <div class="control-points">
    <div class="d-flex" v-for="([u, v, x, y], groupIndex) in mappings" :key="groupIndex">
      <PointsMapping
        :index="groupIndex"
        :u="u"
        :v="v"
        :x="x"
        :y="y"
        :disabled="props.disabled"
        :allow-delete="allowDelete"
        @update:u="setValue(groupIndex, 'u', $event)"
        @update:v="setValue(groupIndex, 'v', $event)"
        @update:x="setValue(groupIndex, 'x', $event)"
        @update:y="setValue(groupIndex, 'y', $event)"
        @delete-mapping="removeControlPoint"
      />
    </div>
    <VBtn :disabled="props.disabled" @click="addControlPoint">Add</VBtn>
  </div>
</template>

<style scoped></style>
