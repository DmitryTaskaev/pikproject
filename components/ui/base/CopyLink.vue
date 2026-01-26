<script setup lang="ts">
export interface CopyLinkProps {
	text: string
	href: string
	mode?: 'accent'
}
const props = defineProps<CopyLinkProps>()

const isCopied = ref(false)

function cleanLink(href: string): string {
	return href.replace(/^(tel:|mailto:)/, '')
}

async function copyLinkHandler() {
	try {
		const cleanHref = cleanLink(props.href)
		await navigator.clipboard.writeText(cleanHref)
		isCopied.value = true
		setTimeout(() => {
			isCopied.value = false
		}, 1000)
	} catch (error) {
		console.error('Ошибка копирования:', error)
	}
}
</script>

<template>
	<div class="copy-link" :class="{ 'copy-link_accent': props.mode }">
		<button class="copy-link__icon" @click="copyLinkHandler">
			<Icon name="copy-button" />
			<div v-if="isCopied" class="copy-link__icon--message">Скопировано</div>
		</button>
		<Text
			class="copy-link__item"
			tag="a"
			:href="props.href"
			size="xl"
			line-height="xs"
			design="primary-bright"
			>{{ props.text }}</Text
		>
	</div>
</template>

<style lang="scss">
.copy-link {
	display: flex;
	align-items: center;
	gap: 8px;
	&__item {
		border-bottom: 1px solid transparent;
		transition: border 0.2s ease-in;
		&:hover,
		&:active {
			border-bottom: 1px solid currentColor;
		}
	}
	&__icon {
		position: relative;
		display: flex;
		&--message {
			cursor: auto;
			position: absolute;
			bottom: -5px;
			left: 4.5px;
			transform: translate(-50%, 100%);
			background: var(--page-bg);
			// color: var(--primary-color-bright);
			padding: 5px 10px;
			border-radius: 5px;
			backdrop-filter: blur(13px);
			box-shadow: 0 12px 30px 0 rgba(91, 91, 91, 0.1);
			font-size: 12px;
			white-space: nowrap;
			z-index: 10;
		}

		.icon {
			color: var(--primary-color-bright);
			width: 9px;
			height: 9px;
		}
	}

	&_accent {
		gap: 13px;
		.text {
			font-size: 14px;
			line-height: 129%;
			letter-spacing: 0;
			color: rgba(255, 255, 255, 0.7);
		}
		.copy-link__icon--message {
			left: 0;
			transform: translate(0, 100%);
		}
		.icon {
			color: var(--accent-color);
		}
	}
}
</style>
