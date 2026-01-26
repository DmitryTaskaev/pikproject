<script setup lang="ts">
interface Measure {
	title: string
	value: string
}

interface Content {
	desc: string
	measures: Measure[]
}

export interface ListItem {
	content: Content
}

export interface FittingBlockProps {
	title: string
	listItem: ListItem
	isBigBtn?: boolean
}

const { title, listItem, isBigBtn } = defineProps<FittingBlockProps>()
</script>

<template>
	<div class="fitting-block-wrap">
		<div class="container">
			<BorderLine class="fitting-block" position="top" design="primary">
				<section-dropdown :is-big-btn="isBigBtn">
					<template #header>
						<div class="fitting-block__top">
							<custom-title class="fitting-block__top--title">{{
								title
							}}</custom-title>
						</div>
					</template>
					<div class="fitting-block__content">
						<div class="fitting-block__content--top">
							<Text class="fitting-block__content--top_desc">{{
								listItem.content.desc
							}}</Text>
						</div>
						<div class="fitting-block__content--measures">
							<div
								v-for="(measure, id) in listItem.content.measures"
								:key="`m-${id}`"
								class="fitting-block__content--measure"
							>
								<Text
									class="fitting-block__content--measure_title"
									size="xs"
									line-height="sm"
									>{{ measure.title }}</Text
								>
								<Text class="fitting-block__content--measure_value">{{
									measure.value
								}}</Text>
							</div>
						</div>
					</div>
				</section-dropdown>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.fitting-block {
	position: relative;
	padding: 30px 0 170px;
	@include desktop {
		padding: 50px 0 120px;
	}
	&__top {
		display: flex;
		gap: var(--space-sm);
		flex-direction: column;
		align-items: flex-start;
		@include desktop {
			flex-direction: row;
			align-items: center;
		}

		&--title {
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
			bottom: 100px;

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
