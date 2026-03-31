<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ProductTableCardProps } from '../cards/ProductTableCard.vue'

interface ProductTableSlideProps {
	slide: ProductTableCardProps[]
	captionHeight?: number
}

const props = defineProps<ProductTableSlideProps>()
const emit = defineEmits<{
	(e: 'caption-height-change', value: number): void
}>()
const rootRef = ref<HTMLElement | null>(null)
const captionHeight = ref(205)

let resizeObserver: ResizeObserver | null = null

const measureCaptionHeight = () => {
	if (!rootRef.value) return
	const sharedContainer =
		rootRef.value.closest<HTMLElement>('.table-section__content--item')
	const tableFeature = sharedContainer?.querySelector<HTMLElement>('.table-feature')
	const sliderRoot = rootRef.value.closest<HTMLElement>('.product-table-slider')
	const captions = Array.from(
		rootRef.value.querySelectorAll<HTMLElement>('.product-table-card__caption-inner'),
	)
	if (captions.length === 0) {
		captionHeight.value = 205
		sharedContainer?.style.setProperty(
			'--product-table-caption-height',
			'205px',
		)
		tableFeature?.style.setProperty('--product-table-caption-height', '205px')
		sliderRoot?.style.setProperty('--product-table-caption-height', '205px')
		return
	}
	const maxHeight = captions.reduce((max, caption) => {
		return Math.max(max, Math.ceil(caption.scrollHeight + 1))
	}, 205)
	captionHeight.value = maxHeight
	emit('caption-height-change', maxHeight)
	sharedContainer?.style.setProperty(
		'--product-table-caption-height',
		`${maxHeight}px`,
	)
	tableFeature?.style.setProperty('--product-table-caption-height', `${maxHeight}px`)
	sliderRoot?.style.setProperty('--product-table-caption-height', `${maxHeight}px`)
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
