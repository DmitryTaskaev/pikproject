<script setup lang="ts">
import type { ImageProps } from '../ui/base/Image.vue'

export interface PipeCardProps {
	image: ImageProps
	name: string
	settings: string[]
	href: string
}

const props = defineProps<PipeCardProps>()
</script>

<template>
	<div class="pipe-card">
		<div class="pipe-card__content">
			<Image class="pipe-card__content--img" v-bind="props.image" />
			<Text
				class="pipe-card__content--title"
				size="md"
				line-height="md"
				design="black"
			>
				{{ props.name }}
			</Text>
		</div>
		<template v-for="(value, index) in props.settings" :key="index">
			<div
				class="pipe-card__measure"
				:class="`pipe-card__measure_${index + 1}`"
			>
				<Text
					class="pipe-card__measure--item"
					size="md"
					line-height="md"
					design="black"
				>
					{{ value }}
				</Text>
			</div>
		</template>
		<div class="pipe-card__action">
			<Button size="sm" :href="props.href" text="Подробнее" />
		</div>
	</div>
</template>

<style lang="scss">
.pipe-card {
	padding: 25px 0;
	border-bottom: 1px solid var(--graphic-main);
	display: grid;
	grid-template-columns: 1fr 130px 40px 110px 40px 80px 70px 60px 50px 150px 30px 100px 160px;

	&__content {
		grid-column: 1/2;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: var(--space-sm);
		&--img {
			width: 70px;
			height: 70px;
			border-radius: 5px;
			overflow: hidden;
			object-fit: cover;
		}
		&--title {
			max-width: 262px;
		}
	}
	&__measure {
		display: flex;
		align-items: center;
		justify-content: center;
		&--item {
		}
		&_1 {
			grid-column: 2/3;
		}
		&_2 {
			grid-column: 4/5;
		}
		&_3 {
			grid-column: 6/7;
		}
		&_4 {
			grid-column: 8/9;
		}
		&_5 {
			grid-column: 10/11;
		}
		&_6 {
			grid-column: 12/13;
		}
	}
	&__action {
		grid-column: 13/14;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
}
</style>
