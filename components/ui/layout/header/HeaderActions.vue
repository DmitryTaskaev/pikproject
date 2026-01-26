<script setup lang="ts">
const language = ref('РУ')
const { isSearchActive, openSearch } = useSearch()

const languageList = ref(['РУ', 'EN'])

const dropdownIsVisible = ref(false)

function languageDropdownHandler() {
	dropdownIsVisible.value = !dropdownIsVisible.value
}

function selectLanguage(selectedLang: string) {
	language.value = selectedLang

	dropdownIsVisible.value = false
}

function handleSearch() {
	openSearch()
}
</script>

<template>
	<div class="header-actions">
		<div class="header-actions__wrap">
			<button
				@click.stop="handleSearch"
				class="header-actions__search"
				:class="{ 'search-active': isSearchActive }"
			>
				<Icon name="search-button" />
			</button>
			<div
				class="header-actions__language"
				:class="{ 'header-actions__language_active': dropdownIsVisible }"
				@click="languageDropdownHandler"
			>
				<Text tag="span" size="sm" line-height="xl" design="secondary">
					{{ language }}
				</Text>
				<Icon name="base-arrow" />
				<div class="header-actions__language--list">
					<Text
						v-for="value in languageList"
						:key="value"
						:class="[
							'header-actions__language--list_item',
							value === language
								? 'header-actions__language--list_item_active'
								: '',
						]"
						tag="span"
						size="sm"
						line-height="sm"
						@click.stop="selectLanguage(value)"
					>
						{{ value }}
					</Text>
				</div>
			</div>
		</div>
		<BorderLine class="header-actions__links" position="left" design="primary">
			<CopyLink text="8 (800) 250-9288" href="tel:+78002509288" />
			<CopyLink text="zakaz@piktube.ru" href="mailto:zakaz@piktube.ru" />
		</BorderLine>
	</div>
</template>

<style lang="scss">
.header-actions {
	display: flex;
	align-items: center;
	&__wrap {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
		padding-right: var(--space-sm);
	}
	&__search {
		width: 16px;
		height: 16px;
		.icon {
			width: 100%;
			height: 100%;
		}
		&.search-active {
			@include ultrahd {
				display: none;
			}
		}
	}
	&__language {
		position: relative;
		display: flex;
		align-items: center;
		width: 40px;
		justify-content: space-between;
		cursor: pointer;
		&--list {
			z-index: 145;
			padding-left: var(--space-xs);
			padding-right: var(--space-xs);
			position: absolute;
			bottom: -10px;
			transform: translateY(100%);
			left: calc(-1 * var(--space-xs));
			border: 1px solid #b8cce1;
			border-radius: 5px;
			background: var(--primary-bg);
			display: flex;
			flex-direction: column;
			gap: 16px;
			overflow: hidden;
			max-height: 0;
			opacity: 0;
			pointer-events: none;
			user-select: none;
			transition: all 0.2s ease-in;
			&_item {
				border-bottom: 1px solid transparent;
				cursor: pointer;
				color: var(--main-bg);
				transition: all 0.2s ease-in;
				&:hover {
					border-bottom: 1px solid currentColor;
				}
				&_active {
					border-bottom: 1px solid currentColor;
				}
			}
		}
		.icon {
			color: var(--main-bg);
			transition: all 0.2s ease;
			width: 12px;
			height: 6px;
		}

		&_active {
			.header-actions__language--list {
				padding-top: var(--space-xs);
				padding-bottom: var(--space-xs);
				max-height: 200px;
				pointer-events: auto;
				user-select: auto;
				opacity: 1;
			}
			.icon {
				transform: rotate(180deg);
			}
		}
	}
	&__links {
		padding-left: var(--space-sm);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		&--item {
			display: flex;
			gap: 8px;
			align-items: center;
		}
	}
}
</style>
