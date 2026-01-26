<script setup lang="ts">
import type { DocumentSlideProps } from '~/components/slides/DocumentSlide.vue'

interface DesignersFileProperty {
	SRC?: string | string[]
	DESCRIPTION?: string | string[]
	FILE?: {
		FILE_SIZE?: string
		SRC?: string
	}
}

interface DesignersItem {
	NAME?: string
	SORT?: string
	PROPERTIES?: {
		FILE?: DesignersFileProperty
	}
	PROPERTY_FILE_SRC?: string
}

interface DesignersSection {
	SECTION?: {
		NAME?: string
		SORT?: string
	}
	ITEMS?: DesignersItem[]
	CHILDREN?: DesignersSection[]
}

interface DesignersResponse {
	data?: {
		TREE?: DesignersSection[]
	}
	meta?: {
		iblock?: {
			name?: string
			description?: string
		}
	}
}

interface ProListSection {
	title: string
	slides: DocumentSlideProps[]
}

interface ProListItem {
	title: string
	sections: ProListSection[]
	sliderMode: 'compact' | 'wide'
	showButtons?: boolean
}

const config = useRuntimeConfig()
const { data: designersData } = await useAsyncData('designersPage', () =>
	$fetch<DesignersResponse>(`${config.app.baseURL}api/designersPage`),
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

const splitParagraphs = (value?: string) => {
	if (!value) return []
	const normalized = decodeHtml(value).replace(/<\/?br\s*\/?>/gi, '\n')
	return normalized
		.split(/\n+/)
		.map(item => item.trim())
		.filter(Boolean)
}

const splitLines = (value?: string) => {
	if (!value) return []
	const normalized = decodeHtml(value).replace(/<\/?br\s*\/?>/gi, '\n')
	return normalized
		.split(/\n+/)
		.map(item => item.trim())
		.filter(Boolean)
}

const resolveMediaSrc = (src?: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

const formatSizeMb = (value?: string) => {
	const bytes = Number(value)
	if (!bytes || Number.isNaN(bytes)) return undefined
	const mb = bytes / (1024 * 1024)
	return mb < 1 ? mb.toFixed(2) : mb.toFixed(1)
}

const pageTitle = computed(
	() => designersData.value?.meta?.iblock?.name || 'Проектировщикам',
)
const pageTexts = computed(() =>
	splitParagraphs(designersData.value?.meta?.iblock?.description),
)

const breadcrumbsList = computed(() => [
	{ title: 'Главная', href: '/' },
	{ title: pageTitle.value, href: '/pro' },
])

const mapSlides = (items: DesignersItem[] = []) => {
	return [...items]
		.sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0))
		.map(item => {
			const name = item.NAME || ''
			const textParts = splitLines(name)
			const fileProperty = item.PROPERTIES?.FILE
			const fileSrc =
				(Array.isArray(fileProperty?.SRC)
					? fileProperty?.SRC[0]
					: fileProperty?.SRC) ||
				fileProperty?.FILE?.SRC ||
				item.PROPERTY_FILE_SRC
			const href = resolveMediaSrc(fileSrc)
			const size =
				formatSizeMb(fileProperty?.FILE?.FILE_SIZE) ||
				(Array.isArray(fileProperty?.DESCRIPTION)
					? fileProperty?.DESCRIPTION[0]
					: fileProperty?.DESCRIPTION) ||
				undefined

			return {
				text: textParts.length ? textParts : [decodeHtml(name)],
				size,
				href: href || undefined,
			}
		})
}

const proListItems = computed<ProListItem[]>(() => {
	const tree = designersData.value?.data?.TREE || []
	return [...tree]
		.sort((a, b) => Number(a.SECTION?.SORT || 0) - Number(b.SECTION?.SORT || 0))
		.map(section => {
			const sectionTitle = section.SECTION?.NAME || ''
			const baseSectionItems = mapSlides(section.ITEMS || [])
			const childSections = (section.CHILDREN || [])
				.slice()
				.sort(
					(a, b) => Number(a.SECTION?.SORT || 0) - Number(b.SECTION?.SORT || 0),
				)
				.map(child => ({
					title: child.SECTION?.NAME || '',
					slides: mapSlides(child.ITEMS || []),
				}))
				.filter(child => child.slides.length)

			const sections: ProListSection[] = []

			if (baseSectionItems.length) {
				sections.push({
					title: sectionTitle,
					slides: baseSectionItems,
				})
			}

			sections.push(...childSections)

			return {
				title: sectionTitle,
				sections,
				sliderMode: 'wide',
				showButtons: sections.length > 1,
			}
		})
		.filter(item => item.sections.length)
})
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<HeroWrapper class="pro-hero" :title="pageTitle" :texts="pageTexts" />
		<ProList :items="proListItems" />
		<ConsultationBlock />
		<DownloadDocumentsPopup />
	</main>
	<DocumentsModal />
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
