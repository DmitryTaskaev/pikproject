<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isVisible = ref(false)

const closePopup = () => {
	isVisible.value = false
}

onMounted(() => {
	isVisible.value = true
})
</script>

<template>
	<Transition name="cookies-popup">
		<div v-if="isVisible" class="cookies-popup">
			<div class="cookies-popup__wrap">
				<CloseButton class="cookies-popup__close" @click="closePopup" />
				<CustomTitle class="cookies-popup__title animated" tag="h3"
					>Мы используем cookies</CustomTitle
				>
				<Text class="cookies-popup__content" tag="span">
					Продолжая работу с сайтом, Вы выражаете своё согласие на
					<Text class="cookies-popup__link" tag="a" href="#" target="_blank"
						>обработку Ваших персональных данных</Text
					>. Отключить cookies Вы можете в настройках своего браузера.
					<Text class="cookies-popup__link" tag="a" href="#" target="_blank"
						>Подробнее о Cookies</Text
					>.
				</Text>
				<div class="cookies-popup__actions">
					<Button
						class="cookies-popup__btn"
						size="xl"
						text="Даю согласие"
						@click="closePopup"
					></Button>
					<Text class="cookies-popup__link" tag="a" href="#" target="_blank"
						>Согласие об использовании.</Text
					>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style lang="scss">
.cookies-popup {
	box-shadow: 0 10px 30px 0 rgba(150, 150, 150, 0.15);
	background: var(--page-bg);
	border-radius: 12px;
	max-width: 100%;
	// width: 100%;
	position: fixed;
	bottom: var(--space-xs);
	right: var(--space-xs);
	left: var(--space-xs);
	z-index: 290;

	overflow: hidden;
	@include tablet {
		max-width: 355px;
		left: auto;
	}
	@include ultrahd {
		bottom: var(--space-sm);
		right: var(--space-sm);
		max-width: 400px;
	}
	&__wrap {
		position: relative;
		padding: var(--space-lg) var(--space-sm) var(--space-sm);
		text-align: center;
	}
	&__title {
		max-width: 315px;
		font-weight: 500;
		font-size: 24px;
		margin-bottom: var(--space-md);
		@include ultrahd {
			max-width: none;
		}
	}
	&__close {
		position: absolute;
		right: 16px;
		top: 16px;
		height: 18px;
		width: 18px;
		.icon {
			width: 100%;
			height: 100%;
		}
	}
	&__content {
		margin: 0 auto 48px;
		display: inline-block;
		max-width: 360px;

		@include ultrahd {
			margin-bottom: 98px;
		}
	}
	&__link,
	&__link:hover,
	&__link:visited {
		text-decoration: underline;
		text-decoration-skip-ink: none;
		text-underline-offset: 3px;
	}
	&__btn {
		margin: 0 auto var(--space-sm);
		max-width: 460px;
	}
}
.cookies-popup-enter-active {
	transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.cookies-popup-leave-active {
	transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
	pointer-events: none;
	user-select: none;
}

.cookies-popup-enter-from {
	opacity: 0;
	transform: translateY(10px);
	pointer-events: none;
	user-select: none;
}

.cookies-popup-leave-to {
	opacity: 0;
	transform: translateY(10px);
	pointer-events: none;
	user-select: none;
}
</style>
