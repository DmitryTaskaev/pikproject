<script setup lang="ts">
interface FooterCardProps {
	icon: string
	title: string
}

const props = defineProps<FooterCardProps>()
</script>

<template>
	<div class="footer-card">
		<div class="footer-card__top">
			<Icon :name="props.icon" :is-sprite="false" />
			<Text
				class="footer-card__title"
				tag="span"
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
.footer-card {
	&__top {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 50px;

		.icon {
			width: 32px;
			height: 32px;
		}
	}
	&__title {
		font-size: 28px;
	}
}
</style>
