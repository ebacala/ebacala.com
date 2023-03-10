// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false
  },
  css:['@/assets/css/reset.min.css', '@/assets/css/main.scss']
})
