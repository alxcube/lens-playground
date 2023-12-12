<template>
  <VApp theme="dark">
    <VNavigationDrawer v-model="isDrawerOpened" temporary>
      <VList>
        <VListItem
          href="https://alxcube.github.io/lens"
          prepend-icon="mdi-file-document-multiple"
          target="_blank"
        >
          Lens Docs
        </VListItem>
        <VListItem href="https://github.com/alxcube/lens" prepend-icon="mdi-github" target="_blank">
          Lens on Github
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <DefaultBar v-model:is-drawer-opened="isDrawerOpened" />

    <DefaultView />

    <VFooter app>
      <span class="text-body-2"> &copy; 2020-2023 Alexander Alexandrov (alxcube) </span>
    </VFooter>

    <GlobalMessage :default-timeout="5000" />

    <VOverlay class="d-flex align-center justify-center" :model-value="isLoading" persistent>
      <VProgressCircular indeterminate size="100" />
    </VOverlay>
  </VApp>
</template>

<script lang="ts" setup>
import GlobalMessage from '@/components/GlobalMessage';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import DefaultBar from './AppBar.vue';
import DefaultView from './View.vue';
const { isLoading } = storeToRefs(useAppStore());

const isDrawerOpened = ref(false);
</script>
