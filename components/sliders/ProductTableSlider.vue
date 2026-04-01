<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import type { ProductTableCardProps } from '../cards/ProductTableCard.vue'

interface ProductTableSliderProps {
	slides: ProductTableCardProps[][]
	navPrevClass?: string
	navNextClass?: string
	captionHeight?: number
	rowHeights?: number[]
}

const props = defineProps<ProductTableSliderProps>()
const emit = defineEmits<{
	(e: 'caption-height-change', value: number): void
	(e: 'row-heights-change', value: number[]): void
}>()
const instanceId = useId().replace(/:/g, '')
const resolvedNavPrevClass =
	props.navPrevClass || `product-table-slider__nav-prev-${instanceId}`
const resolvedNavNextClass =
	props.navNextClass || `product-table-slider__nav-next-${instanceId}`
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
		:hide-built-in-navigation="true"
		:navigation="{
			nextEl: `.${resolvedNavNextClass}`,
			prevEl: `.${resolvedNavPrevClass}`,
		}"
		modificator="product-table"
	>
		<SwiperSlide
			class="swiper-no-swiping"
			v-for="(slide, index) in props.slides"
			:key="index"
		>
			<ProductTableSlide
				:slide="slide"
				:caption-height="props.captionHeight"
				:row-heights="props.rowHeights"
				@caption-height-change="emit('caption-height-change', $event)"
				@row-heights-change="emit('row-heights-change', $event)"
			/>
		</SwiperSlide>
	</BaseSwiper>
</template>

<style lang="scss">
.product-table-slider {
	overflow: auto;
	width: 100%;
	.swiper {
		touch-action: auto !important;
	}
}
</style>
