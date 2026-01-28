<script setup lang="ts">
interface PCHeroDetail {
	title: string
	value: string
}

interface PCHeroProps {
	title?: string
	application?: string
	details?: PCHeroDetail[]
	slides?: Array<{ image: { src: string; alt?: string } }>
}

const fallbackDetails = [
	{
		title: 'Толщина стенки:',
		value: '3',
	},
	{
		title: 'Марка стали:',
		value: 'ст 09Г2С',
	},
	{
		title: 'ГОСТ/ТУ:',
		value: '8732-78',
	},
	{
		title: 'd:',
		value: '32',
	},
	{
		title: 'Толщина изоляции:',
		value: '34',
	},
	{
		title: 'd оболочки:',
		value: '121',
	},
]

const props = defineProps<PCHeroProps>()

const resolvedTitle = computed(
	() => props.title || 'Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200',
)
const resolvedApplication = computed(
	() =>
		props.application ||
		'Применяются в системах водоснабжения и водоотведения, а также для технических трубопроводов с повышенными требованиями к прочности и визуальному контролю протока.',
)
const resolvedDetails = computed(() => {
	return props.details !== undefined ? props.details : fallbackDetails
})
const resolvedSlides = computed(() => props.slides || [])
</script>

<template>
	<div class="p-c-hero">
		<div class="container">
			<div class="p-c-hero__container">
				<div class="p-c-hero__title">
					<CustomTitle class="p-c-hero__title--item" tag="h1" mode="xl">
						{{ resolvedTitle }}
					</CustomTitle>
				</div>
				<div class="p-c-hero__slider">
					<PCHeroSlider :slides="resolvedSlides" />
				</div>
				<BorderLine class="p-c-hero__content" position="top" design="primary">
					<div class="p-c-hero__content--wrap">
						<div class="p-c-hero__content--wrap_top">
							<Text
								class="p-c-hero__content--title"
								size="md"
								line-height="sm"
								design="primary"
							>
								Область применения
							</Text>
							<Text class="p-c-hero__content--desc">
								{{ resolvedApplication }}
							</Text>
						</div>
						<Button
							class="p-c-hero__content--btn"
							text="Заказать"
							modalName="order-modal"
							:is-modal-opener="true"
						/>
					</div>
				</BorderLine>
				<div class="p-c-hero__details">
					<div class="p-c-hero__details--top">
						<Text
							class="p-c-hero__details--title"
							design="primary"
							line-height="sm"
							>Характеристики</Text
						>
					</div>
					<div class="p-c-hero__details--list">
						<BorderLine
							v-for="(item, index) in resolvedDetails"
							:key="index"
							class="p-c-hero__details--item"
							position="top"
							design="primary"
						>
							<Text
								class="p-c-hero__details--item_title"
								size="md"
								line-height="sm"
								design="primary"
								>{{ item.title }}</Text
							>
							<Text
								class="p-c-hero__details--item_desc"
								size="md"
								line-height="sm"
								>{{ item.value }}</Text
							>
						</BorderLine>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.p-c-hero {
	padding-top: var(--space-md);
	margin-bottom: 80px;
	@include tablet {
		margin-bottom: 100px;
	}
	@include ultrahd {
		padding-top: var(--space-lg);
		margin-bottom: 200px;
	}
	&__container {
		display: grid;
		grid-template-columns: 100%;
		row-gap: var(--space-xl);
		justify-content: space-between;

		@include tablet {
			grid-template-columns: 335px 50%;
			column-gap: var(--space-md);
			grid-template-rows: max-content max-content max-content;
		}
		@include ultrahd {
			grid-template-columns: 412px 50% 180px;
			column-gap: 40px;
			grid-template-rows: max-content 1fr;
		}
	}
	&__title {
		max-width: 335px;
		@include tablet {
			grid-column: 1/2;
			grid-row: 1/2;
		}
		@include ultrahd {
			max-width: none;
		}
	}
	&__slider {
		height: auto;
		width: 100%;
		@include tablet {
			grid-column: 2/3;
			grid-row: 1/4;
		}
		@include ultrahd {
			grid-row: 1/3;
		}
	}
	&__content {
		padding-top: var(--space-sm);
		@include tablet {
			grid-row: 2/3;
			grid-column: 1/2;
		}

		.border-line {
			width: var(--space-xl);
		}

		&--wrap {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;
			gap: 80px;
			@include ultrahd {
				gap: 0;
			}
			&_top {
				display: flex;
				flex-direction: column;
				gap: var(--space-md);
				@include ultrahd {
					gap: var(--space-sm);
				}
			}
		}
		&--desc {
			font-size: 14px;
			@include ultrahd {
				font-size: 15px;
			}
		}
		&--btn {
			width: 100%;
			@include ultrahd {
				width: 234px;
			}
		}
	}
	&__details {
		@include tablet {
			grid-row: 3/4;
			grid-column: 1/2;
		}
		@include ultrahd {
			grid-column: 3/4;
			grid-row: 1/3;
		}
		&--top {
			margin-bottom: 40px;
			@include ultrahd {
				margin-bottom: 50px;
			}
		}
		&--list {
			display: flex;
			flex-direction: column;
		}
		&--item {
			padding: var(--space-sm);
			padding-left: 0;
			display: flex;
			flex-direction: column;
			gap: var(--space-xs);
			.border-line {
				width: 60px;
			}
		}
	}
}
</style>
