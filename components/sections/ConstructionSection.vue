<script setup lang="ts">
import { ref } from 'vue'
import type { ConstructionSlideProps } from '../slides/ConstructionSlide.vue'

interface Slider {
	button: string
	slides: ConstructionSlideProps[]
}

interface ConstructionSectionProps {
	title: string
	slides?: ConstructionSlideProps[]
	sliders?: Slider[]
}

const { title, sliders, slides } = defineProps<ConstructionSectionProps>()

const activeSliderIndex = ref(0)

const setActiveSlider = (index: number) => {
	activeSliderIndex.value = index
}
</script>

<template>
	<div class="construction-section-wrap">
		<div class="container">
			<BorderLine class="construction-section" position="top" design="primary">
				<custom-title class="construction-section__title" mode="xl">{{
					title
				}}</custom-title>
				<div v-if="sliders" class="construction-section__container">
					<div class="construction-section__btns">
						<button
							v-for="(item, idx) in sliders"
							:key="idx"
							class="construction-section__btn"
							:class="{
								[`construction-section__btn_${idx + 1}`]: true,
								'construction-section__btn_active': activeSliderIndex === idx,
							}"
							@click="setActiveSlider(idx)"
						>
							{{ item.button }}
						</button>
					</div>
					<div class="construction-section__sliders">
						<construction-slider
							v-for="(item, index) in sliders"
							:key="index"
							:slides="item.slides"
							:class="{
								'construction-section__slider': true,
								'construction-section__slider_active':
									activeSliderIndex === index,
							}"
							:is-sliders="true"
							:modificator="`construction-complex-${index + 1}`"
						/>
					</div>
				</div>
				<div v-else-if="slides" class="construction-section__container">
					<construction-slider :slides="slides" modificator="construction" />
				</div>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.construction-section-wrap {
	margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: var(--space-section-md);
	}
}
.construction-section {
	padding-top: var(--space-md);
	@include ultrahd {
		// padding-top: 50px;
	}
	&__title {
		margin-bottom: 60px;
		@include tablet {
			margin-bottom: 80px;
		}
		@include ultrahd {
			margin-bottom: 0;
			position: absolute;
			top: 50px;
			left: 0;
			margin-bottom: 0;
		}
	}
	&__container {
		position: relative;
	}
	&__btns {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		align-items: center;
		position: absolute;
		left: 0;
		bottom: 315px;
		z-index: 20;
	}
	&__btn {
		font-size: 18px;
		line-height: 110%;
		letter-spacing: -0.01em;
		color: var(--main-color);
		transition: all 0.2s ease-in;
		border-bottom: 1px solid transparent;
		&_active {
			color: var(--primary-color);
			border-bottom: 1px solid currentColor;
		}
	}
	&__sliders {
	}
	&__slider {
		max-height: 0;
		opacity: 0;
		pointer-events: none;
		user-select: none;
		&_active {
			max-height: max-content;
			opacity: 1;
			pointer-events: auto;
			user-select: auto;
		}
	}
}
</style>
