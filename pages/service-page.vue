<script setup lang="ts">
import type { ListItem } from '~/components/ServiceItem.vue'

const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Каталог Услуг', href: '/services' },
	{ title: 'Нанесение ППУ изоляции', href: '/service-page' },
]
const heroTexts = [
	'«Производственная Изоляционная Компания» (ООО «ПИК») - предоставляет услуги по нанесению ППУ изоляции, вы можете самостоятельно ознакомиться со всеми услугами, и заказать нужные вам через форму ниже, не стесняйтесь обратиться к нам через форму обратной связи.',
]
const heroTitle = 'Нанесение ППУ изоляции'

const fallbackList: ListItem[] = [
	{
		title: ['ППУ-изоляция стальных труб с ', 'оцинкованной оболочкой (ППУ-ОЦ)'],
		content: {
			desc: 'Для надземной прокладки теплотрасс и промышленных сетей. Обеспечивает высокую механическую прочность и стойкость к внешним воздействиям.',
			measures: [
				{ title: 'Толщина изоляции:', value: '10-100' },
				{ title: 'd оболочки:', value: '30-140' },
				{ title: 'Срок годности:', value: '20 лет' },
			],
		},
	},
]
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<HeroWrapper class="s-p-hero" :title="heroTitle" :texts="heroTexts" />
		<SPList :list="fallbackList" />
		<SeoBlock />
		<ConsultationBlock />
	</main>
</template>

<style lang="scss">
.s-p-hero {
	.title {
		max-width: 335px;
		@include ultrahd {
			min-width: 560px;
		}
	}
}
</style>
