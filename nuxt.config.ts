// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	typescript: {
		shim: false,
	},
	css: ["@/assets/css/reset.min.css", "@/assets/css/main.scss"],
	app: {
		head: {
			link: [
				{ rel: "icon", type: "image/png", href: "/favicon/favicon.ico" },
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/favicon/apple-touch-icon.png",
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/favicon/favicon-32x32.png",
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "16x16",
					href: "/favicon/favicon-16x16.png",
				},
				{ rel: "manifest", href: "/favicon/site.webmanifest" },
			],
			meta: [{ name: "theme-color", content: "#00A2FF" }],
		},
	},
});
