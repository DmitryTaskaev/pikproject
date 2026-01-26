<script setup lang="ts">
import type { ProductTableCardProps } from '../cards/ProductTableCard.vue'

interface ProductTableSlideProps {
	slide: ProductTableCardProps[]
}

const { slide } = defineProps<ProductTableSlideProps>()
</script>

<template>
	<div class="product-table-slide">
		<div
			v-for="(card, idx) in slide"
			:key="idx"
			class="product-table-slide__item"
		>
			<product-table-card v-bind="card" />
		</div>
	</div>
</template>

<style lang="scss">
.product-table-slide {
	display: flex;
	&__item {
		.product-table-card {
			&__wrap,
			&__caption {
				border: 1px solid var(--graphic-main);
				border-left: none;
				border-bottom: none;
			}
			&__caption {
				border-top: none;
			}
		}
		&:last-child {
			.product-table-card {
				&__wrap,
				&__caption {
					border-right: none;
				}
			}
		}
	}
}
</style>
