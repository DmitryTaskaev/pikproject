<script setup lang="ts">
interface OrderFormProps {
	prefix?: string
}

const props = withDefaults(defineProps<OrderFormProps>(), {
	prefix: 'consultation',
})

const getFieldId = (fieldName: string) => `${props.prefix}-${fieldName}`
</script>

<template>
	<form
		:id="`${props.prefix}-form`"
		class="order-form"
		action="#"
		method="post"
	>
		<div class="order-form__top">
			<label
				v-if="props.prefix === 'documents-modal'"
				class="order-form__organization-name"
				:for="getFieldId('organization-name')"
			>
				<Text class="order-form__label" size="sm" design="secondary"
					>Название организации:</Text
				>
				<Input
					:id="getFieldId('organization-name')"
					class="order-form__input"
					type="text"
					:name="getFieldId('organization-name')"
					required
				/>
			</label>
			<label class="order-form__name" :for="getFieldId('name')">
				<Text class="order-form__label" size="sm" design="secondary"
					>Ваше имя:</Text
				>
				<Input
					:id="getFieldId('name')"
					class="order-form__input"
					type="text"
					:name="getFieldId('name')"
					required
				/>
			</label>
			<div class="order-form__top--wrap">
				<label class="order-form__phone" :for="getFieldId('phone')">
					<Text class="order-form__label" size="sm" design="secondary"
						>Телефон:</Text
					>
					<Input
						:id="getFieldId('phone')"
						class="order-form__input"
						:name="getFieldId('phone')"
						type="tel"
						required
						inputmode="tel"
						placeholder="+7 (___) ___-__-__"
						title="Формат: +7 (XXX) XXX-XX-XX"
					/>
				</label>
				<label class="order-form__email" :for="getFieldId('email')">
					<Text class="order-form__label" size="sm" design="secondary"
						>E-mail:</Text
					>
					<Input
						:id="getFieldId('email')"
						class="order-form__input"
						:name="getFieldId('email')"
						type="email"
						required
					/>
				</label>
			</div>
		</div>
		<div class="order-form__wrap">
			<div class="order-form__checkboxes">
				<label class="order-form__checkbox" :for="getFieldId('agreement')">
					<input
						:id="getFieldId('agreement')"
						type="checkbox"
						:name="getFieldId('agreement')"
						checked
						required
					/>
					<div class="checkbox-custom">
						<Icon class="checkbox-custom__icon" name="check-arrow" />
					</div>
					<Text class="order-form__checkbox--text" size="xs" line-height="xs">
						Я согласен на обработку
						<Text
							class="order-form__checkbox--link"
							size="xs"
							tag="a"
							href="#"
							line-height="xs"
							>персональных данных</Text
						>.
					</Text>
				</label>

				<label class="order-form__checkbox" :for="getFieldId('newsletter')">
					<input
						:id="getFieldId('newsletter')"
						:name="getFieldId('newsletter')"
						type="checkbox"
						checked
					/>
					<div class="checkbox-custom">
						<Icon class="checkbox-custom__icon" name="check-arrow" />
					</div>
					<Text class="order-form__checkbox--text" size="xs" line-height="xs">
						Я согласен на получение
						<Text
							class="order-form__checkbox--link"
							size="xs"
							tag="a"
							href="#"
							line-height="xs"
							>информации об акциях и мероприятиях</Text
						>.
					</Text>
				</label>
			</div>
			<div class="order-form__bottom-wrap">
				<Button
					class="order-form__submit"
					type="submit"
					text="Отправить заявку"
					size="xl"
				></Button>

				<span class="order-form__public-offer">
					<Text
						class="order-form__public-offer--item"
						tag="span"
						size="xs"
						line-height="xs"
						>Нажимая кнопку «Отправить», вы принимаете условия
					</Text>
					<Text
						class="order-form__public-offer--link"
						tag="a"
						href="/piktube/public-offer"
						size="xs"
						line-height="xs"
						>публичной&nbsp;оферты.</Text
					>
				</span>
			</div>
		</div>
	</form>
</template>

<style lang="scss">
.order-form {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--space-sm);

	&__top {
		&--wrap {
			display: grid;
			margin-top: var(--space-sm);

			grid-template-columns: 1fr;
			gap: var(--space-sm);
			@include ultrahd {
				gap: var(--space-xs);
				grid-template-columns: 1fr 1fr;
			}

			&:first-child {
				margin-top: 0;
			}
		}
	}
	&__organization-name {
		width: 100%;
		margin-bottom: var(--space-sm);
	}
	&__label {
		margin-bottom: 2px;
	}
	&__name,
	&__organization-name {
		display: block;
	}

	&__wrap {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1 1 auto;
	}

	&__checkboxes {
		display: inline-flex;
		flex-direction: column;
		justify-content: flex-start;
		@include ultrahd {
			// margin-bottom: var(--space-lg);
		}
	}

	&__checkbox {
		display: inline-flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 14px;
		cursor: pointer;

		&:last-child {
			margin-bottom: 0;
		}

		&--text,
		&--link {
			color: rgba(38, 38, 38, 0.6);
		}

		&--link,
		&--link:hover,
		&--link:active,
		&--link:visited {
			text-decoration: underline;
			text-underline-offset: 2px;
		}

		input[type='checkbox'] {
			display: none;
		}

		.checkbox-custom {
			flex: 0 0 13px;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 13px;
			height: 13px;
			border: 1px solid var(--main-bg);
			border-radius: 3px;
			margin-right: 8px;
			position: relative;

			&__icon {
				opacity: 0;
				width: 7px;
				height: 6px;
				transition: opacity 0.3s ease;
				position: static;
				transform: none;
			}
		}

		input[type='checkbox']:checked + .checkbox-custom {
			.checkbox-custom__icon {
				opacity: 1;
			}
		}
	}
	&__bottom-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	&__public-offer {
		// margin: 0 auto;
		text-align: center;
		&--item,
		&--link {
			max-width: 335px;
			color: rgba(38, 38, 38, 0.6);
		}
		&--link,
		&--link:hover,
		&--link:active,
		&--link:visited {
			text-decoration: underline;
			text-underline-offset: 2px;
		}
	}
	&__submit {
		margin-bottom: var(--space-xs);
	}
}
</style>
