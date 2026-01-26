<script setup lang="ts">
const descList = [
	'Производственная площадка ООО ПИК располагается в городе Полевской Свердловской области и представляет собой современный трубный завод полного цикла. С 2004 года предприятие осуществляет выпуск высококачественной трубопроводной продукции для систем водоснабжения, теплоснабжения, газоснабжения, канализации, энергетических и промышленных сетей.',
	'Завод оснащён оборудованием ведущих мировых производителей: KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery. Использование современных экструзионных линий и автоматизированных систем управления позволяет выпускать трубы диаметром от 63 до 1220 мм в различных исполнениях и с разнообразными типами изоляции (ППУ, ППМ, ВУС). Производственные мощности предприятия достигают 15 000 тонн готовой продукции в год. Это обеспечивает высокую скорость выполнения заказов и устойчивую поставку трубной продукции на объекты различного масштаба.',
	'На заводе функционирует собственная аккредитованная лаборатория, оснащённая измерительным и испытательным оборудованием европейского уровня. Все этапы производства находятся под постоянным контролем, включая входной анализ сырья, производственные параметры и финальное тестирование готовой продукции. Вся продукция ООО «ПИК» соответствует требованиям нормативных документов: ГОСТ Р 56227-2014, ГОСТ 30732-2020, ГОСТ Р ИСО 58346-2019, а также техническим условиям предприятия. Каждое изделие сопровождается паспортом качества и маркировкой, соответствующей стандартам.',
	'ООО «ПИК» специализируется на выпуске:<br />— полиэтиленовых труб (ПНД) для водоснабжения, канализации, газовых сетей и кабельной защиты;<br />— стальных труб с тепловой и антикоррозийной изоляцией (ППУ, ППМ, ВУС);<br />— фасонных изделий в изоляции: отводов, тройников, переходов, муфт;<br />— многослойных гофрированных труб под торговой маркой «ПИКПАЙП», в том числе с полиуретановой теплоизоляцией (OD 160–500 мм).',
	'Собственные производственные мощности, автоматизация процессов, строгий контроль качества и высококвалифицированный инженерный персонал позволяют ООО «ПИК» обеспечивать выпуск надёжной продукции, востребованной как в жилищном, так и в промышленном и инфраструктурном строительстве.<br />Продукция предприятия используется при реализации федеральных и региональных проектов и поставляется по всей территории Российской Федерации. ООО «ПИК» входит в число надёжных и проверенных поставщиков трубной продукции для крупнейших строительных и энергетических компаний страны.',
]

const normalizeNbsp = (s: string) => s.replaceAll('&nbsp;', '\u00A0')
const splitByBr = (s: string) => normalizeNbsp(s).split(/<br\s*\/?\s*>/i)

const descLines = computed(() => descList.map(t => splitByBr(t)))
</script>

<template>
	<section class="a-manufacture">
		<div class="container">
			<BorderLine
				class="a-manufacture__container"
				position="top"
				design="primary"
			>
				<div class="a-manufacture__content">
					<CustomTitle class="a-manufacture__content--title" tag="h1">
						Производство
					</CustomTitle>
					<div class="a-manufacture__content--desc">
						<template v-for="(lines, index) in descLines" :key="index">
							<Text class="a-manufacture__content--desc_item">
								<template v-for="(line, i) in lines" :key="`d-${index}-${i}`">
									<span>{{ line }}</span>
									<br v-if="i < lines.length - 1" />
								</template>
							</Text>
						</template>
					</div>
					<div class="a-manufacture__content--btn-wrap">
						<Button
							class="a-manufacture__content--btn"
							text="Подробнее о лаборатории"
							href="/piktube/lab"
							size="lg"
						/>
					</div>
				</div>
			</BorderLine>
		</div>
	</section>
</template>

<style lang="scss">
.a-manufacture {
	margin-bottom: 100px;
	@include tablet {
		margin-bottom: 120px;
	}
	&__container {
		padding-top: var(--space-md);
		@include ultrahd {
			padding-top: var(--space-xl);
		}
	}
	&__content {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
		margin-bottom: var(--space-section-sm);
		@include tablet {
			gap: var(--space-sm);
			justify-content: space-between;
			grid-template-columns: repeat(2, 1fr);
			// grid-template-rows: repeat(2, 1fr);
			grid-template-rows: max-content 1fr;
			margin-bottom: var(--space-section-md);
		}
		@include ultrahd {
			column-gap: var(--space-xl);
			margin-bottom: var(--space-section-lg);
		}
		&--title {
		}
		&--desc {
			display: flex;
			flex-direction: column;
			gap: var(--space-md);
			@include tablet {
				grid-column: 2;
				grid-row: 1/3;
			}
			@include ultrahd {
				padding-top: var(--space-md);
			}
		}
		&--btn-wrap {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}
		&--btn {
			bottom: var(--space-sm);
			position: sticky;
		}
	}
}
</style>
