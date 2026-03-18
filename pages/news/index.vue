<script setup lang="ts">
interface NewsPageResponse {
	meta?: {
		iblock?: {
			name?: string
		}
	}
}

const config = useRuntimeConfig()
const route = useRoute()
const page = computed(() => Number(route.query.page || 1) || 1)
const homeBreadcrumbTitle = useHomeBreadcrumbTitle()

const { data: newsPageData } = await useLocalizedAsyncData(
	() => `news-page-meta-${page.value}`,
	lang =>
		$fetch<NewsPageResponse>(`${config.app.baseURL}api/news`, {
			query: { page: page.value, lang },
		}),
	{ watch: [page] },
)

const pageTitle = computed(
	() => newsPageData.value?.meta?.iblock?.name || 'Новости',
)
const breadcrumbsList = computed(() => [
	{ title: homeBreadcrumbTitle.value, href: '/' },
	{ title: pageTitle.value, href: '/news' },
])
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<NTitle :title="pageTitle" />
    <NList />
		<ConsultationBlock />
	</main>
</template>

<style lang="scss"></style>
