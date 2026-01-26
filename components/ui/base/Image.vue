<script setup lang="ts">
import { computed } from 'vue'
export interface ImageProps {
	src: string
	alt?: string
	class?: string | string[]
	width?: string
	height?: string
}
const props = defineProps<ImageProps>()

const baseUrl = useRuntimeConfig().app.baseURL

const isExternalSrc = computed(() => {
	return /^https?:\/\//.test(props.src) || props.src.startsWith('/')
})

const resolvedSrc = computed(() => {
	if (isExternalSrc.value) return props.src
	return `${baseUrl}images/${props.src}.webp`
})

const resolvedSrcSet = computed(() => {
	if (isExternalSrc.value) return undefined
	return `${baseUrl}images/${props.src}@2x.webp 2x`
})

const classes = computed(() => {
	if (props.class) {
		return Array.isArray(props.class) ? props.class : [props.class]
	}
	return undefined
})
</script>

<template>
	<img
		:class="classes"
		:src="resolvedSrc"
		:alt="props.alt"
		:srcset="resolvedSrcSet"
		:width="props.width"
		:height="props.height"
	/>
</template>

<style lang="scss"></style>
