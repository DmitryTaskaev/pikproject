<script setup lang="ts">
interface SHeroProps {
	title?: string | string[]
	descriptions?: string[]
	imageSrc?: string
}

const fallbackDescList = [
	'Трубный завод ПИК производит трубы ПИКПАЙП из сертифицированных трубных марок полиэтилена типов ПЭ100, ПЭ100+, ПЭ112 и сверхпрочного ПЭ100RC. В производственной линейке выпускаются трубы ПИКПАЙП в полиуретановой теплоизоляции (ППУ) с различными типами защитной оболочки для надёжной защиты систем водоснабжения от промерзания в условиях холодного климата:<br />– с оцинкованной стальной оболочкой (ОЦ),<br />– с полиэтиленовой оболочкой (ПЭ).<br />Диаметр Ø 63–800 мм, SDR 6–41.',
	'Трубы выпускаются в соответствии с ГОСТ 18599-2001 с изменением №1,2, ГОСТ Р 70628.2—2023, а также ТУ 22.21.21-003-02986689-2024. Трубы предназначены для следующих способов прокладки: траншейной, бестраншейной, прокладки без песчаной подсыпки (в том числе методом горизонтально-направленного бурения). Поставляются прямыми отрезками длиной 12 м, 13 м или другой длины по согласованию с заказчиком, а также в бухтах (для труб диаметром до 110 мм).',
]

const props = defineProps<SHeroProps>()

const resolvedTitleLines = computed(() => {
	const title = props.title ?? ['Холодное', 'водоснабжение']
	return Array.isArray(title) ? title : [title]
})

const resolvedDescriptions = computed(() => {
	return props.descriptions !== undefined ? props.descriptions : fallbackDescList
})

const normalizeNbsp = (s: string) => s.replaceAll('&nbsp;', '\u00A0')
const splitByBr = (s: string) => normalizeNbsp(s).split(/<br\s*\/?\s*>/i)

const descLines = computed(() => resolvedDescriptions.value.map(t => splitByBr(t)))
const imageStyle = computed(() => {
	return props.imageSrc ? { backgroundImage: `url('${props.imageSrc}')` } : {}
})
</script>

<template>
	<div class="s-hero-wrap">
		<div class="container">
			<div class="s-hero">
				<div class="s-hero__title">
					<custom-title class="s-hero__title--item" tag="h1"
						><template
							v-for="(line, index) in resolvedTitleLines"
							:key="`t-${index}`"
						>
							{{ line }}
							<br v-if="index < resolvedTitleLines.length - 1" />
						</template></custom-title
					>
				</div>
				<div class="s-hero__image" :style="imageStyle"></div>
				<div class="s-hero__desc">
					<template v-for="(lines, index) in descLines" :key="index">
						<Text class="s-hero__desc--item">
							<template v-for="(line, i) in lines" :key="`d-${index}-${i}`">
								<span>{{ line }}</span>
								<br v-if="i < lines.length - 1" />
							</template>
						</Text>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.s-hero-wrap {
	margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: calc(3 * var(--space-section-sm));
	}
}
.s-hero {
	border-top: 1px solid var(--graphic-main);
	padding-top: var(--space-md);
	display: grid;
	grid-template-columns: 1fr;
	row-gap: var(--space-xl);
	grid-template-rows: min-content min-content 1fr;
	@include tablet {
		row-gap: 0;
		grid-template-columns: repeat(2, calc(50% - var(--space-sm) / 2));
		column-gap: 36px;
	}
	@include ultrahd {
		grid-template-columns: repeat(2, calc(50% - var(--space-xl) / 2));
		column-gap: 78px;
		padding-top: var(--space-lg);
	}
	&__title {
		@include tablet {
			grid-column: 1/2;
			grid-row: 1/2;
			margin-bottom: var(--space-lg);
		}
	}
	&__image {
		aspect-ratio: 1 / 1;
		border-radius: 12px;
		background: var(--primary-bg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		@include tablet {
			grid-column: 2/3;
			grid-row: 1 / -1;
			align-self: start;
		}
	}
	&__desc {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		@include tablet {
			grid-column: 1/2;
			grid-row: 2/3;
		}
	}
	&__desc {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		@include tablet {
			grid-column: 1/2;
		}
	}
}
</style>
