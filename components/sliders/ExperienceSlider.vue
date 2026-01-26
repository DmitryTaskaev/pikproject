<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'

const slides = [
	{
		title: '21',
		subtitle: 'год на рынке',
		description:
			'За двадцать один год своего существования мы завоевали доверие и стали поставщиком ведущих российских компаний как ПАО «Т\u00A0Плюс», ПАО «Полюс» и многих других. Являемся сертифицированным поставщиком ПАО «Нефтяная компания «РОСНЕФТЬ», ПАО «ГАЗПРОМНЕФТЬ».',
	},
	{
		title: '22',
		subtitle: 'год на рынке',
		description:
			'За двадцать один год своего существования мы завоевали доверие и стали поставщиком ведущих российских компаний как ПАО «Т\u00A0Плюс», ПАО «Полюс» и многих других. Являемся сертифицированным поставщиком ПАО «Нефтяная компания «РОСНЕФТЬ», ПАО «ГАЗПРОМНЕФТЬ».',
	},
	{
		title: '23',
		subtitle: 'год на рынке',
		description:
			'За двадцать один год своего существования мы завоевали доверие и стали поставщиком ведущих российских компаний как ПАО «Т\u00A0Плюс», ПАО «Полюс» и многих других. Являемся сертифицированным поставщиком ПАО «Нефтяная компания «РОСНЕФТЬ», ПАО «ГАЗПРОМНЕФТЬ».',
	},
]
</script>

<template>
	<div class="experience-slider-container">
		<BaseSwiper
			class="experience-slider"
			loop
			modificator="experience"
			:space-between="0"
			:navigation="false"
			:pagination="{
				el: '.experience-slider-pagination',
				clickable: true,
				renderBullet: (index, className) => {
					return `<div class='${className} pagination-bullet'></div>`
				},
			}"
			:show-navigation-with-pagination="false"
			:slides-per-view="1"
			:effect="'fade'"
			:fade-effect="{ crossFade: true }"
		>
			<SwiperSlide v-for="(slide, index) in slides" :key="index">
				<ExperienceSlide v-bind="slide" />
			</SwiperSlide>
		</BaseSwiper>

		<div class="experience-slider-pagination"></div>
	</div>
</template>

<style lang="scss">
.experience-slider-container {
	position: relative;
	height: 100%;
}

.experience-slider {
	height: 100%;
	position: relative;

	&-pagination {
		z-index: 10;
		position: absolute;
		bottom: var(--space-sm) !important;
		left: var(--space-sm) !important;

		display: flex;
		align-items: center;
		gap: 3px;
		.pagination-bullet {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			border: 1px solid #426abf;
			cursor: pointer;
			background: transparent;
			transition: all 0.3s ease;

			&.swiper-pagination-bullet-active {
				background: var(--accent-color);
				border: 1px solid var(--accent-color);
			}
		}
	}
	.swiper {
		height: 100%;
		width: 100%;
	}
}
</style>
