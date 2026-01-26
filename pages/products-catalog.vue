<script setup lang="ts">
const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Каталог', href: '/catalog' },
	{ title: 'Холодное водоснабжение', href: '/solution' },
	{ title: 'SDR 11', href: '/products-catalog' },
]
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<PSCTitle />
		<PSCList />
		<SeoBlock />
		<ConsultationBlock />
	</main>
</template>

<style lang="scss"></style>
