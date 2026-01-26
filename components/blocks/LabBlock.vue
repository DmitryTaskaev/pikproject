<script setup lang="ts">
import type { ButtonProps } from '~/components/ui/base/Button.vue'

interface LabBlockProps {
	isLinks?: boolean
	isBtn?: boolean
	titleTag?: keyof HTMLElementTagNameMap
	title?: string
	cardTitle?: string
	descList?: string[]
	emails?: string[]
	phones?: string[]
	topButton?: ButtonProps
	bottomButton?: ButtonProps
}
const props = withDefaults(defineProps<LabBlockProps>(), {
	titleTag: 'h2',
	title: 'Лаборатория',
	cardTitle:
		'Испытательная лаборатория ООО «ПИК» — это современный аккредитованный испытательный центр.',
	descList: () => [
		'Мы специализируемся на испытаниях полимерных и стальных труб и их фитингов с различными видами изоляции для водоснабжения, газоснабжения, канализации и промышленных нужд. В распоряжении испытательной лаборатории — передовое оборудование, соответствующее государственным стандартам. Сотрудники лаборатории строго придерживаются методов испытаний и процедур, обеспечивающих объективность и точность результатов.',
		'Команда испытательной лаборатории ООО «ПИК» нацелена на поддержание уровня компетенций и гарантирует соблюдение всех норм и стандартов качества в каждом проведённом исследовании.',
		'Номер записи в реестре аккредитованных лиц&nbsp;RA.RU.21РН88',
	],
	emails: () => ['info@piktube.ru', 'lab@piktube.ru'],
	phones: () => ['+7 (800) 25-09-288'],
	topButton: () => ({ text: 'Смотреть аккредитацию', size: 'sm', href: '#' }),
	bottomButton: () => ({
		text: 'Подробнее о компании',
		size: 'lg',
		href: '/piktube/about',
	}),
})

const normalizeNbsp = (s: string) => s.replaceAll('&nbsp;', '\u00A0')
const splitByBr = (s: string) =>
	normalizeNbsp(s).split(/<\/?br\s*\/?>/i)

const descLines = computed(() => props.descList.map(t => splitByBr(t)))
const emailLinks = computed(() => props.emails.filter(Boolean))
const phoneLinks = computed(() => props.phones.filter(Boolean))
const normalizePhone = (value: string) => value.replace(/[^\d+]/g, '')
</script>

<template>
	<section class="lab-block">
		<div class="container">
			<BorderLine class="lab-block__wrap" position="top" design="primary">
				<div class="lab-block__title-wrap">
					<CustomTitle class="lab-block__title" :tag="props.titleTag"
						>{{ props.title }}</CustomTitle
					>
				</div>
				<div class="lab-block__card">
					<LabCard
						:icon="{ name: 'document', isSprite: false }"
						:button="props.topButton"
						:title="props.cardTitle"
					/>
				</div>
				<div class="lab-block__desc">
					<template v-for="(lines, index) in descLines" :key="index">
						<Text class="lab-block__desc--item">
							<template v-for="(line, i) in lines" :key="`d-${index}-${i}`">
								<span>{{ line }}</span>
								<br v-if="i < lines.length - 1" />
							</template>
						</Text>
					</template>
				</div>
				<div v-if="props.isLinks" class="lab-block__links">
					<a
						v-for="(email, index) in emailLinks"
						:key="`e-${index}`"
						class="lab-block__link"
						:href="`mailto:${email}`"
					>
						{{ email }}
					</a>
					<a
						v-for="(phone, index) in phoneLinks"
						:key="`p-${index}`"
						class="lab-block__link"
						:href="`tel:${normalizePhone(phone)}`"
					>
						{{ phone }}
					</a>
				</div>
				<div class="lab-block__btn">
					<Button
						v-if="props.isBtn"
						class="lab-block__btn--item"
						v-bind="props.bottomButton"
					/>
				</div>
			</BorderLine>
		</div>
	</section>
</template>

<style lang="scss">
.lab-block {
	margin-bottom: 120px;
	@include tablet {
		margin-bottom: 160px;
	}
	&__wrap {
		display: grid;
		grid-template-columns: 1fr;
		padding-top: var(--space-md);
		@include tablet {
			grid-template-rows: max-content max-content 48px;
			grid-template-columns: repeat(2, 1fr);
		}
		@include ultrahd {
			padding-top: var(--space-xl);
			grid-template-rows: repeat(3, max-content);
		}
	}
	&__title-wrap {
		margin-bottom: var(--space-xl);
		@include tablet {
			grid-column: 1/2;
			grid-row: 1/2;
			margin-bottom: 0;
		}
	}
	&__title {
	}
	&__card {
		margin-bottom: var(--space-lg);
		@include tablet {
			grid-column: 2/3;
			grid-row: 1/2;
		}
	}
	&__desc {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		@include tablet {
			grid-column: 2/3;
			grid-row: 2/4;
		}
		@include ultrahd {
			grid-row: 2/3;
		}
		&--item {
		}
	}
	&__links {
		margin-top: 60px;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-xs);

		@include tablet {
			margin-top: 0;
			grid-row: 2/3;
			grid-column: 1/2;
			margin-bottom: var(--space-xl);
		}
		@include ultrahd {
			margin-top: 50px;
			margin-bottom: 0;
			grid-column: 2/3;
			grid-row: 3/4;
		}
	}
	&__link {
		font-size: 20px;
		line-height: 120%;
		color: var(--main-bg);
		border-bottom: 1px solid transparent;
		transition: border 0.2s ease-in;
		&:hover,
		&:active {
			border-bottom: 1px solid currentColor;
		}
	}
	&__btn {
		margin-top: 60px;
		display: flex;
		align-items: flex-end;
		@include tablet {
			margin-top: 0;
			grid-row: 3/4;
			grid-column: 1/2;
		}
		@include ultrahd {
			grid-column: 1/2;
			grid-row: 3/4;
		}
	}
}
</style>
