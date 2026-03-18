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
	['~PREVIEW_TEXT']?: string
	SORT?: string
	CODE?: string
	['~CODE']?: string
	PREVIEW_PICTURE_SRC?: string
	PROPERTIES?: Record<string, ServicesProperty>
}

interface ServicesSection {
	SECTION: {
		ID: string
		NAME: string
		SORT?: string
		CODE?: string
		['~CODE']?: string
	}
	ITEMS: ServicesItem[]
}

interface ServicesResponse {
	status: string
	data: {
		TREE: ServicesSection[]
		ROOT_ITEMS?: ServicesItem[]
	}
	meta?: {
		iblock?: {
			name?: string
			description?: string
		}
	}
}

interface ServiceSeoItem {
	NAME: string
	PREVIEW_TEXT: string
}

interface ServiceSeoResponse {
	status: string
	data: {
		items: ServiceSeoItem[]
	}
}

const fallbackHeroTexts = [
	'Трубный завод ПИК оказывает полный спектр услуг по нанесению теплоизоляционных и антикоррозионных покрытий на стальные и полиэтиленовые трубы. Все операции выполняются на собственном оборудовании с обязательным лабораторным контролем качества.',
]
const fallbackHeroTitle = 'Услуги'

const config = useRuntimeConfig()
const { data: servicesData } = await useLocalizedAsyncData(
	'servicesCatalog',
	lang =>
		$fetch<ServicesResponse>(`${config.app.baseURL}api/services`, {
			query: { lang },
		}),
)
const { data: serviceSeoData } = await useLocalizedAsyncData(
	'serviceSeo',
	lang =>
		$fetch<ServiceSeoResponse>(`${config.app.baseURL}api/serviceSeo`, {
			query: { lang },
		}),
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

const resolveRichText = (encoded?: string, raw?: string) => {
	if (raw && raw.trim()) return raw
	if (!encoded) return ''
	return decodeHtml(encoded)
}

const mapItems = (items: ServicesItem[]): ListItem[] => {
	return items.map(item => ({
		title: [item.NAME],
		content: {
			desc: resolveRichText(item.PREVIEW_TEXT, item['~PREVIEW_TEXT']),
			descHtml: true,
			measures: mapProperties(item.PROPERTIES),
		},
		image: mapImage(item.PREVIEW_PICTURE_SRC),
	}))
}

const buildHtmlTexts = (value?: string) => {
	if (!value) return []
	const html = value.trim()
	return html ? [html] : []
}

const pageTitle = computed(
	() => servicesData.value?.meta?.iblock?.name || fallbackHeroTitle,
)
const homeBreadcrumbTitle = useHomeBreadcrumbTitle()

const breadcrumbsList = computed(() => [
	{ title: homeBreadcrumbTitle.value, href: '/' },
	{ title: pageTitle.value, href: '/services' },
])

const sections = computed(() => {
	const tree = servicesData.value?.data?.TREE || []
	const treeSections = tree
		.map(section => ({
			title: section.SECTION.NAME,
			code: section.SECTION.CODE || section.SECTION['~CODE'] || '',
			list: mapItems(section.ITEMS || []),
			sort: Number(section.SECTION.SORT || 0),
		}))
		.filter(section => Boolean(section.code))
		.map(section => ({
			title: section.title,
			href: `${config.app.baseURL}services/${section.code}`,
			list: section.list,
			sort: section.sort,
		}))

	const rootItems = servicesData.value?.data?.ROOT_ITEMS || []
	const rootSections = rootItems
		.map(item => {
			const code = item.CODE || item['~CODE'] || ''
			if (!code) return null

			return {
				title: item.NAME,
				href: `${config.app.baseURL}services/${code}`,
				list: mapItems([item]),
				sort: Number(item.SORT || 0),
			}
		})
		.filter(Boolean) as Array<{
			title: string
			href: string
			list: ListItem[]
			sort: number
		}>

	return [...treeSections, ...rootSections]
		.sort((a, b) => a.sort - b.sort)
		.map(({ title, href, list }) => ({ title, href, list }))
})

const heroTitle = computed(() => pageTitle.value)
const heroTexts = computed(() => {
	const text = servicesData.value?.meta?.iblock?.description
	const decodedText = text ? decodeHtml(text) : ''
	return buildHtmlTexts(decodedText).length
		? buildHtmlTexts(decodedText)
		: fallbackHeroTexts
})

const serviceSeoItem = computed(() => serviceSeoData.value?.data?.items?.[0])
const seoTitle = computed(() => serviceSeoItem.value?.NAME || 'СЕО')
const seoDescription = computed(() =>
	serviceSeoItem.value?.PREVIEW_TEXT
		? decodeHtml(serviceSeoItem.value.PREVIEW_TEXT)
		: '',
)
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<HeroWrapper
			class="s-c-hero"
			:title="heroTitle"
			:texts="heroTexts"
			:render-html="true"
		/>
		<SCList :list="sections" />
		<SeoBlock :title="seoTitle" :description="seoDescription" :render-html="true" />
		<ConsultationBlock />
	</main>
</template>

<style lang="scss"></style>
