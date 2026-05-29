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
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	aspect-ratio: 1 / 1;
	width: 100%;
	min-height: 100%;
	padding: 24px;
	border-radius: 12px;
	overflow: hidden;
	background: var(--primary-bg);
	@include tablet {
		padding: 34px;
	}
	@include ultrahd {
		padding: 54px;
	}

	&__img {
		display: block;
		flex: 0 1 auto;
		width: auto;
		height: auto;
		max-width: 86%;
		max-height: 86%;
		object-fit: contain;
		object-position: center;
	}
}
</style>
