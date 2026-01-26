<script setup lang="ts">
import type { ImageProps } from '../ui/base/Image.vue'

interface Caption {
	title: string
	image: ImageProps
	href: string
}
export interface ProductTableCardProps {
	caption: Caption
	purpose: string[]
	gost: string[]
	specification: string[]
	material: string[]
	diameter: string[][]
	sdr: string[][]
	layersAmount: string[]
	additionalCharacteristic1: string[]
	additionalCharacteristic2: string[]
}

const {
	caption,
	purpose,
	gost,
	specification,
	material,
	diameter,
	sdr,
	layersAmount,
	additionalCharacteristic1,
	additionalCharacteristic2,
} = defineProps<ProductTableCardProps>()
</script>

<template>
	<div class="product-table-card">
		<div class="product-table-card__caption">
			<Image class="product-table-card__caption--img" v-bind="caption.image" />
			<Text
				class="product-table-card__caption--title"
				tag="a"
				:href="caption.href"
				weight="medium"
				size="md"
				line-height="md"
				design="primary"
			>
				{{ caption.title }}
			</Text>
		</div>
		<div class="product-table-card__wrap">
			<template v-for="(value, idx) in purpose" :key="idx">
				{{ value }}<br />
			</template>
		</div>
		<div class="product-table-card__wrap">
			<template v-for="(value, idx) in gost" :key="idx">
				{{ value }}<br />
			</template>
		</div>
		<div class="product-table-card__wrap">
			<template v-for="(value, idx) in specification" :key="idx">
				{{ value }}<br />
			</template>
		</div>
		<div class="product-table-card__wrap">
			<template v-for="(value, idx) in material" :key="idx">
				{{ value }}<br />
			</template>
		</div>
		<div class="product-table-card__wrap product-table-card__wrap_diameter">
			<span
				class="product-table-card__wrap--line"
				v-for="(line, idx) in diameter"
				:key="`l-${idx}`"
			>
				<span
					class="product-table-card__wrap--line_word"
					v-for="(value, index) in line"
					:key="`v-${index}`"
				>
					{{ value }}
				</span>
				<br />
			</span>
		</div>
		<div class="product-table-card__wrap product-table-card__wrap_sdr">
			<span
				class="product-table-card__wrap--line"
				v-for="(line, idx) in diameter"
				:key="`l-${idx}`"
			>
				<span
					class="product-table-card__wrap--line_word"
					v-for="(value, index) in line"
					:key="`v-${index}`"
				>
					{{ value }}
				</span>
				<br />
			</span>
		</div>
		<div class="product-table-card__wrap product-table-card__wrap">
			<template v-for="(value, idx) in layersAmount" :key="idx">
				{{ value }}<br />
			</template>
		</div>
		<div class="product-table-card__wrap product-table-card__wrap_additional">
			<template v-for="(value, idx) in additionalCharacteristic1" :key="idx">
				{{ value }}<br />
			</template>
		</div>
		<div class="product-table-card__wrap product-table-card__wrap_additional">
			<template v-for="(value, idx) in additionalCharacteristic2" :key="idx">
				{{ value }}<br />
			</template>
		</div>
	</div>
</template>

<style lang="scss">
.product-table-card {
	display: grid;
	grid-template-columns: minmax(224px, 1fr);
	grid-template-rows: 205px repeat(4, 122px) repeat(2, 141px) repeat(1, 122px);
	&__caption,
	&__wrap {
		display: flex;
		flex-direction: column;
		padding: 26px;
	}
	&__caption {
		gap: 14px;
		align-items: flex-start;
		&--img {
			width: 171px;
			height: 100px;
		}
		&--title {
		}
	}
	&__wrap {
		justify-content: center;
		align-items: center;
		font-size: 12px;
		line-height: 125%;
		text-align: center;
		color: rgba(34, 34, 34, 0.7);
		&_additional {
			display: none;
		}
		&_sdr,
		&_diameter {
			.product-table-card__wrap--line {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: var(--space-xs);

				&_word {
					text-decoration: underline;
					text-decoration-skip-ink: none;
					color: #222;
				}
			}
		}
	}
	// &_extended {
	// 	grid-template-rows:
	// 		205px repeat(4, 122px) repeat(2, 141px)
	// 		repeat(3, 122px);
	// 	.product-table-card__wrap_additional {
	// 		display: flex;
	// 	}
	// }
}
</style>
