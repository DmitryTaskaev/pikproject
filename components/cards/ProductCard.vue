<script setup lang="ts">
import type { ImageProps } from '../ui/base/Image.vue'

interface ProductCardProps {
	image: ImageProps
	title: string
	href: string
	mode: string
}

const props = defineProps<ProductCardProps>()

const imgClasses = computed(() => {
	return ['product-card__img', `product-card__img_${props.mode}`]
})
</script>

<template>
	<a class="product-card" :href="props.href">
		<div :class="imgClasses">
			<Image class="product-card__img--item" v-bind="props.image" />
		</div>
		<div class="product-card__content">
			<Text
				class="product-card__content--title"
				size="xxl"
				weight="medium"
				line-height="sm"
				design="primary"
				:uppercase="true"
			>
				{{ props.title }}
			</Text>
			<Icon class="product-card__content--icon" name="base-arrow" />
		</div>
	</a>
</template>

<style lang="scss">
.product-card {
	position: relative;
	height: 240px;
	border: 1px solid #b8cce1;
	border-radius: 12px;
	background: var(--primary-bg);
	display: flex;
	justify-content: center;
	text-align: center;
	align-items: flex-end;
	padding: var(--space-sm);
	&__img {
		position: absolute;
		content: '';
		left: 50%;
		transform: translateX(-50%);
		transition: transform 0.3s ease;
		&--item {
			width: 100%;
		}

		&_1 {
			top: 38px;
			left: 47%;
			width: 167px;
			height: 123px;
		}
		&_2 {
			top: 47px;
			width: 165px;
			height: 152px;
		}
		&_3 {
			top: 63px;
			width: 149px;
			height: 98px;
		}
		&_4 {
			top: 59px;
			left: 49%;
			width: 163px;
			height: 120px;
		}
		&_5 {
			top: 39px;
			left: 47%;
			width: 167px;
			height: 123px;
		}
		&_6 {
			top: 60px;
			width: 151px;
			height: 100px;
		}
		&_7 {
			top: 54px;
			left: 49%;
			width: 178px;
			height: 131px;
		}
		&_8 {
			top: 43px;
			width: 150px;
			height: 150px;
		}
	}
	&:hover {
		.product-card__img {
			transform: translateX(-50%) scale(1.15);
		}
	}
	&__content {
		display: flex;
		align-items: center;
		gap: var(--space-sm);

		&--icon {
			color: var(--primary-color);
			transform: rotate(-90deg);
		}
	}
}
</style>
