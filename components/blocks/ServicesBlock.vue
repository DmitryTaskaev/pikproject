<script setup lang="ts">
import type { ListItem } from '../ServiceItem.vue'

interface ServicesBlockProps {
	service: {
		title: string
		href: string
	}
	listItems: ListItem[]
}

const { service, listItems } = defineProps<ServicesBlockProps>()
</script>

<template>
	<div class="services-block-wrap">
		<div class="container">
			<BorderLine class="services-block" position="top" design="primary">
				<div class="services-block__top">
					<custom-title class="services-block__title" mode="xl">
						Услуги
					</custom-title>
					<Text
						class="services-block__desc"
						size="xxl"
						line-height="sm"
						design="primary"
						tag="a"
						:href="service.href"
						>{{ service.title }}</Text
					>
				</div>
				<div class="services-block__content">
					<div
						v-for="(item, idx) in listItems"
						:key="idx"
						class="services-block__item"
					>
						<service-item :is-big-btn="true" :list-item="item" />
					</div>
				</div>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.services-block-wrap {
	margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: var(--space-section-md);
	}
}
.services-block {
	padding-top: var(--space-md);
	@include ultrahd {
		padding-top: 50px;
	}
	&__top {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: var(--space-md);
		gap: var(--space-xl);
		@include ultrahd {
			margin-bottom: var(--space-xl);
			gap: 80px;
		}
	}
	&__title {
	}
	&__content {
	}
	&__item {
		position: relative;
		padding: 27px 0 90px;
		border-top: 1px solid var(--graphic-main);
		@include desktop {
			padding: 27px 0;
		}
		&:last-child {
			border-bottom: 1px solid var(--graphic-main);
		}
	}
}
</style>
