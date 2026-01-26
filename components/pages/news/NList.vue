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
		pagination?: {
			page: number
			limit: number
			total: number
			pages: number
		}
	}
}

const fallbackCards = [
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
const route = useRoute()
const page = computed(() => Number(route.query.page || 1) || 1)

const { data: newsData } = await useAsyncData(
	() => `newsList-${page.value}`,
	() =>
		$fetch<NewsListResponse>(`${config.app.baseURL}api/news`, {
			query: { page: page.value },
		}),
	{ watch: [page] },
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

const cards = computed(() => {
	const items = newsData.value?.data?.items
	if (!items || items.length === 0) return fallbackCards

	return items.map(item => ({
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

const totalPages = computed(() => newsData.value?.data?.pagination?.pages || 1)
</script>

<template>
	<div class="n-list">
		<div class="container">
			<div class="n-list__container">
				<div class="n-list__grid">
					<NewsCard v-for="(card, index) in cards" :key="index" v-bind="card" />
				</div>
				<CustomControls :page="page" :pages="totalPages" />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.n-list {
	margin-bottom: 80px;
	@include ultrahd {
		margin-bottom: 120px;
	}
	&__container {
		display: flex;
		flex-direction: column;
		gap: 80px;
	}
	&__grid {
		display: grid;
		grid-template-columns: 1fr;
		row-gap: var(--space-xl);
		@include tablet {
			grid-template-columns: repeat(2, 1fr);
			column-gap: var(--space-xs);
			row-gap: 50px;
		}
		@include ultrahd {
			grid-template-columns: repeat(4, 1fr);
			column-gap: var(--space-sm);
			row-gap: 80px;
		}
	}
}
</style>
