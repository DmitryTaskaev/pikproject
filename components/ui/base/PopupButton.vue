<script setup lang="ts">
interface IconProps {
	name: string
	width?: string
	height?: string
}

interface PopupButtonProps {
	text: string
	modalName?: string
	class?: string | string[]
	href?: string
	isModalOpener?: boolean
	icon?: IconProps
}

const props = defineProps<PopupButtonProps>()

const classes = computed(() => {
	const base = ['popup-button']

	if (props.class) {
		base.push(...(Array.isArray(props.class) ? props.class : [props.class]))
	}

	if (props.isModalOpener) {
		base.push('modal-opener', 'js-modal-opener')
	}

	return base
})
</script>

<template>
	<a :class="classes" :href="props.href" :data-modal="props.modalName">
		<Icon
			v-if="props.icon"
			class="popup-button__icon"
			:is-sprite="false"
			:name="props.icon.name"
			:width="props.icon.width"
			:height="props.icon.height"
		></Icon>
		<Text class="popup-button__text" tag="span" size="sm" line-height="xl">
			{{ props.text }}
		</Text>
	</a>
</template>

<style lang="scss">
.popup-button {
	display: flex;
	align-items: center;
	gap: 12px;
	cursor: pointer;
	border-radius: 400px;
	padding: 9px 20px;
	backdrop-filter: blur(13px);
	box-shadow: 0 12px 30px 0 rgba(91, 91, 91, 0.1);
	background: var(--page-bg);
	&__text {
		color: var(--main-bg);
	}
}
</style>
