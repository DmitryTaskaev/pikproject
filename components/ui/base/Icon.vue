<script setup lang="ts">
import { computed } from 'vue'
export interface IconProps {
	name: string
	isSprite?: boolean
	class?: string | string[]
	width?: string
	height?: string
	mode?: 'prev' | 'next'
	src?: string
}
const props = withDefaults(defineProps<IconProps>(), {
	isSprite: true,
})

const baseUrl = useRuntimeConfig().app.baseURL

const classes = computed(() => {
	const base = ['icon', `icon--${props.name}`]
	if (props.class) {
		base.push(...(Array.isArray(props.class) ? props.class : [props.class]))
	}
	if (props.mode == 'prev') {
		base.push('icon_prev')
	}
	if (props.mode == 'next') {
		base.push('icon_next')
	}
	return base
})

const resolvedSrc = computed(() => {
	if (props.src) return props.src
	return `${baseUrl}images/svg/${props.name}.svg`
})
</script>

<template>
	<svg
		v-if="props.isSprite"
		:class="classes"
		:width="props.width"
		:height="props.height"
	>
		<use :xlink:href="`#icon--${props.name}`" />
	</svg>
	<img
		v-else
		:class="classes"
		:src="resolvedSrc"
		:alt="props.name"
		:style="{ width: props.width, height: props.height }"
	/>
</template>

<style lang="scss">
.icon {
	padding: 0 !important;
	background: none !important;
	stroke: transparent;
	fill: currentColor;

	&--button-arrow {
		width: 38px;
		height: 38px;
	}

	&--base-arrow {
		width: 16px;
		height: 8px;
	}

	&--close-button {
		width: 13px;
		height: 14px;
		stroke: var(--accent-color);
	}
	&--close-button-lg {
		width: 18px;
		height: 18px;
		stroke: var(--primary-color);
	}

	&--copy-button {
		stroke: currentColor;
	}

	// icon mode
	&_prev {
		transform: rotate(90deg);
	}
	&_next {
		transform: rotate(-90deg);
	}
}
</style>
