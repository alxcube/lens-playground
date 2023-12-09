<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { ref } from 'vue';

const props = defineProps<{
  showAxes: boolean;
  applyViewportOffset: boolean;
  imageOutline: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:showAxes', value: boolean): void;
  (e: 'update:applyViewportOffset', value: boolean): void;
  (e: 'update:imageOutline', value: boolean): void;
}>();

const showAxesModel = useVModel(props, 'showAxes', emit);
const applyViewportOffsetModel = useVModel(props, 'applyViewportOffset', emit);
const imageOutlineModel = useVModel(props, 'imageOutline', emit);
const isShowMenu = ref(false);
</script>

<template>
  <VBtn icon :disabled="disabled">
    <VIcon>mdi-tune</VIcon>
    <VMenu :close-on-content-click="false" v-model="isShowMenu" activator="parent">
      <VCard>
        <VCardText>
          <VSwitch
            label="Apply Viewport Offset"
            v-model="applyViewportOffsetModel"
            density="compact"
          />

          <VSwitch label="Show Axes" v-model="showAxesModel" density="compact" />

          <VSwitch label="Image outline" v-model="imageOutlineModel" density="compact" />
        </VCardText>

        <VCardActions>
          <VBtn @click="isShowMenu = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VMenu>
  </VBtn>
</template>

<style scoped></style>
