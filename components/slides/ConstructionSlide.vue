<script setup lang="ts">
import { ref } from 'vue'
import type { ImageProps } from '../ui/base/Image.vue'

interface Point {
	title: string
	top: string
	left: string
}

export interface ConstructionSlideProps {
	image: ImageProps
	description: string
	points?: Point[]
}

const { image, points, description } = defineProps<ConstructionSlideProps>()

// let hideTimeout

const visibleDescriptions = ref<Set<number>>(new Set())

const showDescription = (index: number) => {
	visibleDescriptions.value.add(index)
	// if (hideTimeout) clearTimeout(hideTimeout)
}

const hideDescription = (index: number) => {
	visibleDescriptions.value.delete(index)
	// hideTimeout = setTimeout(() => visibleDescriptions.value.delete(index), 1000)
}
</script>

<template>
	<div class="construction-slide">
		<div class="construction-slide__image-wrap">
			<div class="construction-slide__image">
				<Image class="construction-slide__image--item" v-bind="image" />
				<div
					v-for="(item, idx) in points"
					:key="idx"
					class="construction-slide__dot"
					:class="`construction-slide__dot_${idx + 1}`"
					:style="{ top: item.top, left: item.left }"
				>
					<!-- eslint-disable-next-line vue/attributes-order -->
					<ClientOnly>
						<div
							class="construction-slide__dot--wrap"
							v-click-away="() => hideDescription(idx)"
						>
							<div
								class="construction-slide__dot--icon"
								:class="{
									'construction-slide__dot--icon_active':
										visibleDescriptions.has(idx),
								}"
								@mouseenter="showDescription(idx)"
								@click="
									visibleDescriptions.has(idx)
										? hideDescription(idx)
										: showDescription(idx)
								"
								@mouseleave="hideDescription(idx)"
							>
								<span />
								<span />
							</div>
							<div
								class="construction-slide__dot--desc"
								:class="{
									'construction-slide__dot--desc_visible':
										visibleDescriptions.has(idx),
								}"
								@mouseenter="showDescription(idx)"
								@mouseleave="hideDescription(idx)"
							>
								<Text class="construction-slide__dot--desc_item" size="xs">{{
									item.title
								}}</Text>
							</div>
						</div>
					</ClientOnly>
				</div>
			</div>
		</div>
		<div class="construction-slide__content-wrap">
			<div class="construction-slide__content">
				<Text class="construction-slide__content--desc" size="md">{{
					description
				}}</Text>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.construction-slide {
	display: grid;
	grid-template-columns: 100%;
	row-gap: var(--space-xl);
	@include tablet {
		grid-template-columns: repeat(2, calc(50% - var(--space-sm) / 2));
		column-gap: var(--space-sm);
		row-gap: 0;
	}
	@include ultrahd {
		grid-template-columns: repeat(2, calc(50% - var(--space-xl) / 2));
		column-gap: var(--space-xl);
	}

	&__image-wrap {
		@include tablet {
			grid-row: 1/2;
			grid-column: 2/3;
		}
	}
	&__image {
		position: relative;
		width: 100%;
		padding-bottom: 68%;
		&--item {
			position: absolute;
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	&__dot {
		cursor: pointer;
		position: absolute;
		width: 0;
		height: 0;
		// z-index: 1;

		&--wrap {
			position: relative;
		}
		&--icon {
			// cursor: pointer;
			z-index: 10;
			position: relative;
			z-index: 10;
			height: 28px;
			width: 28px;
			border-radius: 50%;
			background: var(--page-bg);
			border: 2px solid var(--main-bg);
			display: flex;
			justify-content: center;
			align-items: center;
			transition: all 0.3s ease;

			span {
				display: block;
				border-radius: 1px;
				width: 9px;
				height: 1px;
				background: var(--secondary-color);
				transition: transform 0.3s ease;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, 50%);

				&:last-child {
					top: calc(50%);
					transform: translate(-50%, 50%) rotate(-90deg);
				}
			}
			&_active {
				span:last-child {
					transform: translate(-50%, 50%) rotate(0deg);
				}
			}
		}
		&--desc {
			transform: translate(calc(-50% + 14px), -100%);
			top: -10px;
			left: 0;
			position: absolute;
			display: block;
			padding: 12px 14px;
			background: var(--page-bg);
			border: 1px solid #b8cce1;
			border-radius: 5px;
			opacity: 0;
			// visibility: hidden;
			// transition: opacity 1s ease, visibility 1s ease;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 11;
			pointer-events: none;
			user-select: none;

			&_visible {
				opacity: 1;
				pointer-events: auto;
				user-select: auto;
				// visibility: visible;
			}

			&_item {
				width: 167px;
				color: var(--main-bg);
			}
		}

		// &_1 {
		// 	top: 65%;
		// 	left: 23%;
		// }
		// &_2 {
		// 	top: 57%;
		// 	left: 68%;
		// }
		// &_3 {
		// 	top: 28.5%;
		// 	left: 71%;
		// }
	}
	&__content-wrap {
		align-self: flex-end;
		@include tablet {
			grid-row: 1/3;
			grid-column: 1/2;
		}
		@include ultrahd {
			padding-top: 116px;
		}
	}
	&__content {
		padding-left: var(--space-sm);
		border-left: 1px solid #dbdbdb;
		height: 335px;
		&--desc {
			padding-top: 50px;
			@include tablet {
				max-width: 300px;
			}
			@include ultrahd {
				max-width: 386px;
			}
		}
	}
}
</style>
