<script setup lang="ts">
const headerMenu = ref<HTMLInputElement | null>(null)
const menuBtnText = ref('меню')
const menuIsVisible = ref(false)
const { isSearchActive } = useSearch()

function menuBtnHandler() {
	menuIsVisible.value = !menuIsVisible.value
	menuBtnText.value = menuIsVisible.value ? 'закрыть' : 'меню'
}
</script>

<template>
	<header class="header" :class="{ 'search-active': isSearchActive }">
		<div class="header__container">
			<NuxtLink class="header__logo" to="/">
				<Image
					class="header__logo--item"
					src="logo"
					alt="Производственная Изоляционная Компания"
				/>
			</NuxtLink>
			<div class="header__nav">
				<HeaderNav />
			</div>
			<div class="header__right">
				<div class="header__actions">
					<HeaderActions />
				</div>
				<button class="header__menu-btn" @click="menuBtnHandler">
					<Text tag="span" :uppercase="true" size="xs" design="accent">
						{{ menuBtnText }}
					</Text>
				</button>
			</div>
			<div v-if="isSearchActive" class="header__search">
				<SearchComponent />
			</div>
		</div>
		<div
			ref="headerMenu"
			class="header__menu"
			:class="{
				header__menu_active: menuIsVisible,
			}"
		>
			<div class="header__menu--top">
				<HeaderActions v-if="!isSearchActive" />
				<HeaderNav v-if="!isSearchActive" />
				<SearchComponent v-if="isSearchActive" />
			</div>
		</div>
	</header>
</template>

<style lang="scss">
.header {
	z-index: 290;
	height: 94px;
	top: 30px;
	width: 100%;
	position: fixed;
	background: var(--page-bg);
	transition: top 0.3s ease-in;
	@include ultrahd {
		height: 114px;
	}
	&__container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px 20px;
		height: 94px;
		max-width: calc(1720px + 2 * var(--container-padding));
		margin: 0 auto;
		@include ultrahd {
			height: 114px;
			padding: var(--space-xs) var(--space-sm);
		}
	}
	&__logo {
		display: flex;
		width: 185px;
		height: 64px;
		&--item {
		}
	}
	&__nav {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: none;
		@include ultrahd {
			display: block;
		}
	}
	&__actions {
		display: none;
		@include tablet {
			display: block;
		}
	}
	&__menu-btn {
		width: 79px;
		height: 44px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--main-bg);
		border-radius: 5px;
		@include ultrahd {
			display: none;
		}
	}
	&__menu {
		position: absolute;
		top: 94px;
		left: 0;
		z-index: 101;
		width: 100%;
		height: auto;
		background: var(--page-bg);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		max-height: 0;
		opacity: 0;
		overflow: hidden;
		pointer-events: none;
		user-select: none;
		transition: all 0.3s ease-in;
		padding-left: var(--space-sm);
		padding-right: var(--space-sm);
		box-shadow: 0 13px 15px 0 rgba(0, 0, 0, 0.06);

		@include ultrahd {
			height: 114px;
			display: none;
		}

		.header-actions {
			justify-content: space-between;
			margin-bottom: var(--space-lg);
			@include tablet {
				display: none;
			}
		}

		// gap: var(--space-lg);
		&_active {
			padding-top: calc(1.75 * var(--space-sm));
			padding-bottom: var(--space-sm);
			max-height: 475px;
			pointer-events: auto;
			user-select: auto;
			opacity: 1;
			@include tablet {
				max-height: 265px;
			}
		}
		.search {
			@include tablet {
				display: none;
			}
		}
	}
	&__right {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}
	&__search {
		position: absolute;
		top: 114px;
		left: 0;
		z-index: 101;
		width: 100%;
		background: var(--page-bg);
		box-shadow: 0 13px 15px 0 rgba(0, 0, 0, 0.06);
		padding: var(--space-sm);
		display: none;
		@include tablet {
			display: block;
			top: 0;
			left: 0;
			z-index: 102;
			background: var(--page-bg);
			padding: 25px var(--space-lg);
		}
		@include ultrahd {
			// display: none;
		}
	}
	&.search-active {
		.header {
			&__container {
				padding: 0 var(--space-sm);
				@include tablet {
					height: 94px;
				}
				@include ultrahd {
					height: 114px;
					display: grid;
					grid-template-columns: 185px 145px 732px 66px 250px;
					grid-template-rows: 1fr;
					padding: 25px 20px;
				}
			}
			&__logo {
				@include tablet {
					display: none;
				}
				@include ultrahd {
					display: flex;
					grid-column: 1/2;
					grid-row: 1/2;
				}
			}
			&__nav {
				@include ultrahd {
					display: none;
				}
			}
			&__right {
				@include ultrahd {
					grid-column: 5/6;
					justify-content: flex-end;
					grid-row: 1/2;
				}
			}
			&__actions {
				@include tablet {
					display: none;
				}
				@include ultrahd {
					display: block;
				}
			}
			&__menu-btn {
				@include tablet {
					display: none;
				}
			}
			&__menu {
				@include tablet {
					display: none;
				}
			}
			&__search {
				@include ultrahd {
					position: relative;
					background: inherit;
					box-shadow: none;
					grid-column: 3/4;
					grid-row: 1/2;
					padding: 0;
				}
			}
		}
	}
}

body.promo-hidden .header {
	top: 0;
}
</style>
