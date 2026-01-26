<script setup lang="ts">
interface LabPricesProps {
	title?: string
	list?: Array<{
		number: string
		content: { title: string; desc: string }
		tests: { title: string; href?: string }
		price: string
	}>
}

const props = defineProps<LabPricesProps>()
</script>

<template>
	<div class="l-prices-wrap">
			<div class="container">
				<BorderLine class="l-prices" position="top" design="primary">
					<section-wrapper :title="props.title || 'Виды и цены проводимых испытаний'">
						<div class="l-prices__table">
							<lab-table :list="props.list" />
						</div>
					</section-wrapper>
				</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.l-prices-wrap {
	margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: var(--space-section-md);
	}
}
.l-prices {
	padding-top: var(--space-md);
	@include ultrahd {
		padding-top: var(--space-xl);
	}
	&__table {
		padding-top: var(--space-md);
		padding-bottom: 35px;
		overflow-x: auto;
		width: 100%;
		@media (min-width: 950px) {
			padding-bottom: 0;
		}
		@include ultrahd {
			padding-top: 0;
		}
		&::-webkit-scrollbar {
			width: 100%;
			background: #cfd9ef;
			height: 4px;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-track {
			background: #cfd9ef;
			border-radius: 2px;
		}

		&::-webkit-scrollbar-thumb {
			background: #11437a;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #0a2c5a;
		}

		&::-webkit-scrollbar-corner {
			background: #cfd9ef;
		}
	}
}
</style>
