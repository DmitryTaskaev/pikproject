<script setup lang="ts">
import type { ImageProps } from '../ui/base/Image.vue'

export interface NewsCardProps {
	image: ImageProps
	date: string
	title: string
	text: string
	href: string
}

const props = defineProps<NewsCardProps>()
</script>

<template>
	<div class="news-card">
		<NuxtLink class="news-card__link" :to="props.href"></NuxtLink>
		<div class="news-card__top">
			<border-line position="bottom" design="main">
				<div class="news-card__img">
					<Image class="news-card__img--item" v-bind="props.image" />
				</div>
			</border-line>
			<Text class="news-card__date" line-height="sm">{{ props.date }}</Text>
		</div>
		<div class="news-card__content">
			<CustomTitle class="news-card__title" tag="p" mode="sm">{{
				title
			}}</CustomTitle>
			<Text class="news-card__desc">{{ text }}</Text>
		</div>
	</div>
</template>

<style lang="scss">
.news-card {
	position: relative;
	width: 100%;
	max-width: 100%;
	flex: 0 0 100%;
	&__link {
		position: absolute;
		z-index: 10;
		cursor: pointer;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	&__top {
		margin-bottom: var(--space-lg);
	}
	&__img {
		position: relative;
		padding-bottom: 75%;
		border-radius: 5px;
		overflow: hidden;
		&--item {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: auto;
		}
	}
	&__date {
		margin-top: 14px;
		font-size: 14px;
		@include ultrahd {
			font-size: 15px;
		}
	}
	&__content {
		width: 286px;
		max-width: 286px;
		flex: 0 0 286px;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	&__desc {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&__title {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.border-line-wrap {
		padding-bottom: var(--space-sm);
	}
}
</style>
