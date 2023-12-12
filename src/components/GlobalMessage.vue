<script setup lang="ts">
const props = withDefaults(defineProps<{ defaultTimeout?: number }>(), { defaultTimeout: -1 });
import { useMessagesStore } from '@/store/messages';
import { storeToRefs } from 'pinia';

const messagesStore = useMessagesStore();
const { messages } = storeToRefs(messagesStore);
const { removeMessage } = messagesStore;
</script>

<template>
  <VSnackbar
    v-for="message in messages"
    :key="message.id"
    :color="message.type"
    :timeout="message.timeout !== undefined ? message.timeout : props.defaultTimeout"
    location="top"
    model-value
    @update:model-value="(val) => !val && removeMessage(message)"
  >
    {{ message.text }}
    <template #actions>
      <VBtn @click="() => removeMessage(message)">Close</VBtn>
    </template>
  </VSnackbar>
</template>

<style scoped></style>
