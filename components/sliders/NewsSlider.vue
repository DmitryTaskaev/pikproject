<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import { onMounted, onUnmounted, ref } from 'vue'
import type { NewsCardProps } from '../cards/NewsCard.vue'

interface NewsSliderProps {
	slides: NewsCardProps[]
}

const props = defineProps<NewsSliderProps>()

const isDesktop = ref(false)

onMounted(() => {
	const checkScreenSize = () => {
		isDesktop.value = window.innerWidth >= 1440
	}

	checkScreenSize()
	window.addEventListener('resize', checkScreenSize)

	onUnmounted(() => {
		window.removeEventListener('resize', checkScreenSize)
	})
})
</script>

<template>
	<div class="news-slider">
		<!-- Слайдер для мобильных и планшетов -->
		<BaseSwiper
			v-if="!isDesktop"
			class="news-slider__swiper"
			modificator="news"
			:slides-per-view="'auto'"
			:space-between="10"
			:navigation="false"
			:breakpoints="{ 1024: { loop: false } }"
		>
			<SwiperSlide
				v-for="(slide, index) in props.slides"
				:key="index"
				class="news-slider__slide"
			>
				<NewsCard v-bind="slide" />
			</SwiperSlide>
		</BaseSwiper>

		<!-- Обычный блок для десктопа -->
		<div v-else class="news-slider__grid">
			<NewsCard
				v-for="(slide, index) in props.slides"
				:key="index"
				v-bind="slide"
				class="news-slider__card"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.news-slider {
	&__swiper {
		.swiper {
			margin-left: calc(-1 * var(--container-padding));
			padding-left: var(--container-padding);
			padding-right: var(--container-padding);
		}
		.swiper-slide {
			width: 320px;
			@include desktop {
				width: 360px;
			}

			.news-card {
				width: 320px;
				max-width: 320px;
				flex: 0 0 320px;
				@include desktop {
					width: 360px;
					max-width: 360px;
					flex: 0 0 360px;
				}
				@include ultrahd {
					width: 100%;
					max-width: 100%;
					flex: 0 0 100%;
				}
			}
		}
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-sm);
	}

	&__card {
		width: 100%;
	}
}
</style>
