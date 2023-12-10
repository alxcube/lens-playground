import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlaygroundStore = defineStore('playground', () => {
  const isShowInputSettingsDialog = ref(false);
  const isShowOutputInfoDialog = ref(false);

  return {
    isShowInputSettingsDialog,
    isShowOutputInfoDialog
  };
});
