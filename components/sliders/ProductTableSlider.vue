<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import type { ProductTableCardProps } from '../cards/ProductTableCard.vue'

interface ProductTableSliderProps {
	slides: ProductTableCardProps[][]
}

const { slides } = defineProps<ProductTableSliderProps>()
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
</style>
