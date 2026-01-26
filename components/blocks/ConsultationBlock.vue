<script setup lang="ts">
const titleList = ['Если вам нужна', 'консультация']
const description =
	'У вас возникли вопросы? Мы с удовольствием ответим! Просто закажите обратный звонок. И мы свяжемся с вами как можно скорее.'
</script>

<template>
	<div id="consultation-block" class="consultation-block">
		<div class="container">
			<BorderLine
				class="consultation-block__container"
				position="top"
				design="primary"
			>
				<div class="consultation-block__content">
					<div class="consultation-block__content--top">
						<CustomTitle class="consultation-block__title">
							<template v-for="(value, index) in titleList" :key="index">
								{{ value }}
								<br v-if="index < titleList.length - 1" />
							</template>
						</CustomTitle>
						<Text class="consultation-block__description">{{
							description
						}}</Text>
					</div>
					<div class="consultation-block__actions">
						<CopyLinkComplex
							class="consultation-block__action"
							label="Телефон:"
							:copy-link="{
								text: '8 (800) 250-9288',
								href: 'tel:+78002509288',
							}"
						/>
						<CopyLinkComplex
							class="consultation-block__action"
							label="E-mail:"
							:copy-link="{
								text: 'zakaz@piktube.ru',
								href: 'mailto:zakaz@piktube.ru',
							}"
						/>
					</div>
				</div>
				<div class="consultation-block__form-wrap">
					<order-form class="consultation-block__form" />
				</div>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.consultation-block {
	background: var(--primary-bg);
	padding: var(--space-sm) 0;
	@include tablet {
		padding: var(--space-xl) 0;
	}
	@include ultrahd {
		padding: 50px 0 80px;
	}
	&__container {
		display: grid;
		grid-template-columns: 1fr;
		row-gap: var(--space-section-sm);
		padding-top: var(--space-md);
		@include tablet {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-sm);
		}
		@include ultrahd {
			gap: var(--space-xl);
			padding-top: var(--space-lg);
		}
	}
	&__content {
		display: flex;
		flex-direction: column;
		gap: 60px;
		@include tablet {
			justify-content: space-between;
		}
	}
	&__content--top {
		max-width: 573px;
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		@include ultrahd {
			gap: var(--space-lg);
		}
	}
	&__actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	&__form-wrap {
		@include ultrahd {
			border-radius: 12px;
			padding: var(--space-sm);
			background: var(--page-bg);
		}
	}
	&__form {
		.order-form__checkboxes {
			margin-bottom: var(--space-lg);
			@include ultrahd {
				margin-bottom: calc(2 * var(--space-lg));
			}
		}
		.input {
			background: var(--page-bg);
			@include ultrahd {
				background: var(--accent-bg);
			}
		}
	}
	&__description {
		max-width: 501px;
	}
}
</style>
