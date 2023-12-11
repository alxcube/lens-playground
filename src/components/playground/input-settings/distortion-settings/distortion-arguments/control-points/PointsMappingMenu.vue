<script setup lang="ts">
import { useDistortionStore } from '@/store/distortion';
import { useImagePointsTransportStore } from '@/store/imagePointTransport';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, shallowRef } from 'vue';

const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const emit = defineEmits<{
  (e: 'delete-mapping'): void;
  (e: 'set-source', point: { x: number; y: number }): void;
  (e: 'set-destination', point: { x: number; y: number }): void;
}>();

const distortionStore = useDistortionStore();
const { sourceImageViewport } = storeToRefs(distortionStore);

const addOffset = (point: { x: number; y: number }): { x: number; y: number } => {
  if (!sourceImageViewport.value) {
    return point;
  }
  const { x1: offsetX, y1: offsetY } = sourceImageViewport.value;
  const { x, y } = point;
  return {
    x: x + offsetX,
    y: y + offsetY
  };
};

const imagePointTransportStore = useImagePointsTransportStore();
const { hasRequests } = storeToRefs(imagePointTransportStore);
const { request: requestPoint } = imagePointTransportStore;
const cancelPointRequest = shallowRef<{ (): void }>();

const cancelPickPoint = () => {
  if (cancelPointRequest.value) {
    cancelPointRequest.value();
    cancelPointRequest.value = undefined;
  }
};
const pickPoint = (source = false) => {
  cancelPickPoint();
  cancelPointRequest.value = requestPoint((point) => {
    if (source) {
      emit('set-source', addOffset(point));
    } else {
      emit('set-destination', addOffset(point));
    }
    cancelPointRequest.value = undefined;
  });
};

const pickSourcePoint = () => pickPoint(true);
const pickDestinationPoint = () => pickPoint(false);

onBeforeUnmount(() => {
  cancelPickPoint();
});
</script>

<template>
  <VBtn
    v-if="!cancelPointRequest"
    icon
    class="ml-2"
    :disabled="props.disabled || hasRequests"
    density="comfortable"
  >
    <VIcon>mdi-dots-vertical</VIcon>
    <VMenu activator="parent" :close-on-content-click="true" :disabled="props.disabled">
      <VList>
        <VListItem @click="pickSourcePoint" prepend-icon="mdi-target-variant">
          Pick Source Point
        </VListItem>
        <VListItem @click="pickDestinationPoint" prepend-icon="mdi-target-variant">
          Pick Destination Point
        </VListItem>
        <VListItem @click="emit('delete-mapping')">Remove Mapping</VListItem>
      </VList>
    </VMenu>
  </VBtn>
  <VBtn v-else @click="cancelPickPoint" icon class="ml-2" density="comfortable">
    <VIcon>mdi-cancel</VIcon>
  </VBtn>
</template>

<style scoped></style>
