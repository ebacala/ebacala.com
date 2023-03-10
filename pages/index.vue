<template>
  <div class="profile-picture">
    <img src="~/assets/img/profile-picture.webp" alt="Profile Picture" />
  </div>
  <div class="personal-information">
    <h1>Hi, I'm Evann</h1>
    <h2>Welcome to my personal website!</h2>
  </div>
</template>

<style lang="scss" scoped>
.profile-picture {
  padding: 4rem 0;
  text-align: center;

  img {
    $size: 200px;

    border-radius: 50%;
    height: $size;
    object-fit: contain;
    width: $size;
  }
}

.personal-information {
  font-family: 'Montserrat', sans-serif;
  padding: 4rem 0;
  text-align: center;

  h1 {
    font-size: 5vmax;
    padding: 2vh 4vw;
  }

  h2 {
    font-size: 3vmax;
    padding: 2vh 4vw;
  }
}
</style>