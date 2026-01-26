<script setup lang="ts">
import type { IconProps } from '~/components/ui/base/Icon.vue'

interface MainBottomBannerItem {
	ID: string
	NAME: string
	SORT: string
	PROPERTIES: {
		ICON?: {
			SRC: string
		}
	}
}

interface MainBottomBannerResponse {
	status: string
	data: {
		items: MainBottomBannerItem[]
	}
}

const fallbackBenefitsList: { icon: IconProps; title: string }[] = [
	{
		icon: {
			name: 'price',
			isSprite: false,
		},
		title: 'Выгодные цены',
	},
	{
		icon: {
			name: 'reliability',
			isSprite: false,
		},
		title: 'надежность',
	},
	{
		icon: {
			name: 'experience',
			isSprite: false,
		},
		title: 'богатый опыт',
	},
	{
		icon: {
			name: 'location',
			isSprite: false,
		},
		title: 'Точная доставка',
	},
]

const config = useRuntimeConfig()
const { data: mainBottomBannerData } = await useAsyncData(
	'mainBottomBanner',
	() => $fetch<MainBottomBannerResponse>(`${config.app.baseURL}api/mainBottomBanner`),
)

const resolveIconSrc = (src?: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${config.public.apiOrigin}${src}`
	return src
}

const benefitsList = computed(() => {
	const items = mainBottomBannerData.value?.data?.items
	if (!items || items.length === 0) return fallbackBenefitsList

	return items.map(item => ({
		icon: {
			name: 'external',
			isSprite: false,
			src: resolveIconSrc(item.PROPERTIES?.ICON?.SRC),
		},
		title: item.NAME,
	}))
})
</script>

<template>
	<div class="advantages">
		<div class="container">
			<div class="advantages__container">
				<div class="advantages__top to-animate">
					<BenefitCard
						v-for="(item, index) in benefitsList"
						:key="index"
						v-bind="item"
					/>
				</div>
				<Regalia />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.advantages {
	margin-bottom: var(--space-section-sm);
	@include tablet {
		margin-bottom: var(--space-section-md);
	}
	@include ultrahd {
		margin-bottom: var(--space-section-lg);
	}
	&__container {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		@include tablet {
			gap: var(--space-xl);
		}
		@include ultrahd {
			gap: var(--space-md);
		}
	}
	&__top {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xs);
		@include tablet {
			grid-template-columns: repeat(2, 1fr);
		}
		@include ultrahd {
			grid-template-columns: repeat(4, 1fr);
			gap: var(--space-sm);
		}
		// Анимация появления для advantages__top
		&.to-animate {
			.benefit-card {
				opacity: 0;
				transform: translateY(20px);
				transition: opacity 0.3s linear, transform 0.3s linear;
				@include ultrahd {
					transform: translateY(30px);
				}
				&:nth-child(1) {
					transition-delay: 0s;
				}
				&:nth-child(2) {
					transition-delay: 0.3s;
				}
				&:nth-child(3) {
					transition-delay: 0.6s;
				}
				&:nth-child(4) {
					transition-delay: 0.9s;
				}
			}
			&.animated {
				.benefit-card {
					transform: translateY(0);
					opacity: 1;
				}
			}
		}
	}
}
</style>
