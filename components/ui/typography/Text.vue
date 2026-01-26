<script setup lang="ts">
import { computed } from 'vue'

interface TextProps {
	class?: string | string[]
	tag?: keyof HTMLElementTagNameMap
	letterSpacing?: 'sm' | 'md'
	weight?: 'regular' | 'medium' | 'semi-bold'
	uppercase?: boolean
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
	lineHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	href?: string
	design?:
		| 'main-dimmer'
		| 'primary'
		| 'primary-bright'
		| 'accent'
		| 'accent-dimmer'
		| 'secondary'
		| 'black'
		| 'tertiary'
		| 'main-bg'
}

const props = withDefaults(defineProps<TextProps>(), {
	tag: 'p',
	size: 'lg',
	weight: 'regular',
	letterSpacing: 'sm',
	lineHeight: 'lg',
	uppercase: undefined,
	inverted: undefined,
	design: undefined,
	class: undefined,
	href: undefined,
})
const tag = props.href ? 'a' : props.tag

const classes = computed(() => {
	const base = [
		'text',
		`text_size-${props.size}`,
		`text_weight-${props.weight}`,
		`text_line-height-${props.lineHeight}`,
		`text_letter-spacing-${props.letterSpacing}`,
	]

	if (props.uppercase) {
		base.push('text_uppercase')
	}
	if (props.design) {
		base.push(`text_${props.design}`)
	}

	if (props.class) {
		base.push(...(Array.isArray(props.class) ? props.class : [props.class]))
	}

	return base
})
</script>

<template>
	<component :is="tag" :class="classes" :href="href">
		<slot />
	</component>
</template>

<style lang="scss">
.text {
	color: var(--main-color);
	// size
	&_size {
		&-xs {
			font-size: 12px;
		}
		&-sm {
			font-size: 14px;
		}
		&-md {
			font-size: 15px;
		}
		&-lg {
			font-size: 14px;
			@include ultrahd {
				font-size: 16px;
			}
		}
		&-xl {
			font-size: 16px;
		}
		&-xxl {
			font-size: 16px;
			@include ultrahd {
				font-size: 20px;
			}
		}
	}
	// weight
	&_weight {
		&-regular {
			font-weight: 400;
		}
		&-medium {
			font-weight: 500;
		}
		&-semi-bold {
			font-weight: 600;
		}
	}
	// line height
	&_line-height {
		&-xs {
			line-height: 100%;
		}
		&-sm {
			line-height: 110%;
		}
		&-md {
			line-height: 130%;
		}
		&-lg {
			line-height: 150%;
		}
		&-xl {
			line-height: 157%;
		}
	}

	&_uppercase {
		text-transform: uppercase;
	}

	&_letter-spacing {
		&-sm {
			letter-spacing: -0.01em;
		}
		&-md {
			letter-spacing: 0;
		}
	}

	// design
	&_main-bg {
		color: var(--main-bg);
	}
	&_main-dimmer {
		color: var(--main-color-dimmer);
	}
	&_primary {
		color: var(--primary-color);
	}
	&_primary-bright {
		color: var(--primary-color-bright);
	}
	&_accent {
		color: var(--accent-color);
	}
	&_accent-dimmer {
		color: var(--accent-color-dimmer);
	}
	&_secondary {
		color: var(--secondary-color);
	}
	&_tertiary {
		color: var(--tertiary-color);
	}
	&_black {
		color: var(--black-color);
	}
}
</style>
