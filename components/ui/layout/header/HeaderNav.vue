<script setup lang="ts">
import NavLink from '../../base/NavLink.vue'

interface MenuSection {
	SECTION?: {
		NAME?: string
		SORT?: string
		UF_URL_TO?: string
	}
	ITEMS?: MenuItem[]
	CHILDREN?: unknown[]
}

interface MenuItem {
	NAME?: string
	SORT?: string
	PROPERTY_URL_TO_VALUE?: string | null
	PROPERTIES?: {
		URL_TO?: {
			VALUE?: string | null
		}
	}
}

interface MenuResponse {
	data?: {
		TREE?: MenuSection[]
		ROOT_ITEMS?: MenuItem[]
	}
}

const config = useRuntimeConfig()
const { data: menuData } = await useLocalizedAsyncData('menu', lang =>
	$fetch<MenuResponse>(`${config.app.baseURL}api/menu`, {
		query: { lang },
	}),
)

const basePrefix = config.app.baseURL.replace(/\/$/, '')

const resolveHref = (url?: string | null) => {
	const raw = url || '#'

	if (/^https?:\/\//.test(raw)) return raw
	if (raw.startsWith('/')) return `${basePrefix}${raw}`
	return raw
}

const resolveItemUrl = (item?: MenuItem) =>
	item?.PROPERTIES?.URL_TO?.VALUE || item?.PROPERTY_URL_TO_VALUE || ''

const menuItems = computed(() => {
	const tree = menuData.value?.data?.TREE || []
	const rootItems = menuData.value?.data?.ROOT_ITEMS || []

	const sections = tree.map((section, index) => ({
		text: section.SECTION?.NAME || '',
		href: resolveHref(section.SECTION?.UF_URL_TO),
		sort: Number(section.SECTION?.SORT || 0),
		index,
		hasChildren:
			(section.ITEMS?.length || 0) > 0 || (section.CHILDREN?.length || 0) > 0,
	}))

	const roots = rootItems.map((item, index) => ({
		text: item.NAME || '',
		href: resolveHref(resolveItemUrl(item)),
		sort: Number(item.SORT || 0),
		index: tree.length + index,
		hasChildren: false,
	}))

	return [...sections, ...roots]
		.filter(item => item.text)
		.sort((a, b) => (a.sort - b.sort) || (a.index - b.index))
})

const splitIndex = computed(() => {
	const total = menuItems.value.length
	if (total <= 1) return total
	return Math.floor(total / 2)
})
const navTopList = computed(() =>
	menuItems.value.slice(0, splitIndex.value).map(item => ({
		text: item.text,
		href: item.href,
		icon: item.hasChildren,
	})),
)
const navBottomList = computed(() =>
	menuItems.value.slice(splitIndex.value).map(item => ({
		text: item.text,
		href: item.href,
		icon: false,
	})),
)
</script>

<template>
	<nav class="header-nav">
		<div class="header-nav__top">
			<ul class="header-nav__top--list">
				<li
					v-for="item in navTopList"
					:key="item.text"
					class="header-nav__top--item"
				>
					<NavBtn v-bind="item" />
				</li>
			</ul>
		</div>
		<div class="header-nav__bottom">
			<ul class="header-nav__bottom--list">
				<li
					v-for="item in navBottomList"
					:key="item.text"
					class="header-nav__bottom--item"
				>
					<NavLink v-bind="item" />
				</li>
			</ul>
		</div>
	</nav>
</template>

<style lang="scss">
.header-nav {
	&__top {
		margin-bottom: var(--space-sm);
		@include ultrahd {
			margin-bottom: 6px;
		}
		&--list {
			display: flex;
			flex-direction: column;
			gap: 6px;
			@include ultrahd {
				flex-direction: row;
			}
		}
		&--item {
			width: 100%;
			@include ultrahd {
				width: 240px;
				flex: 0 0 240px;
			}
		}
	}
	&__bottom {
		border: 1px solid #b8cce1;
		border-radius: 5px;

		display: flex;
		align-items: center;
		justify-content: center;

		height: auto;
		padding: calc(0.5 * var(--space-md)) 0;

		@include tablet {
			padding: 0;
			height: 44px;
		}
		&--list {
			display: flex;
			align-items: center;
			flex-direction: column;
			gap: var(--space-md);
			@include tablet {
				flex-direction: row;
				gap: 50px;
			}
		}
		&--item {
		}
	}
}
</style>
