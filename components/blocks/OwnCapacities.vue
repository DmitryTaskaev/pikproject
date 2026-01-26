<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import { computed, nextTick, onMounted, ref } from 'vue'

interface MediaSlide {
	type: 'image' | 'video'
	src?: string
	videoSrc?: Array<{ src: string; type: string }>
	poster?: string
	alt?: string
}

const descList = [
	'Мы предлагаем организациям заказать у нас трубную продукцию по индивидуальному техническому заданию или стандартного размера. Мы производим трубы диаметром от 63 до 1220 мм и фасонные изделия из пластика в тепловой изоляции различных модификаций, включая ППУ, ППМ, оцинкованную. Производство труб в ППУ изоляции осуществляется в городе Полевской Свердловской области. Наш завод оборудован новейшими производственными линиями, европейским экструзионным оборудованием, заливочными машинами ВД для переработки пенополиуретана (ППУ). Заводские мощности ориентированы на объем изготовления 11000 т/год. Вся продукция произведена в соответствии с ГОСТ Р 56227-2014, сертифицирована, промаркирована, упакована по действующим нормативам.',
	'Выпускаемые ООО «ПИК» изделия востребованы покупателями, применяются в промышленности, для нужд химического производства и системного водоснабжения. Мы производим водопроводные (для технической и питьевой воды), газопроводные канализационные трубы, специальные изделия. Будем рады видеть вас в числе наших клиентов.',
]

const slides: MediaSlide[] = [
	{
		type: 'video',
		videoSrc: [
			{ src: '/piktube/videos/production.webm', type: 'video/webm' },
			{ src: '/piktube/videos/production.mp4', type: 'video/mp4' },
		],
		poster: '/piktube/images/production-facilities-poster.webp',
	},
	{
		type: 'image',
		src: 'main/hero',
	},
]

const isSlider = computed(() => slides.length > 1)
const firstSlide = computed(() => slides[0])

const swiperContainer = ref<HTMLElement | null>(null)

const pauseAllVideos = () => {
	if (!swiperContainer.value) return
	const videos = swiperContainer.value.querySelectorAll('video')
	videos.forEach(video => {
		if (!video.paused) {
			video.pause()
		}
	})
}

onMounted(async () => {
	if (!isSlider.value) return

	await nextTick()

	if (!swiperContainer.value) return

	const swiperElement = swiperContainer.value.querySelector('.swiper')
	if (!swiperElement) return

	const swiperInstance = (swiperElement as any).swiper
	if (!swiperInstance) return

	swiperInstance.on('slideChange', () => {
		pauseAllVideos()
	})
})
</script>

<template>
	<div class="own-capacities-wrap">
		<div class="container">
			<border-line class="own-capacities" position="top" design="primary">
				<div class="own-capacities__title">
					<custom-title
						>Собственные <br />производственные <br />мощности</custom-title
					>
				</div>
				<div class="own-capacities__desc">
					<Text
						v-for="(item, idx) in descList"
						:key="idx"
						class="own-capacities__desc--item"
					>
						{{ item }}
					</Text>
				</div>
				<div ref="swiperContainer" class="own-capacities__video">
					<BaseSwiper
						v-if="isSlider"
						class="own-capacities__swiper"
						:slides-per-view="1"
						:navigation="true"
						:modificator="'own-capacities'"
						:navigation-mode="'centered'"
						:loop="true"
						:effect="'fade'"
						:fade-effect="{ crossFade: true }"
						:is-buttons-reverse="true"
					>
						<SwiperSlide
							v-for="(slide, index) in slides"
							:key="index"
							class="own-capacities__slide"
						>
							<div class="own-capacities__slide-content">
								<Video
									v-if="slide.type === 'video' && slide.videoSrc"
									class="own-capacities__video--item"
									:src="slide.videoSrc"
									:poster="slide.poster"
									:controls="true"
								/>
								<div v-else-if="slide.src" class="own-capacities__video--item">
									<Image
										class="own-capacities__video--image"
										:src="slide.src"
										:alt="slide.alt || ''"
									/>
								</div>
							</div>
						</SwiperSlide>
					</BaseSwiper>
					<div v-else-if="firstSlide" class="own-capacities__single">
						<Video
							v-if="firstSlide.type === 'video' && firstSlide.videoSrc"
							class="own-capacities__video--item"
							:src="firstSlide.videoSrc"
							:poster="firstSlide.poster"
							:controls="true"
						/>
						<div v-else-if="firstSlide.src" class="own-capacities__video--item">
							<Image
								class="own-capacities__video--image"
								:src="firstSlide.src"
								:alt="firstSlide.alt || ''"
							/>
						</div>
					</div>
				</div>
			</border-line>
		</div>
	</div>
</template>

<style lang="scss">
.own-capacities-wrap {
	margin-bottom: 160px;
	@include ultrahd {
		margin-bottom: var(--space-section-md);
	}
}
.own-capacities {
	display: grid;
	grid-template-columns: 1fr;
	row-gap: var(--space-xl);
	padding-top: var(--space-md);
	@include tablet {
		grid-template-columns: repeat(2, calc(50% - var(--space-sm) / 2));
		grid-template-rows: repeat(2, max-content);
		row-gap: var(--space-section-sm);
		column-gap: var(--space-sm);
	}
	@include ultrahd {
		grid-template-columns: repeat(2, calc(50% - var(--space-xl) / 2));
		column-gap: var(--space-xl);
		padding-top: var(--space-xl);
	}
	&__title {
		@include tablet {
			grid-column: 1/2;
			grid-row: 1/2;
		}
	}
	&__desc {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		@include tablet {
			grid-column: 2/3;
			grid-row: 1/2;
		}
	}
	&__video {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		aspect-ratio: 16/9;
		@include tablet {
			grid-column: 1/3;
			grid-row: 2/3;
		}
		&--item {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			.base-video__media {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
		&--image {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	&__swiper {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		aspect-ratio: 16/9;
		:deep(.swiper) {
			width: 100%;
			height: 100%;
		}
		:deep(.swiper-wrapper) {
			height: 100%;
		}
		:deep(.swiper-slide) {
			height: 100%;
		}
		.swiper {
			height: 100%;
		}
		.own-capacities__slide {
			height: 100%;
		}
		.own-capacities__slide-content {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
		}
		.swiper__navigation_centered {
			@include tablet {
				right: 30px;
				left: 30px;
			}
		}
	}
	&__slide-content {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	&__single {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		aspect-ratio: 16/9;
	}
}
</style>
