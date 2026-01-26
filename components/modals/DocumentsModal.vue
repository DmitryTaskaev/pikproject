<script setup lang="ts"></script>

<template>
	<Modal class="documents-modal" name="documents-modal" mode="right">
		<div class="documents-modal__container">
			<div class="documents-modal__top">
				<CustomTitle class="documents-modal__title" tag="p" mode="lg">
					Заявка на скачивание документов
				</CustomTitle>
				<CloseButton
					class="documents-modal__close"
					is-modal-closer
					name="documents-modal"
				></CloseButton>
			</div>
			<order-form prefix="documents-modal" />
		</div>
	</Modal>
</template>

<style lang="scss">
.documents-modal {
	padding: var(--space-sm);
	background: var(--page-bg);
	width: 100%;
	@include tablet {
		width: 375px;
	}
	@include ultrahd {
		width: 660px;
	}
	&__container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 50px;
	}
	&__title {
		max-width: 293px;
		@include ultrahd {
			max-width: 444px;
		}
	}
	&__close {
		position: absolute;
		right: 0;
		top: 0;
		width: 18px;
		height: 18px;
		z-index: 1;
		.icon {
			width: 100%;
			height: 100%;
		}
	}

	.order-form {
		// height: 100%;
		flex: 1 1 auto;
		// Исправляем работу чекбоксов в модале
		.checkbox-custom {
			z-index: 1;
			position: relative;
		}

		input[type='checkbox']:checked + .checkbox-custom .checkbox-custom__icon {
			opacity: 1 !important;
		}
	}
}
</style>
