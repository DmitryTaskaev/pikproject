<script setup lang="ts">
interface NavLinkProps {
	text: string
	href: string
	icon?: boolean
}
const props = defineProps<NavLinkProps>()
</script>

<template>
	<Text
		class="nav-link"
		tag="a"
		size="xs"
		line-height="xs"
		:uppercase="true"
		:href="props.href"
	>
		{{ props.text }}
		<Icon v-if="props.icon" name="base-arrow" />
	</Text>
</template>

<style lang="scss">
.nav-link {
	display: flex;
	align-items: center;
	gap: var(--space-xs);
	color: var(--main-bg);
	// transition: border 0.2s ease-in;
	// border-bottom: 1px solid transparent;
	// &:hover,
	// &:active {
	// 	border-bottom: 1px solid currentColor;
	// }
	.icon {
		margin-top: -1px;
		transform: rotate(-90deg);
		width: 12px;
		height: 6px;
	}
	&:hover {
		.icon {
			animation: bounce-arrow-right 1s linear infinite;
		}
	}
}
</style>
