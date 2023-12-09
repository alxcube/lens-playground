<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ modelValue: number[]; disabled?: boolean }>(), {
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void;
}>();

const argsModel = computed({
  get(): string {
    return props.modelValue.toString();
  },
  set(val: string) {
    const array = val.split(',').map(parseFloat);
    emit('update:modelValue', array);
  }
});
</script>

<template>
  <div class="generic-arguments">
    <VTextarea v-model.lazy="argsModel" :disabled="props.disabled" />
  </div>
</template>

<style scoped></style>
