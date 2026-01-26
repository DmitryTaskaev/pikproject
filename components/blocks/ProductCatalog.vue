<script setup lang="ts">
const servicesList = [
	{
		icon: {
			name: 'water-supply',
			isSprite: false,
		},
		title: ['Водоснабжение'],
		href: '/piktube/solution',
	},
	{
		icon: {
			name: 'water-drainage',
			isSprite: false,
		},
		title: ['Водоотведение'],
		href: '/piktube/solution',
	},
	{
		icon: {
			name: 'gas-distribution',
			isSprite: false,
		},
		title: ['Газораспределение'],
		href: '/piktube/solution',
	},
	{
		icon: {
			name: 'cable-protection',
			isSprite: false,
		},
		title: ['Защита кабеля'],
		href: '/piktube/solution',
	},
	{
		icon: {
			name: 'oil-isolation',
			isSprite: false,
		},
		title: ['Изоляция ', 'в нефтегазовой ', 'отрасли'],
		href: '/piktube/solution',
	},
	{
		icon: {
			name: 'pipes-isolation',
			isSprite: false,
		},
		title: ['Стальные трубы ', 'в изоляции'],
		href: '/piktube/solution',
	},
	{
		icon: {
			name: 'pipes',
			isSprite: false,
		},
		title: ['Полиэтиленовые ', 'трубы'],
		href: '/piktube/solution',
	},
	{
		icon: {
			name: 'shaped-products-isolation',
			isSprite: false,
		},
		title: ['Фасонные изделия ', 'в изоляции'],
		href: '/piktube/solution',
	},
]

const productsList = [
	{
		image: {
			src: 'production/production-01',
			alt: 'Трубы ПНД',
		},
		title: 'Трубы ПНД',
		href: '/piktube/product-page',
		mode: '1',
	},
	{
		image: {
			src: 'production/production-02',
			alt: 'Гофрированные трубы',
		},
		title: 'Гофрированные трубы',
		href: '/piktube/product-page',
		mode: '2',
	},
	{
		image: {
			src: 'production/production-03',
			alt: 'Газовые трубы ПНД',
		},
		title: 'Газовые трубы ПНД',
		href: '/piktube/product-page',
		mode: '3',
	},
	{
		image: {
			src: 'production/production-04',
			alt: 'ППМ трубы',
		},
		title: 'ППМ трубы',
		href: '/piktube/product-page',
		mode: '4',
	},
	{
		image: {
			src: 'production/production-05',
			alt: 'ППУ трубы',
		},
		title: 'ППУ трубы',
		href: '/piktube/product-page',
		mode: '5',
	},
	{
		image: {
			src: 'production/production-06',
			alt: 'Трубы для защиты кабеля',
		},
		title: 'Трубы для защиты кабеля',
		href: '/piktube/product-page',
		mode: '6',
	},
	{
		image: {
			src: 'production/production-07',
			alt: 'PE-RT',
		},
		title: 'PE-RT',
		href: '/piktube/product-page',
		mode: '7',
	},
	{
		image: {
			src: 'production/production-08',
			alt: 'Фитинги',
		},
		title: 'Фитинги',
		href: '/piktube/product-page',
		mode: '8',
	},
]

interface ProductCatalogProps {
	isBorder?: boolean
}
const { isBorder } = defineProps<ProductCatalogProps>()
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
								:is-water-supply="index === 0"
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
								:is-water-supply="index === 0"
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
