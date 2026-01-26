<script setup lang="ts">
interface DetailsProperty {
	NAME: string
	CODE?: string
	VALUE?: string | string[]
	SORT?: string
	LIST_PAGE_SHOW?: 'Y' | 'N'
}

interface DetailPageInfoItem {
	NAME: string
	PREVIEW_TEXT?: string
	PROPERTIES?: Record<string, DetailsProperty>
}

interface DetailPageInfoResponse {
	data?: {
		items?: DetailPageInfoItem[]
	}
}

const config = useRuntimeConfig()
const { data: detailPageInfoData } = await useAsyncData(
	'detailPageInfo',
	() => $fetch<DetailPageInfoResponse>(`${config.app.baseURL}api/detailPageInfo`),
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

const splitParagraphs = (value?: string) => {
	if (!value) return []
	const normalized = decodeHtml(value).replace(/<\/?br\s*\/?>/gi, '\n')
	return normalized
		.split(/\n+/)
		.map(item => item.trim())
		.filter(Boolean)
}

const normalizeValue = (value?: string | string[]) => {
	if (!value) return ''
	return Array.isArray(value) ? value.join(', ') : value
}

const detailItem = computed(
	() => detailPageInfoData.value?.data?.items?.[0],
)

const breadcrumbsList = computed(() => [
	{ title: 'Главная', href: '/' },
	{ title: detailItem.value?.NAME || 'Реквизиты', href: '/details' },
])

const contentTitle = computed(() => detailItem.value?.NAME || 'Реквизиты')
const contentTexts = computed(() =>
	splitParagraphs(detailItem.value?.PREVIEW_TEXT),
)

const detailProperties = computed<Record<string, DetailsProperty>>(
	() => detailItem.value?.PROPERTIES || {},
)

const detailsList = computed(() => {
	const properties = Object.values(detailProperties.value)
	return properties
		.filter(item => item.LIST_PAGE_SHOW === 'Y')
		.filter(item => item.VALUE && item.NAME)
		.sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0))
		.map(item => {
			const value = normalizeValue(item.VALUE)
			const code = item.CODE || ''
			const href =
				code === 'PHONE' ? `tel:${value.replace(/[^+\d]/g, '')}` : undefined
			return {
				label: item.NAME,
				value,
				href,
				nowrap: code === 'FULL_NAME',
			}
		})
})

const footerTitle = computed(() =>
	normalizeValue(detailProperties.value['TEXT_BOTTOM']?.VALUE),
)
const footerButtonText = computed(
	() => normalizeValue(detailProperties.value['TEXT_BUTTON']?.VALUE),
)
const footerButtonHref = computed(
	() => normalizeValue(detailProperties.value['URL_BUTTON']?.VALUE),
)
</script>

<template>
    <main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<ContentBlock :title="contentTitle" :texts="contentTexts" />
		<DetailsList
			:items="detailsList"
			:footer-title="footerTitle"
			:footer-button-text="footerButtonText"
			:footer-button-href="footerButtonHref"
		/>
		<ConsultationBlock />
	</main>
</template>
