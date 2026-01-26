<script setup lang="ts">
import type { DocumentSlideProps } from '~/components/slides/DocumentSlide.vue'

interface SliderSection {
	title: string
	slides: DocumentSlideProps[]
}

interface ProItemProps {
	title: string
	sections: SliderSection[]
	sliderMode: 'compact' | 'wide'
	showButtons?: boolean
}

const {
	title,
	sections,
	sliderMode,
	showButtons = true,
} = defineProps<ProItemProps>()

const activeSectionIndex = ref(0)

const handleSectionClick = (index: number) => {
	activeSectionIndex.value = index
}

const currentSlides = computed(
	() => sections[activeSectionIndex.value]?.slides || []
)
</script>

<template>
	<section-dropdown class="pro-item" :title="title">
		<div class="pro-item__container">
			<div v-if="showButtons && sections.length > 1" class="pro-item__top">
				<span
					v-for="(section, index) in sections"
					:key="`pro-item-section-${index}`"
					class="pro-item__top--link"
					:class="{
						'pro-item__top--link_active': activeSectionIndex === index,
					}"
					@click="handleSectionClick(index)"
				>
					{{ section.title }}
				</span>
			</div>
			<div class="pro-item__slider">
				<document-slider
					:slides="currentSlides"
					:mode="sliderMode"
					:key="activeSectionIndex"
				/>
			</div>
		</div>
	</section-dropdown>
</template>

<style lang="scss">
.pro-item {
	&__content {
	}
	&__top {
		max-width: 95%;
		display: inline-flex;
		flex-wrap: wrap;
		row-gap: var(--space-xs);
		column-gap: var(--space-sm);
		margin-bottom: var(--space-xl);
		@include desktop {
			max-width: 900px;
		}
		&--link {
			font-size: 16px;
			color: var(--black-color);
			cursor: pointer;
			&:hover {
				text-decoration: underline;
				text-decoration-skip-ink: none;
				color: var(--main-bg);
			}
			&_active {
				text-decoration: underline;
				text-decoration-skip-ink: none;
				color: var(--main-bg);
			}
		}
	}
	&__slider {
		// padding-top: var(--space-xl);
	}
}
</style>
