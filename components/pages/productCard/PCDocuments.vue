<script setup lang="ts">
import type { DocumentSlideProps } from '~/components/slides/DocumentSlide.vue'

interface PCDocumentsProps {
	slides?: DocumentSlideProps[]
}

const fallbackSlides: DocumentSlideProps[] = [
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

const props = defineProps<PCDocumentsProps>()

const resolvedSlides = computed(() => {
	return props.slides && props.slides.length > 0 ? props.slides : fallbackSlides
})
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
				<document-slider :slides="resolvedSlides" mode="wide" />
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
