<script setup lang="ts">
interface TableFeatureProps {
	titles: string[]
	dropdowns?: Array<string[] | null>
	captionHeight?: number
}

const props = defineProps<TableFeatureProps>()

const resolvedTitles = computed(() => {
	if (props.titles.length >= 6) return props.titles.slice(0, 6)
	return props.titles.concat(Array(6 - props.titles.length).fill(''))
})

const splitLines = (value: string) => {
	return value.split('\n').map(item => item.trim()).filter(Boolean)
}

const resolvedDropdowns = computed(() => {
	const list = props.dropdowns || []
	if (list.length >= 6) return list.slice(0, 6)
	return list.concat(Array(6 - list.length).fill(null))
})

const visibleRowCount = computed(() => {
	return Math.max(
		1,
		resolvedTitles.value.filter((title, idx) => {
			return Boolean(title) || Boolean(resolvedDropdowns.value[idx])
		}).length,
	)
})
</script>

<template>
	<div
		class="table-feature"
		:style="{
			gridTemplateRows: `${props.captionHeight || 205}px repeat(${visibleRowCount}, minmax(122px, auto))`,
		}"
	>
		<div class="table-feature__caption">Наименование:</div>
		<div class="table-feature__wrap" v-for="(title, idx) in resolvedTitles" :key="idx">
			<template v-if="title">
				<span v-for="(line, lineIdx) in splitLines(title)" :key="lineIdx">
					{{ line }}<br v-if="lineIdx < splitLines(title).length - 1" />
				</span>
			</template>
			<Dropdown v-if="resolvedDropdowns[idx]" :list="resolvedDropdowns[idx] || []" />
		</div>
	</div>
</template>

<style lang="scss">
.table-feature {
	display: grid;
	width: 224px;
	flex: 0 0 224px;
	align-self: stretch;
	height: 100%;
	grid-template-rows:
		var(--product-table-caption-height, 205px)
		repeat(var(--table-row-count, 6), minmax(122px, auto));
	&__caption,
	&__wrap {
		padding: 26px;
		min-width: 0;
		font-weight: 500;
		font-size: 15px;
		line-height: 100%;
		white-space: normal;
		overflow-wrap: anywhere;
		word-break: break-word;
		color: #2e4169;

		border-top: 1px solid var(--graphic-main);
		border-right: 1px solid var(--graphic-main);
		&:first-child {
			border-top: none;
		}
	}
	&__caption {
	}
	&__wrap {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		gap: 12px;
	}

	// &_extended {
	// 	grid-template-rows:
	// 		205px repeat(4, 122px) repeat(2, 141px)
	// 		repeat(3, 122px);
	// 	.table-feature__wrap_additional {
	// 		display: flex;
	// 	}
	// }
}
</style>
