<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import type { ConstructionSlideProps } from '../slides/ConstructionSlide.vue'
import ConstructionSlide from '../slides/ConstructionSlide.vue'

interface ConstructionSliderProps {
	slides: ConstructionSlideProps[]
	isSliders?: boolean
	modificator?: string
}

const { slides, isSliders } = defineProps<ConstructionSliderProps>()
</script>

<template>
	<div class="construction-slider-container">
		<BaseSwiper
			class="construction-slider"
			:modificator="modificator"
			:class="{ 'construction-slider_complex': isSliders }"
			:space-between="0"
			:pagination="{ type: 'fraction', el: '.construction-slider__pagination' }"
			:navigation="true"
			:slides-per-view="1"
			:effect="'fade'"
			:fade-effect="{ crossFade: true }"
		>
			<SwiperSlide v-for="(slide, index) in slides" :key="index">
				<ConstructionSlide v-bind="slide" />
			</SwiperSlide>
			<div class="construction-slider__pagination"></div>
		</BaseSwiper>
	</div>
</template>

<style lang="scss">
.construction-slider-container {
	position: relative;
	height: 100%;
}

.construction-slider {
	padding-top: var(--space-sm);
	padding-right: var(--container-padding);
	margin-right: calc(-1 * var(--container-padding));
	padding-left: var(--container-padding);
	margin-left: calc(-1 * var(--container-padding));

	height: 100%;
	// position: relative;
	overflow: visible;

	&.base-swiper {
		position: static;
	}

	&__pagination {
		width: auto;
		position: absolute;
		bottom: 335px;
		transform: translateY(100%);
		left: calc(var(--space-sm) + 1px);

		font-size: 18px;
		line-height: 110%;
		letter-spacing: -0.01em;
		color: var(--primary-color);
	}

	.swiper__navigation,
	.swiper__navigation_construction,
	[class*='swiper__navigation_construction-complex'] {
		position: absolute;
		z-index: 1;
		display: flex;
		gap: 6px;
		left: calc(var(--space-sm) + 1px);
		transform: translateY(-100%);
	}

	// Предотвращаем обрезание описания dots
	.swiper-slide {
		overflow: visible;
	}

	&_complex {
		.construction-slider__pagination {
			bottom: 255px;
		}
		.construction-slide {
			row-gap: 140px;
			@include tablet {
				row-gap: 0;
			}
			&__content {
				height: 255px;
				&-wrap {
					@include ultrahd {
						padding-top: 196px;
					}
				}
			}
		}
	}
	.swiper {
		overflow: visible;
		width: 100%;
		height: 100%;
		&-slide {
		}
	}
}
</style>
