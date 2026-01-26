<script setup lang="ts">
import type { CPSectionListItem } from '~/components/pages/contacts/CPSection.vue'

interface InfoContactsItem {
	ID: string
	NAME: string
	PROPERTY_EMAIL_VALUE?: string
	PROPERTY_PHONE_VALUE?: string
	PROPERTY_ADRESS_VALUE?: string
	PROPERTY_WORKING_VALUE?: string
}

interface InfoContactsSection {
	SECTION: {
		ID: string
		NAME: string
	}
	ITEMS: InfoContactsItem[]
}

interface InfoContactsResponse {
	status: string
	data: {
		TREE: InfoContactsSection[]
	}
}

const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Контакты', href: '/contacts' },
]

const fallbackSections = [
	{
		title: 'Отделы продаж',
		list: [
			{
				title: 'г.Москва',
				email: {
					title: 'email@mail.com',
					href: 'mailto:email@mail.com',
				},
				phone: {
					title: '+7 (965) 001-30-04',
					href: 'tel:79650013004',
				},
				address: ['г.Москва, Новодмитровская улица,', '2к1'],
				schedule: 'Ежедневно с 12:00 до 21:00 по Московскому времени',
			},
			{
				title: 'г.Екатеринбург',
				email: {
					title: 'email@mail.com',
					href: 'mailto:email@mail.com',
				},
				phone: {
					title: '+7 (965) 001-30-04',
					href: 'tel:79650013004',
				},
				address: ['г.Екатеринбург, Онежская улица,', '4А'],
				schedule: 'Ежедневно с 12:00 до 21:00 по Московскому времени',
			},
			{
				title: 'г.Полевской',
				email: {
					title: 'email@mail.com',
					href: 'mailto:email@mail.com',
				},
				phone: {
					title: '+7 (965) 001-30-04',
					href: 'tel:79650013004',
				},
				address: ['г.Полевской, ул. Володарского,', 'д. 288'],
				schedule: 'Ежедневно с 12:00 до 21:00 по Московскому времени',
			},
		],
	},
	{
		title: 'Производство',
		list: [
			{
				title: 'г.Москва',
				email: {
					title: 'email@mail.com',
					href: 'mailto:email@mail.com',
				},
				phone: {
					title: '+7 (965) 001-30-04',
					href: 'tel:79650013004',
				},
				address: ['г.Москва, Новодмитровская улица,', '2к1'],
				schedule: 'Ежедневно с 12:00 до 21:00 по Московскому времени',
			},
		],
	},
]

const config = useRuntimeConfig()
const { data: infoContactsData } = await useAsyncData('infoContacts', () =>
	$fetch<InfoContactsResponse>(`${config.app.baseURL}api/infocontacts`),
)

const splitAddress = (value?: string) => {
	if (!value) return []
	const parts = value
		.split(',')
		.map(item => item.trim())
		.filter(Boolean)
	return parts.length ? parts : [value]
}

const normalizePhone = (value?: string) => {
	if (!value) return ''
	return value.replace(/[^\d+]/g, '')
}

const toSectionList = (item: InfoContactsItem): CPSectionListItem => {
	const email = item.PROPERTY_EMAIL_VALUE || ''
	const phone = item.PROPERTY_PHONE_VALUE || ''
	return {
		title: item.NAME,
		email: {
			title: email,
			href: email ? `mailto:${email}` : '',
		},
		phone: {
			title: phone,
			href: phone ? `tel:${normalizePhone(phone)}` : '',
		},
		address: splitAddress(item.PROPERTY_ADRESS_VALUE),
		schedule: item.PROPERTY_WORKING_VALUE || '',
	}
}

const sections = computed(() => {
	const tree = infoContactsData.value?.data?.TREE
	if (!tree || tree.length === 0) return fallbackSections
	return tree.map(section => ({
		title: section.SECTION.NAME,
		list: section.ITEMS.map(toSectionList),
	}))
})

const maps = [
	'https://yandex.ru/map-widget/v1/?um=constructor%3A7726fca91e518f7d14ab80eace5fc9b54f6f8aafb2a139f8bd01eff319835126&scroll=false&source=constructor',
	'https://yandex.ru/map-widget/v1/?um=constructor%3A733c6a76dd3b5a4e06413e20505ccc36121641d3f724b2f47a5c709755e8d569&scroll=false&source=constructor',
]
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<div class="c-p-title-wrap">
			<div class="container">
				<BorderLine class="c-p-title" position="top" design="primary">
					<CustomTitle class="c-p-title__item" tag="h1">Контакты</CustomTitle>
				</BorderLine>
			</div>
		</div>
		<CPSection
			v-for="(section, index) in sections"
			:key="`${section.title}-${index}`"
			:class="`c-p-section_${index}`"
			v-bind="section"
		>
			<div v-if="maps[index]" class="c-p-section__map">
				<iframe
					:src="maps[index]"
					width="100%"
					height="100%"
					frameborder="0"
					scrolling="no"
					scroll="no"
				></iframe>
			</div>
		</CPSection>
		<ConsultationBlock />
	</main>
</template>

<style lang="scss">
.c-p-title-wrap {
	margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: calc(1.8 * var(--space-section-sm));
	}
}
.c-p-title {
	padding-top: var(--space-md);
	@include ultrahd {
		padding-top: var(--space-xl);
	}
}
.c-p-section {
	&_departments {
	}
}
</style>
