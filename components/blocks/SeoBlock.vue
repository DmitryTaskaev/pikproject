<script setup lang="ts">
interface SeoBlockProps {
	title?: string
	description?: string
}

const props = withDefaults(defineProps<SeoBlockProps>(), {
	title: 'СЕО',
	description:
		'CEO Блок. Трубный завод ПИК — один из ведущих российских производителей трубопроводных',
})
</script>

<template>
	<div class="seo-block">
		<div class="container">
			<BorderLine position="top" design="primary">
				<div class="seo-block__container">
					<CustomTitle class="seo-block__title">{{ props.title }}</CustomTitle>
					<Text class="seo-block__desc">{{ props.description }}</Text>
				</div>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.seo-block {
	margin-bottom: var(--space-section-sm);
	&__container {
		display: grid;
		grid-template-columns: 1fr;
		row-gap: var(--space-xl);
		padding-top: var(--space-md);
		@include tablet {
			grid-template-columns: repeat(2, 1fr);
			column-gap: var(--space-sm);
		}
		@include ultrahd {
			column-gap: var(--space-xl);
			padding-top: var(--space-xl);
		}
	}
	&__title {
	}
	&__desc {
		@include ultrahd {
			padding-top: var(--space-md);
		}
	}
}
</style>
