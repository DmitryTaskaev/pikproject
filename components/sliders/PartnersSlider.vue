<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import type { PartnerSlideProps } from '../slides/PartnerSlide.vue'

interface PartnersSliderProps {
	title?: string
	list?: PartnerSlideProps[]
}

const props = defineProps<PartnersSliderProps>()

const fallbackList: PartnerSlideProps[] = [
	{
		icon: {
			name: 'sibur',
			isSprite: false,
			width: '175px',
			height: '33px',
		},
		title: 'Сибур',
	},
	{
		icon: {
			name: 'pik',
			isSprite: false,
			width: '107px',
			height: '33px',
		},
		title: 'Пик группа',
	},
	{
		icon: {
			name: 'sibur',
			isSprite: false,
			width: '175px',
			height: '33px',
		},
		title: 'Сибур',
	},
	{
		icon: {
			name: 'pik',
			isSprite: false,
			width: '107px',
			height: '33px',
		},
		title: 'Пик группа',
	},
	{
		icon: {
			name: 'sibur',
			isSprite: false,
			width: '175px',
			height: '33px',
		},
		title: 'Сибур',
	},
	{
		icon: {
			name: 'pik',
			isSprite: false,
			width: '107px',
			height: '33px',
		},
		title: 'Пик группа',
	},
	{
		icon: {
			name: 'sibur',
			isSprite: false,
			width: '175px',
			height: '33px',
		},
		title: 'Сибур',
	},
	{
		icon: {
			name: 'pik',
			isSprite: false,
			width: '107px',
			height: '33px',
		},
		title: 'Пик группа',
	},
]

const partnersList = computed(() =>
	props.list && props.list.length ? props.list : fallbackList,
)
const title = computed(() => props.title || 'Нам доверяют')
</script>

<template>
	<DecorativeWrap class="partners-slider-wrap" :title="title">
		<BaseSwiper
			class="partners-slider"
			loop
			modificator="partners"
			:breakpoints="{ 768: { slidesPerView: 2 }, 1440: { slidesPerView: 4 } }"
		>
			<SwiperSlide v-for="(slide, index) in partnersList" :key="index">
				<PartnerSlide v-bind="slide" />
			</SwiperSlide>
		</BaseSwiper>
	</DecorativeWrap>
</template>

<style lang="scss">
.partners-slider-wrap {
	margin-bottom: 88px;
	@include ultrahd {
		margin-bottom: 98px;
	}
}
.partners-slider {
	// custom wrapper styles if needed
	.swiper__navigation_partners {
		position: absolute;
		left: 0;
		bottom: -50px;
		transform: translateY(100%);
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 6px;
		@include ultrahd {
			bottom: -60px;
		}
	}
}
</style>
