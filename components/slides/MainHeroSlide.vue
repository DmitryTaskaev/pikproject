<script setup lang="ts">
import type { ImageProps } from '../ui/base/Image.vue'

interface MainHeroSlideProps {
	title: string
	description: string
	image: ImageProps
}
const { title, description, image } = defineProps<MainHeroSlideProps>()
</script>

<template>
	<div class="main-hero-slide">
		<div class="main-hero-slide__content">
			<Text
				class="main-hero-slide__title"
				line-height="sm"
				letter-spacing="sm"
				design="accent"
				:uppercase="true"
				>{{ title }}</Text
			>
			<Text
				class="main-hero-slide__description"
				size="sm"
				line-height="md"
				letter-spacing="sm"
				design="accent"
				>{{ description }}</Text
			>
		</div>
		<Image class="main-hero-slide__img" v-bind="image" />
	</div>
</template>

<style lang="scss">
.main-hero-slide {
	height: 482px;
	position: relative;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 0 20px;
	@include desktop {
		height: 718px;
		padding: 0 30px;
	}
	&__content {
		position: relative;
		z-index: 3;
		opacity: 0;
		transform: translateY(10px);
		transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
	}
	&__title {
		max-width: 650px;
		margin-bottom: 12px;
		font-size: 32px;
		@include tablet {
			font-size: 46px;
		}
		@include ultrahd {
			font-size: 54px;
		}
	}
	&__description {
		max-width: 538px;
	}
	&__img {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 30%;
		z-index: 1;
	}
}

.swiper-slide-active {
	.main-hero-slide__content {
		opacity: 1;
		transform: translateY(0);
	}
}

.swiper-slide:not(.swiper-slide-active) {
	.main-hero-slide__content {
		opacity: 0;
		transform: translateY(10px);
		transition: opacity 0.2s ease, transform 0.2s ease;
	}
}
</style>
