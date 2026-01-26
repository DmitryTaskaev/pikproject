<script setup lang="ts">
const titleList = [
	'Толщина стенки:',
	'Марка стали:',
	'ГОСТ/ТУ:',
	'd:',
	'Толщина изоляции:',
	'd оболочки:',
]
const cardList = [
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
</script>

<template>
	<div class="p-c-catalog">
		<div class="container">
			<BorderLine
				class="p-c-catalog__container"
				position="top"
				design="primary"
			>
				<CustomTitle class="p-c-catalog__title" tag="h2" mode="xl"
					>Другие варианты трубы ПНД SDR 11 ПИКПАЙП II</CustomTitle
				>
				<pipes-list :title-list="titleList" :card-list="cardList" />
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
