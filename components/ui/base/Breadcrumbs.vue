<script setup lang="ts">
interface BreadcrumbsItem {
	title: string
	href: string
}
interface BreadcrumbsProps {
	list: BreadcrumbsItem[]
}
const props = defineProps<BreadcrumbsProps>()
</script>

<template>
	<div class="breadcrumbs">
		<div class="container">
			<BorderLine
				class="breadcrumbs__container"
				position="bottom"
				design="primary"
			>
				<template v-for="(item, index) in props.list" :key="index">
					<Text class="breadcrumbs__item" tag="span" line-height="sm">
						<NuxtLink class="breadcrumbs__link" :to="item.href">
							{{ item.title }}
						</NuxtLink>
					</Text>
					<div
						v-if="index < props.list.length - 1"
						class="breadcrumbs__divider"
					></div>
				</template>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.breadcrumbs {
	&__container {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px;
		padding: 20px 0 50px;
		@include ultrahd {
			padding: 50px 0 20px;
		}
	}
	&__item {
		font-size: 12px;
		border-bottom: 1px solid transparent;
		transition: border 0.2s ease-in;
		&:hover {
			border-bottom: 1px solid currentColor;
		}
		@include ultrahd {
			font-size: 15px;
		}
	}
	&__divider {
		width: 12px;
		height: 1px;
		background: var(--main-color);
		@include ultrahd {
			width: 15px;
		}
	}
}
</style>
