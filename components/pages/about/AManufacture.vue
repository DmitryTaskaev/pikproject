<script setup lang="ts">
const { t } = useSiteI18n()
const descList = computed(() => [
	String(t('about_manufacture_desc_1')),
	String(t('about_manufacture_desc_2')),
	String(t('about_manufacture_desc_3')),
	String(t('about_manufacture_desc_4')),
	String(t('about_manufacture_desc_5')),
])

const normalizeNbsp = (s: string) => s.replaceAll('&nbsp;', '\u00A0')
const splitByBr = (s: string) => normalizeNbsp(s).split(/<br\s*\/?\s*>/i)

const descLines = computed(() => descList.value.map(value => splitByBr(value)))
</script>

<template>
	<section class="a-manufacture">
		<div class="container">
			<BorderLine
				class="a-manufacture__container"
				position="top"
				design="primary"
			>
				<div class="a-manufacture__content">
					<CustomTitle class="a-manufacture__content--title" tag="h1">
						{{ String(t('about_manufacture_title')) }}
					</CustomTitle>
					<div class="a-manufacture__content--desc">
						<template v-for="(lines, index) in descLines" :key="index">
							<Text class="a-manufacture__content--desc_item">
								<template v-for="(line, i) in lines" :key="`d-${index}-${i}`">
									<span>{{ line }}</span>
									<br v-if="i < lines.length - 1" />
								</template>
							</Text>
						</template>
					</div>
					<div class="a-manufacture__content--btn-wrap">
						<Button
							class="a-manufacture__content--btn"
							:text="String(t('about_manufacture_button'))"
							href="/piktube/lab"
							size="lg"
						/>
					</div>
				</div>
			</BorderLine>
		</div>
	</section>
</template>

<style lang="scss">
.a-manufacture {
	margin-bottom: 100px;
	@include tablet {
		margin-bottom: 120px;
	}
	&__container {
		padding-top: var(--space-md);
		@include ultrahd {
			padding-top: var(--space-xl);
		}
	}
	&__content {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
		margin-bottom: var(--space-section-sm);
		@include tablet {
			gap: var(--space-sm);
			justify-content: space-between;
			grid-template-columns: repeat(2, 1fr);
			// grid-template-rows: repeat(2, 1fr);
			grid-template-rows: max-content 1fr;
			margin-bottom: var(--space-section-md);
		}
		@include ultrahd {
			column-gap: var(--space-xl);
			margin-bottom: var(--space-section-lg);
		}
		&--title {
		}
		&--desc {
			display: flex;
			flex-direction: column;
			gap: var(--space-md);
			@include tablet {
				grid-column: 2;
				grid-row: 1/3;
			}
			@include ultrahd {
				padding-top: var(--space-md);
			}
		}
		&--btn-wrap {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}
		&--btn {
			bottom: var(--space-sm);
			position: sticky;
		}
	}
}
</style>
