<script setup lang="ts">
interface ExperienceSlideProps {
	title: string
	subtitle: string
	description: string
}
const props = defineProps<ExperienceSlideProps>()
</script>

<template>
	<div class="experience-slide">
		<div class="experience-slide__top">
			<Text class="experience-slide__title" design="accent">{{
				props.title
			}}</Text>
			<Text class="experience-slide__subtitle" size="sm" design="accent">{{
				props.subtitle
			}}</Text>
		</div>
		<Text class="experience-slide__desc" size="sm" design="accent-dimmer">{{
			props.description
		}}</Text>
	</div>
</template>

<style lang="scss">
.experience-slide {
	padding: var(--space-sm);
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	&__top {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	&__title {
		font-size: 60px;
		line-height: 87%;
	}
	&__subtitle {
	}
	&__desc {
		padding-bottom: var(--space-sm);
		@include tablet {
			max-width: 474px;
		}
		@include ultrahd {
			max-width: 334px;
		}
	}
}
</style>
