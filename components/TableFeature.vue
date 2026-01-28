<script setup lang="ts">
interface TableFeatureProps {
	titles: string[]
	dropdowns?: Array<string[] | null>
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
</script>

<template>
	<div class="table-feature">
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
	// flex: 1 1 auto;
	display: grid;
	// grid-template-columns: minmax(224px, 1fr);
	width: 224px;
	flex: 0 0 224px;
	grid-template-rows: 205px repeat(4, 122px) repeat(2, 141px);
	&__caption,
	&__wrap {
		padding: 26px;
		font-weight: 500;
		font-size: 15px;
		line-height: 100%;
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
