<script setup lang="ts">
interface HeroWrapperProps {
	title: string
	texts: string[]
}

const { title, texts } = defineProps<HeroWrapperProps>()
</script>

<template>
	<section class="hero-wrapper">
		<ContentBlock :title="title" :texts="texts">
			<template #form>
				<order-form class="hero-wrapper__form" prefix="hero" />
			</template>
		</ContentBlock>
	</section>
</template>

<style lang="scss">
.hero-wrapper {
	&__form {
		margin-top: 60px;
		@include ultrahd {
			margin-top: 80px;
		}
		.order-form {
			&__top {
				@include ultrahd {
					display: flex;
					flex-direction: row;
					gap: var(--space-xs);
				}
				&--wrap {
					@include ultrahd {
						margin-top: 0;
						grid-template-columns: 1fr;
						flex: 0 0 calc(50% - var(--space-xs) / 2);
					}
				}
			}
			&__name {
				@include ultrahd {
					flex: 0 0 calc(50% - var(--space-xs) / 2);
				}
			}
			&__email {
				display: none;
			}
			&__bottom-wrap {
				margin-top: var(--space-lg);
			}
		}
	}
}
</style>
