<script setup lang="ts">
interface DecorativeWrapProps {
	title?: string
}

const props = defineProps<DecorativeWrapProps>()
</script>

<template>
	<div class="decorative-wrap">
		<div class="decorative-wrap__top">
			<Text
				v-if="props.title"
				class="decorative-wrap__title"
				size="xs"
				line-height="xs"
				design="accent"
				:uppercase="true"
				>{{ props.title }}</Text
			>
		</div>
		<slot />
	</div>
</template>

<style lang="scss">
.decorative-wrap {
	position: relative;
	padding: 54px 0 var(--space-sm) var(--space-sm);
	border-radius: 12px;
	border: 1px solid #b8cce1;
	background: var(--primary-bg);
	&__top {
		position: absolute;
		top: -1px;
		left: -1px;
		width: calc(100% + 2px);
		height: 35px;
		border-radius: 12px 12px 0 0;
		background: var(--main-bg);
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
}
</style>
