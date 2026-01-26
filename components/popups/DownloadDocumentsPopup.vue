<script setup lang="ts"></script>

<template>
	<div class="download-documents-popup">
		<PopupButton
			class="download-documents-popup__item"
			isModalOpener
			text="Скачать документы"
			modalName="documents-modal"
		></PopupButton>
	</div>
</template>

<style lang="scss">
.download-documents-popup {
	z-index: 199;
	position: fixed;
	display: flex;
	bottom: var(--space-xs);
	left: var(--space-xs);
	@include ultrahd {
		bottom: var(--space-sm);
		left: var(--space-sm);
	}
}
</style>
