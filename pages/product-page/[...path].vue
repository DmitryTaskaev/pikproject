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
	() => `product-page-section-${sectionPath.value}`,
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

const detailProperties = computed(() => {
	const props = currentItem.value?.PROPERTIES as Record<string, ProductProperty> | undefined
	const list = collectListPageProperties([{ PROPERTIES: props || {} }])
	return list
})

const detailsList = computed(() => {
	const props = currentItem.value?.PROPERTIES as Record<string, ProductProperty> | undefined
	return detailProperties.value
		.map(item => ({
			title: `${item.name}:`,
			value:
				props?.[item.code]?.VALUE === undefined ||
				props?.[item.code]?.VALUE === null ||
				props?.[item.code]?.VALUE === ''
					? ''
					: String(props?.[item.code]?.VALUE),
		}))
		.filter(item => item.value !== '')
})

const slides = computed(() => {
	const gallery = currentItem.value?.PROPERTIES?.MORE_PHOTO as
		| { SRC?: string[]; FILES?: Array<{ SRC?: string }> }
		| undefined
	const sources = gallery?.SRC ||
		gallery?.FILES?.map(file => file.SRC).filter(Boolean) || []
	const uniqueSources = sources.filter(Boolean)
	return uniqueSources.map(src => ({
		image: {
			src: resolveImageSrc(config.public.apiOrigin, src),
			alt: currentItem.value?.NAME || 'Изображение',
		},
	}))
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
	const srcs = docs?.SRC || []
	return srcs.map(src => ({
		text: ['Документ'],
		href: resolveImageSrc(config.public.apiOrigin, src),
	}))
})

const catalogProperties = computed(() => {
	const list = collectListPageProperties(items.value)
	if (list.length > 0) return list.slice(0, 6)
	const map = new Map<string, { code: string; name: string; sort: number }>()
	for (const item of items.value) {
		const props = item.PROPERTIES || {}
		for (const [key, prop] of Object.entries(props)) {
			const code = prop?.CODE || key
			if (!code) continue
			if (!map.has(code)) {
				map.set(code, {
					code,
					name: prop?.NAME || code,
					sort: Number(prop?.SORT || 0),
				})
			}
		}
	}
	return Array.from(map.values())
		.sort((a, b) => a.sort - b.sort)
		.slice(0, 6)
})

const titleList = computed(() => catalogProperties.value.map(item => `${item.name}:`))

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
				catalogProperties.value,
			),
			href: withBasePath(
				`/catalog/${sectionPath.value}/${item.CODE || item['~CODE'] || ''}`,
			),
		}))
})

const catalogTitle = computed(() => {
	return section.value?.NAME
		? `Другие варианты ${section.value.NAME}`
		: 'Другие варианты'
})

const breadcrumbsList = computed(() => {
	const tree = treeData.value?.data?.TREE || []
	const nodes = resolvePathNodes(tree, sectionSegments.value)
	const trail = nodes.map((node, index) => {
		const codes = nodes
			.slice(0, index + 1)
			.map(item => resolveSectionCode(item.SECTION))
			.filter(Boolean)
		const href = withBasePath(`/catalog/${codes.join('/')}`)
		return { title: node.SECTION.NAME, href }
	})
	const currentTitle = currentItem.value?.NAME || 'Товар'
	return [
		{ title: 'Главная', href: withBasePath('/') },
		{ title: 'Каталог', href: withBasePath('/catalog') },
		...trail,
		{ title: currentTitle, href: withBasePath(`/catalog/${pathSegments.value.join('/')}`) },
	]
})

const heroTitle = computed(() => currentItem.value?.NAME || '')
const heroDesc = computed(() =>
	currentItem.value?.PREVIEW_TEXT ? decodeHtml(currentItem.value.PREVIEW_TEXT) : '',
)

const seoTitle = computed(() => {
	const itemTitle = (currentItem.value as { SEO_TITLE?: string })?.SEO_TITLE || ''
	return itemTitle || section.value?.UF_SEO_TITLE || ''
})
const seoDescription = computed(() => {
	const itemDesc =
		(currentItem.value as { SEO_DESCRIPTION?: string })?.SEO_DESCRIPTION || ''
	return itemDesc || section.value?.UF_SEO_DESCRIPTION || ''
})
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<PCHero
			:title="heroTitle"
			:application="heroDesc"
			:details="detailsList"
			:slides="slides"
		/>
		<PCDocuments v-if="documents.length" :slides="documents" />
		<PCCatalog
			v-if="otherCards.length"
			:title="catalogTitle"
			:title-list="titleList"
			:card-list="otherCards"
		/>
		<SeoBlock
			v-if="seoTitle || seoDescription"
			:title="seoTitle"
			:description="seoDescription"
		/>
		<ConsultationBlock />
	</main>
	<OrderModal />
</template>

<style lang="scss"></style>
