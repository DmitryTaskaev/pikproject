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

interface HeroVideoProps {
	slides?: MediaSlide[]
}

const props = defineProps<HeroVideoProps>()

const fallbackSlides: MediaSlide[] = [
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

const slides = computed(() =>
	props.slides && props.slides.length > 0 ? props.slides : fallbackSlides,
)

const isSlider = computed(() => slides.value.length > 1)
const firstSlide = computed(() => slides.value[0])

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
	<div class="hero-video">
		<div class="container">
			<div class="hero-video__container">
				<div ref="swiperContainer" class="hero-video__video">
					<BaseSwiper
						v-if="isSlider"
						class="hero-video__swiper"
						:slides-per-view="1"
						:navigation="true"
						:modificator="'hero-video'"
						:navigation-mode="'centered'"
						:loop="true"
						:effect="'fade'"
						:fade-effect="{ crossFade: true }"
						:is-buttons-reverse="true"
					>
						<SwiperSlide
							v-for="(slide, index) in slides"
							:key="index"
							class="hero-video__slide"
						>
							<div class="hero-video__slide-content">
								<Video
									v-if="slide.type === 'video' && slide.videoSrc"
									class="hero-video__video--item"
									:src="slide.videoSrc"
									:poster="slide.poster"
									:controls="true"
								/>
								<div v-else-if="slide.src" class="hero-video__video--item">
									<Image
										class="hero-video__video--image"
										:src="slide.src"
										:alt="slide.alt || ''"
									/>
								</div>
							</div>
						</SwiperSlide>
					</BaseSwiper>
					<div v-else-if="firstSlide" class="hero-video__single">
						<Video
							v-if="firstSlide.type === 'video' && firstSlide.videoSrc"
							class="hero-video__video--item"
							:src="firstSlide.videoSrc"
							:poster="firstSlide.poster"
							:controls="true"
						/>
						<div v-else-if="firstSlide.src" class="hero-video__video--item">
							<Image
								class="hero-video__video--image"
								:src="firstSlide.src"
								:alt="firstSlide.alt || ''"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.hero-video {
	margin-bottom: 80px;
	@include tablet {
		margin-bottom: 120px;
	}
	@include ultrahd {
		margin-bottom: 50px;
	}
	&__container {
		padding-top: var(--space-md);
	}
	&__video {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		aspect-ratio: 16/9;

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
		.hero-video__slide {
			height: 100%;
		}
		.hero-video__slide-content {
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
