<template>
  <Panel>
    <div class="flex-row align-center justify-space-around flex-wrap-reverse w-80">
      <div>
        <h1 id="h1">Hi I'm</h1>
        <h2 id="h2">Evann</h2>
        <div id="job" class="border-radius-10 job">Developer</div>
      </div>
      <img id="profile-picture" class="profile-picture" src="/img/profile-picture.webp" alt="Profile Picture" />
    </div>
  </Panel>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { createObserver } from '@/services/animation'

onMounted(() => {
  createObserver(document.getElementById('profile-picture'), "animate-profile-picture");
  createObserver(document.getElementById('h1'), "animate-h1");
  createObserver(document.getElementById('h2'), "animate-h2");
  createObserver(document.getElementById('job'), "animate-job");
})
</script>

<style lang="scss" scoped>
@keyframes animation-profile-picture {
    0% {
        opacity: 0;
        transform:  rotate3d(1, 0, 0, 90deg) translate3d(0, -50%, 0);
    }
    100% {
    }
}

.profile-picture {
    $size: min(40vmin, 300px);

    height: $size;
    margin: calc($size / 4);
    object-fit: contain;
    width: $size;
}

.animate-profile-picture {
  animation: animation-profile-picture 1s linear 2s 1 normal both;
  perspective: 4000px;
}

@keyframes animation-title {
    0% {
        opacity: 0;
        transform:  translate(0, -100%);
    }
    100% {
        opacity: 1;
    }
}

h1 {
  font-size : clamp(30px, 4vw, 52px);
  margin: clamp(10px, 2vw, 20px) auto;
}

.animate-h1 {
  animation: animation-title 1s linear 0s 1 normal both;
}

h2 {
  font-size : clamp(60px, 8vw, 140px);
  font-weight: 500;
  margin: clamp(10px, 2vw, 20px) auto;
}

.animate-h2 {
  animation: animation-title 1s linear 1s 1 normal both;
}

@keyframes animation-job {
    0% {
        opacity: 0;
        transform:  rotate3d(1, 0, 0, 90deg) translate3d(0, -50%, 0);
    }
    100% {
    }
}

.job {
  background-color: #00A2FF;
  color: black;
  font-size: clamp(20px, 3vw, 38px);
  margin: clamp(10px, 2vw, 20px) auto;
  padding: clamp(10px, 2vw, 20px);
  text-align: center;
}

.animate-job {
  animation: animation-job 1s linear 2s 1 normal both;
  perspective: 4000px;
}
</style>