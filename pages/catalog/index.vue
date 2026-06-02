<script setup lang="ts">
const homeBreadcrumbTitle = useHomeBreadcrumbTitle()
const breadcrumbsList = computed(() => [
	{ title: homeBreadcrumbTitle.value, href: '/' },
	{ title: 'Каталог', href: '/catalog' },
])
</script>

<template>
	<main class="main catalog-page">
		<Breadcrumbs :list="breadcrumbsList" />
		<ProductCatalog />
		<CPipeCatalog />
		<ServiceCatalog />
		<SeoBlock />
		<ConsultationBlock />
		<ActionsPopup />
	</main>
	<DocumentationModal />
	<OrderModal />
</template>

<style lang="scss">
</style>
