<script setup lang="ts">
interface CompanyProductionItem {
	NAME?: string
	PREVIEW_TEXT?: string
	PROPERTIES?: {
		TEXT_BUTTON?: { VALUE?: string }
		URL_BUTTON?: { VALUE?: string }
	}
}

interface CompanyProductionResponse {
	data?: {
		items?: CompanyProductionItem[]
	}
}

const { t } = useSiteI18n()
const config = useRuntimeConfig()
const { data: companyProductionData } = await useLocalizedAsyncData(
	'companyProduction',
	lang =>
		$fetch<CompanyProductionResponse>(
			`${config.app.baseURL}api/companyProduction`,
			{ query: { lang } },
		),
)

const companyProductionItem = computed(
	() => companyProductionData.value?.data?.items?.[0],
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

const splitParagraphs = (value?: string) => {
	if (!value) return []
	return decodeHtml(value)
		.replace(/\r\n/g, '\n')
		.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '\n\n')
		.replace(/<br\s*\/?>/gi, '\n')
		.split(/\n\s*\n/)
		.map(item =>
			item
				.split('\n')
				.map(line => line.trim())
				.filter(Boolean),
		)
		.filter(item => item.length > 0)
}

const resolveHref = (url?: string) => {
	if (!url) return '/lab'
	if (/^https?:\/\//.test(url)) return url
	const base = config.app.baseURL.replace(/\/$/, '')
	if (url.startsWith(base)) return url
	return url.startsWith('/') ? `${base}${url}` : url
}

const title = computed(
	() => companyProductionItem.value?.NAME || String(t('about_manufacture_title')),
)
const descLines = computed(() => {
	const apiParagraphs = splitParagraphs(companyProductionItem.value?.PREVIEW_TEXT)
	if (apiParagraphs.length > 0) return apiParagraphs
	return [
		[String(t('about_manufacture_desc_1'))],
		[String(t('about_manufacture_desc_2'))],
		[String(t('about_manufacture_desc_3'))],
		[String(t('about_manufacture_desc_4'))],
		[String(t('about_manufacture_desc_5'))],
	]
})
const buttonText = computed(
	() =>
		companyProductionItem.value?.PROPERTIES?.TEXT_BUTTON?.VALUE ||
		String(t('about_manufacture_button')),
)
const buttonHref = computed(() =>
	resolveHref(companyProductionItem.value?.PROPERTIES?.URL_BUTTON?.VALUE),
)
</script>

<template>
	<section class="a-manufacture">
		<div class="container">
			<BorderLine
				class="a-manufacture__container"
				position="top"
				design="primary"
			>
				<div class="a-manufacture__content">
					<CustomTitle class="a-manufacture__content--title" tag="h1">
						{{ title }}
					</CustomTitle>
					<div class="a-manufacture__content--desc">
						<template v-for="(lines, index) in descLines" :key="index">
							<Text class="a-manufacture__content--desc_item">
								<template v-for="(line, i) in lines" :key="`d-${index}-${i}`">
									<span>{{ line }}</span>
									<br v-if="i < lines.length - 1" />
								</template>
							</Text>
						</template>
					</div>
					<div class="a-manufacture__content--btn-wrap">
						<Button
							class="a-manufacture__content--btn"
							:text="buttonText"
							:href="buttonHref"
							size="lg"
						/>
					</div>
				</div>
			</BorderLine>
		</div>
	</section>
</template>

<style lang="scss">
.a-manufacture {
	margin-bottom: 100px;
	@include tablet {
		margin-bottom: 120px;
	}
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
			gap: var(--space-md);
			@include tablet {
				grid-column: 2;
				grid-row: 1/3;
			}
			@include ultrahd {
				padding-top: var(--space-md);
			}
		}
		&--btn-wrap {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}
		&--btn {
			bottom: var(--space-sm);
			position: sticky;
		}
	}
}
</style>
