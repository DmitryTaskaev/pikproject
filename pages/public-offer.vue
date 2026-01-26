<script setup lang="ts">
const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Публичная оферта', href: '/public-offer' },
]
const list = [
	{
		title: '1. Общие положения',
		list: [
			{
				currentTitle: '1.1.',
				description:
					'Настоящая публичная оферта (далее - Оферта) является официальным предложением укажите название юр.лица или ИП в адрес любого физического лица заключить с укажите название юр.лица или ИП договор розничной купли-продажи товара на Сайте дистанционным образом на условиях, определенных в настоящем Договоре и содержит все существенные условия Оферты.',
			},
			{
				currentTitle: '1.2.',
				description:
					'Заказ Покупателем товара, размещенного на Сайте, означает, что Покупатель согласен со всеми условиями настоящей Оферты, Политики конфиденциальности и Пользовательского соглашения.',
			},
			{
				currentTitle: '1.3.',
				description:
					'Сайт имеет право вносить изменения в Оферту без уведомления Покупателя.',
			},
			{
				currentTitle: '1.4.',
				description:
					'Срок действия Оферты не ограничен, если иное не указано на Сайте.',
			},
			{
				currentTitle: '1.5.',
				description:
					'Сайт предоставляет Покупателю полную и достоверную информацию о товаре/услугах, включая информацию об основных потребительских свойствах товара, месте изготовления, а также информацию о гарантийном сроке и сроке годности товара на Сайте в карточке товара или разделе укажите название раздела.',
			},
		],
	},
	{
		title: '2. Предмет Оферты',
		list: [
			{
				currentTitle: '2.1.',
				description:
					'Укажите название юр.лица или ИП обязуется передать Покупателю товар, предназначенный для личного, семейного, домашнего или иного использования, не связанного с предпринимательской деятельностью, на основании размещенных Заказов, а Покупатель обязуется принять и оплатить Товар на условиях настоящей Оферты.',
			},
			{
				currentTitle: '2.2.',
				description:
					'Наименование, цена, количество товара, а также прочие необходимые условия Оферты определяются на основании сведений, предоставленных Покупателем при оформлении заказа.',
			},
			{
				currentTitle: '2.3.',
				description:
					'Право собственности на заказанные товары переходит к Покупателю с момента фактической передачи товара Покупателю и оплаты последним полной стоимости товара. Риск его случайной гибели или повреждения товара переходит к Покупателю с момента фактической передачи товара Покупателю.',
			},
		],
	},
]
</script>

<template>
	<main class="main">
		<div class="p-o-page">
			<Breadcrumbs :list="breadcrumbsList" />
			<div class="p-o-page__wrap">
				<div class="container">
					<BorderLine class="p-o-page__title" position="top" design="primary">
						<CustomTitle class="p-o-page__title--item" tag="h1"
							>Публичная оферта</CustomTitle
						>
					</BorderLine>
					<div class="p-o-page__desc">
						<Text
							class="p-o-page__desc--item"
							size="lg"
							line-height="lg"
							letter-spacing="sm"
							>Настоящий документ – это публичная оферта (предложение)
							интернет-магазина укажите домен магазина или его название о
							продаже товаров.</Text
						>
					</div>
					<div class="p-o-page__list">
						<POText
							class="p-o-page__list--item"
							v-for="(currentObject, index) in list"
							:key="index"
							v-bind="currentObject"
						/>
					</div>
				</div>
			</div>
			<ConsultationBlock />
		</div>
	</main>
</template>

<style lang="scss">
.p-o-page {
	&__wrap {
		margin: 0 auto;
		padding-bottom: 140px;
		@include tablet {
			padding-bottom: 110px;
		}
		@include ultrahd {
			padding-bottom: 170px;
		}

		.container {
			@include tablet {
				padding: 0;
				max-width: 508px;
			}
			@include ultrahd {
				max-width: 660px;
			}
		}
	}
	&__title {
		max-width: 660px;
		padding-top: var(--space-md);
		margin-bottom: var(--space-lg);
		@include tablet {
			text-align: center;
			padding-top: var(--space-xl);
			margin-bottom: var(--space-xl);
		}
		@include ultrahd {
			padding-top: calc(1.5 * var(--space-xl));
		}
	}
	&__desc {
		max-width: 660px;
		margin-bottom: var(--space-lg);
	}
	&__list {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-lg);
	}
}
</style>
