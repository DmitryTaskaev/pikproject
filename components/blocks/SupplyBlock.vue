<script setup lang="ts">
import { ref } from 'vue'

const title = 'Поставка труб по россии'
const contentDescription =
	'Доставляем грузы практически в любой город РФ, все виды труб и практически в любых количествах. Доставляем грузы практически в любой город РФ, все виды труб и практически в\u00A0любых количествах.'

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
						<div class="supply-block__map--point supply-block__map--point_1">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(1)"
								@mouseleave="closePoint(1)"
								@click="togglePoint(1)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(1),
									}"
									v-click-away="() => handleClickAway(1)"
									@mouseenter="openPoint(1)"
									@mouseleave="closePoint(1)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_2">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(2)"
								@mouseleave="closePoint(2)"
								@click="togglePoint(2)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(2),
									}"
									v-click-away="() => handleClickAway(2)"
									@mouseenter="openPoint(2)"
									@mouseleave="closePoint(2)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_3">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(3)"
								@mouseleave="closePoint(3)"
								@click="togglePoint(3)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(3),
									}"
									v-click-away="() => handleClickAway(3)"
									@mouseenter="openPoint(3)"
									@mouseleave="closePoint(3)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_4">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(4)"
								@mouseleave="closePoint(4)"
								@click="togglePoint(4)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(4),
									}"
									v-click-away="() => handleClickAway(4)"
									@mouseenter="openPoint(4)"
									@mouseleave="closePoint(4)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_5">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(5)"
								@mouseleave="closePoint(5)"
								@click="togglePoint(5)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(5),
									}"
									v-click-away="() => handleClickAway(5)"
									@mouseenter="openPoint(5)"
									@mouseleave="closePoint(5)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_6">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(6)"
								@mouseleave="closePoint(6)"
								@click="togglePoint(6)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(6),
									}"
									v-click-away="() => handleClickAway(6)"
									@mouseenter="openPoint(6)"
									@mouseleave="closePoint(6)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_7">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(7)"
								@mouseleave="closePoint(7)"
								@click="togglePoint(7)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(7),
									}"
									v-click-away="() => handleClickAway(7)"
									@mouseenter="openPoint(7)"
									@mouseleave="closePoint(7)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_8">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(8)"
								@mouseleave="closePoint(8)"
								@click="togglePoint(8)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(8),
									}"
									v-click-away="() => handleClickAway(8)"
									@mouseenter="openPoint(8)"
									@mouseleave="closePoint(8)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_9">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(9)"
								@mouseleave="closePoint(9)"
								@click="togglePoint(9)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(9),
									}"
									v-click-away="() => handleClickAway(9)"
									@mouseenter="openPoint(9)"
									@mouseleave="closePoint(9)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_10">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(10)"
								@mouseleave="closePoint(10)"
								@click="togglePoint(10)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(10),
									}"
									v-click-away="() => handleClickAway(10)"
									@mouseenter="openPoint(10)"
									@mouseleave="closePoint(10)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_11">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(11)"
								@mouseleave="closePoint(11)"
								@click="togglePoint(11)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(11),
									}"
									v-click-away="() => handleClickAway(11)"
									@mouseenter="openPoint(11)"
									@mouseleave="closePoint(11)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
						<div class="supply-block__map--point supply-block__map--point_12">
							<div
								class="supply-block__map--point_circle"
								@mouseenter="openPoint(12)"
								@mouseleave="closePoint(12)"
								@click="togglePoint(12)"
							>
								<div
									class="supply-block__map--point_item"
									:class="{
										'supply-block__map--point_item_active': isPointOpen(12),
									}"
									v-click-away="() => handleClickAway(12)"
									@mouseenter="openPoint(12)"
									@mouseleave="closePoint(12)"
								>
									<Text
										class="supply-block__map--point_item-title"
										size="xs"
										letter-spacing="sm"
										design="main-bg"
										>Название города</Text
									>
								</div>
							</div>
						</div>
					</div>
					<div class="supply-block__content">
						<Text class="supply-block__content--desc" size="sm">{{
							contentDescription
						}}</Text>
						<Button
							class="supply-block__content--btn"
							size="lg"
							href="/piktube/contacts"
							text="Свяжитесь с нами"
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
