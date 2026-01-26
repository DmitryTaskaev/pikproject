<script setup lang="ts">
const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Новости', href: '/news' },
]
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<NTitle />
    <NList />
		<ConsultationBlock />
	</main>
</template>

<style lang="scss"></style>
