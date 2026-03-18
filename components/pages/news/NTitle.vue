<script setup lang="ts">
interface NewsTitleProps {
	title?: string
}

const props = withDefaults(defineProps<NewsTitleProps>(), {
	title: 'Новости',
})
</script>

<template>
	<div class="n-title">
		<div class="container">
			<CustomTitle class="n-title__item" tag="h1" mode="xxl">
				{{ props.title }}
			</CustomTitle>
		</div>
	</div>
</template>

<style lang="scss">
.n-title {
	padding: 30px 0 80px;
	@include tablet {
		padding: 30px 0 100px;
	}
	@include ultrahd {
		padding: 50px 0 100px;
	}
}
</style>
