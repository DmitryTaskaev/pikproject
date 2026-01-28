<script setup lang="ts">
import type { PipeCardProps } from '~/components/cards/PipeCard.vue'

interface PCCatalogProps {
	title?: string
	titleList?: string[]
	cardList?: PipeCardProps[]
}

const fallbackTitleList = [
	'Толщина стенки:',
	'Марка стали:',
	'ГОСТ/ТУ:',
	'd:',
	'Толщина изоляции:',
	'd оболочки:',
]
const fallbackCardList: PipeCardProps[] = [
	{
		image: { src: 'production/production-07-small', alt: 'Труба' },
		name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
		settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
		href: '#',
	},
	{
		image: { src: 'production/production-07-small', alt: 'Труба' },
		name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
		settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
		href: '#',
	},
	{
		image: { src: 'production/production-07-small', alt: 'Труба' },
		name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
		settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
		href: '#',
	},
	{
		image: { src: 'production/production-07-small', alt: 'Труба' },
		name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
		settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
		href: '#',
	},
	{
		image: { src: 'production/production-07-small', alt: 'Труба' },
		name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
		settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
		href: '#',
	},
	{
		image: { src: 'production/production-07-small', alt: 'Труба' },
		name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
		settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
		href: '#',
	},
	{
		image: { src: 'production/production-07-small', alt: 'Труба' },
		name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
		settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
		href: '#',
	},
]

const props = defineProps<PCCatalogProps>()

const resolvedTitle = computed(
	() => props.title || 'Другие варианты трубы ПНД SDR 11 ПИКПАЙП II',
)
const resolvedTitleList = computed(() => {
	return props.titleList && props.titleList.length > 0
		? props.titleList
		: fallbackTitleList
})
const resolvedCardList = computed(() => {
	return props.cardList && props.cardList.length > 0
		? props.cardList
		: fallbackCardList
})
</script>

<template>
	<div class="p-c-catalog">
		<div class="container">
			<BorderLine
				class="p-c-catalog__container"
				position="top"
				design="primary"
			>
				<CustomTitle class="p-c-catalog__title" tag="h2" mode="xl">
					{{ resolvedTitle }}
				</CustomTitle>
				<pipes-list
					:title-list="resolvedTitleList"
					:card-list="resolvedCardList"
				/>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.p-c-catalog {
	// margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: calc(1.6 * var(--space-section-sm));
	}
	&__container {
		padding-top: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		@include ultrahd {
			padding-top: 50px;
			gap: calc(2 * var(--space-lg));
		}
	}
	&__title {
		max-width: 335px;
		@include ultrahd {
			max-width: 541px;
		}
	}
}
</style>
