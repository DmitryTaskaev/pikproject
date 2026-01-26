import { defineNuxtPlugin } from '#app'
import vClickAway from 'vue3-click-away'

export default defineNuxtPlugin(nuxtApp => {
	if (import.meta.client) {
		nuxtApp.vueApp.use(vClickAway)
	}
})
// import { defineNuxtPlugin } from '#app'
// import vClickAway from 'vue3-click-away'

// export default defineNuxtPlugin(nuxtApp => {
// 	nuxtApp.vueApp.use(vClickAway)
// })
