<template>
  <a :href="logo.link" target="_blank"
    ><img class="logo" :src="logo.path" :alt="logo.name"
  /></a>
</template>

<script setup lang="ts">
import { Logo } from "@/types/types";

defineProps<{ logo: Logo }>();
</script>

<style scoped lang="scss">
.logo {
  $size: clamp(32px, 10vw, 64px);

  filter: grayscale(1);
  height: $size;
  margin: calc($size / 4);
  object-fit: contain;
  width: $size;
}

.logo:hover {
  filter: grayscale(0);
}
</style>
