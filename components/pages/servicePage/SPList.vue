<script setup lang="ts">
import type { ListItem } from '~/components/ServiceItem.vue'

interface ServicePageListProps {
	list: ListItem[]
}

const props = defineProps<ServicePageListProps>()
</script>

<template>
	<div class="s-p-list-wrap">
		<div class="container">
			<div class="s-p-list">
				<ServiceItem
					v-for="(item, index) in props.list"
					:key="index"
					:list-item="item"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.s-p-list-wrap {
	margin-bottom: 160px;
}
.s-p-list {
	.service-item {
		position: relative;
		padding: 25px 0 90px;
		border-top: 1px solid var(--graphic-main);
		@include desktop {
			padding: 10px 0 10px;
		}
		&:last-child {
			border-bottom: 1px solid var(--graphic-main);
		}
	}
}
</style>
