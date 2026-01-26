<script setup lang="ts">
interface SlideImage {
	src: string
	alt?: string
}

interface PCHeroSlideProps {
	image: SlideImage
}

const props = defineProps<PCHeroSlideProps>()
</script>

<template>
	<div class="p-c-hero-slide">
		<Image
			class="p-c-hero-slide__img"
			:src="props.image.src"
			:alt="props.image.alt || 'Изображение'"
		/>
	</div>
</template>

<style lang="scss">
.p-c-hero-slide {
	// max-height: 400px;
	// max-width: 400px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12px;
	overflow: hidden;

	&__img {
		flex: 1 1 auto;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}
</style>
