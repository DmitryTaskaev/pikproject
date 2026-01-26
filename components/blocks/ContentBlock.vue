<script setup lang="ts">
import { type ButtonProps } from '../ui/base/Button.vue'
interface ContentBlockProps {
	title: string
	texts?: string[]
	button?: ButtonProps
}

const { button, title, texts } = defineProps<ContentBlockProps>()
</script>

<template>
	<div class="content-block">
		<div class="container">
			<CustomTitle tag="h1">{{ title }}</CustomTitle>
			<div class="content-block__body">
				<slot>
					<Text v-for="(item, index) in texts" :key="index">{{ item }}</Text>
				</slot>
				<slot name="form" />
			</div>
			<Button v-if="button" v-bind="button" />
		</div>
	</div>
</template>

<style lang="scss">
.content-block {
	padding-top: var(--space-md);

	@include ultrahd {
		padding-top: var(--space-xl);
	}

	.container {
		display: grid;
		grid-template-columns: 100%;
		row-gap: var(--space-xl);
		margin-bottom: var(--space-section-sm);

		@include tablet {
			grid-template-columns: repeat(2, calc((100% - 1 * var(--space-sm)) / 2));
			column-gap: var(--space-sm);
			margin-bottom: var(--space-section-lg);
		}

		@include ultrahd {
			padding-bottom: var(--space-xl);

			.title {
				max-width: 570px;
			}
		}
	}

	&__body {
		display: flex;
		flex-direction: column;
		row-gap: var(--space-sm);
		align-items: flex-start;
	}
}
</style>
