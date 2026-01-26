<script setup lang="ts">
interface CustomControlsProps {
	page: number
	pages: number
	queryKey?: string
}

const props = withDefaults(defineProps<CustomControlsProps>(), {
	queryKey: 'page',
})

const route = useRoute()

const page = computed(() => Math.max(1, props.page))
const pages = computed(() => Math.max(1, props.pages))

const getLinkClass = (index: number) => {
	return `custom-controls__pagination--link${
		page.value === index ? ' custom-controls__pagination--link_active' : ''
	}`
}

const goToPage = (index: number) => {
	if (index < 1 || index > pages.value) return
	const query = { ...route.query, [props.queryKey]: String(index) }
	return navigateTo({ path: route.path, query })
}
</script>

<template>
	<div class="custom-controls">
		<Button
			class="custom-controls__button custom-controls__button_prev"
			:icon="{ name: 'button-arrow', mode: 'prev' }"
			@click="goToPage(page - 1)"
		/>
		<div class="custom-controls__pagination">
			<Text
				v-for="n in pages"
				:key="n"
				:class="getLinkClass(n)"
				tag="a"
				line-height="xs"
				size="sm"
				design="primary"
				@click="goToPage(n)"
			>
				{{ n }}
			</Text>
		</div>
		<Button
			class="custom-controls__button custom-controls__button_next"
			:icon="{ name: 'button-arrow', mode: 'next' }"
			@click="goToPage(page + 1)"
		/>
	</div>
</template>

<style lang="scss">
.custom-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	&__button {
		flex: 0 0 auto;
		&_prev {
		}
		&_next {
		}
	}
	&__pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);

		&--link {
			cursor: pointer;
			transition: all 0.2s ease;
			border-bottom: 1px solid transparent;
			font-weight: 400;
			&_active {
				font-weight: 600;
				color: var(--primary-color);
				border-bottom: 1px solid currentColor;
			}
		}
	}
}
</style>
