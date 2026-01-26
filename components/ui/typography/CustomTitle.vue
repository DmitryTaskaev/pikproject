<script setup lang="ts">
import { computed } from 'vue'

interface TitleProps {
	class?: string | string[]
	tag?: keyof HTMLElementTagNameMap
	mode?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

const props = withDefaults(defineProps<TitleProps>(), {
	tag: 'h2',
	mode: 'xxl',
	class: undefined,
})

const tag = props.tag

const classes = computed(() => {
	const base = ['title']
	if (props.mode) {
		base.push(`title_${props.mode}`)
	}
	if (props.mode === 'xxl') {
		base.push('to-animate')
	}
	if (props.class) {
		base.push(...(Array.isArray(props.class) ? props.class : [props.class]))
	}

	return base
})
</script>

<template>
	<component :is="tag" :class="classes">
		<slot />
	</component>
</template>

<style lang="scss">
.title {
	color: var(--primary-color);
	letter-spacing: -0.01em;
	text-transform: uppercase;
	&_xxl {
		line-height: 110%;
		font-size: 28px;
		@include ultrahd {
			font-size: 46px;
		}
	}
	&_xl {
		line-height: 110%;
		font-size: 28px;
		@include ultrahd {
			font-size: 32px;
		}
	}
	&_lg {
		line-height: 110%;
		font-size: 28px;
	}
	&_md {
		line-height: 100%;
		font-size: 16px;
		@include ultrahd {
			font-size: 30px;
		}
	}
	&_sm {
		text-transform: none;
		line-height: 110%;
		color: var(--secondary-color);
		font-size: 18px;
		@include ultrahd {
			font-size: 22px;
		}
	}
	&_xs {
		line-height: 100%;
		font-weight: 500;
		font-size: 14px;
		@include ultrahd {
			font-size: 18px;
		}
	}
	// Анимация появления для title
	&.to-animate {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.5s linear, transform 0.5s linear;
		@include ultrahd {
			transform: translateY(30px);
		}
		&.animated {
			opacity: 1;
			transform: translateY(0);
		}
	}
}
</style>
