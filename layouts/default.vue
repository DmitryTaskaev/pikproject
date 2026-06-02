<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue'

const { initModals } = useModals()
const { initAnimation } = useAnimations()
const route = useRoute()

onMounted(() => {
	initModals()
	initAnimation()
})

watch(
	() => route.fullPath,
	async () => {
		await nextTick()
		initAnimation()
	},
)
</script>

<template>
	<div>
		<PromoStrip />
		<Header />
		<slot />
		<Footer />
		<!-- <OrderModal />
		<DocumentationModal /> -->
		<div class="overlay js-overlay" />
		<SvgSprite />
	</div>
</template>
