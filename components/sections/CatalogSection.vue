<script setup lang="ts">
import type { PipeCardProps } from '../cards/PipeCard.vue'

interface CatalogSectionProps {
	title: string[]
	slides: PipeCardProps[][]
	titleList: string[]
}

const { title, slides, titleList } = defineProps<CatalogSectionProps>()
</script>

<template>
	<div class="catalog-section-wrap">
		<div class="container">
			<BorderLine class="catalog-section" position="top" design="primary">
				<div class="catalog-section__title">
					<custom-title class="catalog-section__title--item" mode="xl">
						<span v-for="(value, idx) in title" :key="idx">{{ value }}</span>
					</custom-title>
				</div>
				<PipesList :title-list="titleList" :slides="slides" />
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.catalog-section-wrap {
	margin-bottom: 160px;
}
.catalog-section {
	padding-top: var(--space-md);
	@include ultrahd {
		padding-top: 50px;
	}
	&__title {
		margin-bottom: 80px;
		&--item {
			line-height: 120%;
			span {
				@include desktop {
					display: block;
				}
			}
		}
	}
}
</style>
