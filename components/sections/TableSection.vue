<script setup lang="ts">
import type { ProductTableCardProps } from '../cards/ProductTableCard.vue'

interface TableSectionProps {
	title: string
	slides: ProductTableCardProps[][]
	titles?: string[]
	dropdowns?: Array<string[] | null>
}

const btnText = ref('Показать больше')
const isBtnActive = ref(false)

const { title, slides, titles, dropdowns } = defineProps<TableSectionProps>()
const resolvedTitles = computed(() => {
	const list = titles || []
	const base =
		list.length > 0
			? list
			: [
					'Назначение изделия:',
					'ГОСТ изделия:',
					'ТУ изделия:',
					'Материал изделия:',
					'Диаметр изделия:',
					'SDR изделия:',
				]
	if (base.length >= 6) return base.slice(0, 6)
	return base.concat(Array(6 - base.length).fill(''))
})

function handleBtnClick() {
	if (isBtnActive.value) {
		btnText.value = 'Показать больше'
		isBtnActive.value = false
	} else {
		btnText.value = 'Скрыть'
		isBtnActive.value = true
	}
}
</script>

<template>
	<section class="table-section-wrap">
		<div class="container">
			<BorderLine
				class="table-section"
				:class="{ 'table-section_active': isBtnActive }"
				position="top"
				design="primary"
			>
				<div class="table-section__title">
					<custom-title class="table-section__title--item" mode="xl">{{
						title
					}}</custom-title>
				</div>
				<div class="table-section__content-wrap">
					<div class="table-section__content">
						<div class="table-section__content--item">
							<TableFeature :titles="resolvedTitles" :dropdowns="dropdowns" />
							<product-table-slider :slides="slides" />
						</div>
					</div>
					<div class="table-section__content-btn">
						<div
							class="table-section__content-btn--item"
							:class="{
								'table-section__content-btn--item_active': isBtnActive,
							}"
							@click="handleBtnClick"
						>
							{{ btnText }}
							<Icon name="base-arrow" />
						</div>
					</div>
				</div>
			</BorderLine>
		</div>
	</section>
</template>

<style lang="scss">
.table-section {
	padding-top: var(--space-md);
	margin-bottom: var(--space-section-md);
	@include ultrahd {
		padding-top: 50px;
		margin-bottom: 180px;
	}
	&__title {
		margin-bottom: var(--space-xl);
		@include ultrahd {
			margin-bottom: 80px;
		}
	}
	&__content-wrap {
	}
	&__content-btn {
		position: absolute;
		bottom: calc(-1 * var(--space-xl));
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2;
		@include ultrahd {
			position: relative;
			bottom: 0;
			height: 64px;
			border: 1px solid var(--graphic-main);
			border-top: none;
			border-bottom-left-radius: 12px;
			border-bottom-right-radius: 12px;
		}
		&--item {
			cursor: pointer;
			font-size: 14px;
			line-height: 157%;
			letter-spacing: -0.01em;
			display: flex;
			align-items: center;
			gap: var(--space-xs);
			color: #2e4169;
			.icon {
				transition: all 0.2s ease;
				fill: #0e41ad;
				width: 14px;
				height: 8px;
			}
			&_active {
				.icon {
					transform: rotate(180deg);
				}
			}
		}
	}
	&__content {
		display: flex;

		overflow-x: auto;
		padding-bottom: 34px;
		@include ultrahd {
			display: block;
			padding-bottom: 0;
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
		@include ultrahd {
			border: 1px solid var(--graphic-main);
			overflow-x: auto;
			border-radius: 12px 12px 0 0;
			width: 100%;
		}
		&--item {
			flex: 0 0 1340px;

			display: flex;
			position: relative;

			border: 1px solid var(--graphic-main);
			border-radius: 12px;
			overflow-x: auto;
			width: 1340px;
			@include ultrahd {
				flex: none;
				width: 100%;
				border: none;
				border-radius: 0;
			}
		}
	}
	&_active {
		.product-table-card {
			grid-template-rows: 205px repeat(4, 122px) repeat(2, 141px);
		}
		.table-feature {
			grid-template-rows: 205px repeat(4, 122px) repeat(2, 141px);
		}
	}
}
</style>
