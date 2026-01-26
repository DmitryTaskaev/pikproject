<script setup lang="ts">
import type { ImageProps } from '../ui/base/Image.vue'

interface TestCardProps {
	title: string
	image?: ImageProps
}
const { title, image } = defineProps<TestCardProps>()
</script>

<template>
	<div class="test-card">
		<div class="test-card__img">
			<Image
				v-if="image"
				class="test-card__img--item"
				v-bind="image"
			/>
		</div>
		<Text class="test-card__title" size="sm" design="tertiary">{{
			title
		}}</Text>
	</div>
</template>

<style lang="scss">
.test-card {
	display: flex;
	flex-direction: column;
	gap: var(--space-sm);
	&__img {
		height: 258px;
		border-radius: 12px;
		background: var(--primary-bg);
		overflow: hidden;

		&--item {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}
	&__title {
	}
}
</style>
