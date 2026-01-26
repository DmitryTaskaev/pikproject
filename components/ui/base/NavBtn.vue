<script setup lang="ts">
interface NavBtnProps {
	text: string
	href: string
	icon?: boolean
}
const props = defineProps<NavBtnProps>()
</script>

<template>
	<Text
		class="nav-btn"
		tag="a"
		size="xs"
		line-height="xs"
		design="accent"
		:uppercase="true"
		:href="props.href"
	>
		{{ props.text }}
		<Icon v-if="props.icon" name="base-arrow" />
	</Text>
</template>

<style lang="scss">
.nav-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-xs);
	background: var(--main-bg);
	width: 100%;
	height: 44px;
	border-radius: 5px;
	.icon {
		margin-top: -1px;
		transform: rotate(-90deg);
		width: 12px;
		height: 6px;
		transition: transform 0.3s ease;
	}
	&:hover {
		.icon {
			animation: bounce-arrow-right 1s linear infinite;
		}
	}
}
</style>
