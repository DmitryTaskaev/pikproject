<script setup lang="ts">
const homeBreadcrumbTitle = useHomeBreadcrumbTitle()
const { t } = useSiteI18n()
const breadcrumbsList = computed(() => [
	{ title: homeBreadcrumbTitle.value, href: '/' },
	{ title: String(t('about_breadcrumb_title')), href: '/about' },
])
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
