<script setup lang="ts">
interface ListItem {
	title: string
	desc: string
}
interface LSectionProps {
	title: string
	list: ListItem[]
}

const { title, list } = defineProps<LSectionProps>()
</script>

<template>
	<div class="l-section-wrap">
		<div class="container">
			<BorderLine class="l-section" position="top" design="primary">
				<section-wrapper :title="title">
					<div class="l-section__list">
						<div
							v-for="(item, index) in list"
							:key="index"
							class="l-section__item"
						>
							<Text
								class="l-section__item--title"
								weight="medium"
								line-height="xs"
								design="primary"
								:uppercase="true"
							>
								{{ item.title }}
							</Text>
							<Text class="l-section__item--desc" size="xl">
								{{ item.desc }}
							</Text>
						</div>
					</div>
				</section-wrapper>
			</BorderLine>
		</div>
	</div>
</template>

<style lang="scss">
.l-section-wrap {
	margin-bottom: var(--space-section-sm);
	@include ultrahd {
		margin-bottom: var(--space-section-md);
	}
}
.l-section {
	padding-top: var(--space-md);
	@include ultrahd {
		padding-top: var(--space-xl);
	}
	.section-wrapper {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
		@include tablet {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-sm);
		}
		@include ultrahd {
			gap: var(--space-xl);
		}
		&__top {
			align-items: flex-start;
		}
	}
	&__list {
		display: flex;
		flex-direction: column;
		gap: 50px;
	}
	&__item {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		&--title {
			font-size: 18px;
		}
		&--desc {
		}
	}
}
</style>
