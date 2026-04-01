<script setup lang="ts">
import type { ImageProps } from '../ui/base/Image.vue'

interface Caption {
	title: string
	image: ImageProps
	href: string
}
export interface ProductTableCardProps {
	caption: Caption
	captionHeight?: number
	rowHeights?: number[]
	rows?: string[][][]
	rowLinks?: string[][][]
	clickableRows?: number[]
	purpose?: string[]
	gost?: string[]
	specification?: string[]
	material?: string[]
	diameter?: string[][]
	sdr?: string[][]
	layersAmount?: string[]
	additionalCharacteristic1?: string[]
	additionalCharacteristic2?: string[]
}

const props = defineProps<ProductTableCardProps>()

const toLines = (value?: string[] | string[][]) => {
	if (!value) return []
	if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0])) {
		return (value as string[][]).map(line => line.filter(Boolean))
	}
	return (value as string[]).map(item => [item])
}

const resolvedRows = computed(() => {
	if (props.rows && props.rows.length > 0) {
		return props.rows.slice(0, 6)
	}
	const rows = [
		toLines(props.purpose),
		toLines(props.gost),
		toLines(props.specification),
		toLines(props.material),
		toLines(props.diameter),
		toLines(props.sdr),
	]
	if (rows.length >= 6) return rows.slice(0, 6)
	return rows.concat(Array(6 - rows.length).fill([]))
})

const resolvedClickableRows = computed(() => {
	if (props.clickableRows && props.clickableRows.length > 0) {
		return props.clickableRows
	}
	return [4, 5]
})

const resolvedRowLinks = computed(() => {
	const rows = resolvedRows.value
	const links = props.rowLinks || []
	return rows.map((row, rowIndex) => {
		const rowLinks = links[rowIndex] || []
		return row.map((line, lineIdx) => {
			const lineLinks = rowLinks[lineIdx] || []
			return line.map((_, valueIdx) => lineLinks[valueIdx] || '')
		})
	})
})

const visibleRowCount = computed(() => {
	return Math.max(1, resolvedRows.value.length)
})

const resolvedGridTemplateRows = computed(() => {
	const caption = props.captionHeight || 205
	const rowHeights =
		props.rowHeights && props.rowHeights.length > 0
			? props.rowHeights.slice(0, visibleRowCount.value)
			: Array.from({ length: visibleRowCount.value }, () => 122)
	return `${caption}px ${rowHeights
		.map(height => `minmax(${Math.max(height, 122)}px, auto)`)
		.join(' ')}`
})
</script>

<template>
	<div
		class="product-table-card"
		:style="{
			gridTemplateRows: resolvedGridTemplateRows,
		}"
	>
		<div class="product-table-card__caption">
			<div class="product-table-card__caption-inner">
				<Image class="product-table-card__caption--img" v-bind="props.caption.image" />
				<a
					class="product-table-card__caption--title"
					:href="props.caption.href"
				>
					{{ props.caption.title }}
				</a>
				<div class="product-table-card__caption--spacer" />
			</div>
		</div>
		<div
			class="product-table-card__wrap"
			v-for="(row, rowIndex) in resolvedRows"
			:key="`row-${rowIndex}`"
		>
			<span
				class="product-table-card__wrap--line"
				v-for="(line, lineIdx) in row"
				:key="`line-${lineIdx}`"
			>
				<span
					class="product-table-card__wrap--line_word"
					:class="{
						'product-table-card__wrap--line_word-clickable':
							resolvedClickableRows.includes(rowIndex),
					}"
					v-for="(value, valueIdx) in line"
					:key="`value-${valueIdx}`"
				>
					<a
						v-if="resolvedRowLinks[rowIndex]?.[lineIdx]?.[valueIdx]"
						:href="resolvedRowLinks[rowIndex]?.[lineIdx]?.[valueIdx]"
					>
						{{ value }}
					</a>
					<template v-else>{{ value }}</template>
				</span>
				<br />
			</span>
		</div>
	</div>
</template>

<style lang="scss">
.product-table-card {
	display: grid;
	grid-template-columns: minmax(224px, 1fr);
	grid-template-rows:
		var(--product-table-caption-height, 205px)
		repeat(var(--table-row-count, 6), minmax(122px, auto));
	min-width: 0;
	width: 100%;
	&__caption,
	&__wrap {
		display: flex;
		flex-direction: column;
		padding: 26px;
		min-width: 0;
	}
	&__caption {
		width: 100%;
		max-width: 100%;
		padding-bottom: 0;
		&-inner {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			gap: 14px;
			width: 100%;
			max-width: 100%;
			min-width: 0;
			padding-bottom: 34px;
		}
		&--img {
			flex: 0 0 auto;
			display: block;
			width: 100%;
			max-width: 171px;
			height: 100px;
			object-fit: contain;
			object-position: center;
			padding: 8px;
			overflow: hidden;
			border-radius: 12px;
			background: #f4f7fc;
			color: transparent;
			font-size: 0;
			line-height: 0;
			text-indent: -9999px;
		}
		&--title {
			display: block;
			align-self: stretch;
			width: 100%;
			max-width: 100%;
			min-width: 0;
			color: var(--primary-color);
			font-weight: 500;
			text-decoration: none;
			white-space: normal;
			overflow-wrap: anywhere;
			word-break: break-word;
			hyphens: auto;
			font-size: 14px;
			line-height: 120%;
		}
		&--spacer {
			flex: 0 0 18px;
			height: 18px;
			width: 100%;
		}
	}
	&__wrap {
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 100%;
		font-size: 12px;
		line-height: 125%;
		text-align: center;
		color: rgba(34, 34, 34, 0.7);
		.product-table-card__wrap--line {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			gap: var(--space-xs);
			width: 100%;
			max-width: 100%;
			min-width: 0;
		}
		.product-table-card__wrap--line_word {
			display: inline;
			max-width: 100%;
			min-width: 0;
			color: #222;
			white-space: normal;
			overflow-wrap: anywhere;
			word-break: break-word;
			a {
				color: inherit;
				text-decoration: inherit;
				white-space: normal;
				overflow-wrap: anywhere;
				word-break: break-word;
			}
		}
		.product-table-card__wrap--line_word-clickable {
			text-decoration: underline;
			text-decoration-skip-ink: none;
			cursor: pointer;
		}
	}
	// &_extended {
	// 	grid-template-rows:
	// 		205px repeat(4, 122px) repeat(2, 141px)
	// 		repeat(3, 122px);
	// 	.product-table-card__wrap_additional {
	// 		display: flex;
	// 	}
	// }
}
</style>
