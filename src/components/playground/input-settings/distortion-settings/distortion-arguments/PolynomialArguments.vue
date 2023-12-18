<script setup lang="ts">
import ControlPoints from '@/components/playground/input-settings/distortion-settings/distortion-arguments/control-points/ControlPoints.vue';
import { useVModel } from '@vueuse/core';
import { computed, watch } from 'vue';

const props = defineProps<{
  modelValue: number[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit, { passive: true });

const orderModel = computed<number>({
  get() {
    return valueModel.value[0] || 1;
  },
  set(value) {
    valueModel.value[0] = value;
  }
});

const controlPointsModel = computed<number[]>({
  get() {
    return valueModel.value.slice(1);
  },
  set(cps) {
    valueModel.value = [valueModel.value[0]].concat(cps);
  }
});

const orderOptions = [1, 1.5, 2, 3, 4, 5];

const minControlPoints = computed(() => {
  return Math.floor(((orderModel.value + 1) * (orderModel.value + 2)) / 2);
});

watch(minControlPoints, (value, prev) => {
  if (value !== prev) {
    const missingArgsCount = value * 4 - controlPointsModel.value.length;
    if (missingArgsCount > 0) {
      controlPointsModel.value = controlPointsModel.value.concat(
        new Array(missingArgsCount).fill(0)
      );
    } else if (missingArgsCount < 0) {
      let deleteCount = 0;
      const cps = controlPointsModel.value;
      const length = cps.length;
      for (let i = length - 4; i > length + missingArgsCount; i -= 4) {
        if (cps[i] === 0 && cps[i + 1] === 0 && cps[i + 2] === 0 && cps[i + 3] === 0) {
          deleteCount += 4;
        } else {
          break;
        }
      }
      if (deleteCount) {
        controlPointsModel.value = controlPointsModel.value.slice(0, -deleteCount);
      }
    }
  }
});
</script>

<template>
  <div class="polynomial-arguments">
    <VSelect
      label="Order"
      v-model.number="orderModel"
      :items="orderOptions"
      density="compact"
      :disabled="props.disabled"
    />

    <ControlPoints
      v-model="controlPointsModel"
      :disabled="props.disabled"
      :min-control-points="minControlPoints"
    />
  </div>
</template>

<style scoped></style>
