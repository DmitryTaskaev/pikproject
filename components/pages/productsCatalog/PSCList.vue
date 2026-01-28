<script setup lang="ts">
import type { PipeCardProps } from '~/components/cards/PipeCard.vue'

interface PSCListProps {
	titleList?: string[]
	slides?: PipeCardProps[][]
}

const fallbackTitleList = [
	'Толщина стенки:',
	'Марка стали:',
	'ГОСТ/ТУ:',
	'd:',
	'Толщина изоляции:',
	'd оболочки:',
]
const fallbackSlides: PipeCardProps[][] = [
	[
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
	],
	[
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
	],
	[
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
	],
	[
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['3', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['5', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['4', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
	],
]

const props = defineProps<PSCListProps>()

const resolvedTitleList = computed(() => {
	return props.titleList !== undefined ? props.titleList : fallbackTitleList
})

const resolvedSlides = computed(() => {
	return props.slides !== undefined ? props.slides : fallbackSlides
})
</script>

<template>
	<div class="p-s-c-list">
		<div class="container">
			<div class="p-s-c-list__container">
				<PipesList :title-list="resolvedTitleList" :slides="resolvedSlides" />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.p-s-c-list {
	margin-bottom: 140px;
	&__container {
		// padding-left: var(--container-padding);
		// @include ultrahd {
		// 	padding-right: var(--container-padding);
		// }
	}
}
</style>
