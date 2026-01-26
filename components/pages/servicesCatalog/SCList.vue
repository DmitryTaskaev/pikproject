<script setup lang="ts">
import type { ListItem } from '~/components/ServiceItem.vue'

interface ServicesCatalogSection {
	title: string
	href: string
	list: ListItem[]
}

interface ServicesCatalogProps {
	list: ServicesCatalogSection[]
}

const props = defineProps<ServicesCatalogProps>()
</script>

<template>
	<div class="s-c-list-wrap">
		<div class="container">
			<div class="s-c-list">
				<div
					v-for="(item, index) in props.list"
					:key="`i-${index}`"
					class="s-c-list-block"
				>
					<div class="s-c-list-block__top">
						<CustomTitle class="s-c-list-block__title" mode="xl">{{
							item.title
						}}</CustomTitle>
						<Button
							class="s-c-list-block__btn"
							:href="item.href"
							text="Подробнее"
							size="sm"
						/>
					</div>
					<div class="s-c-list-block__content">
						<div
							v-for="(listItem, idx) in item.list"
							:key="`i-i-${idx}`"
							class="s-c-list-item"
						>
							<ServiceItem :list-item="listItem" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.s-c-list-wrap {
	padding-top: var(--space-section-sm);
	margin-bottom: 200px;
}
.s-c-list {
	display: flex;
	flex-direction: column;
	gap: var(--space-section-md);
	&-block {
		&__top {
			margin-bottom: var(--space-md);
			display: flex;
			flex-direction: column;
			gap: var(--space-md);
			align-items: flex-start;
			@include tablet {
				align-items: center;
				justify-content: space-between;
				flex-direction: row;
			}
			@include desktop {
				margin-bottom: var(--space-xl);
			}
		}
		&__title {
		}
		&__btn {
			flex: 0 0 auto;
		}
		&__content {
		}
	}
	&-item {
		position: relative;
		padding: 25px 0 90px;
		border-top: 1px solid var(--graphic-main);
		@include desktop {
			padding: 10px 0 10px;
		}
		&:last-child {
			border-bottom: 1px solid var(--graphic-main);
		}
	}
}
</style>
