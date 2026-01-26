<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import type { ImageProps } from '~/components/ui/base/Image.vue'

interface MainSlideProps {
	image: ImageProps
	title: string
	description: string
}

interface MainBannerItem {
	ID: string
	NAME: string
	PREVIEW_TEXT: string
	PREVIEW_PICTURE: string
	PREVIEW_PICTURE_SRC: string
}

interface MainBannerResponse {
	status: string
	data: {
		items: MainBannerItem[]
	}
}

const fallbackSlides: MainSlideProps[] = [
	{
		title: 'Новая продукция',
		description:
			'Полиэтиленовые трубы, Фасонные изделия в изоляции, Стальные трубы в изоляции и трубы для Водоснабжения и Водоотведения.',
		image: {
			src: 'main/hero',
		},
	},
	{
		title: 'Новая продукция',
		description:
			'Полиэтиленовые трубы, Фасонные изделия в изоляции, Стальные трубы в изоляции и трубы для Водоснабжения и Водоотведения.',
		image: {
			src: 'production-facilities-poster',
		},
	},
	{
		title: 'Новая продукция',
		description:
			'Полиэтиленовые трубы, Фасонные изделия в изоляции, Стальные трубы в изоляции и трубы для Водоснабжения и Водоотведения.',
		image: {
			src: 'main/hero',
		},
	},
]

const config = useRuntimeConfig()
const { data: mainBannerData } = await useAsyncData('mainBanner', () =>
	$fetch<MainBannerResponse>(`${config.app.baseURL}api/mainBanner`),
)

const resolveBannerSrc = (src: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

const slides = computed<MainSlideProps[]>(() => {
	const items = mainBannerData.value?.data?.items
	if (!items || items.length === 0) return fallbackSlides

	return items.map(item => ({
		title: item.NAME,
		description: item.PREVIEW_TEXT,
		image: {
			src: resolveBannerSrc(item.PREVIEW_PICTURE_SRC),
			alt: item.NAME,
		},
	}))
})

const { getScrollOffset } = useScrollOffset()

const heroRef = ref<HTMLElement | null>(null)
const scaleProgress = ref(0)
// Начинаем с 0, правильное значение установится в onMounted
const initialHeight = ref(0)
const isAutoScrolling = ref(false)
let mutationObserver: MutationObserver | null = null

// Для отслеживания скорости скролла
let lastScrollY = 0
let lastScrollTime = 0
let scrollVelocity = 0

const handleScroll = () => {
	if (!heroRef.value || initialHeight.value === 0 || isAutoScrolling.value)
		return

	// Вычисляем скорость скролла
	const currentScrollY = window.scrollY
	const currentTime = Date.now()
	const timeDelta = currentTime - lastScrollTime

	if (timeDelta > 0 && lastScrollTime !== 0) {
		const scrollDelta = Math.abs(currentScrollY - lastScrollY)
		// Скорость в пикселях за миллисекунду
		scrollVelocity = scrollDelta / timeDelta
	}

	lastScrollY = currentScrollY
	lastScrollTime = currentTime

	const rect = heroRef.value.getBoundingClientRect()
	const heroTop = rect.top
	const headerOffset = getScrollOffset()

	// Блок начинает сжиматься когда его верхняя часть достигает нижней границы header+promo
	const startPoint = headerOffset

	// Если блок еще не достиг точки начала анимации
	if (heroTop > startPoint) {
		scaleProgress.value = 0
		return
	}

	// Величина сжатия - 1/4 от начальной высоты
	const compressionAmount = initialHeight.value / 4
	// Расстояние, на которое проскроллили от точки начала сжатия
	const scrolledDistance = startPoint - heroTop

	// Рассчитываем прогресс сжатия (0-1)
	const progress = Math.min(scrolledDistance / compressionAmount, 1)
	const prevProgress = scaleProgress.value
	scaleProgress.value = progress

	// Когда достигнуто полное сжатие, запускаем автоматический скролл
	if (progress >= 1 && prevProgress < 1) {
		triggerAutoScroll()
	}
}

const triggerAutoScroll = () => {
	if (!heroRef.value || isAutoScrolling.value) return

	// Если пользователь быстро скроллит (больше 2 пикселей за миллисекунду),
	// не прерываем его автоматическим скроллом
	const velocityThreshold = 2 // пикселей/мс
	if (scrollVelocity > velocityThreshold) {
		return
	}

	isAutoScrolling.value = true
	const rect = heroRef.value.getBoundingClientRect()
	const headerOffset = getScrollOffset()

	// Рассчитываем сколько нужно проскроллить, чтобы нижняя граница блока
	// достигла нижней границы header (т.е. блок полностью ушел из видимой области)
	// rect.bottom - нижняя граница блока относительно viewport
	// headerOffset - нижняя граница header
	const scrollDistance = rect.bottom - headerOffset

	window.scrollTo({
		top: window.scrollY + scrollDistance,
		behavior: 'smooth',
	})

	// Сбрасываем флаг после завершения скролла
	setTimeout(() => {
		isAutoScrolling.value = false
	}, 600) // Примерная длительность smooth scroll
}

onMounted(() => {
	if (process.client) {
		// Устанавливаем высоту сразу на основе медиа-запроса
		const isDesktop = window.matchMedia('(min-width: 1024px)').matches
		initialHeight.value = isDesktop ? 718 : 482

		nextTick(() => {
			if (heroRef.value) {
				// Получаем реальную высоту элемента если она отличается
				const computedHeight = heroRef.value.offsetHeight
				if (computedHeight > 0 && computedHeight !== initialHeight.value) {
					initialHeight.value = computedHeight
				}
			}
			window.addEventListener('scroll', handleScroll, { passive: true })
			window.addEventListener('resize', handleScroll, { passive: true })
			// Отслеживаем изменения видимости промо-полосы
			mutationObserver = new MutationObserver(() => {
				handleScroll()
			})
			if (document.body) {
				mutationObserver.observe(document.body, {
					attributes: true,
					attributeFilter: ['class'],
				})
			}
			handleScroll()
		})
	}
})

onUnmounted(() => {
	if (process.client) {
		window.removeEventListener('scroll', handleScroll)
		window.removeEventListener('resize', handleScroll)
		if (mutationObserver) {
			mutationObserver.disconnect()
			mutationObserver = null
		}
		// Сбрасываем переменные отслеживания скролла
		lastScrollY = 0
		lastScrollTime = 0
		scrollVelocity = 0
	}
})

const heroStyle = computed(() => {
	// Если высота еще не инициализирована, используем CSS высоту
	if (initialHeight.value === 0) return {}

	// Сжатие по вертикали на 1/4: уменьшаем высоту от 100% до 75%
	const heightScale = 1 - scaleProgress.value * (1 / 4)
	const currentHeight = initialHeight.value * heightScale
	return {
		height: `${currentHeight}px`,
	}
})
</script>

<template>
	<div ref="heroRef" class="m-hero" :style="heroStyle">
		<BaseSwiper
			class="m-hero__swiper"
			:slides-per-view="1"
			:navigation="{
				nextEl: '.m-hero__nav-next',
				prevEl: '.m-hero__nav-prev',
			}"
			:pagination="{
				el: '.m-hero__pagination',
				clickable: true,
				renderBullet: (index: number, className: string) => {
					return `<span class='${className}'></span>`
				},
			}"
			:show-navigation-with-pagination="false"
			:effect="'fade'"
			:fade-effect="{ crossFade: true }"
			:loop="true"
			:speed="600"
		>
			<SwiperSlide
				v-for="(slide, index) in slides"
				:key="index"
				class="m-hero__slide"
			>
				<MainHeroSlide v-bind="slide" />
			</SwiperSlide>
		</BaseSwiper>

		<div class="m-hero__controls">
			<Button
				class="m-hero__nav-btn m-hero__nav-prev"
				:icon="{ name: 'button-arrow-reverse', mode: 'prev' }"
			/>
			<div class="m-hero__pagination" />
			<Button
				class="m-hero__nav-btn m-hero__nav-next"
				:icon="{ name: 'button-arrow-reverse', mode: 'next' }"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.m-hero {
	max-width: calc(1720px + 2 * var(--container-padding));
	margin: 0 auto var(--space-lg);
	position: relative;
	overflow: hidden;
	will-change: height;
	height: 482px;
	@include desktop {
		margin: 0 auto 50px;
		height: 718px;
	}
	&__swiper {
		height: 100%;
		.swiper {
			height: 100%;
		}
	}
	&__controls {
		position: absolute;
		bottom: 20px;
		left: 20px;
		right: 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 20;
		pointer-events: none;

		@include desktop {
			left: 30px;
			right: 30px;
			bottom: 30px;
		}
	}
	&__nav-btn {
		flex: 0 0 auto;
		pointer-events: all;
		transform: rotate(90deg);
	}
	&__pagination {
		gap: 5px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: all;

		.swiper-pagination-bullet {
			position: relative;
			width: 33px;
			height: 3px;
			border-radius: 16px;
			background: rgba(255, 255, 255);
			opacity: 0.3;
			transition: all 0.3s ease;
			cursor: pointer;
			margin: 0 !important;

			&::before {
				content: '';
				position: absolute;
				top: -10px;
				left: 0;
				right: 0;
				bottom: -10px;
			}

			&.swiper-pagination-bullet-active,
			&:hover {
				background: #ffffff;
				opacity: 1;
			}
		}
	}
}
</style>
