<script setup lang="ts">
const titleList = [
	'Толщина стенки:',
	'Марка стали:',
	'ГОСТ/ТУ:',
	'd:',
	'Толщина изоляции:',
	'd оболочки:',
]
const slides = [
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
