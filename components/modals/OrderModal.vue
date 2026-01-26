<script setup lang="ts"></script>

<template>
	<Modal class="order-modal" name="order-modal" mode="right">
		<div class="order-modal__container">
			<div class="order-modal__top">
				<CustomTitle class="order-modal__title" tag="p" mode="lg"
					>Заявка на <br />
					оформление заказа
				</CustomTitle>
				<CloseButton
					class="order-modal__close"
					is-modal-closer
					name="order-modal"
				></CloseButton>
				<div class="order-modal__top--desc">
					<Text size="xl" tag="span"
						>У вас возникли вопросы? Мы с удовольствием ответим!
					</Text>
					<Text class="order-modal__top--desc_middle" size="xl" tag="span"
						>Просто закажите обратный звонок.</Text
					>
					<Text class="order-modal__top--desc_bottom" size="xl" tag="span"
						>И мы свяжемся с вами как можно скорее.</Text
					>
				</div>
			</div>
			<order-form prefix="order-modal" />
		</div>
	</Modal>
</template>

<style lang="scss">
.order-modal {
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
		gap: var(--space-xl);
	}
	&__top {
		&--desc {
			&_middle {
				@include ultrahd {
					display: block;
				}
			}
			&_bottom {
				display: block;
			}
		}
	}
	&__title {
		margin-bottom: var(--space-lg);
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
