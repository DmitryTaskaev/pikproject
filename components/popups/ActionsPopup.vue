<script setup lang="ts"></script>

<template>
	<div class="actions-popup">
		<PopupButton
			class="actions-popup__item actions-popup__item_top"
			isModalOpener
			text="Документация"
			modalName="documentation-modal"
			:icon="{ name: 'document-small' }"
		></PopupButton>
		<PopupButton
			class="actions-popup__item"
			isModalOpener
			text="Оформить заказ"
			modalName="order-modal"
		></PopupButton>
		<PopupButton
			class="actions-popup__item"
			text="Получить консультацию"
			href="#consultation-block"
		></PopupButton>
	</div>
</template>

<style lang="scss">
.actions-popup {
	display: flex;
	z-index: 199;
	flex-direction: column;
	row-gap: 5px;
	position: fixed;
	bottom: var(--space-xs);
	right: var(--space-xs);
	// justify-content: flex-end;
	align-items: flex-end;
	@include tablet {
		row-gap: 10px;
	}
	@include ultrahd {
		right: var(--space-sm);
		bottom: var(--space-sm);
	}
	&__item {
		&_top {
			@include tablet {
				position: fixed;
				bottom: var(--space-xs);
				left: var(--space-xs);
			}
			@include ultrahd {
				bottom: var(--space-sm);
				left: var(--space-sm);
			}
		}
	}
}
</style>
