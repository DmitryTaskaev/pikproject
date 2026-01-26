<script setup lang="ts">
interface IconProps {
	name: string
	width?: string
	height?: string
	mode?: 'prev' | 'next'
}
export interface ButtonProps {
	size?: 'sm' | 'md' | 'lg' | 'xl'
	href?: string
	text?: string

	class?: string | string[]
	isOpen?: boolean
	icon?: IconProps
	isModalOpener?: boolean
	modalName?: string
}

const props = defineProps<ButtonProps>()

const classes = computed(() => {
	const base = ['btn']
	if (props.size) {
		base.push(`btn_${props.size}`)
	}
	if (props.text && props.icon) {
		base.push('btn_complex')
	} else if (props.icon) {
		base.push('btn_icon')
	}
	if (props.isOpen) {
		base.push('btn_active')
	}

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
	<div
		v-if="props.icon && !props.text"
		:class="classes"
		:data-modal="props.modalName"
	>
		<Icon
			v-if="props.icon"
			class="btn__icon"
			:name="props.icon.name"
			:width="props.icon.width"
			:height="props.icon.height"
			:mode="props.icon.mode"
		></Icon>
	</div>
	<a v-else :href="props.href" :class="classes" :data-modal="props.modalName">
		<Text
			v-if="props.text"
			class="btn__text"
			tag="span"
			size="sm"
			line-height="xl"
			design="accent"
			>{{ props.text }}</Text
		>
		<Icon
			v-if="props.icon"
			:name="props.icon.name"
			:width="props.icon.width"
			:height="props.icon.height"
			:mode="props.icon.mode"
		></Icon>
	</a>
</template>

<style lang="scss">
.btn {
	cursor: pointer;
	border-radius: 400px;
	padding: 13px 0;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	background: var(--main-bg);
	color: var(--accent-color);
	// size
	&_sm {
		padding: 13px 20px;
	}
	&_md {
		padding: 13px 26px;
	}
	&_lg {
		width: 224px;
	}
	&_xl {
		width: 100%;
	}

	&_complex {
		gap: var(--space-xs);
	}

	&_icon {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		overflow: hidden;
		.icon {
			width: 38px;
			height: 38px;
		}
	}

	&_active {
		.icon {
			transform: rotate(-180deg);
		}
	}
	.icon {
		transition: all 0.2s ease;
		color: var(--accent-color);
	}
}
</style>
