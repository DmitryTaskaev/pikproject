<script setup lang="ts">
import type { CopyLinkProps } from './CopyLink.vue'

interface CopyLinkComplexProps {
	label: string
	copyLink: CopyLinkProps
}

const props = defineProps<CopyLinkComplexProps>()
</script>

<template>
	<div class="copy-link-complex">
		<Text class="copy-link-complex__label" tag="span" size="sm">
			{{ props.label }}
		</Text>
		<CopyLink class="copy-link-complex__item" v-bind="props.copyLink" />
	</div>
</template>

<style lang="scss">
.copy-link-complex {
	display: flex;
	flex-direction: column;
	gap: 4px;
	justify-content: flex-start;
	&__label {
	}
	&__item {
		.copy-link {
			&__item {
				color: var(--primary-color);
				font-size: 30px;
			}
			&__icon {
				&--message {
					left: 6.5px;
				}
				.icon {
					color: var(--primary-color);
					width: 13px;
					height: 13px;
				}
			}
		}
	}
}
</style>
