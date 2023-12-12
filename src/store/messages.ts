import { defineStore } from 'pinia';
import { ref } from 'vue';

let messageIdsCounter = 0;
const createMessageId = () => ++messageIdsCounter;

export type MessageType = 'info' | 'warning' | 'error' | 'success';
export interface Message {
  id: number;
  text: string | Error;
  type: MessageType;
  timeout?: number;
}
export const useMessagesStore = defineStore('messages', () => {
  const messages = ref<Message[]>([]);

  const addMessage = (
    text: string | Error,
    type: MessageType = 'info',
    options: { timeout?: number } = {}
  ) => {
    const { timeout } = options;
    if (text instanceof Error) {
      type = 'error';
    }
    const id = createMessageId();
    messages.value.push({ id, text, type, timeout });
  };

  const removeMessage = (message: Message) => {
    const index = messages.value.indexOf(message);
    if (index >= 0) {
      messages.value.splice(index, 1);
    }
  };

  return {
    messages,
    addMessage,
    removeMessage
  };
});
