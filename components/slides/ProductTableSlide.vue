<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ProductTableCardProps } from '../cards/ProductTableCard.vue'

interface ProductTableSlideProps {
	slide: ProductTableCardProps[]
	captionHeight?: number
	rowHeights?: number[]
}

const props = defineProps<ProductTableSlideProps>()
const emit = defineEmits<{
	(e: 'caption-height-change', value: number): void
	(e: 'row-heights-change', value: number[]): void
}>()
const rootRef = ref<HTMLElement | null>(null)
const captionHeight = ref(205)

let resizeObserver: ResizeObserver | null = null

const measureCaptionHeight = () => {
	if (!rootRef.value) return
	const sharedContainer =
		rootRef.value.closest<HTMLElement>('.table-section__content--item')
	const captions = Array.from(
		rootRef.value.querySelectorAll<HTMLElement>('.product-table-card__caption-inner'),
	)
	const tableCaption = sharedContainer?.querySelector<HTMLElement>(
		'.table-feature__caption',
	)
	const leftRows = Array.from(
		sharedContainer?.querySelectorAll<HTMLElement>('.table-feature__wrap') || [],
	)
	const cards = Array.from(
		rootRef.value.querySelectorAll<HTMLElement>('.product-table-card'),
	)

	if (captions.length === 0) {
		captionHeight.value = 205
		emit('caption-height-change', 205)
		emit('row-heights-change', Array.from({ length: 6 }, () => 122))
		return
	}
	const maxHeight = captions.reduce((max, caption) => {
		return Math.max(max, Math.ceil(caption.scrollHeight + 1))
	}, tableCaption ? Math.ceil(tableCaption.getBoundingClientRect().height) : 205)
	captionHeight.value = maxHeight
	emit('caption-height-change', maxHeight)

	const nextRowHeights = Array.from({ length: 6 }, (_, rowIndex) => {
		const leftHeight = Math.ceil(leftRows[rowIndex]?.getBoundingClientRect().height || 0)
		const maxCardHeight = cards.reduce((max, card) => {
			const row = card.querySelectorAll<HTMLElement>('.product-table-card__wrap')[rowIndex]
			if (!row) return max
			return Math.max(max, Math.ceil(row.getBoundingClientRect().height))
		}, 0)
		return Math.max(122, leftHeight, maxCardHeight)
	})
	emit('row-heights-change', nextRowHeights)
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
		:style="{
			'--product-table-caption-height': `${Math.max(captionHeight, props.captionHeight || 205)}px`,
		}"
	>
		<div
			v-for="(card, idx) in props.slide"
			:key="idx"
			class="product-table-slide__item"
		>
			<product-table-card
				v-bind="card"
				:caption-height="Math.max(captionHeight, props.captionHeight || 205)"
				:row-heights="props.rowHeights"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.product-table-slide {
	display: flex;
	min-width: 0;
	&__item {
		flex: 1 1 0;
		min-width: 0;
		.product-table-card {
			width: 100%;
			min-width: 0;
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
