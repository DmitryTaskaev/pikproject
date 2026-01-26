<script setup lang="ts">
interface sectionWrapperProps {
	title: string
	tag?: keyof HTMLElementTagNameMap
}

const props = withDefaults(defineProps<sectionWrapperProps>(), {
	tag: 'h2',
})
</script>

<template>
	<section class="section-wrapper">
		<div class="section-wrapper__top">
			<div class="section-wrapper__top--figure"></div>
			<CustomTitle class="section-wrapper__title" mode="xs" :tag="props.tag">
				{{ props.title }}
			</CustomTitle>
		</div>
		<slot />
	</section>
</template>

<style lang="scss">
.section-wrapper {
	&__top {
		margin-bottom: var(--space-md);
		@include ultrahd {
			margin-bottom: var(--space-xl);
		}
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		&--figure {
			width: 16px;
			height: 16px;
			flex: 0 0 16px;
			max-width: 16px;
			border-radius: 4px;
			background: var(--main-bg);
		}
	}
	&__title {
		margin-top: 1px;
		// line-height: 75%;
	}
}
</style>
