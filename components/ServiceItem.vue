<script setup lang="ts">
import type { ImageProps } from './ui/base/Image.vue'

interface Measure {
	title: string
	value: string
}

interface Content {
	desc: string
	measures: Measure[]
}

export interface ListItem {
	title: string[]
	content: Content
	image?: ImageProps
}

export interface ServiceItemProps {
	listItem: ListItem
	isBigBtn?: boolean
}

const { listItem, isBigBtn } = defineProps<ServiceItemProps>()
</script>

<template>
	<div class="service-item">
		<section-dropdown :is-big-btn="isBigBtn">
			<template #header>
				<div class="service-item__top">
					<div class="service-item__top--image">
						<Image
							v-if="listItem.image"
							class="service-item__top--image_item"
							v-bind="listItem.image"
						/>
					</div>
					<Text
						class="service-item__top--title"
						line-height="md"
						design="black"
					>
						<template v-for="(item, index) in listItem.title" :key="index">
							{{ item }}<br />
						</template>
					</Text>
				</div>
			</template>
			<div class="service-item__content">
				<div class="service-item__content--top">
					<Text class="service-item__content--top_desc">{{
						listItem.content.desc
					}}</Text>
				</div>
				<div class="service-item__content--measures">
					<div
						v-for="(measure, id) in listItem.content.measures"
						:key="`m-${id}`"
						class="service-item__content--measure"
					>
						<Text
							class="service-item__content--measure_title"
							size="xs"
							line-height="sm"
							>{{ measure.title }}</Text
						>
						<Text class="service-item__content--measure_value">{{
							measure.value
						}}</Text>
					</div>
				</div>
			</div>
		</section-dropdown>
	</div>
</template>

<style lang="scss">
.service-item {
	&__top {
		display: flex;
		gap: var(--space-sm);
		flex-direction: column;
		align-items: flex-start;
		@include desktop {
			flex-direction: row;
			align-items: center;
		}
		&--image {
			background: var(--primary-bg);
			border-radius: 5px;
			height: 70px;
			width: 70px;
			flex: 0 0 70px;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			@include desktop {
				height: 100px;
				width: 100px;
				flex: 0 0 100px;
			}
			&_item {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}
		&--title {
			font-size: 15px;
			@include desktop {
				font-size: 16px;
			}
		}
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		padding-bottom: 60px;
		@include tablet {
			flex-direction: row;
			justify-content: space-between;
		}
		&--top {
			&_desc {
				@include tablet {
					max-width: 335px;
				}
				@include desktop {
					max-width: 618px;
				}
			}
		}
		&--measures {
		}
		&--measure {
			width: 100%;
			padding: 8px 0;
			border-bottom: 1px solid var(--graphic-main);
			display: flex;
			justify-content: space-between;
			align-items: center;

			@include tablet {
				width: 300px;
				flex: 0 0 300px;
			}
			@include desktop {
				width: 500px;
				flex: 0 0 500px;
			}
			&_title,
			&_value {
				letter-spacing: -0.04em;
				color: rgba(0, 0, 0, 0.6);
			}
			&_title {
			}
			&_value {
			}
			&:first-child {
				padding-top: 0;
			}
			&:last-child {
				border-bottom: none;
				padding-bottom: 0;
			}
		}
	}
	.section-dropdown {
		&__btn {
			position: absolute;
			left: 0;
			bottom: 20px;

			@include desktop {
				position: relative;
				left: auto;
				bottom: auto;
			}
		}
		&_active {
			.section-dropdown__content {
				padding-top: var(--space-lg);
				@include desktop {
					padding-top: 80px;
				}
			}
		}
	}
}
</style>
