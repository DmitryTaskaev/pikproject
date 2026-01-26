<script setup lang="ts">
import type { IconProps } from '../ui/base/Icon.vue'

interface BenefitCardProps {
	icon: IconProps
	title: string
}
const props = defineProps<BenefitCardProps>()
</script>

<template>
	<div class="benefit-card">
		<Icon class="benefit-card__icon" v-bind="props.icon" />
		<Text
			class="benefit-card__title"
			tag="span"
			weight="medium"
			line-height="sm"
			design="primary"
			:uppercase="true"
			>{{ props.title }}</Text
		>
	</div>
</template>

<style lang="scss">
.benefit-card {
	display: flex;
	align-items: center;
	gap: var(--space-sm);
	padding: 16px 20px;
	border: 1px solid #b8cce1;
	border-radius: 12px;
	background: var(--primary-bg);
	@include ultrahd {
		padding: 26px 20px;
	}
	&__icon {
		width: 48px;
		height: 48px;
	}
	&__title {
		font-size: 16px;
		@include ultrahd {
			font-size: 18px;
		}
	}
}
</style>
