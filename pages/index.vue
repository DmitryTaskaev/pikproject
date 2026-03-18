<script setup lang="ts">
interface SeoMainItem {
	NAME?: string
	PREVIEW_TEXT?: string
}

interface SeoMainResponse {
	data?: {
		items?: SeoMainItem[]
	}
}

const config = useRuntimeConfig()
const { data: seoMainData } = await useLocalizedAsyncData('seoMain', lang =>
	$fetch<SeoMainResponse>(`${config.app.baseURL}api/seoMain`, {
		query: { lang },
	}),
)

const seoMainItem = computed(() => seoMainData.value?.data?.items?.[0])
const seoTitle = computed(() => seoMainItem.value?.NAME || undefined)
const seoDescription = computed(() => seoMainItem.value?.PREVIEW_TEXT || undefined)
</script>

<template>
	<main class="main">
		<MHero />
		<Advantages />
		<ProductCatalog :is-border="true" />
		<ServiceCatalog />
		<MAbout />
		<ProductionFacilities />
		<SupplyBlock />
		<NewsBlock />
		<SeoBlock :title="seoTitle" :description="seoDescription" />
		<ConsultationBlock />
		<CookiesPopup />
	</main>
</template>

<style lang="scss"></style>
