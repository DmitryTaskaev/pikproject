<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import type { PipeCardProps } from '../cards/PipeCard.vue'

interface PipesListProps {
	titleList: string[]
	slides?: PipeCardProps[][]
	cardList?: PipeCardProps[]
}
const props = defineProps<PipesListProps>()

const isSlider = props.slides ? true : false
const instanceId = useId().replace(/:/g, '')
const paginationClass = `pipes-list__pagination-${instanceId}`
const navPrevClass = `pipes-list__nav-prev-${instanceId}`
const navNextClass = `pipes-list__nav-next-${instanceId}`
</script>

<template>
	<div class="pipes-list">
		<div class="pipes-list__viewport">
			<div class="pipes-list__content">
				<div class="pipes-list__top">
					<div />
					<template v-for="(value, index) in props.titleList" :key="index">
						<div
							class="pipes-list__top--measure"
							:class="`pipes-list__top--measure_${index + 1}`"
						>
							<Text size="md" line-height="sm" design="primary">
								{{ value }}
							</Text>
						</div>
					</template>
					<div />
				</div>
				<div v-if="isSlider" class="pipes-list__slider">
					<BaseSwiper
						:space-between="0"
						:slides-per-view="1"
						:navigation="{
							nextEl: `.${navNextClass}`,
							prevEl: `.${navPrevClass}`,
						}"
						:pagination="{
							el: `.${paginationClass}`,
							clickable: true,
							renderBullet: (index: number, className: string) => {
								return `<span class='${className}'>${index + 1}</span>`
							},
						}"
						:show-navigation-with-pagination="false"
						:loop="true"
						:effect="'fade'"
						:fade-effect="{ crossFade: true }"
						:no-swiping="true"
						:no-swiping-class="'swiper-no-swiping'"
						mode="overflow-controls"
						modificator="pipes"
					>
						<SwiperSlide
							class="swiper-no-swiping"
							v-for="(slide, slideIndex) in props.slides"
							:key="slideIndex"
						>
							<div class="pipes-list__slide">
								<PipeCard
									v-for="(item, idx) in slide"
									:key="idx"
									v-bind="item"
								/>
							</div>
						</SwiperSlide>
					</BaseSwiper>
				</div>
				<div v-else class="pipes-list__slide">
					<PipeCard
						v-for="(item, index) in props.cardList"
						:key="index"
						v-bind="item"
					/>
				</div>
			</div>
		</div>

		<!-- Внешние элементы управления -->
		<div
			v-if="isSlider && props.slides && props.slides.length > 1"
			class="pipes-list__controls"
		>
			<Button
				:class="['pipes-list__nav-btn', navPrevClass]"
				:icon="{ name: 'button-arrow', mode: 'prev' }"
			/>
			<div :class="paginationClass" />
			<Button
				:class="['pipes-list__nav-btn', navNextClass]"
				:icon="{ name: 'button-arrow', mode: 'next' }"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.pipes-list {
	position: relative;
	width: 100%;
	max-width: 100%;
	padding-bottom: 120px;

	@include ultrahd {
		padding-bottom: 0;
	}
	&__viewport {
		padding-bottom: var(--space-md);
		overflow-x: auto;
		overflow-y: hidden;

		&::-webkit-scrollbar {
			width: 100%;
			background: #cfd9ef;
			height: 4px;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-track {
			background: #cfd9ef;
			border-radius: 2px;
		}

		&::-webkit-scrollbar-thumb {
			background: #11437a;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #0a2c5a;
		}

		&::-webkit-scrollbar-corner {
			background: #cfd9ef;
		}
	}
	&__content {
		width: 1340px;
		flex: 0 0 1340px;
		@include ultrahd {
			width: 100%;
			flex: 0 0 100%;
		}
	}
	&__top {
		padding-bottom: 12px;
		border-bottom: 1px solid var(--graphic-main);
		display: grid;
		grid-template-columns: 1fr 130px 40px 110px 40px 80px 70px 60px 50px 150px 30px 100px 160px;
		&--measure {
			display: flex;
			justify-content: center;
			align-items: center;
			&_1 {
				grid-column: 2/3;
			}
			&_2 {
				grid-column: 4/5;
			}
			&_3 {
				grid-column: 6/7;
			}
			&_4 {
				grid-column: 8/9;
			}
			&_5 {
				grid-column: 10/11;
			}
			&_6 {
				grid-column: 12/13;
			}
		}
	}

	&__slider {
		// padding-bottom: 154px;
		// margin-bottom: -154px;

		.swiper {
			touch-action: auto !important;
			@include ultrahd {
				margin-bottom: 50px;
			}
		}
	}

	&__controls {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		justify-items: center;
	}

	&__nav-btn {
		flex: 0 0 auto;
	}

	&__pagination {
		gap: 10px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
