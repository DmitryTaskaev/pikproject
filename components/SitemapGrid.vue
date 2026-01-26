<script setup lang="ts">
interface SitemapItem {
	name: string
	path: string
	href: string
}

const sitemapItems: SitemapItem[] = [
	{ name: 'Main', path: '/', href: 'index.html' },
	{ name: 'About', path: '/about', href: 'about.html' },
	{ name: 'Catalog', path: '/catalog', href: 'catalog.html' },
	{ name: 'News', path: '/news', href: 'news.html' },
	{
		name: 'Products Catalog',
		path: '/products-catalog',
		href: 'products-catalog.html',
	},
	{ name: 'Awards', path: '/awards', href: 'awards.html' },
	{ name: 'Details', path: '/details', href: 'details.html' },
	{ name: 'Product card', path: '/product-card', href: 'product-card.html' },
	{
		name: 'Services',
		path: '/services',
		href: 'services/index.html',
	},
	{
		name: 'Service page',
		path: '/services',
		href: 'services/index.html',
	},
	{
		name: 'Pro',
		path: '/pro',
		href: 'pro.html',
	},
	{
		name: 'Lab',
		path: '/lab',
		href: 'lab.html',
	},
	{
		name: 'Contacts',
		path: '/contacts',
		href: 'contacts.html',
	},
	{
		name: 'Product page',
		path: '/product-page',
		href: 'product-page.html',
	},
	{
		name: 'Solution',
		path: '/solution',
		href: 'solution.html',
	},
]
</script>

<template>
	<div class="sitemap-table">
		<div class="sitemap-table__header-row">
			<div class="sitemap-table__cell sitemap-table__cell_header">
				<Text tag="span" size="md" line-height="sm" design="accent">
					Страница
				</Text>
			</div>
			<div class="sitemap-table__cell sitemap-table__cell_header">
				<Text tag="span" size="md" line-height="sm" design="accent">
					Ссылка
				</Text>
			</div>
			<div class="sitemap-table__cell sitemap-table__cell_header">
				<Text tag="span" size="md" line-height="sm" design="accent">
					Статус
				</Text>
			</div>
		</div>

		<div
			v-for="(item, index) in sitemapItems"
			:key="item.name"
			class="sitemap-table__row"
			:class="{ 'sitemap-table__row_alt': index % 2 === 1 }"
		>
			<div class="sitemap-table__cell sitemap-table__cell_name">
				<Text tag="span" size="sm" line-height="sm" design="primary">
					{{ item.name }}
				</Text>
			</div>
			<div class="sitemap-table__cell sitemap-table__cell_path">
				<NuxtLink :to="item.path" class="sitemap-table__link">
					<Text tag="span" size="sm" line-height="sm" design="primary">
						{{ item.href }}
					</Text>
				</NuxtLink>
			</div>
			<div class="sitemap-table__cell sitemap-table__cell_status">
				<Text tag="span" size="sm" line-height="sm" design="primary">
					Готово
				</Text>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.sitemap-table {
	overflow: hidden;
	&__header-row {
		border: 1px solid var(--main-bg);
		border-bottom: none;
		border-top: none;
		background: var(--main-bg);
		display: grid;
		grid-template-columns: 2fr 2fr 1fr;
		@include tablet {
			grid-template-columns: 200px 200px 1fr;
		}
	}

	&__row {
		display: grid;
		grid-template-columns: 2fr 2fr 1fr;
		border: 1px solid var(--graphic-main);
		border-top: none;
		@include tablet {
			grid-template-columns: 200px 200px 1fr;
		}
	}
	&__cell {
		text-align: center;
		padding: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid var(--graphic-main);
		&:last-child {
			border-right: none;
		}
		&_header {
			border-right: none;
		}
	}
	&__cell_path {
		.sitemap-table__link {
			display: flex;
			align-items: center;
			justify-content: center;
			text-decoration: none;
			transition: all 0.2s ease;
			border-bottom: 1px solid transparent;
			&:hover,
			&:active {
				border-bottom: 1px solid var(--primary-color);
			}
		}
	}
	&__cell_status {
		justify-content: center;
		background: #f2fbfa;
	}
}
</style>
