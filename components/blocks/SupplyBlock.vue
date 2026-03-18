<script setup lang="ts">
import { ref } from 'vue'

interface MapMainPoint {
	ID?: string
	NAME?: string
	SORT?: string
	PROPERTY_CSS_POINT_VALUE?: string
	PROPERTIES?: {
		CSS_POINT?: {
			VALUE?: string
		}
	}
}

interface MapMainResponse {
	data?: {
		ROOT_ITEMS?: MapMainPoint[]
	}
	meta?: {
		iblock?: {
			name?: string
			description?: string
		}
	}
}

const fallbackTitle = 'Поставка труб по россии'
const fallbackDescription
	= 'Доставляем грузы практически в любой город РФ, все виды труб и практически в любых количествах. Доставляем грузы практически в любой город РФ, все виды труб и практически в любых количествах.'

const config = useRuntimeConfig()
const { t } = useSiteI18n()
const { data: mapMainData } = await useLocalizedAsyncData('mapMain', lang =>
	$fetch<MapMainResponse>(`${config.app.baseURL}api/mapMain`, {
		query: { lang },
	}),
)

const title = computed(
	() => mapMainData.value?.meta?.iblock?.name || fallbackTitle,
)
const contentDescription = computed(
	() => mapMainData.value?.meta?.iblock?.description || fallbackDescription,
)
const buttonText = computed(() => String(t('common_contact_us')))
const points = computed(() => {
	const items = mapMainData.value?.data?.ROOT_ITEMS || []
	return [...items]
		.sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0))
		.map((item, index) => ({
			id: Number(item.ID || index + 1),
			title: item.NAME || 'Название города',
			cssClass:
				item.PROPERTIES?.CSS_POINT?.VALUE ||
				item.PROPERTY_CSS_POINT_VALUE ||
				'',
		}))
		.filter(point => point.cssClass)
})

const openPoints = ref<Set<number>>(new Set())

const togglePoint = (index: number) => {
	if (openPoints.value.has(index)) {
		openPoints.value.delete(index)
	} else {
		openPoints.value.add(index)
	}
}

const openPoint = (index: number) => {
	openPoints.value.add(index)
}

const closePoint = (index: number) => {
	openPoints.value.delete(index)
}

const handleClickAway = (index: number) => {
	closePoint(index)
}

const isPointOpen = (index: number) => {
	return openPoints.value.has(index)
}
</script>

<template>
	<ClientOnly>
		<section class="supply-block">
			<div class="container">
				<div class="supply-block__container">
					<div class="supply-block__top">
						<div class="supply-block__top--wrap">
							<Icon
								class="supply-block__top--icon"
								name="location"
								:is-sprite="false"
							/>
							<CustomTitle
								class="supply-block__top--title"
								mode="md"
								tag="h2"
								>{{ title }}</CustomTitle
							>
						</div>
					</div>
					<div class="supply-block__map">
						<Image class="supply-block__map--item" src="map/map" alt="Карта" />
						<div
							v-for="point in points"
							:key="point.id"
							class="supply-block__map--point"
							:class="point.cssClass"
						>
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(point.id)"
								@mouseleave="closePoint(point.id)"
								@click="togglePoint(point.id)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(point.id),
									}"
									v-click-away="() => handleClickAway(point.id)"
									@mouseenter="openPoint(point.id)"
									@mouseleave="closePoint(point.id)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>{{ point.title }}</Text
									>
								</div>
							</div>
						</div>
					</div>
					<div class="supply-block__content">
						<Text class="supply-block__content--desc" size="sm" tag="div">
							<span v-html="contentDescription" />
						</Text>
						<Button
							class="supply-block__content--btn"
							size="lg"
							href="/piktube/contacts"
							:text="buttonText"
						/>
					</div>
				</div>
			</div>
		</section>
	</ClientOnly>
</template>

<style lang="scss">
.supply-block {
	margin-bottom: 120px;
	@include tablet {
		margin-bottom: 160px;
	}
	&__container {
		border: 1px solid #b8cce1;
		border-radius: 12px;
		background: var(--primary-bg);
		padding: var(--space-sm) 0;
		display: grid;
		grid-template-columns: 1fr;
		row-gap: var(--space-lg);

		@include tablet {
			row-gap: 90px;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: auto auto;
		}
		@include ultrahd {
			row-gap: 50px;
		}
	}
	&__top {
		padding: 0 var(--space-sm);
		// display: flex;
		grid-row: 1;
		grid-column: 1;
		align-items: flex-start;
		@include ultrahd {
			padding: var(--space-xs) var(--space-md) 0;
		}
		&--wrap {
			display: flex;
			gap: 14px;
			align-items: center;
		}
		&--icon {
			width: 48px;
			height: 48px;
		}
		&--title {
			width: 150px;
			max-width: 150px;
			flex: 0 0 150px;
			@include ultrahd {
				width: 100%;
				max-width: 100%;
				flex: 0 0 100%;
			}
		}
	}
	&__map {
		position: relative;
		width: 96%;
		margin-left: 1px;
		@include tablet {
			grid-row: 2;
			grid-column: 1/3;
			margin-left: 13px;
		}
		@include ultrahd {
			margin-left: 19px;
		}
		&--item {
			width: 100%;
		}
		&--point {
			position: absolute;
			width: 5px;
			height: 5px;
			@include tablet {
				width: 9px;
				height: 9px;
			}
			@include desktop {
				width: 18px;
				height: 18px;
			}
			&_circle {
				position: relative;
				border-radius: 50%;
				width: 100%;
				height: 100%;
				background: var(--page-bg);
				cursor: pointer;
			}
			&_item {
				position: absolute;
				top: -6px;
				left: 2.5px;
				transform: translate(-50%, -100%);
				border: 1px solid #b8cce1;
				border-radius: 5px;
				padding: 8px 18px;
				background: var(--page-bg);
				opacity: 0;
				visibility: hidden;
				pointer-events: none;
				transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
				transform: translate(-50%, -100%) scale(0.8);
				z-index: 10;
				@include tablet {
					left: 4.5px;
				}
				@include ultrahd {
					left: 9px;
					top: -10px;
				}
				&_active {
					opacity: 1;
					visibility: visible;
					pointer-events: auto;
					transform: translate(-50%, -100%) scale(1);
				}
				&-title {
					white-space: nowrap;
				}
			}

			&_1 {
				top: 59.22%;
				left: 13.014%;
			}
			&_2 {
				top: 49.618%;
				left: 19.557%;
			}
			&_3 {
				top: 66.4%;
				left: 23.8%;
			}
			&_4 {
				top: 58.37%;
				left: 31.73%;
			}
			&_5 {
				top: 47.317%;
				left: 32.65%;
			}
			&_6 {
				top: 71.98%;
				left: 42.294%;
			}
			&_7 {
				top: 60.68%;
				left: 50.92%;
			}
			&_8 {
				top: 72.9%;
				left: 53.32%;
			}
			&_9 {
				top: 41.49%;
				left: 59.93%;
			}
			&_10 {
				top: 74.81%;
				left: 62.362%;
			}
			&_11 {
				top: 56.87%;
				left: 76.568%;
			}
			&_12 {
				top: 50.355%;
				left: 84.589%;
			}
		}
	}
	&__content {
		margin-left: auto;
		padding: 0 var(--space-sm);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		&--desc {
			:deep(p) {
				margin: 0;
			}
		}
		@include tablet {
			width: 355px;
			max-width: 355px;
			grid-column: 2;
			grid-row: 1;
			padding: var(--space-xs) var(--space-md) 0;
		}
		@include ultrahd {
			width: 504px;
			max-width: 504px;
			padding: var(--space-sm) var(--space-lg) 0;
		}
	}
}
</style>
