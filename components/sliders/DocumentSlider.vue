<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import type { DocumentSlideProps } from '../slides/DocumentSlide.vue'

interface DocumentSliderProps {
	slides: DocumentSlideProps[]
	mode?: 'compact' | 'wide'
	modificator?: string
}

const props = withDefaults(defineProps<DocumentSliderProps>(), {
	mode: 'compact',
	modificator: undefined,
})

const breakpoints = computed(() => {
	if (props.mode === 'wide') {
		return {
			1440: { slidesPerView: 4 },
			768: { slidesPerView: 2 },
		}
	}
	// compact mode
	return {
		1440: { slidesPerView: 2 },
		0: { slidesPerView: 1 },
	}
})
</script>

<template>
	<BaseSwiper
		class="document-slider"
		loop
		:breakpoints="breakpoints"
		:modificator="props.modificator"
	>
		<SwiperSlide v-for="(slide, index) in props.slides" :key="index">
			<DocumentSlide v-bind="slide" />
		</SwiperSlide>
	</BaseSwiper>
</template>

<style lang="scss">
.document-slider {
	.swiper-wrapper {
		margin-bottom: 50px;
	}
	.swiper__navigation {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 6px;
	}
}
</style>
