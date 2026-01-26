<script setup lang="ts">
import { computed } from 'vue'

interface ModalProps {
	name: string
	class?: string
	mode: 'left' | 'right' | 'center'
}

const props = defineProps<ModalProps>()

const classes = computed(() => {
	const base = ['modal', 'js-modal']
	if (props.class) {
		base.push(...(Array.isArray(props.class) ? props.class : [props.class]))
	}
	if (props.mode) {
		base.push(`modal_${props.mode}`)
	}
	return base
})

const handleModalClick = (e: MouseEvent) => {
	if (props.mode !== 'center') return

	const target = e.target as HTMLElement
	const modal = e.currentTarget as HTMLElement
	const container = modal.querySelector('[class*="__container"]')

	if (container && !container.contains(target)) {
		const overlay = document.querySelector<HTMLElement>('.js-overlay')
		if (overlay) {
			overlay.click()
		}
	}
}
</script>

<template>
	<div :class="classes" :data-modal="props.name" @click="handleModalClick">
		<slot></slot>
	</div>
</template>

<style lang="scss">
.modal {
	position: fixed;
	// left: 0;
	// right: 0;
	top: 0;
	z-index: 300;
	height: 100%;

	opacity: 0;
	pointer-events: none;
	user-select: none;
	// transform: translateY(100%);
	transition: opacity 0.2s cubic-bezier(0.7, 0.01, 0.11, 0.96) 0.2s,
		transform 0.3s cubic-bezier(0.7, 0.01, 0.11, 0.96) 0.3s;

	touch-action: pan-y;
	overflow-y: auto;
	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}

	// &__wrapper {
	// 	background-color: var(--page-bg);
	// 	width: 100%;
	// 	height: 100%;
	// }

	// &__wrapper {
	// 	opacity: 0;
	// 	filter: blur(12px);
	// 	transition: filter 0.2s cubic-bezier(0.7, 0.01, 0.11, 0.96) 0.2s,
	// 		opacity 0.2s cubic-bezier(0.7, 0.01, 0.11, 0.96) 0.2s;
	// }
	.order-form {
		&__wrap {
			gap: var(--space-sm);
		}
	}

	&_visible {
		opacity: 1;
		pointer-events: auto;
		user-select: auto;
		// transform: none;
		// transition: none;

		&.modal_left,
		&.modal_right {
			transform: translateX(0);
		}

		// .modal__wrapper {
		// 	opacity: 1;
		// 	filter: blur(0);
		// 	transition: filter 0.2s cubic-bezier(0.7, 0.01, 0.11, 0.96) 0.2s,
		// 		transform 0.3s cubic-bezier(0.7, 0.01, 0.11, 0.96) 0.3s,
		// 		opacity 0.2s cubic-bezier(0.7, 0.01, 0.11, 0.96) 0.2s;
		// }
	}
	&_left {
		left: 0;
		transform: translateX(-100%);
	}
	&_right {
		right: 0;
		transform: translateX(100%);
	}
	&_center {
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
