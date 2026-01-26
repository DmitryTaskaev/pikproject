<script setup lang="ts">
const descList = [
	'Хозяйственно-питьевое водоснабжение, напорное водоотведение. Очень высокая термоустойчивость, простой способ прокладки, доступный практически всем, удобная для применения комбинированная система.',
	'ПИК производит трубы в России — качественные отечественные трубы от российского производителя.',
	'Чтобы заказать товар Труба 32х3 ГОСТ 8732-78 ст 20-ППМ-44,5 нажмите кнопку "Заказать". Если у Вас есть какие-либо вопросы, Вы можете заказать звонок.',
]
const measures = [
	{
		title: 'Толщина стенки:',
		value: '1-3',
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
		value: '32-1600',
	},
	{
		title: 'Толщина изоляции:',
		value: '30-100',
	},
	{
		title: 'd оболочки:',
		value: '120-1800',
	},
]
</script>

<template>
	<div class="p-p-hero-wrap">
		<div class="container">
			<div class="p-p-hero">
				<div class="p-p-hero__title">
					<custom-title class="p-p-hero__title--item" tag="h1">
						Однослойная труба <br />ПНД ПИКПАЙП
					</custom-title>
				</div>
				<div class="p-p-hero__image"></div>
				<div class="p-p-hero__desc">
					<Text
						v-for="(item, index) in descList"
						:key="index"
						class="p-p-hero__desc--item"
					>
						{{ item }}
					</Text>
				</div>
				<div class="p-p-hero__measures">
					<div
						v-for="(measure, idx) in measures"
						:key="idx"
						class="p-p-hero__measure"
					>
						<span class="p-p-hero__measure--item">{{ measure.title }}</span>
						<span class="p-p-hero__measure--item">{{ measure.value }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.p-p-hero-wrap {
	padding-top: var(--space-md);
	margin-bottom: var(--space-section-sm);
	@include tablet {
		margin-bottom: var(--space-section-md);
	}
	@include ultrahd {
		padding-top: var(--space-lg);
		margin-bottom: calc(2 * var(--space-section-sm));
	}
}
.p-p-hero {
	display: grid;
	grid-template-columns: 1fr;
	row-gap: var(--space-xl);
	@include tablet {
		row-gap: 0;
		grid-template-columns: repeat(2, calc(50% - var(--space-sm) / 2));
		column-gap: var(--space-sm);
	}
	@include ultrahd {
		grid-template-columns: repeat(2, calc(50% - var(--space-xl) / 2));
		column-gap: var(--space-xl);
	}
	&__title {
		@include tablet {
			grid-row: 1/2;
			grid-column: 1/2;
			margin-bottom: var(--space-lg);
		}
		&--item {
		}
	}
	&__image {
		aspect-ratio: 1 / 1;
		border-radius: 12px;
		background: var(--primary-bg);
		@include tablet {
			grid-row: 1/4;
			grid-column: 2/3;
		}
	}
	&__desc {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		@include tablet {
			grid-column: 1/2;
			grid-row: 2/3;
			margin-bottom: var(--space-xl);
		}
		&--item {
		}
	}
	&__measures {
		display: flex;
		flex-direction: column;
		@include tablet {
			grid-column: 1/2;
			grid-row: 3/4;
		}
	}
	&__measure {
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-xs) 0;
		border-bottom: 1px solid #f3f3f3;
		&:first-child {
			padding-top: 0;
		}
		&:last-child {
			padding-bottom: 0;
			border-bottom: none;
		}
		&--item {
			font-size: 16px;
			letter-spacing: -0.03em;
		}
	}
}
</style>
