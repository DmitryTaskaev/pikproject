<script setup lang="ts">
const dropdownList = [
	{
		title: 'Однослойная труба ПИКПАЙП',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП II',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП III',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП ХАРД',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП II',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП ХАРД III',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП ХАРД III',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП II',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП III',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП ХАРД',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП II',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП ХАРД III',
		href: '/piktube/product-page',
	},
	{
		title: 'Однослойная труба ПИКПАЙП ХАРД III',
		href: '/piktube/product-page',
	},
]
const searchText = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const isDropdown = computed(() => searchText.value.toUpperCase().includes(''))
const { closeSearch } = useSearch()

function handleSearch() {
	closeSearch()
}

function clearSearch() {
	searchText.value = ''
}

onMounted(() => {
	if (searchInput.value) {
		searchInput.value.focus()
	}
})
</script>

<template>
	<div class="search">
		<div class="search__top">
			<div class="search__input">
				<input
					ref="searchInput"
					v-model="searchText"
					class="search__input--item"
					type="text"
					placeholder="Услуги"
				/>
				<button class="search__input--search">
					<Icon class="search__input--search_icon" name="search-button" />
				</button>
			</div>
			<div v-if="!searchText" class="search__close-btn" @click="handleSearch">
				<close-button class="search__close-btn--icon" size="md" />
			</div>
			<button v-else class="search__clear-btn" @click="clearSearch">
				<Icon class="search__clear-btn--icon" name="close-button" />
			</button>
		</div>

		<div v-if="isDropdown && searchText" class="search__dropdown">
			<div class="search__dropdown--body">
				<div class="search__dropdown--list">
					<Text
						v-for="(item, index) in dropdownList"
						:key="index"
						class="search__dropdown--item"
						tag="a"
						:href="item.href"
						size="xs"
						line-height="sm"
						:uppercase="true"
					>
						{{ item.title }}
					</Text>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.search {
	&__top {
		display: flex;
		align-items: center;
		@include tablet {
			width: 100%;
		}
	}
	&__input {
		position: relative;
		flex: 1 1 auto;

		&--item {
			font-size: 12px;
			letter-spacing: -0.01em;
			text-transform: uppercase;
			color: var(--primary-color);
			width: 100%;
			padding-left: var(--space-sm);
			height: 44px;
			border: 1px solid #b8cce1;
			border-radius: 5px;
			background: var(--primary-bg);
			&::placeholder {
				opacity: 1;
				color: #92a5b9;
				font-size: 12px;
				letter-spacing: -0.01em;
				text-transform: uppercase;
			}
		}
		&--search {
			display: flex;
			position: absolute;
			top: 14px;
			right: 20px;
			background: none;
			border: none;
			cursor: pointer;
			padding: 0;

			&_icon {
				width: 16px;
				height: 16px;
				color: var(--secondary-color);
			}
		}
	}
	&__close-btn {
		margin-left: var(--space-sm);
		flex: 0 0 14px;
		height: 14px;
		cursor: pointer;
		@include tablet {
			margin-left: var(--space-xs);
		}
		&--icon {
			width: 14px;
			height: 14px;
			color: var(--black-color);
			.icon {
				stroke: currentColor;
			}
		}
	}
	&__clear-btn {
		margin-left: var(--space-xs);
		flex: 0 0 44px;
		width: 44px;
		height: 44px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 5px;
		background: var(--main-bg);
		cursor: pointer;
		border: none;
		@include tablet {
			margin-left: var(--space-xs);
		}
		&--icon {
			width: 14px;
			height: 14px;
			color: var(--accent-color);
			.icon {
				stroke: currentColor;
			}
		}
	}
	&__dropdown {
		// padding: var(--space-sm);
		padding-top: var(--space-sm);
		@include tablet {
			background: var(--page-bg);
			border: 1px solid #b8cce1;
			border-radius: 5px;
			padding: var(--space-xs);
			position: absolute;
			top: calc(100% - 15px);
			left: 0;
			right: 0;
			z-index: 103;
			margin-top: var(--space-xs);
			width: calc(100% - 2 * var(--space-lg));
			margin: 0 auto;
		}
		@include ultrahd {
			width: 732px;
			top: calc(100% + 10px);
		}

		&--body {
			height: 100%;
			overflow-y: auto;
			padding-right: var(--space-sm);
			@include tablet {
				padding-right: var(--space-xs);
			}
			&::-webkit-scrollbar {
				height: 100%;
				background: #cfd9ef;
				width: 2px;
				border-radius: 2px;
			}

			&::-webkit-scrollbar-track {
				background: #cfd9ef;
				border-radius: 1px;
			}

			&::-webkit-scrollbar-thumb {
				background: #11437a;
				border-radius: 2px;
			}

			&::-webkit-scrollbar-thumb:hover {
				background: #0a2c5a;
			}

			&::-webkit-scrollbar-corner {
				background: #cfd9ef;
			}
		}
		&--list {
			max-width: 400px;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 18px;
			height: 246px;

			@include ultrahd {
				height: 123px;
				gap: 12px;
			}
		}
		&--item.text {
			color: var(--main-bg);
			border-bottom: 1px solid transparent;

			&:hover,
			&:active {
				border-bottom: 1px solid currentColor;
			}
		}
	}
}
</style>
