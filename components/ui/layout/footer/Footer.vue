<script setup lang="ts">
interface MenuSection {
	SECTION?: {
		NAME?: string
		SORT?: string
		UF_URL_TO?: string
	}
	ITEMS?: MenuItem[]
	CHILDREN?: MenuSection[]
}

interface MenuItem {
	NAME?: string
	SORT?: string
}

interface MenuResponse {
	data?: {
		TREE?: MenuSection[]
		ROOT_ITEMS?: MenuItem[]
	}
}

interface FooterEntry {
	title: string
	href: string
	list?: { title: string; href: string }[]
	sort: number
}

const config = useRuntimeConfig()
const { data: menuData } = await useAsyncData('menu', () =>
	$fetch<MenuResponse>(`${config.app.baseURL}api/menu`),
)

const basePrefix = config.app.baseURL.replace(/\/$/, '')

const resolveHref = (name?: string, url?: string) => {
	const map: Record<string, string> = {
		'О компании': '/about',
		'О нас': '/about',
		Новости: '/news',
		Награды: '/awards',
		Реквизиты: '/details',
		Продукция: '/catalog',
		Услуги: '/services',
		Фитинги: '/',
		Лаборатория: '/lab',
		Проектировщики: '/pro',
		Проектировщикам: '/pro',
		Контакты: '/contacts',
	}

	const fromMap = name ? map[name] : undefined
	const raw = fromMap || url || '#'

	if (/^https?:\/\//.test(raw)) return raw
	if (raw.startsWith('/')) return `${basePrefix}${raw}`
	return raw
}

const buildFooterEntries = () => {
	const tree = menuData.value?.data?.TREE || []
	const rootItems = menuData.value?.data?.ROOT_ITEMS || []

	const sections: FooterEntry[] = tree.map(section => {
		const sectionTitle = section.SECTION?.NAME || ''
		const sectionHref = resolveHref(sectionTitle, section.SECTION?.UF_URL_TO)

		const childSections = (section.CHILDREN || [])
			.slice()
			.sort(
				(a, b) => Number(a.SECTION?.SORT || 0) - Number(b.SECTION?.SORT || 0),
			)
			.map(child => ({
				title: child.SECTION?.NAME || '',
				href: resolveHref(
					child.SECTION?.NAME,
					child.SECTION?.UF_URL_TO || section.SECTION?.UF_URL_TO,
				),
			}))
			.filter(item => item.title)

		const items = (section.ITEMS || [])
			.slice()
			.sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0))
			.map(item => ({
				title: item.NAME || '',
				href: resolveHref(item.NAME, section.SECTION?.UF_URL_TO),
			}))
			.filter(item => item.title)

		const list = childSections.length ? childSections : items

		return {
			title: sectionTitle,
			href: sectionHref,
			list: list.length ? list : undefined,
			sort: Number(section.SECTION?.SORT || 0),
		}
	})

	const roots: FooterEntry[] = rootItems.map(item => ({
		title: item.NAME || '',
		href: resolveHref(item.NAME),
		sort: Number(item.SORT || 0),
	}))

	return [...sections, ...roots].filter(item => item.title)
}

const footerEntries = computed(() =>
	buildFooterEntries().sort((a, b) => a.sort - b.sort),
)

const splitIndex = computed(() => Math.ceil(footerEntries.value.length / 2))
const footerTopList = computed(() =>
	footerEntries.value.slice(0, splitIndex.value),
)
const footerBottomList = computed(() =>
	footerEntries.value.slice(splitIndex.value),
)
</script>

<template>
	<footer class="footer">
		<div class="footer__container">
			<div class="container">
				<BorderLine class="footer__wrap" position="top" design="accent">
					<div class="footer__top">
						<a href="#" class="footer__logo">
							<Image
								class="footer__logo--item"
								src="footer-logo"
								alt="Производственная Изоляционная Компания"
							/>
						</a>
						<div class="footer__list">
							<div class="footer__list--top">
								<FooterList
									v-for="item in footerTopList"
									:key="item.title"
									v-bind="item"
								/>
							</div>
							<div class="footer__list--bottom">
								<FooterList
									v-for="item in footerBottomList"
									:key="item.title"
									v-bind="item"
								/>
							</div>
						</div>
					</div>
					<div class="footer__cards">
						<FooterCard
							class="footer__card footer__activity"
							icon="activity"
							title="деятельность"
						>
							<div class="footer__activity--content">
								<p class="footer__card--text">
									Лауреат награды «100 лучших <br />товаров России»
								</p>
								<p class="footer__card--text">Член АПТС</p>
								<p class="footer__card--text">Член РАВВ</p>
								<p class="footer__card--text">Участник ГИСП</p>
							</div>
						</FooterCard>
						<FooterCard
							class="footer__card footer__address"
							icon="address"
							title="Адрес"
						>
							<div class="footer__address--content">
								<p class="footer__card--text">
									Россия, Москва, <br />Котельническая набережная <br />д.17
								</p>
							</div>
						</FooterCard>
						<FooterCard
							class="footer__card footer__contacts"
							icon="contacts"
							title="Контакты"
						>
							<div class="footer__contacts--content">
								<div class="footer__contacts--content_top">
									<CopyLink
										mode="accent"
										text="8 (800) 250-9288"
										href="tel:+78002509288"
									/>
									<CopyLink
										mode="accent"
										text="zakaz@piktube.ru"
										href="mailto:zakaz@piktube.ru"
									/>
								</div>
								<div class="footer__contacts--socials">
									<a
										class="footer__contacts--socials_item"
										href="https://vk.com/piktube"
										target="_blank"
									>
										<Icon name="vk" />
									</a>
									<a
										class="footer__contacts--socials_item"
										href="https://wa.me/78002509288"
										target="_blank"
									>
										<Icon name="whatsapp" />
									</a>
								</div>
							</div>
						</FooterCard>
					</div>
				</BorderLine>
				<div class="footer__bottom">
					<div class="footer__bottom--content">
						<Text
							class="footer__bottom--content_top"
							size="sm"
							line-height="xl"
							design="accent"
							>Сделано в Дзен.Дизайн</Text
						>
						<div class="footer__bottom--content_wrap">
							<div class="footer__bottom--content_inner">
								<Text
									class="footer__bottom--content_link"
									tag="a"
									href="/piktube/public-offer"
									size="sm"
									line-height="xl"
									design="accent"
									>Политика конфиденциальности</Text
								>
								<Text
									class="footer__bottom--content_link"
									tag="a"
									href="/piktube/public-offer"
									size="sm"
									line-height="xl"
									design="accent"
									>Публичная оферта</Text
								>
							</div>
							<Text
								class="footer__copyright"
								tag="small"
								size="sm"
								line-height="xl"
								design="accent"
								>2024 © "PIKTUBE"</Text
							>
						</div>
					</div>
					<a class="footer__bottom--btn" href="#">
						<Icon name="base-arrow" />
					</a>
				</div>
			</div>
		</div>
	</footer>
</template>

<style lang="scss">
.footer {
	background: var(--primary-bg);
	&__container {
		border-radius: var(--space-md) var(--space-md) 0 0;
		background: var(--main-bg);
		padding: var(--space-sm) 0;
		@include tablet {
			padding: var(--space-sm) 0 var(--space-lg);
		}
		@include ultrahd {
			padding: calc(2.5 * var(--space-sm)) 0 var(--space-sm);
		}
	}
	&__wrap {
		padding-top: var(--space-sm);
		margin-bottom: 60px;
		display: flex;
		flex-direction: column;
		gap: 60px;
		@include tablet {
			gap: 100px;
			margin-bottom: 120px;
		}
		@include ultrahd {
			flex-direction: row;
			gap: unset;
			justify-content: space-between;
			padding-top: var(--space-lg);
			margin-bottom: 140px;
		}
	}
	.border-line-wrap_top .border-line {
		@include tablet {
			width: 335px;
		}
		@include ultrahd {
			width: 100%;
		}
	}
	&__top {
	}
	&__logo {
		display: flex;
		width: 133px;
		height: 46px;
		margin-bottom: 60px;
		@include ultrahd {
			margin-bottom: 44px;
		}
		&--item {
			width: 100%;
		}
	}
	&__list {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
		flex-direction: column;
		@include tablet {
			flex-direction: row;
		}
		&--top {
		}
		&--bottom {
		}
	}
	&__cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
		margin-bottom: var(--space-xl);

		@include tablet {
			grid-template-columns: repeat(2, max-content);
			column-gap: 100px;
			row-gap: var(--space-xl);
		}
		@include ultrahd {
			grid-template-columns: repeat(3, max-content);
			gap: 50px;
			margin-bottom: 0;
		}
	}
	&__card {
		&--text {
			font-size: 14px;
			line-height: 129%;
			color: rgba(255, 255, 255, 0.7);
		}
	}
	&__activity {
		&--content {
			display: flex;
			flex-direction: column;
			gap: 14px;
		}
	}
	&__address {
		&--content {
		}
	}
	&__contacts {
		&--content {
			&_top {
				display: flex;
				flex-direction: column;
				gap: 14px;
				margin-bottom: var(--space-lg);
			}
		}
		&--socials {
			display: flex;
			gap: 14px;
			align-items: center;
			&_item {
				.icon {
					width: 30px;
					height: 30px;
				}
			}
		}
	}
	&__bottom {
		display: flex;
		align-items: stretch;
		gap: var(--space-xs);
		&--content {
			background: rgba(62, 103, 189, 0.35);
			border-radius: 5px;
			flex: 1 1 auto;
			padding: var(--space-sm);

			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;

			@include ultrahd {
				align-items: center;
				flex-direction: row-reverse;
				justify-content: space-between;
			}

			&_top {
			}
			&_wrap {
				display: flex;
				flex-direction: column;
				gap: 12px;
				@include tablet {
					gap: 6px;
				}
				@include ultrahd {
					flex-direction: row-reverse;
					gap: var(--space-lg);
				}
			}
			&_link {
				border-bottom: 1px solid transparent;
				transition: border 0.2s ease-in;
				&:hover,
				&:active {
					border-bottom: 1px solid currentColor;
				}
			}
			&_inner {
				display: flex;
				flex-direction: column;
				gap: 6px;
				@include tablet {
					flex-direction: row;
					gap: 20px;
				}
			}
		}
		&--btn {
			background: rgba(62, 103, 189, 0.35);
			border-radius: 5px;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 60px;

			@include ultrahd {
				border-radius: 50%;
			}

			.icon {
				width: 14px;
				height: 7px;
				transform: rotate(180deg);
				color: var(--accent-color);
			}
		}
	}
	&__copyright {
	}
}
</style>
