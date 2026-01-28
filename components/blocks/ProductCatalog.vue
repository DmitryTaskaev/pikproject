<script setup lang="ts">
import type { ProductSectionNode, ProductsTreeResponse } from '~/composables/products'
import { resolveSectionCode } from '~/composables/products'

const fallbackServicesList = [
	{
		icon: {
			name: 'water-supply',
			isSprite: false,
		},
		title: ['Водоснабжение'],
		href: '/piktube/catalog',
	},
	{
		icon: {
			name: 'water-drainage',
			isSprite: false,
		},
		title: ['Водоотведение'],
		href: '/piktube/catalog',
	},
	{
		icon: {
			name: 'gas-distribution',
			isSprite: false,
		},
		title: ['Газораспределение'],
		href: '/piktube/catalog',
	},
	{
		icon: {
			name: 'cable-protection',
			isSprite: false,
		},
		title: ['Защита кабеля'],
		href: '/piktube/catalog',
	},
	{
		icon: {
			name: 'oil-isolation',
			isSprite: false,
		},
		title: ['Изоляция ', 'в нефтегазовой ', 'отрасли'],
		href: '/piktube/catalog',
	},
	{
		icon: {
			name: 'pipes-isolation',
			isSprite: false,
		},
		title: ['Стальные трубы ', 'в изоляции'],
		href: '/piktube/catalog',
	},
	{
		icon: {
			name: 'pipes',
			isSprite: false,
		},
		title: ['Полиэтиленовые ', 'трубы'],
		href: '/piktube/catalog',
	},
	{
		icon: {
			name: 'shaped-products-isolation',
			isSprite: false,
		},
		title: ['Фасонные изделия ', 'в изоляции'],
		href: '/piktube/catalog',
	},
]

const productsList = [
	{
		image: {
			src: 'production/production-01',
			alt: 'Трубы ПНД',
		},
		title: 'Трубы ПНД',
		href: '/piktube/catalog',
		mode: '1',
	},
	{
		image: {
			src: 'production/production-02',
			alt: 'Гофрированные трубы',
		},
		title: 'Гофрированные трубы',
		href: '/piktube/catalog',
		mode: '2',
	},
	{
		image: {
			src: 'production/production-03',
			alt: 'Газовые трубы ПНД',
		},
		title: 'Газовые трубы ПНД',
		href: '/piktube/catalog',
		mode: '3',
	},
	{
		image: {
			src: 'production/production-04',
			alt: 'ППМ трубы',
		},
		title: 'ППМ трубы',
		href: '/piktube/catalog',
		mode: '4',
	},
	{
		image: {
			src: 'production/production-05',
			alt: 'ППУ трубы',
		},
		title: 'ППУ трубы',
		href: '/piktube/catalog',
		mode: '5',
	},
	{
		image: {
			src: 'production/production-06',
			alt: 'Трубы для защиты кабеля',
		},
		title: 'Трубы для защиты кабеля',
		href: '/piktube/catalog',
		mode: '6',
	},
	{
		image: {
			src: 'production/production-07',
			alt: 'PE-RT',
		},
		title: 'PE-RT',
		href: '/piktube/catalog',
		mode: '7',
	},
	{
		image: {
			src: 'production/production-08',
			alt: 'Фитинги',
		},
		title: 'Фитинги',
		href: '/piktube/catalog',
		mode: '8',
	},
]

interface ProductCatalogProps {
	isBorder?: boolean
}
const { isBorder } = defineProps<ProductCatalogProps>()

const config = useRuntimeConfig()
const { data: productsData } = await useAsyncData('productsCatalog', () =>
	$fetch<ProductsTreeResponse>(`${config.app.baseURL}api/products`),
)

const makeSectionHref = (section: ProductSectionNode, path: string[]) => {
	const base = 'catalog'
	const suffix = path.length ? `/${path.join('/')}` : ''
	return base ? `${config.app.baseURL}${base}${suffix}` : ''
}

const buildChildLinks = (node: ProductSectionNode, path: string[]) => {
	const children = node.CHILDREN || []
	return children
		.map(child => {
			const code = resolveSectionCode(child.SECTION)
			if (!code) return null
			const childPath = [...path, code]
			return {
				title: child.SECTION.NAME,
				href: makeSectionHref(child, childPath),
			}
		})
		.filter(Boolean)
}

const flattenSections = (
	nodes: ProductSectionNode[],
	parentPath: string[] = [],
	depth = 1,
): Array<{ node: ProductSectionNode; path: string[]; depth: number }> => {
	return nodes.flatMap(node => {
		const code = resolveSectionCode(node.SECTION)
		if (!code) return []
		const path = [...parentPath, code]
		const current = [{ node, path, depth }]
		const children = node.CHILDREN
			? flattenSections(node.CHILDREN, path, depth + 1)
			: []
		return current.concat(children)
	})
}

const sectionsFlat = computed(() => {
	const tree = productsData.value?.data?.TREE || []
	return flattenSections(tree)
})

const servicesList = computed(() => {
	const top = sectionsFlat.value.filter(entry => entry.depth === 1)
	if (top.length === 0) return []
	const icons = fallbackServicesList.map(item => item.icon)
	return top.map((entry, index) => ({
		icon: icons[index] || { name: 'pipes', isSprite: false },
		title: [entry.node.SECTION.NAME],
		href: entry.node.SECTION.UF_TYPE_ELEMENT ? makeSectionHref(entry.node, entry.path) : '',
		links: buildChildLinks(entry.node, entry.path),
	}))
})

// productsList stays static for now per requirements
</script>

<template>
	<section v-if="!isBorder" class="product-catalog">
		<div class="container">
			<div class="product-catalog__container">
				<CustomTitle class="product-catalog__title" tag="h1">
					Каталог продукции
				</CustomTitle>
				<div class="product-catalog__wrap">
					<SectionWrapper
						class="product-catalog__solutions"
						title="Отраслевые решения"
					>
						<div class="product-catalog__solutions--list">
							<ServiceCard
								v-for="(item, index) in servicesList"
								:key="index"
								v-bind="item"
							/>
						</div>
					</SectionWrapper>
					<SectionWrapper
						class="product-catalog__products"
						title="Наша продукция"
					>
						<div class="product-catalog__products--list">
							<ProductCard
								v-for="(item, index) in productsList"
								:key="index"
								v-bind="item"
							/>
						</div>
					</SectionWrapper>
				</div>
			</div>
		</div>
	</section>
	<section v-else class="product-catalog">
		<div class="container">
			<BorderLine
				class="product-catalog__container"
				position="top"
				design="primary"
			>
				<CustomTitle class="product-catalog__title" tag="h1">
					Каталог продукции
				</CustomTitle>
				<div class="product-catalog__wrap">
					<SectionWrapper
						class="product-catalog__solutions"
						title="Отраслевые решения"
					>
						<div class="product-catalog__solutions--list">
							<ServiceCard
								v-for="(item, index) in servicesList"
								:key="index"
								v-bind="item"
							/>
						</div>
					</SectionWrapper>
					<SectionWrapper
						class="product-catalog__products"
						title="Наша продукция"
					>
						<div class="product-catalog__products--list">
							<ProductCard
								v-for="(item, index) in productsList"
								:key="index"
								v-bind="item"
							/>
						</div>
					</SectionWrapper>
				</div>
			</BorderLine>
		</div>
	</section>
</template>

<style lang="scss">
.product-catalog {
	margin-bottom: var(--space-section-sm);
	@include tablet {
		margin-bottom: var(--space-section-md);
	}
	@include ultrahd {
		margin-bottom: var(--space-section-lg);
	}
	&__container {
		padding-top: var(--space-md);
	}
	&__title {
		text-align: center;
		margin-bottom: 80px;
		@include ultrahd {
			margin-bottom: 110px;
		}
	}
	&__wrap {
		display: flex;
		flex-direction: column;
		gap: 80px;
		@include ultrahd {
			gap: 120px;
		}
	}
	&__solutions {
		&--list {
			display: grid;
			grid-template-columns: 1fr;
			gap: var(--space-xs);

			@include tablet {
				grid-template-columns: repeat(2, 1fr);
			}
			@include ultrahd {
				grid-template-columns: repeat(3, 1fr);
				gap: var(--space-sm);
			}
		}
	}
	&__products {
		&--list {
			display: grid;
			grid-template-columns: 1fr;
			gap: var(--space-xs);

			@include tablet {
				grid-template-columns: repeat(2, 1fr);
			}
			@include ultrahd {
				grid-template-columns: repeat(3, 1fr);
				gap: var(--space-sm);
			}
		}
	}
}
</style>
