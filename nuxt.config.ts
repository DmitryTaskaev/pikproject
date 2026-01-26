// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image'],
	css: ['swiper/css/bundle', '~/assets/styles/main.scss'],
	ssr: true,
	runtimeConfig: {
		apiBase: 'https://pik.fintechzone.ru/api/v1/ru',
		apiKey: '',
		public: {
			apiOrigin: 'https://pik.fintechzone.ru',
		},
	},
	experimental: {
		inlineSSRStyles: false,
	},
	nitro: {
		preset: 'static',
		prerender: {
			crawlLinks: true,
			routes: ['/news'],
		},
	},
	components: [
		{
			path: '~/components',
			pathPrefix: false,
			global: true,
		},
	],
	vite: {
		build: {
			cssCodeSplit: false,
			modulePreload: false,
			rollupOptions: {
				output: {
					manualChunks: undefined,
					inlineDynamicImports: true,
					entryFileNames: '_nuxt/app.js',
					chunkFileNames: '_nuxt/app.js',
					assetFileNames: assetInfo => {
						if (assetInfo.name && assetInfo.name.endsWith('.css'))
							return '_nuxt/app.css'
						return '_nuxt/[name][extname]'
					},
				},
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
            @import "@/assets/styles/base/mixins.scss";
          `,
				},
			},
		},
	},
	app: {
		baseURL: '/piktube/',
		head: {
			title: 'Завод ПИК – Производство и продажа труб в изоляции ППУ, ППМ, ВУС',
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/piktube/favicon.ico' },
			],
			script: [
				{
					src: 'https://unpkg.com/swiper@11/swiper-bundle.min.js',
					defer: true,
				},
				{
					src: 'https://unpkg.com/imask@7/dist/imask.min.js',
					defer: true,
				},
			],
		},
	},
})
