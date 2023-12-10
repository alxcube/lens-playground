import { defineStore } from 'pinia';
import { useDisplay } from 'vuetify';

export const useAppStore = defineStore('app', () => {
  const { mobile: isMobile } = useDisplay({ mobileBreakpoint: 'sm' });

  return {
    isMobile
  };
});
