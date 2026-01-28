<script setup lang="ts">
import type { PipeCardProps } from '~/components/cards/PipeCard.vue'

interface PPCatalogProps {
	title?: string[]
	titleList?: string[]
	slides?: PipeCardProps[][]
}

const fallbackTitle = ['Полный каталог труб ПНД ', 'ПИКПАЙП']
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
	],
	[
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['6', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['7', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['8', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
	],
	[
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['9', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['10', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['11', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
	],
	[
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['12', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['13', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
		{
			image: { src: 'production/production-07-small', alt: 'Труба' },
			name: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
			settings: ['14', 'ст 09Г2С', '8732-78', '32', '34', '121'],
			href: '/piktube/product-card',
		},
	],
]

const props = defineProps<PPCatalogProps>()

const resolvedTitle = computed(() => {
	if (props.title) return props.title
	return fallbackTitle
})
const resolvedTitleList = computed(() => {
	if (props.titleList) return props.titleList
	return fallbackTitleList
})
const resolvedSlides = computed(() => {
	if (props.slides) return props.slides
	return fallbackSlides
})
</script>

<template>
	<catalog-section
		:title="resolvedTitle"
		:title-list="resolvedTitleList"
		:slides="resolvedSlides"
	/>
</template>

<style lang="scss"></style>
