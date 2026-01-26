<script setup lang="ts">
interface EquipmentCardProps {
	title: string
	href: string
}
const { title, href } = defineProps<EquipmentCardProps>()
</script>

<template>
	<a class="equipment-card" :href="href">
		<div class="equipment-card__content">
			<Text
				class="equipment-card__content--title"
				size="xxl"
				weight="medium"
				line-height="sm"
				design="primary"
				:uppercase="true"
				>{{ title }}</Text
			>
			<Icon
				class="equipment-card__content--icon"
				name="base-arrow"
				mode="next"
			/>
		</div>
		<div class="equipment-card__icon">
			<Icon
				class="equipment-card__icon--item"
				name="extended"
				:is-sprite="false"
			/>
		</div>
	</a>
</template>

<style lang="scss">
.equipment-card {
	display: flex;
	justify-content: center;
	align-items: flex-end;

	position: relative;
	padding: 24px;
	border: 1px solid #b8cce1;
	border-radius: 12px;
	height: 240px;
	background: var(--primary-bg);
	&:hover {
		.equipment-card__icon {
			opacity: 1;
			user-select: auto;
		}
	}
	&__content {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-sm);
		&--title {
			margin-top: 1px;
		}
		&--icon {
			color: var(--primary-color);
		}
	}
	&__icon {
		position: absolute;
		top: 82px;
		left: 50%;
		transform: translateX(-50%);

		pointer-events: none;
		user-select: none;
		opacity: 0;
		transition: opacity 0.2s ease-in;
		&--item {
			width: 52px;
			height: 52px;
		}
	}
}
</style>
