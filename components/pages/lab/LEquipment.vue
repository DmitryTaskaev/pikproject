<script setup lang="ts">
import type { ImageProps } from '~/components/ui/base/Image.vue'

interface EquipmentCardItem {
	title: string
	image: ImageProps
}

interface EquipmentProps {
	title?: string
	list?: EquipmentCardItem[]
}

const props = withDefaults(defineProps<EquipmentProps>(), {
	title: 'Парк оборудования',
	list: () => [
		{
			title: 'Оборудование',
			image: { src: 'equipment/equipment-1', alt: 'Оборудование' },
		},
		{
			title: 'Оборудование',
			image: { src: 'equipment/equipment-2', alt: 'Оборудование' },
		},
		{
			title: 'Оборудование',
			image: { src: 'equipment/equipment-3', alt: 'Оборудование' },
		},
		{
			title: 'Оборудование',
			image: { src: 'equipment/equipment-2', alt: 'Оборудование' },
		},
		{
			title: 'Оборудование',
			image: { src: 'equipment/equipment-3', alt: 'Оборудование' },
		},
		{
			title: 'Оборудование',
			image: { src: 'equipment/equipment-1', alt: 'Оборудование' },
		},
	],
})
</script>

<template>
	<div class="l-equipment-wrap">
			<div class="container">
				<BorderLine class="l-equipment" position="top" design="primary">
					<section-wrapper :title="props.title">
						<div class="l-equipment__list">
							<!-- <EquipmentCard
							v-for="(item, index) in equipmentList"
							:key="index"
							class="l-equipment__item"
							v-bind="item"
						/> -->
						<EquipmentNewCard
							v-for="(item, index) in props.list"
							:key="index"
							class="l-equipment__item"
							v-bind="item"
						/>
					</div>
				</section-wrapper>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.l-equipment-wrap {
	margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: var(--space-section-md);
	}
}
.l-equipment {
	padding-top: var(--space-md);
	@include ultrahd {
		padding-top: var(--space-xl);
	}
	&__list {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-md);
		@include tablet {
			gap: var(--space-sm);
			grid-template-columns: repeat(2, 1fr);
		}
		@include ultrahd {
			grid-template-columns: repeat(3, 1fr);
		}
	}
}
</style>
