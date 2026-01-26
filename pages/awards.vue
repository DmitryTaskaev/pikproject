<script setup lang="ts">
interface AwardsItem {
	NAME: string
	PREVIEW_TEXT: string
	PROPERTIES?: {
		AWARDS?: {
			SRC?: string[]
			DESCRIPTION?: string[]
		}
	}
}

interface AwardsResponse {
	status: string
	data: {
		items: AwardsItem[]
	}
}

const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Награды', href: '/awards' },
]

const fallbackTitle = 'Награды и достижения'
const fallbackTexts = [
	'«Производственная Изоляционная Компания» (ООО «ПИК») – одно из крупнейших предприятий Российской Федерации по производству, изоляции и поставке пластиковых труб различного сортамента. Имея историю длиной в двадцать один год, мы создали имидж надёжного поставщика качественной трубной продукции для реализации проектов самой разной сложности.',
	'Выпуская продукт высокого качества, мы помогаем развивать промышленность и бизнес, а значит экономику страны, ведь именно наша продукция обеспечивает надёжную и бесперебойную доставку сред и ресурсов по магистралям наших партнёров. И делает это с наименьшими потерями. Высокие показатели качества и надёжности были достигнуты благодаря собственному современному производству, которое обеспечивает полный контроль соответствия заложенным требования на всех стадиях производства пластиковых труб и изоляции.',
	'Мы гордимся нашими наградами и достижениями.',
]

const config = useRuntimeConfig()
const { data: awardsData } = await useAsyncData('awards', () =>
	$fetch<AwardsResponse>(`${config.app.baseURL}api/awards`),
)

const splitText = (value?: string) => {
	if (!value) return []
	return value
		.replace(/<\/?br\s*\/?>/gi, '\n')
		.split('\n')
		.map(item => item.trim())
		.filter(Boolean)
}

const resolveImageSrc = (src: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

const awardsItem = computed(() => awardsData.value?.data?.items?.[0])
const pageTitle = computed(() => awardsItem.value?.NAME || fallbackTitle)
const texts = computed(() => {
	const parsed = splitText(awardsItem.value?.PREVIEW_TEXT)
	return parsed.length ? parsed : fallbackTexts
})
const awardsList = computed(() => {
	const awards = awardsItem.value?.PROPERTIES?.AWARDS
	const listTitle = awards?.NAME
	const descriptions = awards?.DESCRIPTION || []
	const images = awards?.SRC || []
	if (!descriptions.length) return []
	return descriptions.map((title, index) => ({
		title,
		description: title,
		image: images[index] ? resolveImageSrc(images[index]) : undefined,
	}))
})
</script>

<template>
    <main class="main">
        <Breadcrumbs :list="breadcrumbsList" />
        <ContentBlock :title="pageTitle" :texts="texts" />
        <AwardsList
            :items="awardsList"
            :title="awardsItem?.PROPERTIES?.AWARDS?.NAME"
        />
        <ConsultationBlock />
    </main>
</template>
