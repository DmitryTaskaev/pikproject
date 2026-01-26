<script setup lang="ts">
interface LabTableItem {
	number: string
	content: {
		title: string
		desc: string
	}
	tests: {
		title: string
		href?: string
	}
	price: string
}

interface LabTableProps {
	list?: LabTableItem[]
}

const props = defineProps<LabTableProps>()

const fallbackList: LabTableItem[] = [
	{
		number: '1',
		content: {
			title: 'Внешний вид.',
			desc: 'Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания.',
		},
		tests: {
			title: '—',
		},
		price: '2160',
	},
	{
		number: '2',
		content: {
			title: 'Относительное удлинение при разрыве е ≤ 12 мм; е > 12 мм.',
			desc: 'Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания.',
		},
		tests: {
			title: 'ГОСТ 11262-2017',
			href: 'https://meganorm.ru/Data2/1/4293739/4293739599.pdf',
		},
		price: '14160 — 19080',
	},
	{
		number: '3',
		content: {
			title: 'Предел текучести при растяжении.',
			desc: 'Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания.',
		},
		tests: {
			title: 'ГОСТ Р 53652.1',
			href: 'https://meganorm.ru/Data2/1/4293820/4293820577.pdf',
		},
		price: '9120',
	},
	{
		number: '4',
		content: {
			title:
				'Стойкость при постоянном внутреннем давлении при 20℃, 100ч. Диаметры: Ø 63, Ø 90, Ø 250, Ø 710.',
			desc: 'Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания.',
		},
		tests: {
			title: 'ГОСТ ISO 1167',
			href: 'https://meganorm.ru/Data2/1/4293772/4293772450.pdf',
		},
		price: '41300',
	},
]

const list = computed(() =>
	props.list && props.list.length > 0 ? props.list : fallbackList,
)
</script>

<template>
	<div class="lab-table">
		<div class="lab-table__top">
			<span class="lab-table__top--item lab-table__top--item_number"> № </span>
			<span class="lab-table__top--item lab-table__top--item_name">
				Наименование показателя
			</span>
			<span class="lab-table__top--item lab-table__top--item_tests">
				Методика испытания
			</span>
			<span class="lab-table__top--item lab-table__top--item_price">
				Цена
			</span>
		</div>
		<div class="lab-table__list">
			<div
				class="lab-table__item"
				v-for="item in list"
				:key="item.number"
			>
				<div class="lab-table__item--number">{{ item.number }}</div>
				<div class="lab-table__item--content">
					<span class="lab-table__item--content_title">{{
						item.content.title
					}}</span>
					<Text
						class="lab-table__item--content_desc"
						size="xs"
						line-height="md"
						>{{ item.content.desc }}</Text
					>
				</div>
				<a
					class="lab-table__item--tests"
					:class="{ 'lab-table__item--tests_empty': item.tests.title === '—' }"
					:href="item.tests.href"
					:target="item.tests.href ? '_blank' : undefined"
					:rel="item.tests.href ? 'noopener noreferrer' : undefined"
					>{{ item.tests.title }}</a
				>
				<div class="lab-table__item--price">{{ item.price }}</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.lab-table {
	width: 825px;
	@media (min-width: 950px) {
		width: 100%;
	}
	&__top {
		display: grid;
		align-items: flex-end;
		grid-template-columns: 70px 335px 140px 160px 120px;
		margin-bottom: 14px;
		@media (min-width: 950px) {
			grid-template-columns: 70px 1fr 50px 160px 120px;
		}
		&--item {
			font-size: 12px;
			line-height: 120%;
			letter-spacing: -0.04em;
			color: var(--main-bg);
			&_number {
				justify-content: flex-start;
				grid-column: 1/2;
			}
			&_name {
				justify-content: flex-start;
				grid-column: 2/3;
			}
			&_tests {
				justify-content: center;
				grid-column: 4/5;
				text-align: center;
			}
			&_price {
				justify-content: flex-end;
				grid-column: 5/6;
				text-align: right;
			}
		}
	}
	&__list {
	}
	&__item {
		padding: var(--space-md) 0;
		border-top: 1px solid var(--graphic-main);
		display: grid;
		align-items: flex-start;
		grid-template-columns: 70px 335px 140px 160px 120px;
		&:last-child {
			border-bottom: 1px solid var(--graphic-main);
		}
		@media (min-width: 950px) {
			grid-template-columns: 70px 1fr 50px 160px 120px;
		}
		&--number {
			justify-content: flex-start;
			font-size: 16px;
			line-height: 125%;
			color: var(--main-bg);

			grid-column: 1/2;
		}
		&--content {
			justify-content: flex-start;
			grid-column: 2/3;
			display: flex;
			flex-direction: column;
			gap: var(--space-sm);
			&_title {
				font-size: 16px;
				line-height: 125%;
				color: var(--main-bg);
			}
			&_desc {
				max-width: 400px;
			}
		}
		&--tests {
			grid-column: 4/5;
			justify-content: center;
			text-align: center;
			font-size: 12px;
			line-height: 117%;
			letter-spacing: -0.04em;
			text-decoration: underline;
			text-decoration-skip-ink: none;
			text-align: center;
			color: var(--black-color);
			&:hover,
			&:visited {
				text-decoration: underline;
			}
			&_empty {
				text-decoration: none;
				&:hover,
				&:visited {
					text-decoration: none;
				}
			}
		}
		&--price {
			grid-column: 5/6;
			justify-content: flex-end;
			text-align: right;
			font-size: 12px;
			line-height: 117%;
			letter-spacing: -0.04em;
			text-align: right;
			color: var(--black-color);
		}
	}
}
</style>
