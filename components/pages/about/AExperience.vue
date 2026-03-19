<script setup lang="ts">
import type { ExperienceSliderItem } from '~/components/sliders/ExperienceSlider.vue'

interface CompanyInfoTreeItem {
	NAME?: string
	SORT?: string
	'~SORT'?: string
	PREVIEW_TEXT?: string
}

interface CompanyInfoTreeSection {
	SECTION?: {
		NAME?: string
		SORT?: string
		'~SORT'?: string
	}
	ITEMS?: CompanyInfoTreeItem[]
}

interface CompanyInfoRootItem {
	NAME?: string
	SORT?: string
	'~SORT'?: string
	PREVIEW_TEXT?: string
	DETAIL_TEXT?: string
}

interface CompanyInfoResponse {
	data?: {
		TREE?: CompanyInfoTreeSection[]
		ROOT_ITEMS?: CompanyInfoRootItem[]
	}
}

const { t } = useSiteI18n()
const config = useRuntimeConfig()
const { data: companyInfoData } = await useLocalizedAsyncData('companyInfo', lang =>
	$fetch<CompanyInfoResponse>(`${config.app.baseURL}api/companyInfo`, {
		query: { lang },
	}),
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
		.replace(/&nbsp;/g, '\u00A0')
}

const normalizeText = (value?: string) => {
	if (!value) return ''
	return decodeHtml(value)
		.replace(/\r\n/g, '\n')
		.replace(/<\/?br\s*\/?>/gi, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
}

const resolveSort = (item?: { SORT?: string, '~SORT'?: string }) =>
	Number(item?.SORT ?? item?.['~SORT'] ?? 0)

const sliderSlides = computed<ExperienceSliderItem[]>(() => {
	const sections = companyInfoData.value?.data?.TREE || []
	const sliderSection = [...sections]
		.sort((a, b) => resolveSort(a.SECTION) - resolveSort(b.SECTION))
		.find(section => section.SECTION?.NAME === 'Слайдер')
	const items = sliderSection?.ITEMS || []

	const slides = [...items]
		.sort((a, b) => resolveSort(a) - resolveSort(b))
		.map(item => ({
			title: item.NAME || '',
			subtitle: String(t('about_experience_slider_subtitle')),
			description: normalizeText(item.PREVIEW_TEXT),
		}))
		.filter(item => item.title && item.description)

	if (slides.length > 0) return slides

	return [
		{
			title: '21',
			subtitle: String(t('about_experience_slider_subtitle')),
			description:
				'За двадцать один год своего существования мы завоевали доверие и стали поставщиком ведущих российских компаний как ПАО «Т Плюс», ПАО «Полюс» и многих других. Являемся сертифицированным поставщиком ПАО «Нефтяная компания «РОСНЕФТЬ», ПАО «ГАЗПРОМНЕФТЬ».',
		},
		{
			title: '22',
			subtitle: String(t('about_experience_slider_subtitle')),
			description:
				'За двадцать один год своего существования мы завоевали доверие и стали поставщиком ведущих российских компаний как ПАО «Т Плюс», ПАО «Полюс» и многих других. Являемся сертифицированным поставщиком ПАО «Нефтяная компания «РОСНЕФТЬ», ПАО «ГАЗПРОМНЕФТЬ».',
		},
		{
			title: '23',
			subtitle: String(t('about_experience_slider_subtitle')),
			description:
				'За двадцать один год своего существования мы завоевали доверие и стали поставщиком ведущих российских компаний как ПАО «Т Плюс», ПАО «Полюс» и многих других. Являемся сертифицированным поставщиком ПАО «Нефтяная компания «РОСНЕФТЬ», ПАО «ГАЗПРОМНЕФТЬ».',
		},
	]
})

const rootCards = computed(() => {
	const items = companyInfoData.value?.data?.ROOT_ITEMS || []
	const normalized = [...items]
		.sort((a, b) => resolveSort(a) - resolveSort(b))
		.map(item => ({
			title: item.NAME || '',
			text: normalizeText(item.PREVIEW_TEXT),
			detail: normalizeText(item.DETAIL_TEXT),
		}))
		.filter(item => item.title && item.text)

	if (normalized.length > 0) return normalized

	return [
		{
			title: String(t('about_experience_innovations_title')),
			text: String(t('about_experience_innovations_text')),
			detail:
				'Завод оснащён оборудованием ведущих мировых производителей: KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery. Использование современных экструзионных линий и автоматизированных систем управления позволяет выпускать трубы диаметром от 63 до 1220 мм в различных исполнениях и с разнообразными типами изоляции (ППУ, ППМ, ВУС). Производственные мощности предприятия достигают 15 000 тонн готовой продукции в год. Это обеспечивает высокую скорость выполнения заказов и устойчивую поставку трубной продукции на объекты различного масштаба.',
		},
		{
			title: String(t('about_experience_time_title')),
			text: String(t('about_experience_time_text')),
			detail:
				'Завод оснащён оборудованием ведущих мировых производителей: KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery. Использование современных экструзионных линий и автоматизированных систем управления позволяет выпускать трубы диаметром от 63 до 1220 мм в различных исполнениях и с разнообразными типами изоляции (ППУ, ППМ, ВУС). Производственные мощности предприятия достигают 15 000 тонн готовой продукции в год. Это обеспечивает высокую скорость выполнения заказов и устойчивую поставку трубной продукции на объекты различного масштаба.',
		},
	]
})
</script>

<template>
	<div class="a-experience">
		<div class="container">
			<div class="a-experience__container">
				<div class="a-experience__wrap">
					<ExperienceSlider :slides="sliderSlides" />
				</div>
				<experience-card
					v-for="(card, index) in rootCards.slice(0, 2)"
					:key="index"
					:title="card.title"
					:text="card.text"
					:detail="card.detail"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.a-experience {
	margin-bottom: 100px;
	@include ultrahd {
		margin-bottom: 150px;
	}
	&__container {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		align-items: stretch;
		@include tablet {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
		@include ultrahd {
			display: flex;
			flex-direction: row;
			align-items: stretch;
		}
	}
	&__wrap {
		height: 380px;
		border-radius: 12px;
		background: var(--main-bg);
		@include tablet {
			grid-column: 1/3;
			grid-row: 1;
		}
		@include ultrahd {
			width: calc((100% - 40px) / 3);
			max-width: calc((100% - 40px) / 3);
			flex: 0 0 calc((100% - 40px) / 3);
			grid-column: 1/2;
		}
	}
	.experience-card {
		@include ultrahd {
			width: calc((100% - 40px) / 3);
			max-width: calc((100% - 40px) / 3);
			flex: 0 0 calc((100% - 40px) / 3);
		}
	}
}
</style>
