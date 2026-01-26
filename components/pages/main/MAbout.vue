<script setup lang="ts">
import type { PartnerSlideProps } from '~/components/slides/PartnerSlide.vue'

interface AboutCompanyItem {
	NAME?: string
	PREVIEW_TEXT?: string
	PROPERTIES?: {
		FIRST_BUTTON_TEXT?: { VALUE?: string }
		FIRST_BUTTON_URL?: { VALUE?: string }
		TWO_BUTTON_TEXT?: { VALUE?: string }
		TWO_BUTTON_URL?: { VALUE?: string }
	}
}

interface MainAboutCompanyResponse {
	data?: {
		items?: AboutCompanyItem[]
	}
}

interface TrustItem {
	NAME?: string
	SORT?: string
	PREVIEW_PICTURE_SRC?: string
}

interface MainTrustResponse {
	data?: {
		items?: TrustItem[]
	}
	meta?: {
		iblock?: {
			name?: string
		}
	}
}

const config = useRuntimeConfig()
const { data: aboutCompanyData } = await useAsyncData('mainAboutCompany', () =>
	$fetch<MainAboutCompanyResponse>(`${config.app.baseURL}api/mainAboutCompany`),
)
const { data: trustData } = await useAsyncData('mainTrust', () =>
	$fetch<MainTrustResponse>(`${config.app.baseURL}api/mainTrust`),
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

const resolveHref = (url?: string) => {
	if (!url) return '#'
	if (/^https?:\/\//.test(url)) return url
	const base = config.app.baseURL.replace(/\/$/, '')
	return url.startsWith('/') ? `${base}${url}` : url
}

const resolveMediaSrc = (src?: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

const aboutItem = computed(() => aboutCompanyData.value?.data?.items?.[0])
const aboutTitle = computed(() => aboutItem.value?.NAME || 'О компании')
const aboutTexts = computed(() =>
	splitParagraphs(aboutItem.value?.PREVIEW_TEXT),
)

const firstButtonText = computed(
	() => aboutItem.value?.PROPERTIES?.FIRST_BUTTON_TEXT?.VALUE,
)
const firstButtonUrl = computed(
	() => aboutItem.value?.PROPERTIES?.FIRST_BUTTON_URL?.VALUE,
)
const secondButtonText = computed(
	() => aboutItem.value?.PROPERTIES?.TWO_BUTTON_TEXT?.VALUE,
)
const secondButtonUrl = computed(
	() => aboutItem.value?.PROPERTIES?.TWO_BUTTON_URL?.VALUE,
)

const trustTitle = computed(
	() => trustData.value?.meta?.iblock?.name || 'Нам доверяют',
)
const trustSlides = computed<PartnerSlideProps[]>(() => {
	const items = trustData.value?.data?.items || []
	return [...items]
		.sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0))
		.map(item => ({
			title: item.NAME || '',
			icon: {
				name: item.NAME || 'partner',
				isSprite: false,
				src: resolveMediaSrc(item.PREVIEW_PICTURE_SRC),
			},
		}))
		.filter(item => item.title && item.icon.src)
})
</script>

<template>
	<section class="m-about">
		<div class="container">
			<BorderLine class="m-about__container" position="top" design="primary">
				<div class="m-about__content">
					<CustomTitle class="m-about__content--title">
						{{ aboutTitle }}
					</CustomTitle>
					<div class="m-about__content--desc">
						<Text v-for="(item, index) in aboutTexts" :key="index">
							{{ item }}
						</Text>
					</div>
					<div class="m-about__content--btns-wrap">
						<div class="m-about__content--btns">
							<Button
								v-if="firstButtonText && firstButtonUrl"
								class="m-about__content--btn"
								:text="firstButtonText"
								:href="resolveHref(firstButtonUrl)"
								size="lg"
							/>
							<Button
								v-if="secondButtonText && secondButtonUrl"
								class="m-about__content--btn"
								:text="secondButtonText"
								:href="resolveHref(secondButtonUrl)"
								size="lg"
							/>
						</div>
					</div>
				</div>
				<div class="m-about__slider">
					<PartnersSlider :title="trustTitle" :list="trustSlides" />
				</div>
			</BorderLine>
		</div>
	</section>
</template>

<style lang="scss">
.m-about {
	margin-bottom: 160px;
	&__container {
		padding-top: var(--space-md);
		@include ultrahd {
			padding-top: var(--space-xl);
		}
	}
	&__content {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
		margin-bottom: var(--space-section-sm);
		@include tablet {
			gap: var(--space-sm);
			justify-content: space-between;
			grid-template-columns: repeat(2, 1fr);
			// grid-template-rows: repeat(2, 1fr);
			grid-template-rows: max-content 1fr;
			margin-bottom: var(--space-section-md);
		}
		@include ultrahd {
			column-gap: var(--space-xl);
			margin-bottom: var(--space-section-lg);
		}
		&--title {
		}
		&--desc {
			display: flex;
			flex-direction: column;
			gap: var(--space-xs);
			@include tablet {
				grid-column: 2;
				grid-row: 1/3;
			}
			@include ultrahd {
				padding-top: var(--space-md);
			}
		}
		&--btns-wrap {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}
		&--btns {
			bottom: var(--space-sm);
			position: sticky;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			gap: 6px;
		}
		&--btn {
		}
	}
	&__slider {
	}
}
</style>
