<script setup lang="ts">
import type { ListItem } from '~/components/ServiceItem.vue'
import type { ImageProps } from '~/components/ui/base/Image.vue'

interface ServicesProperty {
	NAME: string
	VALUE?: string
}

interface ServicesItem {
	ID: string
	NAME: string
	PREVIEW_TEXT: string
	PREVIEW_PICTURE_SRC?: string
	PROPERTIES?: Record<string, ServicesProperty>
}

interface ServicesSectionDetail {
	SECTION: {
		ID: string
		NAME: string
		CODE: string
		DESCRIPTION?: string
		UF_SEO_TITLE?: string
		UF_SEO_DESCRIPTION?: string
	}
	ITEMS: ServicesItem[]
}

interface ServicesDetailResponse {
	status: string
	data: ServicesSectionDetail
}

const route = useRoute()
const config = useRuntimeConfig()
const code = computed(() => String(route.params.code || ''))

const { data: servicesData } = await useAsyncData(
	() => `services-${code.value}`,
	() =>
		$fetch<ServicesDetailResponse>(`${config.app.baseURL}api/services`, {
			query: { code: code.value },
		}),
	{ watch: [code] },
)

const section = computed(() => servicesData.value?.data?.SECTION)

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

const resolveImageSrc = (src?: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

const mapProperties = (props?: Record<string, ServicesProperty>) => {
	if (!props) return []
	return Object.values(props)
		.filter(item => item?.NAME && item?.VALUE)
		.map(item => ({
			title: `${item.NAME}:`,
			value: String(item.VALUE),
		}))
}

const mapImage = (src?: string): ImageProps | undefined => {
	if (!src) return undefined
	return { src: resolveImageSrc(src), alt: '' }
}

const listItems = computed<ListItem[]>(() => {
	const items = servicesData.value?.data?.ITEMS || []
	return items.map(item => ({
		title: [item.NAME],
		content: {
			desc: decodeHtml(item.PREVIEW_TEXT || ''),
			measures: mapProperties(item.PROPERTIES),
		},
		image: mapImage(item.PREVIEW_PICTURE_SRC),
	}))
})

const heroTitle = computed(() => section.value?.NAME || '')
const heroTexts = computed(() =>
	section.value?.DESCRIPTION
		? decodeHtml(section.value.DESCRIPTION).split('\n').filter(Boolean)
		: [],
)

const seoTitle = computed(() => section.value?.UF_SEO_TITLE || '')
const seoDescription = computed(() =>
	section.value?.UF_SEO_DESCRIPTION
		? decodeHtml(section.value.UF_SEO_DESCRIPTION)
		: '',
)

const breadcrumbsList = computed(() => [
	{ title: 'Главная', href: '/' },
	{ title: 'Каталог Услуг', href: '/services' },
	{ title: heroTitle.value || 'Услуга', href: `/services/${code.value}` },
])

useHead(() => ({
	title: section.value?.UF_SEO_TITLE || heroTitle.value,
	meta: [
		{
			name: 'description',
			content: section.value?.UF_SEO_DESCRIPTION || '',
		},
	],
}))
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<HeroWrapper class="s-p-hero" :title="heroTitle" :texts="heroTexts" />
		<SPList :list="listItems" />
		<SeoBlock :title="seoTitle" :description="seoDescription" />
		<ConsultationBlock />
	</main>
</template>

<style lang="scss">
.s-p-hero {
	.title {
		max-width: 335px;
		@include ultrahd {
			min-width: 560px;
		}
	}
}
</style>
