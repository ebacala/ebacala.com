<template>
  <div class="panel flex-row align-center justify-center">
    <slot/>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  scroll-snap-align: start;
  width: 100vw;
}
</style>