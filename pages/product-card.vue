<script setup lang="ts">
const homeBreadcrumbTitle = useHomeBreadcrumbTitle()
const breadcrumbsList = computed(() => [
	{ title: homeBreadcrumbTitle.value, href: '/' },
	{ title: 'Каталог', href: '/catalog' },
	{ title: 'Холодное водоснабжение', href: '/solution' },
	{
		title: 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
		href: '/product-card',
	},
])
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<PCHero />
		<PCDocuments />
		<PCCatalog />
		<SeoBlock />
		<ConsultationBlock />
	</main>
	<OrderModal />
</template>

<style lang="scss"></style>
