<script setup lang="ts">
interface ExperienceCardProps {
	title: string
	text: string
}

const props = defineProps<ExperienceCardProps>()
</script>

<template>
	<div class="experience-card">
		<div class="experience-card__wrap">
			<Text
				class="experience-card__title"
				line-height="xs"
				design="accent"
				:uppercase="true"
				>{{ title }}</Text
			>
			<Text class="experience-card__desc" size="sm" design="accent-dimmer">{{
				text
			}}</Text>
			<div
				class="experience-card__plus modal-opener js-modal-opener"
				data-modal="experience-card-modal"
			>
				<Icon
					class="experience-card__plus--icon"
					name="plus"
					:is-sprite="false"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.experience-card {
	position: relative;
	border-radius: 12px;
	height: 380px;
	background: var(--main-bg);
	padding: var(--space-sm);
	overflow: hidden;
	&__wrap {
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	&__title {
		font-size: 28px;
		@include ultrahd {
			font-size: 30px;
		}
	}
	&__plus {
		position: absolute;
		content: '';
		bottom: -75px;
		right: -75px;
		width: 204px;
		height: 204px;
		border-radius: 50%;
		border: 1px solid rgba(101, 133, 203, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		&--icon {
			width: 54px;
			height: 54px;
		}
	}
}
</style>
