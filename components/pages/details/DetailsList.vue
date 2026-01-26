<script setup lang="ts">
import type { ButtonProps } from '../../ui/base/Button.vue'

interface DetailsItem {
	label: string
	value: string
	nowrap?: boolean
	href?: string
}

interface DetailsListProps {
	items?: DetailsItem[]
	footerTitle?: string
	footerButtonText?: string
	footerButtonHref?: string
}

const props = defineProps<DetailsListProps>()

const listItems = computed(() => props.items ?? [])
const footerTitle = computed(() => props.footerTitle || 'Карточка предприятия')
const footerButton = computed<ButtonProps>(() => ({
	text: props.footerButtonText || 'Смотреть',
	size: 'sm',
	href: props.footerButtonHref || '#',
}))
</script>

<template>
	<div class="details-list">
		<div class="container">
			<div class="details-list__body">
				<div
					v-for="(item, index) in listItems"
					:key="index"
					class="details-list__item"
					:class="{ 'details-list__item_nowrap': item.nowrap }"
				>
					<Text class="details-list__item--label" design="black">{{
						item.label
					}}</Text>
					<Text
						:href="item.href"
						class="details-list__item--value"
						design="black"
						>{{ item.value }}</Text
					>
				</div>
			</div>
			<div class="details-list__footer">
				<LabCard
					:icon="{ name: 'document', isSprite: false }"
					:button="footerButton"
					:title="footerTitle"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.details-list {
	margin-bottom: var(--space-xl);
	padding-bottom: var(--space-sm);

	.container {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--space-section-sm);

		@include tablet {
			gap: var(--space-xl);
		}

		@include ultrahd {
			display: grid;
			grid-template-columns: repeat(2, calc((100% - 1 * var(--space-sm)) / 2));
			column-gap: var(--space-sm);
		}
	}

	&__body {
		width: 100%;
		overflow-x: auto;
		padding-bottom: 35px;

		@include ultrahd {
			grid-column: 2/3;
		}

		&::-webkit-scrollbar {
			width: 100%;
			background: #cfd9ef;
			height: 4px;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-track {
			background: #cfd9ef;
			border-radius: 2px;
		}

		&::-webkit-scrollbar-thumb {
			background: #11437a;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #0a2c5a;
		}

		&::-webkit-scrollbar-corner {
			background: #cfd9ef;
		}
	}

	&__item {
		display: grid;
		column-gap: 16px;
		grid-template-columns: 250px 400px;
		width: 666px;

		padding: 15px 20px 15px 0;
		border-top: 1px solid var(--graphic-main);

		@include tablet {
			grid-template-columns: 290px 1fr;
			width: 100%;
			padding: 15px 0;
		}

		&:first-child {
			border-top: none;
		}

		&_nowrap {
			display: flex;
			flex-direction: column;
			row-gap: 16px;
			width: 100%;

			@include tablet {
				display: grid;
				grid-template-columns: 290px 1fr;
				width: 100%;
				padding: 15px 0;
			}

			.details-list__item--label {
				color: #0000008a;

				@include tablet {
					color: var(--black-color);
				}
			}
		}
	}

	&__footer {
		@include ultrahd {
			grid-column: 2/3;
		}
	}
}
</style>
