<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    title?: string;
  }>(),
  { modelValue: false, title: '' }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isShow = useVModel(props, 'modelValue', emit);
</script>

<template>
  <VDialog fullscreen v-model="isShow" transition="dialog-bottom-transition">
    <VCard>
      <VToolbar>
        <VBtn icon @click.stop="isShow = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>

        <VToolbarTitle v-if="props.title">{{ props.title }}</VToolbarTitle>
      </VToolbar>

      <VCardText>
        <slot />
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped></style>
