<script setup lang="ts">
interface SectionDropdownProps {
	title?: string
	isBigBtn?: boolean
}
const { title, isBigBtn } = defineProps<SectionDropdownProps>()

const isOpen = ref(false)
const toggleDropdown = () => {
	isOpen.value = !isOpen.value
}
</script>

<template>
	<section
		class="section-dropdown"
		:class="{ 'section-dropdown_active': isOpen }"
	>
		<div class="section-dropdown__top" @click="toggleDropdown">
			<slot name="header">
				<section-wrapper v-if="title" :title="title" />
			</slot>
			<Button
				v-if="isBigBtn"
				class="section-dropdown__btn section-dropdown__btn_large"
				:text="isOpen ? 'Скрыть' : 'Показать'"
				:icon="{ name: 'base-arrow' }"
				size="md"
			/>
			<Button
				v-else
				class="section-dropdown__btn section-dropdown__btn_small"
				:icon="{ name: 'button-arrow' }"
			/>
		</div>
		<div class="section-dropdown__content">
			<slot />
		</div>
	</section>
</template>

<style lang="scss">
.section-dropdown {
	&__top {
		gap: 35px;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.section-wrapper {
			margin-bottom: 0;
			@include ultrahd {
				margin-bottom: 0;
			}
			&__top {
				margin-bottom: 0;
			}
		}
	}
	&__content {
		overflow: hidden;
		padding-top: 0;
		max-height: 0;
		opacity: 0;
		transition: all 0.2s linear;
	}

	&__btn {
		flex: 0 0 auto;
		&_small {
			transition: transform 0.2s ease-in;
			.icon {
			}
		}
		&_large {
			width: 139px;
			.icon--base-arrow {
				width: 14px;
				height: 7px;
				transition: none;
				// transition: transform 0.1s ease;
			}
		}
	}

	&_active {
		.section-dropdown {
			&__content {
				opacity: 1;
				max-height: 1000px;
				padding-top: var(--space-section-sm);
			}
			&__btn {
				&_small {
					transform: rotate(180deg);
				}
				&_large {
					.icon--base-arrow {
						transform: rotate(180deg);
					}
				}
			}
		}
	}
}
</style>
