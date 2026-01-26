<script setup lang="ts">
import type { ImageProps } from '../ui/base/Image.vue'

interface EquipmentNewCardProps {
	title: string
	image: ImageProps
}
const { title, image } = defineProps<EquipmentNewCardProps>()
</script>

<template>
	<div class="equipment-new-card">
		<div class="equipment-new-card__img">
			<Image
				class="equipment-new-card__img--item"
				:src="image.src"
				:alt="image.alt"
			/>
		</div>
		<Text
			class="equipment-new-card__title"
			weight="medium"
			size="xxl"
			line-height="sm"
			letter-spacing="sm"
			design="primary"
			:uppercase="true"
			>{{ title }}</Text
		>
	</div>
</template>

<style lang="scss">
.equipment-new-card {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	gap: var(--space-sm);
	&__img {
		width: 100%;
		border-radius: 12px;
		overflow: hidden;
		&--item {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}
</style>
