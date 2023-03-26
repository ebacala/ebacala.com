<template>
  <section class="panel flex-column align-center justify-center">
    <slot/>
  </section>
</template>

<style lang="scss" scoped>
.panel {
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  width: 100vw;
}
</style>