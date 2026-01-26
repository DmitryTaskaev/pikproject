<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import type { ImageProps } from '~/components/ui/base/Image.vue'

interface TestCardItem {
	title: string
	image?: ImageProps
}

interface LTestsProps {
	title?: string
	list?: TestCardItem[]
}

const props = withDefaults(defineProps<LTestsProps>(), {
	title: 'Объекты испытаний',
	list: () => [
		{ title: 'Трубы стальные, стальные в тепло- и\u00A0гидроизоляции.' },
		{ title: 'Трубы и фитинги пластиковые из полиэтилена низкого давления' },
		{ title: 'Трубы для водо-, газоснабжения, защиты кабельных сетей.' },
		{
			title:
				'Трубы пластиковые из полипропилена, гофрированные для канализационных сетей.',
		},
		{ title: 'Трубы стальные, стальные в тепло- и\u00A0гидроизоляции.' },
		{ title: 'Трубы и фитинги пластиковые из полиэтилена низкого давления' },
		{ title: 'Трубы для водо-, газоснабжения, защиты кабельных сетей.' },
		{
			title:
				'Трубы пластиковые из полипропилена, гофрированные для канализационных сетей.',
		},
	],
})

const breakpoints = {
	0: { slidesPerView: 1 },
	600: { slidesPerView: 2 },
	1024: { slidesPerView: 4 },
}
</script>

<template>
	<div class="l-tests-wrap">
		<div class="container">
			<BorderLine class="l-tests" position="top" design="primary">
				<section-wrapper :title="props.title">
					<BaseSwiper
						class="l-tests__slider"
						modificator="l-tests"
						:breakpoints="breakpoints"
						:space-between="20"
						:navigation="true"
						:loop="true"
					>
						<SwiperSlide v-for="(item, index) in props.list" :key="index">
							<TestCard v-bind="item" />
						</SwiperSlide>
					</BaseSwiper>
				</section-wrapper>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.l-tests-wrap {
	margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: var(--space-section-md);
	}

	.section-wrapper__top {
		margin-bottom: var(--space-xl);
	}
}
.l-tests {
	padding-top: var(--space-md);
	@include ultrahd {
		padding-top: var(--space-xl);
	}
	&__slider {
		position: relative;
		.swiper__navigation {
			position: absolute;
			top: calc(-1 * (60px + 9.5px + 19px));
			right: 0;
			z-index: 10;
			display: flex;
			gap: 6px;
		}
	}
}
</style>
