<script setup lang="ts">
import type { PipeCardProps } from '~/components/cards/PipeCard.vue'
import type { DocumentSlideProps } from '~/components/slides/DocumentSlide.vue'
import type { ImageProps } from '~/components/ui/base/Image.vue'
import type {
	ProductItem,
	ProductProperty,
	ProductSectionDetailResponse,
	ProductsTreeResponse,
} from '~/composables/products'
import {
	collectListPageProperties,
	decodeHtml,
	mapListPageValues,
	normalizePathSegments,
	resolveImageSrc,
	resolvePathNodes,
	resolveSectionCode,
} from '~/composables/products'

const route = useRoute()
const config = useRuntimeConfig()

const pathSegments = computed(() => normalizePathSegments(route.params.path))
const itemCode = computed(() => pathSegments.value[pathSegments.value.length - 1] || '')
const sectionSegments = computed(() => pathSegments.value.slice(0, -1))
const sectionPath = computed(() => sectionSegments.value.join('/'))

const { data: treeData } = await useAsyncData('productsTree', () =>
	$fetch<ProductsTreeResponse>(`${config.app.baseURL}api/products`),
)

const { data: sectionData } = await useAsyncData(
	() => `product-section-${sectionPath.value}`,
	() =>
		sectionPath.value
			? $fetch<ProductSectionDetailResponse>(`${config.app.baseURL}api/products`, {
					query: { path: sectionPath.value },
				})
			: null,
	{ watch: [sectionPath] },
)

const section = computed(() => sectionData.value?.data?.SECTION)
const items = computed(() => sectionData.value?.data?.ITEMS || [])

const currentItem = computed<ProductItem | undefined>(() => {
	const code = itemCode.value
	if (!code) return undefined
	return items.value.find(item => (item.CODE || item['~CODE'] || '') === code)
})

const listPageProperties = computed(() => collectListPageProperties(items.value))

const titleList = computed(() =>
	listPageProperties.value.map(item => `${item.name}:`),
)

const detailsList = computed(() => {
	const props = currentItem.value?.PROPERTIES as Record<string, ProductProperty> | undefined
	const detailProps = collectListPageProperties([{ PROPERTIES: props || {} }])
	return detailProps.map(item => ({
		title: `${item.name}:`,
		value:
			props?.[item.code]?.VALUE === undefined ||
			props?.[item.code]?.VALUE === null ||
			props?.[item.code]?.VALUE === ''
				? ''
				: String(props?.[item.code]?.VALUE),
	}))
})

const slides = computed(() => {
	const gallery = currentItem.value?.PROPERTIES?.MORE_PHOTO as
		| { SRC?: string[]; FILES?: Array<{ SRC?: string }> }
		| undefined
	const sources = gallery?.SRC ||
		gallery?.FILES?.map(file => file.SRC).filter(Boolean) || []
	const uniqueSources = sources.filter(Boolean)
	if (uniqueSources.length > 0) {
		return uniqueSources.map(src => ({
			image: {
				src: resolveImageSrc(config.public.apiOrigin, src),
				alt: currentItem.value?.NAME || 'Изображение',
			},
		}))
	}
	const preview = currentItem.value?.PREVIEW_PICTURE_SRC
	return preview
		? [
				{
					image: {
						src: resolveImageSrc(config.public.apiOrigin, preview),
						alt: currentItem.value?.NAME || 'Изображение',
					},
				},
			]
		: []
})

const documents = computed<DocumentSlideProps[]>(() => {
	const docs = currentItem.value?.PROPERTIES?.DOCUMNETS as
		| { SRC?: string[]; FILES?: Array<{ SRC?: string; FILE_SIZE?: number; ORIGINAL_NAME?: string }> }
		| undefined
	const files = docs?.FILES || []
	if (files.length > 0) {
		return files.map(file => ({
			text: [file.ORIGINAL_NAME || 'Документ'],
			size: Number.isFinite(Number(file.FILE_SIZE))
				? (Number(file.FILE_SIZE) / (1024 * 1024)).toFixed(1)
				: undefined,
			href: file.SRC ? resolveImageSrc(config.public.apiOrigin, file.SRC) : undefined,
		}))
	}
	const rawSources = (docs as { SRC?: unknown; VALUE?: unknown } | undefined)?.SRC ??
		(docs as { SRC?: unknown; VALUE?: unknown } | undefined)?.VALUE ?? []
	const srcs = Array.isArray(rawSources)
		? rawSources
		: rawSources
			? [rawSources]
			: []
	const normalized = srcs
		.map(src => {
			if (typeof src === 'string') return src
			if (src && typeof src === 'object') {
				const obj = src as { SRC?: string }
				return obj.SRC || ''
			}
			return ''
		})
		.filter(Boolean)
	return normalized.map(src => ({
		text: ['Документ'],
		href: resolveImageSrc(config.public.apiOrigin, src),
	}))
})

const otherCards = computed<PipeCardProps[]>(() => {
	return items.value
		.filter(item => (item.CODE || item['~CODE'] || '') !== itemCode.value)
		.map(item => ({
			image: {
				src: resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC),
				alt: item.NAME,
			} as ImageProps,
			name: item.NAME,
			settings: mapListPageValues(
				item.PROPERTIES as Record<string, ProductProperty>,
				listPageProperties.value,
			),
			href: `${config.app.baseURL}product-card/${sectionPath.value}/${
				item.CODE || item['~CODE'] || ''
			}`,
		}))
})

const catalogTitle = computed(() => {
	return section.value?.NAME ? `Другие варианты ${section.value.NAME}` : ''
})

const breadcrumbsList = computed(() => {
	const tree = treeData.value?.data?.TREE || []
	const nodes = resolvePathNodes(tree, sectionSegments.value)
	const trail = nodes.map((node, index) => {
		const codes = nodes
			.slice(0, index + 1)
			.map(item => resolveSectionCode(item.SECTION))
			.filter(Boolean)
		const href = `${config.app.baseURL}catalog/${codes.join('/')}`
		return { title: node.SECTION.NAME, href }
	})
	const currentTitle = currentItem.value?.NAME || 'Товар'
	return [
		{ title: 'Главная', href: '/' },
		{ title: 'Каталог', href: '/catalog' },
		...trail,
		{ title: currentTitle, href: `${config.app.baseURL}product-card/${pathSegments.value.join('/')}` },
	]
})

const heroTitle = computed(() => currentItem.value?.NAME || '')
const heroDesc = computed(() =>
	currentItem.value?.PREVIEW_TEXT ? decodeHtml(currentItem.value.PREVIEW_TEXT) : '',
)
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<PCHero
			:title="heroTitle"
			:application="heroDesc"
			:details="detailsList"
			:slides="slides.length ? slides : undefined"
		/>
		<PCDocuments v-if="documents.length" :slides="documents" />
		<PCCatalog
			v-if="otherCards.length"
			:title="catalogTitle"
			:title-list="titleList"
			:card-list="otherCards"
		/>
		<SeoBlock />
		<ConsultationBlock />
	</main>
	<OrderModal />
</template>

<style lang="scss"></style>
