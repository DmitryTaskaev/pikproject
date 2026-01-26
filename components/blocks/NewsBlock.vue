<script setup lang="ts">
interface NewsItem {
	ID: string
	NAME: string
	CODE: string
	PREVIEW_TEXT: string
	PREVIEW_PICTURE_SRC: string
	DATE_ACTIVE_FROM: string
}

interface NewsListResponse {
	status: string
	data: {
		items: NewsItem[]
	}
}

const title = 'Новости'
const fallbackSlides = [
	{
		image: {
			src: 'news/news-01',
			alt: 'Новость',
		},
		date: '06.20.24',
		title: 'Поддерживаем спорт и наших спортсменов',
		text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
		href: '/piktube/news-item',
	},
	{
		image: {
			src: 'news/news-02',
			alt: 'Новость',
		},
		date: '06.20.24',
		title: 'Получение статуса официального партнера',
		text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
		href: '/piktube/news-item',
	},
	{
		image: {
			src: 'news/news-03',
			alt: 'Новость',
		},
		date: '06.20.24',
		title: 'Поддерживаем спорт и наших спортсменов',
		text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
		href: '/piktube/news-item',
	},
	{
		image: {
			src: 'news/news-04',
			alt: 'Новость',
		},
		date: '06.20.24',
		title: 'Получение статуса официального партнера',
		text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
		href: '/piktube/news-item',
	},
]

const config = useRuntimeConfig()
const { data: newsData } = await useAsyncData('newsList', () =>
	$fetch<NewsListResponse>(`${config.app.baseURL}api/news`),
)

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

const slides = computed(() => {
	const items = newsData.value?.data?.items
	if (!items || items.length === 0) return fallbackSlides

	return items.slice(0, 4).map(item => ({
		image: {
			src: resolveImageSrc(item.PREVIEW_PICTURE_SRC),
			alt: item.NAME,
		},
		date: item.DATE_ACTIVE_FROM,
		title: item.NAME,
		text: decodeHtml(item.PREVIEW_TEXT),
		href: `/news/${item.CODE}`,
	}))
})
</script>

<template>
	<div class="news-block">
		<div class="container">
			<BorderLine class="news-block__container" position="top" design="primary">
				<CustomTitle class="news-block__title">{{ title }}</CustomTitle>
			</BorderLine>
		</div>
		<div class="news-block__wrapper">
			<SectionWrapper class="news-block__content" title="Последнее" tag="h3">
				<NewsSlider :slides="slides" />
			</SectionWrapper>
			<NuxtLink class="news-block__action" to="/news">
				<Text
					class="news-block__action--title"
					tag="span"
					weight="medium"
					line-height="sm"
					design="secondary"
				>
					Читать все новости
				</Text>
				<Icon class="news-block__action--icon" name="base-arrow" />
			</NuxtLink>
		</div>
	</div>
</template>

<style lang="scss">
.news-block {
	margin-bottom: 160px;
	@include ultrahd {
		margin: 0 auto 160px;
		padding: 0 var(--container-padding);
		max-width: calc(1720px + 2 * var(--container-padding));
	}
	&__container {
		padding-top: var(--space-md);
		margin-bottom: 80px;
		text-align: center;

		@include ultrahd {
			padding-top: var(--space-lg);
			margin-bottom: 100px;
		}
	}
	&__wrapper {
		position: relative;
		margin-left: var(--container-padding);
		@include ultrahd {
			margin: 0;
		}
	}
	&__content {
		margin-bottom: var(--space-xl);
		@include ultrahd {
			margin-bottom: 0;
		}
	}
	&__action {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		@include ultrahd {
			position: absolute;
			content: '';
			top: 0;
			right: 0;
		}
		&--icon {
			width: 14px;
			height: 7px;
			transform: rotate(-90deg);
			color: var(--main-bg);
		}
		&:hover {
			.icon {
				animation: bounce-arrow-right 1s linear infinite;
			}
		}
	}
}
</style>
