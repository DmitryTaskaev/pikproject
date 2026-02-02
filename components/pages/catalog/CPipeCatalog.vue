<script setup lang="ts">
import type { PipeCardProps } from '~/components/cards/PipeCard.vue'
import type { ProductItem, ProductSectionNode, ProductsTreeResponse } from '~/composables/products'
import {
	chunkArray,
	collectListPageProperties,
	mapListPageValues,
	resolveImageSrc,
	resolveSectionCode,
} from '~/composables/products'

const config = useRuntimeConfig()

const { data: productsTreeData } = await useAsyncData('productsTree-catalog', () =>
	$fetch<ProductsTreeResponse>(`${config.app.baseURL}api/products`),
)

const flattenItems = (
	nodes: ProductSectionNode[],
	parentPath: string[] = [],
): Array<{ item: ProductItem; path: string[] }> => {
	const result: Array<{ item: ProductItem; path: string[] }> = []
	for (const node of nodes) {
		const code = resolveSectionCode(node.SECTION)
		if (!code) continue
		const path = [...parentPath, code]
		const items = (node.ITEMS || []) as ProductItem[]
		for (const item of items) {
			result.push({ item, path })
		}
		if (node.CHILDREN?.length) {
			result.push(...flattenItems(node.CHILDREN, path))
		}
	}
	return result
}

const catalogEntries = computed(() => {
	const tree = productsTreeData.value?.data?.TREE || []
	const entries = flattenItems(tree)
	const seen = new Set<string>()
	return entries.filter(entry => {
		const code = entry.item.CODE || entry.item['~CODE'] || ''
		if (!code) return false
		const key = `${entry.path.join('/')}/${code}`
		if (seen.has(key)) return false
		seen.add(key)
		return true
	})
})

const items = computed(() => catalogEntries.value.map(entry => entry.item))
const listPageProps = computed(() =>
	collectListPageProperties(items.value).slice(0, 6),
)
const titleList = computed(() =>
	listPageProps.value.map(item => `${item.name}:`),
)

const slides = computed(() => {
	const cards: PipeCardProps[] = catalogEntries.value.map(entry => ({
		// Use preview image for catalog cards
		image: {
			src: entry.item.PREVIEW_PICTURE_SRC
				? resolveImageSrc(config.public.apiOrigin, entry.item.PREVIEW_PICTURE_SRC)
				: '',
			alt: entry.item.NAME,
		},
		name: entry.item.NAME,
		settings: mapListPageValues(
			entry.item.PROPERTIES as Record<string, any>,
			listPageProps.value,
		),
		href: `/catalog/${entry.path.join('/')}/${entry.item.CODE || entry.item['~CODE'] || ''}`,
	}))
	return chunkArray(cards, 3)
})
</script>

<template>
	<div class="c-pipe-catalog-wrap">
		<div class="container">
			<section-dropdown class="c-pipe-catalog" title="Каталог труб">
				<PipesList :title-list="titleList" :slides="slides" />
			</section-dropdown>
		</div>
	</div>
</template>

<style lang="scss">
.c-pipe-catalog-wrap {
	// padding-left: var(--container-padding);
	// @include ultrahd {
	// 	padding: 0 var(--container-padding);
	// }
}
.c-pipe-catalog {
	margin-bottom: var(--space-section-lg);

	.section-dropdown__top {
		// padding-right: var(--container-padding);
		// @include ultrahd {
		// 	padding-right: 0;
		// }
	}
}
</style>
