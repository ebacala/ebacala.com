<template>
  <div class="skillbar">
  <div class="name">{{ skill.name }}</div>
  <div class="bar">
    <div
      class="progress"
      v-bind:style="{
        width: skill.levelOutOfFive * 20 + '%',
      }"
    ></div>
  </div>
</div>
</template>

<script lang="ts" setup>
const props = defineProps(['skill'])
</script>

<style scoped>
.name {
  margin: 1vmin;
}
.bar {
  background: #dfdfdf;
  border-radius: 5px;
  overflow: hidden;
  padding: 5px;
  width: 100%;
}

.progress {
  background-color: purple;
  height: 30px;
}

.skillbar {
  margin: 2vmin 0;
  width: 100%;
}
</style>
