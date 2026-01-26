<script setup lang="ts"></script>

<template>
	<main class="main">
		<div class="error-page">
			<div class="error-page__wrap">
				<div class="error-page__content">
					<CustomTitle class="error-page__title" tag="h1">404</CustomTitle>
					<div class="error-page__inner">
						<Text
							class="error-page__inner--title"
							line-height="lg"
							weight="medium"
							letter-spacing="sm"
							>Страница не найдена</Text
						>
						<Text
							class="error-page__inner--description"
							size="xl"
							line-height="md"
							>Вернитесь на главную страницу или проверьте правильность
							написания адреса.</Text
						>
					</div>
					<Button
						class="error-page__button"
						text="На главную"
						href="/piktube"
					/>
				</div>
			</div>
			<ConsultationBlock />
		</div>
	</main>
</template>

<style lang="scss">
.error-page {
	&__wrap {
		margin: 0 auto;
		padding: 200px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		@include tablet {
			padding: 210px 0;
		}
		@include ultrahd {
			padding: 250px 0;
		}
	}
	&__content {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		max-width: 335px;
		@include tablet {
			max-width: 660px;
		}
	}
	&__title {
		line-height: 108%;
		font-size: 72px;
		text-align: center;
	}
	&__inner {
		&--title {
			font-size: 20px;
		}
		&--description {
		}
	}
	&__button {
		width: 200px;
	}
}
</style>
