<script setup lang="ts">
import { onMounted } from 'vue'

const { initModals } = useModals()
const { initAnimation } = useAnimations()

onMounted(() => {
	initModals()
	initAnimation()
})
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
