<script setup lang="ts"></script>

<template>
	<Modal class="documentation-modal" name="documentation-modal" mode="left">
		<div class="documentation-modal__container">
			<div class="documentation-modal__top">
				<CustomTitle class="documentation-modal__title" tag="p" mode="lg"
					>Документы для <br />
					скачивания
				</CustomTitle>
				<CloseButton
					class="documentation-modal__close"
					is-modal-closer
					name="documentation-modal"
				></CloseButton>
			</div>
			<div class="documentation-modal__list-wrapper">
				<div class="documentation-modal__list">
					<div class="documentation-modal__list--item">
						<Text
							class="documentation-modal__list--item_title"
							letter-spacing="sm"
							design="primary"
							line-height="sm"
							:uppercase="true"
							>Каталоги</Text
						>
						<DocumentSlider
							id="catalog-list-modal"
							modificator="catalog-list-modal"
							:slides="[
								{
									text: ['Альбом проектных ', 'решений №1'],
									size: '10',
								},
								{
									text: ['Альбом проектных ', 'решений №2'],
									size: '10',
								},
								{
									text: ['Альбом проектных ', 'решений №3'],
									size: '10',
								},
								{
									text: ['Альбом проектных ', 'решений №4'],
									size: '10',
								},
								{
									text: ['Альбом проектных ', 'решений №5'],
									size: '10',
								},
								{
									text: ['Альбом проектных ', 'решений №6'],
									size: '10',
								},
							]"
						></DocumentSlider>
					</div>
					<div class="documentation-modal__list--item">
						<Text
							class="documentation-modal__list--item_title"
							letter-spacing="sm"
							design="primary"
							line-height="sm"
							:uppercase="true"
							>Прайс-листы</Text
						>
						<DocumentSlider
							id="price-list-modal"
							modificator="price-list-modal"
							:slides="[
								{
									text: ['Прайс-лист №1'],
									size: '10',
								},
								{
									text: ['Прайс-лист №2'],
									size: '10',
								},
								{
									text: ['Прайс-лист №3'],
									size: '10',
								},
								{
									text: ['Прайс-лист №4'],
									size: '10',
								},
								{
									text: ['Прайс-лист №5'],
									size: '10',
								},
								{
									text: ['Прайс-лист №6'],
									size: '10',
								},
							]"
						></DocumentSlider>
					</div>
					<div class="documentation-modal__list--item">
						<Text
							class="documentation-modal__list--item_title"
							letter-spacing="sm"
							design="primary"
							line-height="sm"
							:uppercase="true"
							>Сертификаты</Text
						>
						<DocumentSlider
							id="certificates-list-modal"
							modificator="certificates-list-modal"
							:slides="[
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
							]"
						></DocumentSlider>
					</div>
					<div class="documentation-modal__list--item">
						<Text
							class="documentation-modal__list--item_title"
							letter-spacing="sm"
							design="primary"
							line-height="sm"
							:uppercase="true"
							>ГОСТы</Text
						>
						<DocumentSlider
							id="gosts-list-modal"
							modificator="gosts-list-modal"
							:slides="[
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
							]"
						></DocumentSlider>
					</div>
					<div class="documentation-modal__list--item">
						<Text
							class="documentation-modal__list--item_title"
							letter-spacing="sm"
							design="primary"
							line-height="sm"
							:uppercase="true"
							>СНИПы</Text
						>
						<DocumentSlider
							id="snipes-list-modal"
							modificator="snipes-list-modal"
							:slides="[
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
							]"
						></DocumentSlider>
					</div>
					<div class="documentation-modal__list--item">
						<Text
							class="documentation-modal__list--item_title"
							letter-spacing="sm"
							design="primary"
							line-height="sm"
							:uppercase="true"
							>Инструкции по монтажу</Text
						>
						<DocumentSlider
							id="mounting-instructions-list-modal"
							modificator="mounting-instructions-list-modal"
							:slides="[
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
							]"
						></DocumentSlider>
					</div>
					<div class="documentation-modal__list--item">
						<Text
							class="documentation-modal__list--item_title"
							letter-spacing="sm"
							design="primary"
							line-height="sm"
							:uppercase="true"
							>Схемы соединений</Text
						>
						<DocumentSlider
							id="connection-schemes-list-modal"
							modificator="connection-schemes-list-modal"
							:slides="[
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
								{
									text: ['Прайс на однослойную трубу ПНД ', 'ПИКПАЙП'],
									size: '10',
								},
							]"
						></DocumentSlider>
					</div>
				</div>
			</div>
		</div>
	</Modal>
</template>

<style lang="scss">
.documentation-modal {
	padding: var(--space-sm) var(--space-sm) 0 var(--space-sm);
	background: var(--page-bg);
	width: 100%;
	@include tablet {
		width: 375px;
	}
	@include ultrahd {
		width: 700px;
	}
	&__container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	&__top {
		margin-bottom: var(--space-xl);
	}
	&__close {
		position: absolute;
		right: 0;
		top: 0;
		width: 18px;
		height: 18px;
		.icon {
			width: 100%;
			height: 100%;
		}
	}
	&__list-wrapper {
		height: 100%;
		flex: 1 1 auto;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		margin-bottom: var(--space-sm);
		&::-webkit-scrollbar {
			height: 100%;
			background: #cfd9ef;
			width: 2px;
			border-radius: 2px;
		}
		&::-webkit-scrollbar-track {
			background: #cfd9ef;
			border-radius: 1px;
		}
		&::-webkit-scrollbar-thumb {
			background: #11437a;
			border-radius: 2px;
		}
		&::-webkit-scrollbar-thumb:hover {
			background: #0a2c5a;
		}
		&::-webkit-scrollbar-corner {
			background: #cfd9ef;
		}
	}
	&__list {
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		align-items: flex-start;
		justify-content: flex-start;
		&--item {
			width: 100%;
			&_title {
				font-size: 22px;
				margin-bottom: var(--space-md);
				@include ultrahd {
					margin-bottom: var(--space-lg);
				}
			}
		}
	}
}
</style>
