<script setup lang="ts">
import type { PartnerSlideProps } from '~/components/slides/PartnerSlide.vue'

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
const { data: trustData } = await useAsyncData('mainTrust', () =>
	$fetch<MainTrustResponse>(`${config.app.baseURL}api/mainTrust`),
)

const resolveMediaSrc = (src?: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

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
	<div class="a-partners">
		<div class="container">
			<PartnersSlider :title="trustTitle" :list="trustSlides" />
		</div>
	</div>
</template>

<style lang="scss">
.a-partners {
	display: flex;
	margin-bottom: 160px;
	@include ultrahd {
		margin-bottom: 100px;
	}
}
</style>
