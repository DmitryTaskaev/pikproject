<script setup lang="ts">
const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'О компании', href: '/about' },
]
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<HeroVideo />
		<Advantages />
		<AManufacture />
		<AExperience />
		<APartners />
		<ProductionFacilities :use-api="false" />
		<LabBlock />
		<SupplyBlock />
		<NewsBlock />
		<ConsultationBlock />
	</main>
	<ExperienceCardModal />
</template>

<style lang="scss"></style>
