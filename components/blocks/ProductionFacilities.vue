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

interface MainTextImageItem {
	NAME?: string
	PREVIEW_TEXT?: string
	PREVIEW_PICTURE_SRC?: string
}

interface MainTextImageResponse {
	data?: {
		items?: MainTextImageItem[]
	}
}

interface MainSliderBottomItem {
	NAME?: string
	SORT?: string
	PREVIEW_PICTURE_SRC?: string
	PROPERTIES?: {
		VIDEO?: {
			SRC?: string
		}
	}
}

interface MainSliderBottomResponse {
	data?: {
		items?: MainSliderBottomItem[]
	}
}

interface ProductionFacilitiesProps {
	useApi?: boolean
}

const props = withDefaults(defineProps<ProductionFacilitiesProps>(), {
	useApi: true,
})

const fallbackTitle = 'Собственные <br />производственные <br />мощности'
const fallbackDescList = [
	'Локация:<br />Производственная площадка трубного завода ПИК находится в г.&nbsp;Полевской, Свердловская&nbsp;область.',
	'Оборудование:<br /> Завод оснащён высокотехнологичными экструзионными и изоляционными линиями от KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery. Это позволяет обеспечивать стабильное качество продукции в промышленных объёмах.',
	'Номенклатура:<br />Производим полиэтиленовые трубы (ПНД) диаметром от 63 до 800 мм для водоснабжения, канализации и защиты кабеля. Изолируем стальные трубы диаметром до 1220 мм с применением пенополиуретановой (ППУ), полипропиленовой (ППМ) и антикоррозионной (ВУС) изоляции. Выпускаем фасонные изделия и многослойные гофрированные трубы под маркой<br />«ПИКПАЙП».',
	'Объёмы производства:<br />Годовая мощность достигает 15&nbsp;000 тонн продукции. Завод способен оперативно обрабатывать оптовые и индивидуальные заказы любой сложности.',
	'Контроль качества:<br />На базе предприятия работает собственная аккредитованная лаборатория. Полный цикл контроля охватывает входной анализ сырья, производственные параметры и испытания готовой продукции. Все изделия соответствуют требованиям ГОСТ и ТУ, имеют паспорта качества и маркировку.',
	'Преимущества:<br />— Производство полного цикла<br />— ПНД трубы и изоляция стальных труб в одном технологическом контуре<br />— Современное оборудование и высокая производительность<br />— Строгий контроль качества<br />— Широкая география поставок по всей России<br />— Надёжный партнёр для инженерных и инфраструктурных проектов',
]

const config = useRuntimeConfig()
const mainTextImageData = props.useApi
	? await useAsyncData('mainTextImage', () =>
			$fetch<MainTextImageResponse>(`${config.app.baseURL}api/mainTextImage`),
		)
	: { data: ref<MainTextImageResponse | null>(null) }

const mainSliderBottomData = props.useApi
	? await useAsyncData('mainSliderBottom', () =>
			$fetch<MainSliderBottomResponse>(
				`${config.app.baseURL}api/mainSliderBottom`,
			),
		)
	: { data: ref<MainSliderBottomResponse | null>(null) }

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

const decodeHtml = (value: string) => {
	return value
		.replace(/&#40;/g, '(')
		.replace(/&#41;/g, ')')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
}

const normalizeNbsp = (value: string) =>
	value.replace(/&nbsp;/g, '\u00A0')

const splitByBr = (value: string) =>
	normalizeNbsp(decodeHtml(value)).split(/<br\s*\/?\s*>|\r?\n/i)

const splitParagraphs = (value: string) => {
	const normalized = normalizeNbsp(decodeHtml(value)).replace(
		/<\/?br\s*\/?>/gi,
		'\n',
	)
	return normalized
		.split(/\n\s*\n/)
		.map(item => item.trim())
		.filter(Boolean)
}

const item = computed(() => mainTextImageData.data.value?.data?.items?.[0])

const titleValue = computed(() =>
	props.useApi && item.value?.NAME ? item.value.NAME : fallbackTitle,
)

const descBlocks = computed(() => {
	if (props.useApi && item.value?.PREVIEW_TEXT) {
		return splitParagraphs(item.value.PREVIEW_TEXT)
	}
	return fallbackDescList
})

const titleLines = computed(() => splitByBr(titleValue.value))
const descLines = computed(() => descBlocks.value.map(text => splitByBr(text)))

const resolveMediaSrc = (src?: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

const imageSrc = computed(() => {
	if (!props.useApi) return 'production-facilities'
	return (
		resolveMediaSrc(item.value?.PREVIEW_PICTURE_SRC) ||
		'production-facilities'
	)
})

const isVideo = (src: string) => /\.(mp4|webm|ogv)$/i.test(src)

const slides = computed<MediaSlide[]>(() => {
	if (!props.useApi) return fallbackSlides

	const items = mainSliderBottomData.data.value?.data?.items || []
	const mapped = [...items]
		.sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0))
		.map(item => {
			const rawSrc = item.PROPERTIES?.VIDEO?.SRC || ''
			const resolved = resolveMediaSrc(rawSrc)
			if (!resolved) return null
			if (isVideo(resolved)) {
				return {
					type: 'video',
					videoSrc: [{ src: resolved }],
					poster: resolveMediaSrc(item.PREVIEW_PICTURE_SRC) || undefined,
				}
			}
			return {
				type: 'image',
				src: resolved,
				alt: item.NAME || '',
			}
		})
		.filter((slide): slide is MediaSlide => Boolean(slide))

	return mapped.length ? mapped : fallbackSlides
})

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

	// Получаем Swiper instance из элемента
	const swiperInstance = (swiperElement as any).swiper
	if (!swiperInstance) return

	// Обработчик переключения слайда
	swiperInstance.on('slideChange', () => {
		pauseAllVideos()
	})
})
</script>

<template>
	<section class="production-facilities">
		<div class="container">
			<BorderLine position="top" design="primary">
				<div class="production-facilities__container">
					<div class="production-facilities__wrap">
						<custom-title class="production-facilities__title">
							<template v-for="(line, i) in titleLines" :key="`t-${i}`">
								<span class="production-facilities__title--line">{{
									line
								}}</span>
								<br v-if="i < titleLines.length - 1" />
							</template>
						</custom-title>
						<div class="production-facilities__desc">
							<template v-for="(lines, index) in descLines" :key="index">
								<Text class="production-facilities__desc--item">
									<template v-for="(line, i) in lines" :key="`d-${index}-${i}`">
										<span>{{ line }}</span>
										<br v-if="i < lines.length - 1" />
									</template>
								</Text>
							</template>
						</div>
						<div class="production-facilities__img-wrap">
							<div class="production-facilities__img">
								<Image
									class="production-facilities__img--item"
									:src="imageSrc"
									alt="Завод"
								/>
							</div>
						</div>
					</div>
					<div ref="swiperContainer" class="production-facilities__media">
						<BaseSwiper
							v-if="isSlider"
							class="production-facilities__swiper"
							:slides-per-view="1"
							:navigation="true"
							:modificator="'production-facilities'"
							:navigation-mode="'centered'"
							:loop="true"
							:effect="'fade'"
							:fade-effect="{ crossFade: true }"
							:is-buttons-reverse="true"
						>
							<SwiperSlide
								v-for="(slide, index) in slides"
								:key="index"
								class="production-facilities__slide"
							>
								<div class="production-facilities__slide-content">
									<Video
										v-if="slide.type === 'video' && slide.videoSrc"
										class="production-facilities__media--item"
										:src="slide.videoSrc"
										:poster="slide.poster"
										:controls="true"
									/>
									<div
										v-else-if="slide.src"
										class="production-facilities__media--item"
									>
										<Image
											class="production-facilities__media--image"
											:src="slide.src"
											:alt="slide.alt || ''"
										/>
									</div>
								</div>
							</SwiperSlide>
						</BaseSwiper>
						<div v-else-if="firstSlide" class="production-facilities__single">
							<Video
								v-if="firstSlide.type === 'video' && firstSlide.videoSrc"
								class="production-facilities__media--item"
								:src="firstSlide.videoSrc"
								:poster="firstSlide.poster"
								:controls="true"
							/>
							<div
								v-else-if="firstSlide.src"
								class="production-facilities__media--item"
							>
								<Image
									class="production-facilities__media--image"
									:src="firstSlide.src"
									:alt="firstSlide.alt || ''"
								/>
							</div>
						</div>
					</div>
				</div>
			</BorderLine>
		</div>
	</section>
</template>

<style lang="scss">
.production-facilities {
	margin-bottom: 160px;
	@include ultrahd {
		margin-bottom: 100px;
	}
	&__container {
		padding-top: var(--space-md);
		@include ultrahd {
			padding-top: var(--space-xl);
		}
	}

	&__wrap {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
		margin-bottom: var(--space-sm);
		@include tablet {
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: auto 1fr;
			margin-bottom: 80px;
			column-gap: var(--space-sm);
			row-gap: var(--space-xl);
		}
		@include ultrahd {
			margin-bottom: 120px;
			column-gap: var(--space-xl);
			row-gap: var(--space-lg);
		}
	}

	&__title {
		@include tablet {
			grid-column: 1;
			grid-row: 1;
		}
		@include ultrahd {
			grid-column: 1;
			grid-row: 1;
		}
	}

	&__desc {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		@include tablet {
			grid-column: 2;
			grid-row: 1/3;
		}
		@include ultrahd {
			grid-column: 1;
			grid-row: 2;
		}
	}

	&__img-wrap {
		@include tablet {
			width: 291px;
			grid-column: 1;
			grid-row: 2;
		}
		@include ultrahd {
			width: 100%;
			grid-column: 2;
			grid-row: 1/3;
		}
	}
	&__img {
		position: sticky;
		border-radius: 12px;
		overflow: hidden;
		padding-bottom: 84%;
		width: 100%;
		// @include ultrahd {
		// 	width: 100%;
		// }
		top: 124px;
		@include ultrahd {
			top: 144px;
		}
		&--item {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: auto;
			object-fit: cover;
		}
	}
	&__media {
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
		.production-facilities__slide {
			height: 100%;
		}
		.production-facilities__slide-content {
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
