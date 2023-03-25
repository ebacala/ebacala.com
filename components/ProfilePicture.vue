<template>
  <Panel>
    <div class="flex-row align-center justify-space-around flex-wrap-reverse w-80">
      <div>
        <h1>Hi I'm</h1>
        <h2>Evann</h2>
        <div class="job">Developer</div>
      </div>
      <img class="profile-picture" src="~/assets/img/profile-picture.webp" alt="Profile Picture" />
      
    </div>
  </Panel>
</template>

<style lang="scss" scoped>
@keyframes animation {
    0% {
        opacity: 0;
        transform:  translate(0, -100%);
    }
    100% {
        opacity: 1;
    }
}

@keyframes animation-picture {
    0% {
        opacity: 0;
        transform:  rotate3d(1, 0, 0, 90deg) translate3d(0, -50%, 0);
    }
    100% {
    }
}

.profile-picture {
    $size: min(40vmin, 300px);

    animation: animation-picture 1s linear 2s 1 normal both;
    perspective: 4000px;

    height: $size;
    margin: calc($size / 4);
    object-fit: contain;
    width: $size;
}

h1 {
  animation: animation 1s linear 0s 1 normal backwards;
  font-size : clamp(30px, 4vw, 52px);
  margin: clamp(10px, 2vw, 20px) auto;
}

h2 {
  animation: animation 1s linear 1s 1 normal backwards;
  font-size : clamp(60px, 8vw, 140px);
  font-weight: 500;
  margin: clamp(10px, 2vw, 20px) auto;
}

.job {
  animation: animation 1s linear 2s 1 normal both;
  perspective: 4000px;

  border-radius: 10px;
  background-color: #00A2FF;
  color: black;
  font-size: clamp(20px, 3vw, 38px);
  margin: clamp(10px, 2vw, 20px) auto;
  padding: clamp(10px, 2vw, 20px);
  text-align: center;
}
</style>