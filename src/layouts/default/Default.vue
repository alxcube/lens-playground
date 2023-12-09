<template>
  <VApp theme="dark">
    <DefaultBar />

    <DefaultView />

    <VFooter app height="25">
      <span class="text-body-2"> &copy; 2020-2023 Alexander Alexandrov (alxcube) </span>
    </VFooter>
  </VApp>
</template>

<script lang="ts" setup>
import DefaultBar from './AppBar.vue';
import DefaultView from './View.vue';
</script>
