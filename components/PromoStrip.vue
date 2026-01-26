<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isVisible = ref(true)

function closePromoStrip() {
	isVisible.value = false
	if (process.client) {
		document.body.classList.add('promo-hidden')
	}
}

onMounted(() => {
	if (process.client && isVisible.value) {
		document.body.classList.remove('promo-hidden')
	}
})
</script>

<template>
	<div v-if="isVisible" class="promo-strip">
		<Text
			class="promo-strip__content"
			size="xs"
			line-height="xs"
			design="accent"
			>Сообщение / Уведомление. Новостная строка.</Text
		>
		<CloseButton
			class="promo-strip__close"
			size="md"
			@click="closePromoStrip"
		></CloseButton>
	</div>
</template>

<style lang="scss">
.promo-strip {
	z-index: 290;
	width: 100%;
	position: fixed;
	top: 0;
	background: var(--secondary-color);
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 100%;
	&__content {
	}
	&__close {
		position: absolute;
		top: 8px;
		right: 20px;
		width: 13px;
		height: 14px;
		display: flex;
		@include ultrahd {
			right: 10px;
		}
		.icon {
			width: 100%;
			height: 100%;
			color: var(--accent-color);
		}
	}
}
</style>
