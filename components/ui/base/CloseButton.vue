<script setup lang="ts">
import { computed } from 'vue'

interface CloseButtonProps {
	name?: string
	class?: string | string[]
	isModalCloser?: boolean
	size?: 'md' | 'lg'
}
const props = withDefaults(defineProps<CloseButtonProps>(), {
	size: 'lg',
})

const classes = computed(() => {
	const base = ['close-button']

	if (props.class) {
		base.push(...(Array.isArray(props.class) ? props.class : [props.class]))
	}

	if (props.isModalCloser) {
		base.push('modal-closer', 'js-modal-closer')
	}

	return base
})
</script>

<template>
	<button :class="classes" :data-modal="props.name">
		<Icon v-if="props.size == 'lg'" name="close-button-lg"></Icon>
		<Icon v-else-if="props.size === 'md'" name="close-button"></Icon>
	</button>
</template>

<style lang="scss">
.close-button {
	display: flex;
	.icon--button-close {
		display: block;
	}
}
</style>
