<script setup lang="ts">
import IMask from 'imask'
import { computed, onMounted } from 'vue'

interface InputProps {
	id: string
	type: string
	name: string
	class?: string | string[]
	required?: boolean
	inputmode?:
		| 'text'
		| 'email'
		| 'search'
		| 'tel'
		| 'url'
		| 'none'
		| 'numeric'
		| 'decimal'
		| undefined
	placeholder?: string
	title?: string
}
const props = defineProps<InputProps>()

const classes = computed(() => {
	const base = ['input']

	if (props.class) {
		base.push(...(Array.isArray(props.class) ? props.class : [props.class]))
	}

	return base
})

onMounted(() => {
	if (props.inputmode !== 'tel') return
	const inputEl = document.getElementById(props.id) as HTMLInputElement | null
	if (!inputEl) return
	IMask(inputEl, { mask: '+{7} (000) 000-00-00' })
})
</script>

<template>
	<input
		:id="props.id"
		:class="classes"
		:type="props.type"
		:name="props.name"
		:required="props.required"
		:inputmode="props.inputmode"
		:placeholder="props.placeholder"
		:title="props.title"
	/>
</template>

<style lang="scss">
.input {
	border: 2px solid var(--accent-bg);
	border-radius: 10px;
	background: var(--accent-bg);
	height: 48px;
	width: 100%;
	padding-left: 12px;
}
</style>
