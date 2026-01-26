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

interface ServicesSection {
	SECTION: {
		ID: string
		NAME: string
		CODE?: string
		['~CODE']?: string
	}
	ITEMS: ServicesItem[]
}

interface ServicesResponse {
	status: string
	data: {
		TREE: ServicesSection[]
	}
}

interface ServicesTopItem {
	NAME: string
	PREVIEW_TEXT: string
}

interface ServicesTopResponse {
	status: string
	data: {
		items: ServicesTopItem[]
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

const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Каталог Услуг', href: '/services' },
]
const fallbackHeroTexts = [
	'Трубный завод ПИК оказывает полный спектр услуг по нанесению теплоизоляционных и антикоррозионных покрытий на стальные и полиэтиленовые трубы. Все операции выполняются на собственном оборудовании с обязательным лабораторным контролем качества.',
]
const fallbackHeroTitle = 'Услуги'

const config = useRuntimeConfig()
const { data: servicesData } = await useAsyncData('servicesCatalog', () =>
	$fetch<ServicesResponse>(`${config.app.baseURL}api/services`),
)
const { data: servicesTopData } = await useAsyncData('servicesTop', () =>
	$fetch<ServicesTopResponse>(`${config.app.baseURL}api/servicesTop`),
)
const { data: serviceSeoData } = await useAsyncData('serviceSeo', () =>
	$fetch<ServiceSeoResponse>(`${config.app.baseURL}api/serviceSeo`),
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

const mapItems = (items: ServicesItem[]): ListItem[] => {
	return items.map(item => ({
		title: [item.NAME],
		content: {
			desc: decodeHtml(item.PREVIEW_TEXT || ''),
			measures: mapProperties(item.PROPERTIES),
		},
		image: mapImage(item.PREVIEW_PICTURE_SRC),
	}))
}

const sections = computed(() => {
	const tree = servicesData.value?.data?.TREE || []
	return tree
		.map(section => ({
			title: section.SECTION.NAME,
			code: section.SECTION.CODE || section.SECTION['~CODE'] || '',
			list: mapItems(section.ITEMS || []),
		}))
		.filter(section => Boolean(section.code))
		.map(section => ({
			title: section.title,
			href: `${config.app.baseURL}services/${section.code}`,
			list: section.list,
		}))
})

const servicesTopItem = computed(() => servicesTopData.value?.data?.items?.[0])
const heroTitle = computed(() => servicesTopItem.value?.NAME || fallbackHeroTitle)
const heroTexts = computed(() => {
	const text = servicesTopItem.value?.PREVIEW_TEXT
	if (!text) return fallbackHeroTexts
	return [decodeHtml(text)]
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
		<HeroWrapper class="s-c-hero" :title="heroTitle" :texts="heroTexts" />
		<SCList :list="sections" />
		<SeoBlock :title="seoTitle" :description="seoDescription" />
		<ConsultationBlock />
	</main>
</template>

<style lang="scss"></style>
