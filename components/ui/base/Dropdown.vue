<script setup lang="ts">
interface DropdownProps {
	list: string[]
}

const dropdownValue = ref('')
const isDropped = ref(false)

function toggleDropdown() {
	isDropped.value = !isDropped.value
}
function handleClickAway() {
	isDropped.value = false
}

function setText(value: string) {
	dropdownValue.value = value
	isDropped.value = false
}

const { list } = defineProps<DropdownProps>()
</script>

<template>
	<ClientOnly>
		<div class="dropdown" v-click-away="handleClickAway">
			<div class="dropdown__top" @click.stop="toggleDropdown">
				<Text
					class="dropdown__top--desc"
					size="xs"
					line-height="sm"
					design="black"
					>{{ dropdownValue }}</Text
				>
				<Icon
					class="dropdown__top--icon"
					name="dropdown-arrow"
					:is-sprite="false"
				/>
			</div>
			<div class="dropdown__list" :class="{ dropdown__list_active: isDropped }">
				<div class="dropdown__list--content">
					<Text
						class="dropdown__list--content_desc"
						v-for="(value, idx) in list"
						:key="idx"
						size="xs"
						:uppercase="true"
						@click="setText(value)"
					>
						{{ value }}
					</Text>
				</div>
			</div>
		</div>
	</ClientOnly>
</template>

<style lang="scss">
.dropdown {
	width: 140px;
	position: relative;
	&__top {
		position: relative;
		z-index: 10;
		cursor: pointer;
		padding: 0 var(--space-xs);
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 22px;
		border: 1px solid var(--graphic-main);
		border-radius: 6px;
		&--desc {
		}
		&--icon {
			width: 8px;
			height: 5px;
			color: var(--black-color);
		}
	}
	&__list {
		position: absolute;
		padding-left: var(--space-xs);
		padding-right: var(--space-xs);
		z-index: 150;
		left: 0;
		top: 27px;
		width: 100%;
		max-height: 0;
		opacity: 0;
		height: 127px;
		transition: all 0.3s ease;
		border: 1px solid #b8cce1;
		border-radius: 5px;
		background: var(--primary-bg);
		&--content {
			overflow-y: auto;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;

			&::-webkit-scrollbar {
				height: 100%;
				background: #cfd9ef;
				width: 2px;
				border-radius: 2px;
			}

			&::-webkit-scrollbar-track {
				background: #cfd9ef;
				border-radius: 1px;
			}

			&::-webkit-scrollbar-thumb {
				background: #11437a;
				border-radius: 2px;
			}

			&::-webkit-scrollbar-thumb:hover {
				background: #0a2c5a;
			}

			&::-webkit-scrollbar-corner {
				background: #cfd9ef;
			}

			&_desc {
				cursor: pointer;
				border-bottom: 1px solid transparent;
				&:hover {
					border-bottom: 1px solid currentColor;
				}
				&.title {
					color: var(--main-bg);
					line-height: auto;
				}
			}
		}
		&_active {
			opacity: 1;
			max-height: 127px;
			padding-top: var(--space-xs);
			padding-bottom: var(--space-xs);
		}
	}
}
</style>
