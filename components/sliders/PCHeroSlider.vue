<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'

interface PCHeroSliderProps {
	slides?: Array<{ image: { src: string; alt?: string } }>
}

const fallbackSlides = [
	{
		image: {
			src: 'product-card/product-card-01',
			alt: 'Труба',
		},
	},
	{
		image: {
			src: 'product-card/product-card-01',
			alt: 'Труба',
		},
	},
	{
		image: {
			src: 'product-card/product-card-01',
			alt: 'Труба',
		},
	},
]

const props = withDefaults(defineProps<PCHeroSliderProps>(), {
	slides: undefined,
})

const slides = computed(() => {
	if (props.slides !== undefined) return props.slides
	return fallbackSlides
})
</script>

<template>
	<div class="p-c-hero-slider-container">
		<BaseSwiper
			class="p-c-hero-slider"
			loop
			modificator="p-c-hero-slider"
			:space-between="0"
			:navigation="false"
			:pagination="{
				el: '.p-c-hero-slider-pagination',
				clickable: true,
				renderBullet: (index, className) => {
					return `<div class='${className} pagination-bullet'></div>`
				},
			}"
			:show-navigation-with-pagination="false"
			:slides-per-view="1"
			:effect="'fade'"
			:fade-effect="{ crossFade: true }"
		>
			<SwiperSlide v-for="(slide, index) in slides" :key="index">
				<PCHeroSlide v-bind="slide" />
			</SwiperSlide>
		</BaseSwiper>

		<div class="p-c-hero-slider-pagination" />
	</div>
</template>

<style lang="scss">
.p-c-hero-slider-container {
	position: relative;
	@include tablet {
		position: sticky;
		top: var(--space-sm);
	}
	@include ultrahd {
		position: relative;
		top: 0;
	}
}

.p-c-hero-slider {
	position: relative;

	&-pagination {
		position: absolute;
		left: 12px !important;
		bottom: 12px !important;
		display: flex;
		align-items: center;
		gap: 3px;
		z-index: 10;
		.pagination-bullet {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			border: 1px solid var(--main-bg);
			cursor: pointer;
			background: transparent;
			transition: all 0.3s ease;

			&.swiper-pagination-bullet-active {
				background: var(--main-bg);
				border: 1px solid var(--main-bg);
			}
		}
	}
}
</style>
