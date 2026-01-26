<template>
	<main class="main">
		<div class="sitemap">
			<div class="container">
				<div class="sitemap__header">
					<BorderLine position="top" design="primary">
						<CustomTitle class="sitemap__title"> Карта сайта </CustomTitle>
					</BorderLine>
				</div>
				<SitemapGrid />
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
useHead({
	title: 'Карта сайта - PikTube',
	meta: [
		{
			name: 'description',
			content: 'Карта сайта компании PikTube - все страницы сайта',
		},
	],
})
</script>

<style lang="scss">
.sitemap {
	padding: 40px 0 60px;

	.sitemap__header {
		text-align: center;
		margin-bottom: 60px;
	}

	.sitemap__title {
		padding-top: 40px;
	}
}
</style>
