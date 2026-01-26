<script setup lang="ts">
import type { ButtonProps } from '../ui/base/Button.vue'
import type { IconProps } from '../ui/base/Icon.vue'

interface LabCardProps {
	icon: IconProps
	title: string
	button: ButtonProps
}
const props = defineProps<LabCardProps>()
</script>

<template>
	<div class="lab-card">
		<div class="lab-card__top">
			<Icon class="lab-card__top--icon" v-bind="props.icon" />
			<span class="lab-card__top--desc">{{ props.title }}</span>
		</div>
		<Button class="lab-card__btn" v-bind="props.button" />
	</div>
</template>

<style lang="scss">
.lab-card {
	padding: 25px 0;
	border-bottom: 1px solid var(--graphic-main);
	border-top: 1px solid var(--graphic-main);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 50px;
	@include ultrahd {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	&__top {
		display: flex;
		align-items: center;
		gap: 22px;
		&--icon {
			width: 70px;
			height: 70px;
		}
		&--desc {
			font-size: 13px;
			line-height: 140%;
			color: var(--black-color);
		}
	}
	&__btn {
		width: 210px;
		max-width: 210px;
		height: 48px;
		@include ultrahd {
			flex: 0 0 210px;
		}
	}
}
</style>
