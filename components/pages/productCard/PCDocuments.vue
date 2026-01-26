<script setup lang="ts">
const slides = [
	{
		text: [
			'Методическое пособие ',
			'по проектированию труб AQUASAFE ',
			'из ПЭ',
		],
		size: '10',
	},
	{
		text: [
			'Методическое пособие ',
			'по проектированию труб AQUASAFE ',
			'из ПЭ',
		],
		size: '10',
	},
	{
		text: [
			'Методическое пособие ',
			'по проектированию труб AQUASAFE ',
			'из ПЭ',
		],
		size: '10',
	},
	{
		text: [
			'Методическое пособие ',
			'по проектированию труб AQUASAFE ',
			'из ПЭ',
		],
		size: '10',
	},
	{
		text: [
			'Методическое пособие ',
			'по проектированию труб AQUASAFE ',
			'из ПЭ',
		],
		size: '10',
	},
	{
		text: [
			'Методическое пособие ',
			'по проектированию труб AQUASAFE ',
			'из ПЭ',
		],
		size: '10',
	},
]
</script>

<template>
	<div class="p-c-documents">
		<div class="container">
			<BorderLine
				class="p-c-documents__container"
				position="top"
				design="primary"
			>
				<CustomTitle class="p-c-documents__title" tag="h2" mode="xl"
					>Документы для скачивания</CustomTitle
				>
				<document-slider :slides="slides" mode="wide" />
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.p-c-documents {
	&__container {
		padding-top: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		margin-bottom: var(--space-section-sm);
		@include ultrahd {
			padding-top: 50px;
			gap: calc(2 * var(--space-lg));
			margin-bottom: var(--space-section-md);
		}
	}
	&__title {
	}
}
</style>
