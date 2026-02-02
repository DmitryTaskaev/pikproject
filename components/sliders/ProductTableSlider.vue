<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import type { ProductTableCardProps } from '../cards/ProductTableCard.vue'

interface ProductTableSliderProps {
	slides: ProductTableCardProps[][]
}

const { slides } = defineProps<ProductTableSliderProps>()
const instanceId = useId().replace(/:/g, '')
const paginationClass = `product-table-slider__pagination-${instanceId}`
const navPrevClass = `product-table-slider__nav-prev-${instanceId}`
const navNextClass = `product-table-slider__nav-next-${instanceId}`
</script>

<template>
	<BaseSwiper
		class="product-table-slider"
		loop
		:no-swiping="true"
		:no-swiping-class="'swiper-no-swiping'"
		:effect="'fade'"
		:fade-effect="{ crossFade: true }"
		:space-between="0"
		:slides-per-view="1"
		:navigation="{
			nextEl: `.${navNextClass}`,
			prevEl: `.${navPrevClass}`,
		}"
		:pagination="{
			el: `.${paginationClass}`,
			clickable: true,
			renderBullet: (index: number, className: string) => {
				return `<span class='${className}'>${index + 1}</span>`
			},
		}"
		modificator="product-table"
	>
		<SwiperSlide
			class="swiper-no-swiping"
			v-for="(slide, index) in slides"
			:key="index"
		>
			<ProductTableSlide :slide="slide" />
		</SwiperSlide>
	</BaseSwiper>
	<div v-if="slides.length > 1" class="product-table-slider__controls">
		<Button
			:class="['product-table-slider__nav-btn', navPrevClass]"
			:icon="{ name: 'button-arrow', mode: 'prev' }"
		/>
		<div :class="paginationClass" />
		<Button
			:class="['product-table-slider__nav-btn', navNextClass]"
			:icon="{ name: 'button-arrow', mode: 'next' }"
		/>
	</div>
</template>

<style lang="scss">
.product-table-slider {
	// position: relative;
	overflow: auto;
	// width: 1120px;
	width: 100%;

	&.base-swiper {
		position: static;
	}

	.swiper__navigation,
	.swiper__navigation_product-table {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 6px;
		position: absolute;
		z-index: 11;
		top: 141px;
		left: 26px;
	}
	.swiper {
		touch-action: auto !important;
	}
}

.product-table-slider__controls {
	margin-top: 20px;
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	justify-items: center;
}

.product-table-slider__nav-btn {
	flex: 0 0 auto;
}

.product-table-slider__controls .swiper-pagination-bullet {
	min-width: 26px;
	height: 26px;
	padding: 0 6px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	background: #e7eefb;
	color: #11437a;
	font-size: 12px;
	line-height: 1;
	opacity: 1;
}

.product-table-slider__controls .swiper-pagination-bullet-active {
	background: #11437a;
	color: #fff;
}
</style>
