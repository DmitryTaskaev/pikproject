<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'

const breadcrumbsList = [
	{ title: 'Главная', href: '/' },
	{ title: 'Новости', href: '/news' },
	{ title: 'Новость', href: '/news-item' },
]

const descriptionsList = [
	`Настоящая публичная оферта (далее - Оферта) является официальным предложением укажите название юр.лица или ИП в адрес любого физического лица заключить с укажите название юр.лица или ИП договор розничной купли-продажи товара на Сайте дистанционным образом на условиях, определенных в настоящем Договоре и содержит все существенные условия Оферты.`,
	`Сайт предоставляет Покупателю полную и достоверную информацию о товаре/услугах, включая информацию об основных потребительских свойствах товара, месте изготовления, а также информацию о гарантийном сроке и сроке годности товара на Сайте в карточке товара или разделе укажите название раздела.`,
]

const sliderImages = [
	{
		src: 'news/news-01',
		alt: 'Новость 1',
	},
	{
		src: 'news/news-02',
		alt: 'Новость 2',
	},
	{
		src: 'news/news-03',
		alt: 'Новость 3',
	},
]
</script>

<template>
	<main class="main">
		<div class="n-i-page">
			<Breadcrumbs :list="breadcrumbsList" />
			<div class="n-i-page__wrapper">
				<div class="container">
					<div class="n-i-page__content">
						<div class="n-i-page__top">
							<CustomTitle class="n-i-page__title" tag="h1" mode="xxl"
								>Заголовок H1</CustomTitle
							>
							<Text
								class="n-i-page__top--description"
								size="lg"
								line-height="lg"
								letter-spacing="sm"
								>Настоящий документ – это публичная оферта (предложение)
								интернет-магазина укажите домен магазина или его название о
								продаже товаров.</Text
							>
						</div>
						<div class="n-i-page__slider">
							<BaseSwiper
								class="n-i-page__slider-swiper"
								modificator="news-item"
								:slides-per-view="1"
								:space-between="0"
								:navigation="true"
								navigation-mode="centered"
								:effect="'fade'"
								:fade-effect="{ crossFade: true }"
								:loop="true"
								:is-buttons-reverse="true"
							>
								<SwiperSlide
									v-for="(image, index) in sliderImages"
									:key="index"
									class="n-i-page__slider-slide"
								>
									<Image
										class="n-i-page__slider-image"
										:src="image.src"
										:alt="image.alt"
									/>
								</SwiperSlide>
							</BaseSwiper>
						</div>
						<div class="n-i-page__bottom">
							<CustomTitle class="n-i-page__bottom--title" tag="h2" mode="xl"
								>Заголовок H2</CustomTitle
							>
							<CustomTitle class="n-i-page__bottom--subtitle" tag="h3" mode="xl"
								>Заголовок H3</CustomTitle
							>
							<div class="n-i-page__bottom--list">
								<Text
									class="n-i-page__bottom--list_item"
									v-for="(item, idx) in descriptionsList"
									:key="idx"
									>{{ item }}</Text
								>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ConsultationBlock />
		</div>
	</main>
</template>

<style lang="scss">
.n-i-page {
	&__slider {
		position: relative;
		width: 100%;
		margin-bottom: var(--space-lg);

		&-swiper {
			position: relative;
		}

		&-slide {
			width: 100%;
			height: 234px;
			border-radius: 12px;
			overflow: hidden;
			@include tablet {
				height: 343px;
			}
			@include ultrahd {
				height: 422px;
			}
		}

		&-image {
			border-radius: 12px;
			overflow: hidden;
			width: 100%;
			height: auto;
			object-fit: cover;
			display: block;
		}
	}
	&__wrapper {
		padding: 30px 0 80px;
		@include tablet {
			padding: 60px 0 80px;
		}
		@include ultrahd {
			padding: 90px 0 110px;
		}
		.container {
		}
	}
	&__content {
		max-width: 511px;
		@include tablet {
			margin: 0 auto;
		}
		@include ultrahd {
			max-width: 660px;
		}
	}
	&__top {
		margin-bottom: var(--space-lg);
		&--description {
		}
	}
	&__title {
		margin-bottom: var(--space-lg);
		@include tablet {
			text-align: center;
			margin-bottom: var(--space-xl);
		}
	}
	&__bottom {
		&--title {
			font-weight: 500;
			font-size: 18px;
			line-height: 150%;
			letter-spacing: -0.01em;
			color: var(--main-color);
			margin-bottom: var(--space-md);
			@include ultrahd {
				font-size: 20px;
			}
		}
		&--subtitle {
			margin-bottom: var(--space-md);
			line-height: 150%;
			letter-spacing: -0.01em;
			color: var(--main-color);
			font-size: 14px;
			font-weight: 600;
			@include ultrahd {
				font-size: 16px;
			}
		}
		&--list {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-sm);
			&_item {
			}
		}
	}
}
</style>
