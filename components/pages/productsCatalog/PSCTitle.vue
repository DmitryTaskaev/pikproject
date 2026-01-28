<script setup lang="ts">
interface PSCTitleProps {
	title?: string
	subtitle?: string
}

const props = withDefaults(defineProps<PSCTitleProps>(), {
	title: 'Холодное водоснабжение',
	subtitle: '(SDR 11)',
})
</script>

<template>
	<div class="p-s-c-title">
		<div class="container">
			<CustomTitle class="p-s-c-title__item" tag="h1" mode="xl">
				{{ props.title }}
				<br v-if="props.subtitle" />
				<span v-if="props.subtitle">{{ props.subtitle }}</span>
			</CustomTitle>
		</div>
	</div>
</template>

<style lang="scss">
.p-s-c-title {
	padding: 30px 0 90px;
	@include ultrahd {
		padding: 50px 0 80px;
	}
}
</style>
