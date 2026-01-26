<script setup lang="ts">
interface FooterListProps {
	title: string
	href: string
	list?: { title: string; href: string }[]
}

const props = defineProps<FooterListProps>()

const isComplex = props.list ? true : false
</script>

<template>
	<div class="footer-list" :class="{ 'footer-list_complex': isComplex }">
		<div class="footer-list__top">
			<Text
				class="footer-list__title"
				tag="a"
				:href="props.href"
				:uppercase="true"
				size="sm"
				line-height="xl"
				design="accent"
				>{{ props.title }}</Text
			>
		</div>
		<ul v-if="isComplex" class="footer-list__list">
			<li v-for="(item, index) in props.list" :key="index">
				<Text
					class="footer-list__list--link"
					tag="a"
					design="accent"
					:href="item.href"
					:uppercase="true"
					>{{ item.title }}</Text
				>
			</li>
		</ul>
	</div>
</template>

<style lang="scss">
.footer-list {
	display: flex;
	flex-direction: column;
	gap: calc(1.5 * var(--space-xs));
	margin-bottom: var(--space-xs);
	&__title {
		display: inline-block;
		transition: border 0.2s ease-in;
		border-bottom: 1px solid transparent;
		&:hover,
		&:active {
			border-bottom: 1px solid currentColor;
		}
	}
	&__list {
		padding-left: calc(0.8 * var(--space-xs));
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		li {
			display: flex;
		}
		&--link {
			font-size: 10px;
			line-height: 120%;
			transition: border 0.2s ease-in;
			border-bottom: 1px solid transparent;
			&:hover,
			&:active {
				border-bottom: 1px solid currentColor;
			}
		}
	}

	&_complex {
		margin-bottom: var(--space-sm);
	}
}
</style>
