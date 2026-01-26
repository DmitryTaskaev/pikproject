<script setup lang="ts">
interface LabBannerItem {
	ID: string
	NAME: string
	SORT: string
	PREVIEW_PICTURE_SRC?: string
	PROPERTIES?: {
		SLIDE?: {
			SRC?: string[]
		}
	}
}

interface LabBannerResponse {
	status: string
	data: {
		items: LabBannerItem[]
	}
}

interface LabInfoItem {
	ID: string
	NAME: string
	PREVIEW_TEXT: string
	DETAIL_TEXT: string
	PROPERTIES?: {
		EMAIL?: { VALUE?: string[] | string }
		PHONE?: { VALUE?: string[] | string }
		TEXT_URL_TOP?: { VALUE?: string }
		URL_TOP?: { VALUE?: string }
		TEXT_URL_BOTTOM?: { VALUE?: string }
		URL_BOTTOM?: { VALUE?: string }
	}
}

interface LabInfoResponse {
	status: string
	data: {
		items: LabInfoItem[]
	}
}

interface LabParkItem {
	ID: string
	NAME: string
	SORT: string
	PREVIEW_TEXT?: string
	PREVIEW_PICTURE_SRC?: string
}

interface LabParkResponse {
	status: string
	data: {
		items: LabParkItem[]
	}
	meta?: {
		iblock?: {
			name?: string
		}
	}
}

interface LabObjectsItem {
	ID: string
	NAME: string
	SORT: string
	PREVIEW_PICTURE_SRC?: string
}

interface LabObjectsResponse {
	status: string
	data: {
		items: LabObjectsItem[]
	}
	meta?: {
		iblock?: {
			name?: string
		}
	}
}

interface LabPricesItem {
	ID: string
	NAME: string
	SORT: string
	PREVIEW_TEXT?: string
	PROPERTIES?: {
		PRICE?: { VALUE?: string }
		METODIKA_TEXT?: { VALUE?: string }
		METODIKA_URL?: { VALUE?: string }
	}
}

interface LabPricesResponse {
	status: string
	data: {
		items: LabPricesItem[]
	}
	meta?: {
		iblock?: {
			name?: string
		}
	}
}

interface LabBottomSectionItem {
	ID: string
	NAME: string
	SORT: string
	PREVIEW_TEXT?: string
}

interface LabBottomSection {
	SECTION: {
		ID: string
		NAME: string
		SORT: string
	}
	ITEMS: LabBottomSectionItem[]
}

interface LabBottomResponse {
	status: string
	data: {
		TREE: LabBottomSection[]
	}
}

const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Лаборатория', href: '/lab' },
]

const config = useRuntimeConfig()
const { data: labBannerData } = await useAsyncData('labBanner', () =>
	$fetch<LabBannerResponse>(`${config.app.baseURL}api/labBanner`),
)
const { data: labInfoData } = await useAsyncData('labInfoAfterBanner', () =>
	$fetch<LabInfoResponse>(`${config.app.baseURL}api/labInfoAfterBanner`),
)
const { data: labParkData } = await useAsyncData('labPark', () =>
	$fetch<LabParkResponse>(`${config.app.baseURL}api/labPark`),
)
const { data: labObjectsData } = await useAsyncData('labObjects', () =>
	$fetch<LabObjectsResponse>(`${config.app.baseURL}api/labObjects`),
)
const { data: labPricesData } = await useAsyncData('labPrices', () =>
	$fetch<LabPricesResponse>(`${config.app.baseURL}api/labPrices`),
)
const { data: labBottomData } = await useAsyncData('labBottom', () =>
	$fetch<LabBottomResponse>(`${config.app.baseURL}api/labBottom`),
)

const decodeHtml = (value: string) => {
	return value
		.replace(/&#40;/g, '(')
		.replace(/&#41;/g, ')')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
}

const resolveMediaSrc = (src: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

const isVideo = (src: string) => /\.(mp4|webm|ogv)$/i.test(src)

const labSlides = computed(() => {
	const items = labBannerData.value?.data?.items || []
	const sortedItems = [...items].sort(
		(a, b) => Number(a.SORT || 0) - Number(b.SORT || 0),
	)
	const slides = sortedItems.flatMap(item => {
		const sources = item.PROPERTIES?.SLIDE?.SRC || []
		const poster = item.PREVIEW_PICTURE_SRC
			? resolveMediaSrc(item.PREVIEW_PICTURE_SRC)
			: ''
		return sources.map(src => {
			const resolved = resolveMediaSrc(src)
			if (isVideo(resolved)) {
				return {
					type: 'video' as const,
					videoSrc: [{ src: resolved }],
					poster,
				}
			}
			return {
				type: 'image' as const,
				src: resolved,
				alt: item.NAME || '',
			}
		})
	})
	return slides
})

const labInfoItem = computed(() => labInfoData.value?.data?.items?.[0])

const normalizeArray = (value?: string[] | string) => {
	if (!value) return []
	return Array.isArray(value) ? value : [value]
}

const splitParagraphs = (value?: string) => {
	if (!value) return []
	const normalized = value.replace(/<\/?br\s*\/?>/gi, '\n')
	return normalized
		.split(/\n\s*\n/)
		.map(item => item.trim())
		.filter(Boolean)
}

const labTitle = computed(() => labInfoItem.value?.NAME || 'Лаборатория')
const labCardTitle = computed(
	() =>
		labInfoItem.value?.PREVIEW_TEXT ||
		'Испытательная лаборатория ООО «ПИК» — это современный аккредитованный испытательный центр.',
)
const labDescList = computed(() =>
	splitParagraphs(labInfoItem.value?.DETAIL_TEXT),
)
const labEmails = computed(() =>
	normalizeArray(labInfoItem.value?.PROPERTIES?.EMAIL?.VALUE),
)
const labPhones = computed(() =>
	normalizeArray(labInfoItem.value?.PROPERTIES?.PHONE?.VALUE),
)
const topButton = computed(() => ({
	text:
		labInfoItem.value?.PROPERTIES?.TEXT_URL_TOP?.VALUE ||
		'Смотреть аккредитацию',
	size: 'sm' as const,
	href: labInfoItem.value?.PROPERTIES?.URL_TOP?.VALUE || '#',
}))
const bottomButton = computed(() => ({
	text:
		labInfoItem.value?.PROPERTIES?.TEXT_URL_BOTTOM?.VALUE ||
		'Подробнее о компании',
	size: 'lg' as const,
	href: labInfoItem.value?.PROPERTIES?.URL_BOTTOM?.VALUE || '/piktube/about',
}))

const labParkTitle = computed(
	() => labParkData.value?.meta?.iblock?.name || 'Парк оборудования',
)
const labParkList = computed(() => {
	const items = labParkData.value?.data?.items || []
	return [...items]
		.sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0))
		.filter(item => Boolean(item.PREVIEW_PICTURE_SRC))
		.map(item => ({
			title: item.PREVIEW_TEXT || item.NAME,
			image: {
				src: resolveMediaSrc(item.PREVIEW_PICTURE_SRC || ''),
				alt: item.NAME,
			},
		}))
})

const labObjectsTitle = computed(
	() => labObjectsData.value?.meta?.iblock?.name || 'Объекты испытаний',
)
const labObjectsList = computed(() => {
	const items = labObjectsData.value?.data?.items || []
	return [...items]
		.sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0))
		.map(item => ({
			title: item.NAME,
			image: item.PREVIEW_PICTURE_SRC
				? { src: resolveMediaSrc(item.PREVIEW_PICTURE_SRC), alt: item.NAME }
				: undefined,
		}))
})

const labPricesTitle = computed(
	() => labPricesData.value?.meta?.iblock?.name || 'Виды и цены проводимых испытаний',
)
const labPricesList = computed(() => {
	const items = labPricesData.value?.data?.items || []
	return [...items]
		.sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0))
		.map(item => ({
			number: String(item.SORT || ''),
			content: {
				title: item.NAME,
				desc: item.PREVIEW_TEXT || '',
			},
			tests: {
				title: item.PROPERTIES?.METODIKA_TEXT?.VALUE || '—',
				href: item.PROPERTIES?.METODIKA_URL?.VALUE || undefined,
			},
			price: item.PROPERTIES?.PRICE?.VALUE || '—',
		}))
})

const policy = {
	title: 'Политика в области качества',
	list: [
		{
			title: 'Ресурсы',
			desc: 'В распоряжении испытательной лаборатории — передовое оборудование, соответствующее государственным стандартам. Сотрудники лаборатории строго придерживаются методов испытаний и процедур, обеспечивающих объективность и точность результатов.В распоряжении испытательной лаборатории — передовое оборудование, соответствующее государственным стандартам. Сотрудники лаборатории строго придерживаются методов испытаний и процедур, обеспечивающих объективность и точность результатов.',
		},
		{
			title: 'Персонал',
			desc: 'Команда испытательной лаборатории ООО «ПИК» нацелена на поддержание уровня компетенций и гарантирует соблюдение всех норм и стандартов качества в каждом проведённом исследовании.',
		},
		{
			title: 'Стандарты качества',
			desc: 'Испытательная лаборатория ООО «ПИК» обязуется соблюдать требования ГОСТ ИСО/МЭК 17025-2019 «Общие требования к компетентности испытательных и калибровочных лабораторий», а также критериев аккредитации, и проводить поверочные работы в соответствии с установленными методами.',
		},
	],
}
const tasks = {
	title: 'Задачи испытательной лаборатории',
	list: [
		{
			title: 'Улучшение процедур',
			desc: 'Улучшать процедуры СМК с целью обеспечения эффективности деятельности лаборатории на постоянной основе.',
		},
		{
			title: 'Предоставление услуг',
			desc: 'Предоставлять услуги, соответствующие ожиданиям клиентов по качеству, точности и скорости выполнения.',
		},
		{
			title: 'Конфиденциальность',
			desc: 'Соблюдать конфиденциальность информации, полученной в результате испытаний.',
		},
		{
			title: 'Следование принципам',
			desc: 'Следовать принципам беспристрастности: гарантия независимости своих выводов и отчётов; обеспечение достоверности и прозрачности результатов.',
		},
	],
}

const bottomSections = computed(() => {
	const tree = labBottomData.value?.data?.TREE
	if (!tree || tree.length === 0) return [policy, tasks]

	return [...tree]
		.sort((a, b) => Number(a.SECTION.SORT || 0) - Number(b.SECTION.SORT || 0))
		.map(section => ({
			title: section.SECTION.NAME,
			list: [...(section.ITEMS || [])]
				.sort(
					(a, b) => Number(a.SORT || 0) - Number(b.SORT || 0),
				)
				.map(item => ({
					title: item.NAME,
					desc: decodeHtml(item.PREVIEW_TEXT || ''),
				})),
		}))
})
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<HeroVideo :slides="labSlides" />
		<LabBlock
			:is-btn="true"
			:is-links="true"
			title-tag="h1"
			:title="labTitle"
			:card-title="labCardTitle"
			:desc-list="labDescList"
			:emails="labEmails"
			:phones="labPhones"
			:top-button="topButton"
			:bottom-button="bottomButton"
		/>
		<LEquipment :title="labParkTitle" :list="labParkList" />
		<LTests :title="labObjectsTitle" :list="labObjectsList" />
		<LPrices :title="labPricesTitle" :list="labPricesList" />
		<LSection v-for="(section, index) in bottomSections" :key="index" v-bind="section" />
		<ConsultationBlock />
	</main>
</template>

<style lang="scss"></style>
