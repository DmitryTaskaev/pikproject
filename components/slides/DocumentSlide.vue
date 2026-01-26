<script setup lang="ts">
export interface DocumentSlideProps {
	text: string[]
	size?: string
	href?: string
}
const props = defineProps<DocumentSlideProps>()
</script>

<template>
	<div class="document-slide">
		<Icon
			class="document-slide__icon"
			:is-sprite="false"
			name="document"
			width="48px"
			height="48px"
		></Icon>
		<div class="document-slide__content">
			<Text
				v-for="(item, index) in props.text"
				:key="index"
				class="document-slide__desc"
				size="md"
				line-height="sm"
				design="secondary"
				>{{ item }}</Text
			>
		</div>
		<a
			v-if="props.size || props.href"
			:href="props.href || '#'"
			class="document-slide__download"
			target="_blank"
			download
		>
			<Icon
				class="document-slide__download--icon"
				:is-sprite="false"
				name="download"
				width="18px"
				height="16px"
			></Icon>
			<Text class="document-slide__download--text" size="md" tag="span">
				{{ props.size ? `${props.size} мб` : 'Скачать' }}
			</Text>
		</a>
	</div>
</template>

<style lang="scss">
.document-slide {
	max-width: 320px;
	width: 320px;
	flex: 0 0 320px;
	border-left: 1px solid #cfd9ef;
	padding: 0 var(--space-sm) 0 var(--space-sm);
	&__icon {
		margin-bottom: var(--space-sm);
	}
	&__content {
		margin-bottom: var(--space-xl);
	}
	&__download {
		display: flex;
		align-items: center;
		column-gap: 15px;
	}
}
</style>
