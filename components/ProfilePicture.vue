<template>
  <Panel>
    <div class="flex-row align-center justify-space-around flex-wrap w-80">
      <div>
        <div class="hi">Hi I'm</div>
        <div class="name">Evann</div>
      </div>
      <img class="profile-picture" src="~/assets/img/profile-picture.webp" alt="Profile Picture" />
    </div>
  </Panel>
</template>

<style lang="scss" scoped>
.profile-picture {
    $size: min(40vw, 200px);

    border: 2px purple solid;
    border-radius: 50%;
    height: $size;
    margin: calc($size / 4);
    object-fit: contain;
    width: $size;
}

.hi {
  font-size : clamp(2rem, 10vw, 4rem);
}

.name {
  font-size : clamp(4rem, 20vw, 6rem);
  font-weight: 500;
}
</style>