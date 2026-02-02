<script setup lang="ts">
import type { PipeCardProps } from '~/components/cards/PipeCard.vue'
import type { ProductItem } from '~/composables/products'
import {
	chunkArray,
	collectListPageProperties,
	mapListPageValues,
	resolveImageSrc,
} from '~/composables/products'

const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Каталог', href: '/catalog' },
]

const config = useRuntimeConfig()

interface ProductsListResponse {
	status: string
	data: {
		items: ProductItem[]
	}
}

const { data: productsListData } = await useAsyncData('productsList', () =>
	$fetch<ProductsListResponse>(`${config.app.baseURL}api/productsList`),
)

const productsListItems = computed(() => productsListData.value?.data?.items || [])
const listPageProperties = computed(() =>
	collectListPageProperties(productsListItems.value).slice(0, 6),
)
const titleList = computed(() =>
	listPageProperties.value.map(item => `${item.name}:`),
)

const tableSlides = computed(() => {
	const cards: PipeCardProps[] = productsListItems.value.map(item => ({
		image: {
			src: item.PREVIEW_PICTURE_SRC
				? resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC)
				: '',
			alt: item.NAME,
		},
		name: item.NAME,
		settings: mapListPageValues(
			item.PROPERTIES as Record<string, any>,
			listPageProperties.value,
		),
		href: `/catalog/${item.CODE || item['~CODE'] || ''}`,
	}))
	return chunkArray(cards, 3)
})
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<ProductCatalog />
		<CPipeCatalog />
		<ServiceCatalog />
		<SeoBlock />
		<ConsultationBlock />
		<ActionsPopup />
	</main>
	<DocumentationModal />
	<OrderModal />
</template>

<style lang="scss">
</style>
