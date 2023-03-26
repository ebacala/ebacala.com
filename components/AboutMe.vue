<template>
  <Panel>
    <div id="about-me" class="border-radius-10 flex-column align-center justify-space-around">
        <h1>About Me</h1>
        <div class="content">
          <p>I began my tech journey in 2016 when I enrolled in a 2-year computer science curriculum. Having lightly tinkered with code (some HTML/CSS and Java) at the end of my middle school education, 
            I knew I was made for computer science.
          </p>
          <p>I then enrolled in a 3-year work-school program where I would be spending 2 weeks learning at school and 2 weeks working on real life projects in a company.</p>
          <p>Since school ended in 2022, I am always eager to learn new technologies and tools that can strenghten my technical skills as well as my soft skills.</p>
          <p>Always focusing on delivering high-quality results, I am excited to bring my skills and experience onto the next project.</p>
        </div>
    </div>
  </Panel>
</template>

<script setup>
import { onMounted } from 'vue'
import { createObserver } from '@/services/animation'

onMounted(() => {
  createObserver(document.getElementById('about-me'), "animate-about-me");
  // createObserver(document.getElementById('technologies'), "animate-technologies");
})
</script>

<style lang="scss" scoped>
@keyframes animation-about-me {
    0% {
        opacity: 0;
        transform:  translate(-100%, 0);
    }
    100% {
    }
}

.animate-about-me {
  animation: animation-about-me 1s linear 0s 1 normal both;
}

#about-me {
  background-color: white;
  border: 1px solid lightgrey;
  height: 70vh;
  padding: clamp(20px, 4vw, 40px);
  text-align: justify;
  width: 80vw;
}

@keyframes animation-technologies {
    0% {
        opacity: 0;
        transform:  translate(0, 100%);
    }
    100% {
    }
}

.animate-technologies {
  animation: animation-technologies 1s linear 1s 1 normal both;
}

h1 {
  font-size : clamp(30px, 4vw, 52px);
}

p {
  font-family: 'Barlow Condensed', monospace;
  font-size : clamp(15px, 2vmax, 25px);
  font-weight: 300;
  line-height: min(30px, 5vmin);
  margin: clamp(20px, 4vw, 40px) auto;
}
</style>
