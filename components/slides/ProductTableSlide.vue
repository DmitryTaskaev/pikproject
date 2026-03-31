<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ProductTableCardProps } from '../cards/ProductTableCard.vue'

interface ProductTableSlideProps {
	slide: ProductTableCardProps[]
}

const props = defineProps<ProductTableSlideProps>()
const rootRef = ref<HTMLElement | null>(null)
const captionHeight = ref(205)

let resizeObserver: ResizeObserver | null = null

const measureCaptionHeight = () => {
	if (!rootRef.value) return
	const captions = Array.from(
		rootRef.value.querySelectorAll<HTMLElement>('.product-table-card__caption'),
	)
	if (captions.length === 0) {
		captionHeight.value = 205
		rootRef.value.parentElement?.style.setProperty(
			'--product-table-caption-height',
			'205px',
		)
		return
	}
	const maxHeight = captions.reduce((max, caption) => {
		return Math.max(max, Math.ceil(caption.getBoundingClientRect().height))
	}, 205)
	captionHeight.value = maxHeight
	rootRef.value.parentElement?.style.setProperty(
		'--product-table-caption-height',
		`${maxHeight}px`,
	)
}

const scheduleMeasure = () => {
	requestAnimationFrame(() => {
		measureCaptionHeight()
	})
}

onMounted(async () => {
	await nextTick()
	scheduleMeasure()
	window.addEventListener('resize', scheduleMeasure)
	if (rootRef.value && typeof ResizeObserver !== 'undefined') {
		resizeObserver = new ResizeObserver(() => {
			scheduleMeasure()
		})
		resizeObserver.observe(rootRef.value)
	}
})

watch(
	() => props.slide,
	async () => {
		await nextTick()
		scheduleMeasure()
	},
	{ deep: true },
)

onBeforeUnmount(() => {
	window.removeEventListener('resize', scheduleMeasure)
	resizeObserver?.disconnect()
})
</script>

<template>
	<div
		ref="rootRef"
		class="product-table-slide"
		:style="{ '--product-table-caption-height': `${captionHeight}px` }"
	>
		<div
			v-for="(card, idx) in props.slide"
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
		flex: 1 1 0;
		min-width: 0;
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
