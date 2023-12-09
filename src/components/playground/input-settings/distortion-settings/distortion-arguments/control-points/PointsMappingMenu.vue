<script setup lang="ts">
const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });

const emit = defineEmits<{
  (e: 'delete-mapping'): void;
}>();
</script>

<template>
  <VBtn icon class="ml-2" :disabled="props.disabled" density="comfortable">
    <VIcon>mdi-dots-vertical</VIcon>
    <VMenu activator="parent" :close-on-content-click="true" :disabled="props.disabled">
      <VList>
        <VListItem @click="emit('delete-mapping')">Remove Mapping</VListItem>
      </VList>
    </VMenu>
  </VBtn>
</template>

<style scoped></style>
