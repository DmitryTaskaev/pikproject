<script setup lang="ts">
import { ref } from 'vue'
import type { IconProps } from '../ui/base/Icon.vue'

interface ServiceCardProps {
	icon: IconProps
	title: string[]
	href: string
	links?: Array<{ title: string; href: string }>
}

const props = defineProps<ServiceCardProps>()

const isExpanded = ref(false)
const hasLinks = computed(() => (props.links || []).length > 0)
const hrefValue = computed(() => (props.href && props.href.length > 0 ? props.href : undefined))

const handleMouseEnter = () => {
	if (hasLinks.value) {
		isExpanded.value = true
	}
}

const handleMouseLeave = () => {
	if (hasLinks.value) {
		isExpanded.value = false
	}
}

const handleClick = (e: Event) => {
	if (hasLinks.value) {
		const target = e.target as HTMLElement
		if (target.closest('.service-card__water-link')) {
			return
		}
		e.preventDefault()
		e.stopPropagation()
		isExpanded.value = !isExpanded.value
	}
}

const handleLinkClick = (e: Event) => {
	e.stopPropagation()
}
</script>

<template>
	<a
		class="service-card"
		:class="{ 'service-card--expanded': isExpanded && hasLinks }"
		:href="hasLinks ? undefined : hrefValue"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
		@click.stop="handleClick"
	>
		<div v-if="!isExpanded || !hasLinks" class="service-card__content">
			<Icon class="service-card__image" v-bind="props.icon" />
			<div class="service-card__title">
				<Text
					v-for="(item, index) in props.title"
					:key="index"
					class="service-card__title"
					tag="span"
					size="xxl"
					design="accent"
					line-height="sm"
					weight="medium"
					:uppercase="true"
					>{{ item }}<br />
				</Text>
			</div>
		</div>
		<div v-else class="service-card__water-supply" @click.stop>
			<div class="service-card__water-supply--inner">
				<template v-for="(link, index) in props.links" :key="link.href">
					<a
						class="service-card__water-link"
						:href="link.href"
						@click="handleLinkClick"
					>
						<Text
							tag="span"
							size="xxl"
							design="accent"
							line-height="sm"
							weight="medium"
							:uppercase="true"
						>
							{{ link.title }}
						</Text>
					</a>
					<div
						v-if="index < (props.links?.length || 0) - 1"
						class="service-card__divider"
					></div>
				</template>
			</div>
		</div>
		<Icon class="service-card__icon" name="base-arrow" />
	</a>
</template>

<style lang="scss">
.service-card {
	height: 150px;
	background: var(--main-bg);
	border-radius: 12px;
	padding: 0 var(--space-sm);
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-sm);
	&__content {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}
	&__image {
		width: 70px;
		height: 70px;
	}
	&__icon {
		color: var(--accent-color);
		transform: rotate(-90deg);
		transition: transform 0.3s ease;
	}
	&:hover:not(&--expanded) {
		.service-card__icon {
			animation: bounce-arrow 1s linear infinite;
		}
	}
	&__water-supply {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		width: 100%;
	}
	&__water-link {
		text-decoration: none;
		color: inherit;
		pointer-events: auto;
	}
	&__divider {
		height: 1px;
		background: var(--accent-color);
		opacity: 0.3;
		width: 206px;
	}
	&--expanded {
		.service-card__water-supply--inner {
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: var(--space-sm);
		}
		.service-card__icon {
			display: none;
		}
		.service-card__water-link {
			pointer-events: auto;
		}
	}
}
</style>
