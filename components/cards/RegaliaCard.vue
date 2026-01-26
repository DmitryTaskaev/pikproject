<script setup lang="ts">
import type { ImageProps } from '../ui/base/Image.vue'

export interface RegaliaCardProps {
	image: ImageProps
	title: string[]
	text: string[]
}
const props = defineProps<RegaliaCardProps>()
</script>

<template>
	<BorderLine class="regalia-card" position="left" design="main">
		<div class="regalia-card__img">
			<Image class="regalia-card__img--item" v-bind="props.image" />
		</div>
		<div class="regalia-card__content">
			<span class="regalia-card__title">
				<Text
					v-for="(item, index) in props.title"
					:key="index"
					class="regalia-card__title--item"
					tag="span"
					weight="medium"
					design="primary"
					line-height="xs"
					:uppercase="true"
				>
					{{ item }}<br />
				</Text>
			</span>
			<span class="regalia-card__desc">
				<Text
					v-for="(item, index) in props.text"
					:key="index"
					class="regalia-card__desc--item"
					tag="span"
					design="primary"
					line-height="sm"
					size="sm"
				>
					{{ item }}<br />
				</Text>
			</span>
		</div>
	</BorderLine>
</template>

<style lang="scss">
.regalia-card {
	padding-left: var(--space-sm);
	display: flex;
	flex-direction: column;
	gap: 26px;
	&__img {
		&--item {
			height: 68px;
			width: auto;
		}
	}
	&__content {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	&__title {
		&--item {
			font-size: 16px;
			@include ultrahd {
				font-size: 18px;
			}
		}
	}
	&__desc {
		&--item {
		}
	}
}
</style>
