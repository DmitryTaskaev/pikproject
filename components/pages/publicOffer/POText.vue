<script setup lang="ts">
interface POItemProps {
	currentTitle: string
	description: string
}
interface POTextProps {
	title: string
	list: POItemProps[]
}

const { title, list } = defineProps<POTextProps>()
</script>

<template>
	<div class="p-o-text">
		<div class="p-o-text__title">
			<Text
				class="p-o-text__title--item"
				tag="h2"
				line-height="lg"
				weight="medium"
				letter-spacing="sm"
				>{{ title }}</Text
			>
		</div>
		<div class="p-o-text__list">
			<span class="p-o-text__item" v-for="(item, idx) in list" :key="idx">
				<Text
					class="p-o-text__item--title"
					tag="span"
					size="lg"
					weight="semi-bold"
					letter-spacing="sm"
					line-height="lg"
					>{{ item.currentTitle }}&nbsp;</Text
				>
				<Text
					class="p-o-text__item--desc"
					tag="span"
					size="lg"
					letter-spacing="sm"
					line-height="lg"
					>{{ item.description }}</Text
				>
			</span>
		</div>
	</div>
</template>

<style lang="scss">
.p-o-text {
	&__title {
		margin-bottom: var(--space-md);
		&--item {
			font-size: 18px;
			@include ultrahd {
				font-size: 20px;
			}
		}
	}
	&__list {
		max-width: 625px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-md);
	}
	&__item {
		&--title {
		}
		&--desc {
		}
	}
}
</style>
