<script setup lang="ts">
import type { CPSectionListItem } from '../pages/contacts/CPSection.vue'

const { title, address, schedule, email, phone } =
	defineProps<CPSectionListItem>()
</script>

<template>
	<div class="contact-card">
		<Text class="contact-card__title" letter-spacing="md">{{ title }}</Text>
		<Text
			class="contact-card__email"
			tag="a"
			:href="email.href"
			letter-spacing="md"
			>{{ email.title }}</Text
		>
		<Text
			class="contact-card__phone"
			tag="a"
			:href="phone.href"
			letter-spacing="md"
			>{{ phone.title }}</Text
		>
		<Text class="contact-card__address" letter-spacing="md">
			<template v-for="value in address"> {{ value }}<br /> </template>
		</Text>
		<Text class="contact-card__schedule" letter-spacing="md">{{
			schedule
		}}</Text>
	</div>
</template>

<style lang="scss">
.contact-card {
	max-width: 400px;
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	&__title.text {
		margin-bottom: var(--space-md);
		font-size: 24px;
		line-height: 133%;
		color: var(--main-bg);
	}
	&__email {
		margin-bottom: var(--space-xs);
	}
	&__phone {
		margin-bottom: var(--space-md);
	}
	&__email,
	&__phone {
		font-size: 20px;
		line-height: 120%;
		color: var(--black-color);
		border-bottom: 1px solid transparent;
		transition: all 0.2s ease-in;
		&:hover,
		&:visited {
			border-bottom: 1px solid currentColor;
		}
	}
	&__address {
		margin-bottom: var(--space-lg);
		font-size: 20px;
		line-height: 120%;
		color: var(--black-color);
	}
	&__schedule {
		font-size: 16px;
		color: rgba(0, 0, 0, 0.5);
	}
}
</style>
