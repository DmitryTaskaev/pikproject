<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'

interface NewsDetailItem {
	ID: string
	NAME: string
	CODE: string
	PREVIEW_TEXT: string
	DETAIL_TEXT: string
	PREVIEW_PICTURE_SRC: string
	PROPERTIES?: {
		MORE_PHOTO?: {
			SRC?: string[] | string
		}
	}
}

interface NewsDetailResponse {
	status: string
	data: {
		item: NewsDetailItem
	}
}

const route = useRoute()
const config = useRuntimeConfig()
const code = computed(() => String(route.params.code || ''))

const { data: newsData } = await useAsyncData(
	`news-${code.value}`,
	() =>
		$fetch<NewsDetailResponse>(`${config.app.baseURL}api/news`, {
			query: { code: code.value },
		}),
	{ watch: [code] },
)

const item = computed(() => newsData.value?.data?.item)

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

const resolveImageSrc = (src: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

const breadcrumbsList = computed(() => [
	{ title: 'Главная', href: '/' },
	{ title: 'Новости', href: '/news' },
	{
		title: item.value?.NAME || 'Новость',
		href: `/news/${code.value}`,
	},
])

const previewText = computed(() => decodeHtml(item.value?.PREVIEW_TEXT || ''))
const detailHtml = computed(() => item.value?.DETAIL_TEXT || '')

const sliderImages = computed(() => {
	const src = item.value?.PROPERTIES?.MORE_PHOTO?.SRC
	if (Array.isArray(src) && src.length > 0) return src
	if (typeof src === 'string' && src) return [src]
	if (item.value?.PREVIEW_PICTURE_SRC) return [item.value.PREVIEW_PICTURE_SRC]
	return []
})
</script>

<template>
	<main class="main">
		<div class="n-i-page">
			<Breadcrumbs :list="breadcrumbsList" />
			<div class="n-i-page__wrapper">
				<div class="container">
					<div class="n-i-page__content">
						<div class="n-i-page__top">
							<CustomTitle class="n-i-page__title" tag="h1" mode="xxl">
								{{ item?.NAME }}
							</CustomTitle>
							<Text
								class="n-i-page__top--description"
								size="lg"
								line-height="lg"
								letter-spacing="sm"
							>
								<span v-html="previewText" />
							</Text>
						</div>
						<div v-if="sliderImages.length" class="n-i-page__slider">
							<BaseSwiper
								class="n-i-page__slider-swiper"
								modificator="news-item"
								:slides-per-view="1"
								:space-between="0"
								:navigation="true"
								navigation-mode="centered"
								:effect="'fade'"
								:fade-effect="{ crossFade: true }"
								:loop="true"
								:is-buttons-reverse="true"
							>
								<SwiperSlide
									v-for="(image, index) in sliderImages"
									:key="index"
									class="n-i-page__slider-slide"
								>
									<Image
										class="n-i-page__slider-image"
										:src="resolveImageSrc(image)"
										:alt="item?.NAME || 'Новость'"
									/>
								</SwiperSlide>
							</BaseSwiper>
						</div>
						<div class="n-i-page__bottom">
							<div class="n-i-page__detail" v-html="detailHtml" />
						</div>
					</div>
				</div>
			</div>
			<ConsultationBlock />
		</div>
	</main>
</template>

<style lang="scss">
.n-i-page {
	&__slider {
		position: relative;
		width: 100%;
		margin-bottom: var(--space-lg);

		&-swiper {
			position: relative;
		}

		&-slide {
			width: 100%;
			height: 234px;
			border-radius: 12px;
			overflow: hidden;
			@include tablet {
				height: 343px;
			}
			@include ultrahd {
				height: 422px;
			}
		}

		&-image {
			border-radius: 12px;
			overflow: hidden;
			width: 100%;
			height: auto;
			object-fit: cover;
			display: block;
		}
	}
	&__wrapper {
		padding: 30px 0 80px;
		@include tablet {
			padding: 60px 0 80px;
		}
		@include ultrahd {
			padding: 90px 0 110px;
		}
	}
	&__content {
		max-width: 511px;
		@include tablet {
			margin: 0 auto;
		}
		@include ultrahd {
			max-width: 660px;
		}
	}
	&__top {
		margin-bottom: var(--space-lg);
	}
	&__title {
		margin-bottom: var(--space-lg);
		@include tablet {
			text-align: center;
			margin-bottom: var(--space-xl);
		}
	}
	&__bottom {
	}
	&__detail {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);

		:deep(h2) {
			font-weight: 500;
			font-size: 18px;
			line-height: 150%;
			letter-spacing: -0.01em;
			color: var(--main-color);
			margin-bottom: var(--space-md);
			@include ultrahd {
				font-size: 20px;
			}
		}
		:deep(h3) {
			margin-bottom: var(--space-md);
			line-height: 150%;
			letter-spacing: -0.01em;
			color: var(--main-color);
			font-size: 14px;
			font-weight: 600;
			@include ultrahd {
				font-size: 16px;
			}
		}
		:deep(p) {
			margin: 0;
		}
	}
}
</style>
