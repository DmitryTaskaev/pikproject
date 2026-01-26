<script setup lang="ts"></script>

<template>
	<div class="n-title">
		<div class="container">
			<CustomTitle class="n-title__item" tag="h1" mode="xxl"
				>Новости</CustomTitle
			>
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
