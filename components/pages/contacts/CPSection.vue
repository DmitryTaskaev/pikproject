<script setup lang="ts">
interface contactBase {
	title: string
	href: string
}
export interface CPSectionListItem {
	title: string
	address: string[]
	schedule: string
	email: contactBase
	phone: contactBase
}
interface CPSectionProps {
	title: string
	list: CPSectionListItem[]
}

const { title, list } = defineProps<CPSectionProps>()
</script>

<template>
	<div class="c-p-section-wrap">
		<div class="container">
			<BorderLine class="c-p-section" position="top" design="primary">
				<section-wrapper :title="title">
					<div class="c-p-section__list">
						<div
							v-for="(item, index) in list"
							:key="index"
							class="c-p-section__item"
						>
							<ContactCard v-bind="item" />
						</div>
					</div>
					<slot />
					<!-- map -->
				</section-wrapper>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.c-p-section-wrap {
	margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: calc(1.6 * var(--space-section-sm));
	}
}
.c-p-section {
	padding-top: var(--space-md);
	@include ultrahd {
		padding-top: var(--space-xl);
	}
	&__list {
		margin-bottom: var(--space-xl);
		display: flex;
		flex-direction: column;
		@include ultrahd {
			flex-direction: row;
			gap: var(--space-xl);
			margin-bottom: 80px;
		}
	}
	&__item {
		max-width: 530px;
		padding: var(--space-xl) 0;
		border-bottom: 1px solid #dcdcd7;
		&:last-child {
			border-bottom: none;
			padding-bottom: 0;
		}
		@include ultrahd {
			padding: 0;
			border-bottom: none;
		}
	}
	&__map {
		width: 100%;
		height: 432px;
		@include tablet {
		}
		@include ultrahd {
			height: 663px;
		}
	}
}
</style>
