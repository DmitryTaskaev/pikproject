<script setup lang="ts">
import type { IconProps } from '../ui/base/Icon.vue'

export interface PartnerSlideProps {
	icon: IconProps
	title: string
}

const props = defineProps<PartnerSlideProps>()
</script>

<template>
	<BorderLine position="left" design="main" class="partner-slide">
		<div class="partner-slide__wrap">
			<div class="partner-slide__img">
				<Icon class="partner-slide__img--item" v-bind="props.icon" />
			</div>
			<Text
				class="partner-slide__title"
				line-height="xs"
				weight="medium"
				design="primary"
				:uppercase="true"
			>
				{{ props.title }}
			</Text>
		</div>
	</BorderLine>
</template>

<style lang="scss">
.partner-slide {
	height: 150px;
	padding: var(--space-sm) 0 0 var(--space-sm);
	&__wrap {
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	&__img {
		&--item {
		}
	}
	&__title {
		font-size: 18px;
	}
}
</style>
