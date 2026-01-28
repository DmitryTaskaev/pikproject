<script setup lang="ts">
const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Каталог', href: '/catalog' },
]
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<ProductCatalog />
		<CPipeCatalog />
		<ServiceCatalog />
		<SeoBlock />
		<ConsultationBlock />
	</main>
</template>

<style lang="scss">
</style>
