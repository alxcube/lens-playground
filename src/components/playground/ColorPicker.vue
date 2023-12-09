<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value?: string): void;
}>();

const valueModel = useVModel(props, 'modelValue', emit);
const sampleColor = computed(() => valueModel.value || 'transparent');
const backupValue = ref<string>();
const isDisplayMenu = ref(false);

watch(isDisplayMenu, (val: boolean) => {
  if (val) {
    backupValue.value = valueModel.value;
  }
});

const closeMenu = () => (isDisplayMenu.value = false);
const cancel = () => {
  valueModel.value = backupValue.value;
  closeMenu();
};
</script>

<template>
  <VBtn class="color-picker-toggle">
    <VSheet class="color-picker-sample" :color="sampleColor" rounded />
    <VSheet class="color-picker-transparent-backdrop" rounded />
    <VMenu
      activator="parent"
      v-model="isDisplayMenu"
      :close-on-content-click="false"
      :close-on-click="false"
      transition="scale-transition"
      min-width="290px"
      :disabled="props.disabled"
    >
      <VCard>
        <VColorPicker v-model="valueModel" mode="rgba" :modes="['rgba']" />
        <VCardActions>
          <VBtn @click="closeMenu">Ok</VBtn>
          <VBtn @click="cancel">Cancel</VBtn>
        </VCardActions>
      </VCard>
    </VMenu>
  </VBtn>
</template>

<style scoped>
.color-picker-toggle {
  position: relative;
}

.color-picker-sample {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.color-picker-transparent-backdrop {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0I2OTM4MUI0QzA3MTFFQTk5ODI5NEYwRTg3RDIzMDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0I2OTM4MUM0QzA3MTFFQTk5ODI5NEYwRTg3RDIzMDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QjY5MzgxOTRDMDcxMUVBOTk4Mjk0RjBFODdEMjMwNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3QjY5MzgxQTRDMDcxMUVBOTk4Mjk0RjBFODdEMjMwNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgAiQgsAAABWSURBVHjaYmRgYJBiQAJCQkJMb9++1WNAA0zoAt+/f//PgAUwMRAJMBRKSkoyY1PIIiUlxfzjx4//UEVMV69e/YNNIeP///+9MAQZGS9Qz430UwgQYAAyfBOo6ecabAAAAABJRU5ErkJggg==);
  background-repeat: repeat;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>
