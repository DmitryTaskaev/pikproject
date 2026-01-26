<script setup lang="ts">
import type { RegaliaCardProps } from './cards/RegaliaCard.vue'

interface ThreeBlockMainItem {
	ID: string
	NAME: string
	SORT: string
	PREVIEW_TEXT: string
}

interface ThreeBlockMainResponse {
	status: string
	data: {
		items: ThreeBlockMainItem[]
	}
}

const fallbackRegaliaList: RegaliaCardProps[] = [
	{
		image: {
			src: 'achievements/achievement-01',
			alt: 'Дипломант конкурса',
			// width: '52px',
			// height: '68px',
		},
		title: ['100 лучших товаров ', 'России'],
		text: ['2022-2024 гг.'],
	},
	{
		image: {
			src: 'achievements/achievement-02',
			alt: 'Член АПТС',
		},
		title: ['Член АПТС'],
		text: ['Ассоциация производителей ', 'трубопроводных систем'],
	},
	{
		image: {
			src: 'achievements/achievement-03',
			alt: 'Член РАВВ',
			// width: '167px',
			// height: '68px',
		},
		title: ['Член РАВВ'],
		text: ['Российская ассоциация ', 'водоснабжения и водоотведения'],
	},
	{
		image: {
			src: 'achievements/achievement-04',
			alt: 'Участник ГИСП',
			// width: '68px',
			// height: '68px',
		},
		title: ['Участник ГИСП'],
		text: ['Государственная информационная ', 'система промышленности'],
	},
]

const config = useRuntimeConfig()
const { data: threeBlockMainData } = await useAsyncData('threeBlockMain', () =>
	$fetch<ThreeBlockMainResponse>(`${config.app.baseURL}api/threeBlockMain`),
)

const splitLines = (value?: string) => {
	if (!value) return []
	return value
		.replace(/<br\s*\/?>/gi, '\n')
		.split('\n')
		.map(item => item.trim())
		.filter(Boolean)
}

const regaliaList = computed<RegaliaCardProps[]>(() => {
	const items = threeBlockMainData.value?.data?.items
	if (!items || items.length === 0) return fallbackRegaliaList

	return items.map((item, index) => ({
		image: fallbackRegaliaList[index]?.image || fallbackRegaliaList[0].image,
		title: splitLines(item.NAME),
		text: splitLines(item.PREVIEW_TEXT),
	}))
})
</script>

<template>
	<DecorativeWrap class="regalia">
		<div class="regalia__wrap">
			<RegaliaCard
				v-for="(item, index) in regaliaList"
				:key="index"
				v-bind="item"
			/>
		</div>
	</DecorativeWrap>
</template>

<style lang="scss">
.regalia {
	&__wrap {
		display: grid;
		grid-template-columns: 1fr;
		row-gap: var(--space-md);
		@include tablet {
			grid-template-columns: repeat(2, 1fr);
			row-gap: var(--space-lg);
			justify-content: space-between;
		}
		@include ultrahd {
			grid-template-columns: repeat(4, 1fr);
		}

		.regilia-card {
			@include tablet {
				width: 266px;
			}
		}
	}
}
</style>
