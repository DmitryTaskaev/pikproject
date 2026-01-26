<script setup lang="ts">
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import type { SwiperModule, SwiperOptions } from 'swiper/types'
import { Swiper } from 'swiper/vue'

interface BaseSwiperProps {
	class?: string | string[]
	modules?: SwiperModule[]
	slidesPerView?: number | 'auto'
	spaceBetween?: number
	navigation?: boolean | SwiperOptions['navigation']
	pagination?: boolean | SwiperOptions['pagination']
	showNavigationWithPagination?: boolean
	autoplay?: boolean
	loop?: boolean
	breakpoints?: Record<number, object>
	effect?: SwiperOptions['effect']
	fadeEffect?: SwiperOptions['fadeEffect']
	allowTouchMove?: boolean
	modificator?: string
	noSwiping?: boolean
	noSwipingClass?: string
	autoHeight?: boolean
	observer?: boolean
	observeParents?: boolean
	navigationMode?: 'default' | 'centered'
	controlsMode?: 'bottom'
	isButtonsReverse?: boolean
	speed?: number
}

const props = withDefaults(defineProps<BaseSwiperProps>(), {
	class: '',
	modules: () => [Navigation, Pagination, Autoplay, EffectFade],
	slidesPerView: 1,
	spaceBetween: 20,
	navigation: true,
	pagination: false,
	showNavigationWithPagination: false,
	autoplay: false,
	loop: false,
	breakpoints: () => ({}),
	effect: undefined,
	fadeEffect: undefined,
	allowTouchMove: true,
	modificator: undefined,
	noSwiping: true,
	noSwipingClass: 'swiper-no-swiping',
	autoHeight: false,
	observer: false,
	observeParents: false,
	navigationMode: 'default',
	isButtonsReverse: false,
	speed: 400,
	controlsMode: undefined,
})

const classes = computed(() => {
	const base = ['base-swiper']
	if (props.isButtonsReverse) {
		base.push('base-swiper_btn-reverse')
	}
	if (props.class) {
		base.push(...(Array.isArray(props.class) ? props.class : [props.class]))
	}

	return base
})

const computedPagination = computed(() => {
	if (props.controlsMode === 'bottom') {
		return {
			el: `.swiper__pagination_${props.modificator}`,
			clickable: true,
			renderBullet: (index: number, className: string) =>
				`<span class="${className}"></span>`,
		}
	}
	if (!props.pagination) return false
	if (typeof props.pagination === 'object') {
		return {
			...props.pagination,
		}
	}
	return {
		el: `.swiper__pagination`,
		clickable: true,
		renderBullet: (index: number, className: string) =>
			`<span class="${className}">${index + 1}</span>`,
	}
})

const navigationConfig = computed(() => {
	if (!props.navigation) return false
	if (typeof props.navigation === 'object') {
		return props.navigation
	}
	return {
		nextEl: `.swiper__button_next_${props.modificator}`,
		prevEl: `.swiper__button_prev_${props.modificator}`,
	}
})

const showNavigation = computed(() => {
	if (props.navigation && !computedPagination.value) return true
	if (props.navigation && props.showNavigationWithPagination) return true
	if (
		props.navigation &&
		typeof props.pagination === 'object' &&
		props.pagination.type === 'fraction'
	)
		return true
	return false
})

const showPaginationControls = computed(() => {
	if (props.controlsMode === 'bottom') {
		return true
	}
	return computedPagination.value && props.showNavigationWithPagination
})

const iconName = computed(() => {
	return props.isButtonsReverse ? 'button-arrow-reverse' : 'button-arrow'
})
</script>

<template>
	<div :class="classes">
		<Swiper
			:modules="props.modules"
			:slides-per-view="props.slidesPerView"
			:space-between="props.spaceBetween"
			:allow-touch-move="props.allowTouchMove"
			:navigation="navigationConfig"
			:pagination="computedPagination"
			:autoplay="props.autoplay"
			:loop="props.loop"
			:breakpoints="props.breakpoints"
			:effect="props.effect"
			:fade-effect="props.fadeEffect"
			:no-swiping="props.noSwiping"
			:no-swiping-class="props.noSwipingClass"
			:auto-height="props.autoHeight"
			:observer="props.observer"
			:observeParents="props.observeParents"
			:speed="props.speed"
		>
			<slot />
		</Swiper>
		<slot name="after-swiper" />
		<div
			v-if="props.controlsMode === 'bottom'"
			:class="[
				'swiper__controls',
				{
					swiper__controls_bottom: props.controlsMode === 'bottom',
				},
			]"
		>
			<Button
				:class="`swiper__button swiper__button_prev swiper__button_prev_${props.modificator}`"
				:icon="{ name: iconName, mode: 'prev' }"
			/>
			<div
				:class="`swiper__pagination swiper__pagination_${props.modificator}`"
			/>
			<Button
				:class="`swiper__button swiper__button_next swiper__button_next_${props.modificator}`"
				:icon="{ name: iconName, mode: 'next' }"
			/>
		</div>
		<div
			v-else-if="showPaginationControls"
			:class="[
				'swiper__controls',
				{
					swiper__controls_bottom: props.controlsMode === 'bottom',
				},
			]"
		>
			<Button
				:class="`swiper__button swiper__button_prev swiper__button_prev_${props.modificator}`"
				:icon="{ name: iconName, mode: 'prev' }"
			/>
			<div
				:class="`swiper__pagination swiper__pagination_${props.modificator}`"
			/>
			<Button
				:class="`swiper__button swiper__button_next swiper__button_next_${props.modificator}`"
				:icon="{ name: iconName, mode: 'next' }"
			/>
		</div>
		<div
			v-else-if="showNavigation"
			:class="[
				`swiper__navigation swiper__navigation_${props.modificator}`,
				{
					swiper__navigation_centered: props.navigationMode === 'centered',
				},
			]"
		>
			<Button
				:class="`swiper__button swiper__button_prev swiper__button_prev_${props.modificator}`"
				:icon="{ name: iconName, mode: 'prev' }"
			/>
			<Button
				:class="`swiper__button swiper__button_next swiper__button_next_${props.modificator}`"
				:icon="{ name: iconName, mode: 'next' }"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.swiper {
	&__controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		&_bottom {
			position: absolute;
			bottom: 30px;
			left: 10px;
			right: 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			z-index: 20;
			pointer-events: none;

			@include tablet {
				left: 20px;
				right: 20px;
				bottom: 50px;
			}

			.swiper__button {
				pointer-events: all;
			}

			.swiper__pagination {
				pointer-events: all;
			}
		}
	}
	&__button {
		flex: 0 0 auto;
	}
	&__pagination {
		gap: 10px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;

		&_m-hero {
			.swiper-pagination-bullet {
				width: 33px;
				height: 3px;
				border-radius: 16px;
				background: rgba(255, 255, 255);
				opacity: 0.3;
				transition: opacity 0.3s ease;
				cursor: pointer;

				&.swiper-pagination-bullet-active {
					background: #ffffff;
					opacity: 1;
				}
			}
		}
	}
	&__navigation {
		&_centered {
			position: absolute;
			top: 50%;
			left: 10px;
			right: 10px;
			transform: translateY(-50%);
			display: flex;
			align-items: center;
			justify-content: space-between;
			z-index: 10;
			pointer-events: none;

			@include tablet {
				left: 20px;
				right: 20px;
			}
		}
	}
}
.base-swiper {
	position: relative;

	&_btn-reverse {
		.swiper__button {
			pointer-events: all;
		}
		.swiper__button {
			transform: rotate(90deg);
		}
	}
}
</style>
