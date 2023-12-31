import { useDark } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';

export const useAppStore = defineStore('app', () => {
  const { mobile: isMobile } = useDisplay({ mobileBreakpoint: 'sm' });

  const loadingsCounter = ref(0);
  const isLoading = computed(() => loadingsCounter.value > 0);
  const startLoading = () => loadingsCounter.value++;
  const finishLoading = () => loadingsCounter.value > 0 && loadingsCounter.value--;

  const isDarkTheme = useDark();
  const theme = computed<'dark' | 'light'>(() => (isDarkTheme.value ? 'dark' : 'light'));

  return {
    isMobile,
    loadingsCounter,
    isLoading,
    startLoading,
    finishLoading,
    isDarkTheme,
    theme
  };
});
