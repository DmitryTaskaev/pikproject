<script setup lang="ts">
interface BorderLineProps {
	position: 'left' | 'top' | 'right' | 'bottom'
	design: 'main' | 'primary' | 'accent'
}

const props = defineProps<BorderLineProps>()

const wrapClasses = computed(() => {
	return ['border-line-wrap', `border-line-wrap_${props.position}`]
})
const lineClasses = computed(() => {
	return ['border-line', `border-line_${props.design}`]
})
</script>

<template>
	<div :class="wrapClasses">
		<div :class="lineClasses"></div>
		<slot />
	</div>
</template>

<style lang="scss">
.border-line-wrap {
	position: relative;

	&_left {
		margin-left: 1px;
		& > .border-line {
			left: -1px;
		}
	}
	&_right {
		margin-right: 1px;
		& > .border-line {
			right: -1px;
		}
	}
	&_top {
		margin-top: 1px;
		& > .border-line {
			top: -1px;
		}
	}
	&_bottom {
		margin-bottom: 1px;

		& > .border-line {
			bottom: -1px;
		}
	}

	&_left,
	&_right {
		& > .border-line {
			top: 0;
			width: 1px;
			height: 100%;
		}
	}
	&_top,
	&_bottom {
		& > .border-line {
			left: 0;
			width: 100%;
			height: 1px;
		}
	}
}
.border-line {
	position: absolute;
	border-radius: 1px;
	content: '';

	&_main {
		background: var(--main-bg);
	}
	&_primary {
		background: var(--graphic-main);
	}
	&_accent {
		background: #345f96;
	}
}
</style>
