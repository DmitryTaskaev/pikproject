<script setup lang="ts"></script>

<template>
	<div class="a-experience">
		<div class="container">
			<div class="a-experience__container">
				<div class="a-experience__wrap">
					<experience-slider />
				</div>
				<experience-card
					title="Инновации"
					text="Ежегодно выпускаем на рынок не менее одной производственной новинки: в 2023 году было освоено производство уникального продукта: ПИКПАЙП G-ППУ."
				/>
				<experience-card
					title="Ваше время"
					text="Производственные процессы отлажены до мелочей – на предприятии внедрены самые современные инструменты бережливого производства и реализован национальный проект по повышению производительности труда и поддержки занятости."
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.a-experience {
	margin-bottom: 100px;
	@include ultrahd {
		margin-bottom: 150px;
	}
	&__container {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		align-items: stretch;
		@include tablet {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
		@include ultrahd {
			display: flex;
			flex-direction: row;
			align-items: stretch;
		}
	}
	&__wrap {
		height: 380px;
		border-radius: 12px;
		background: var(--main-bg);
		@include tablet {
			grid-column: 1/3;
			grid-row: 1;
		}
		@include ultrahd {
			width: calc((100% - 40px) / 3);
			max-width: calc((100% - 40px) / 3);
			flex: 0 0 calc((100% - 40px) / 3);
			grid-column: 1/2;
		}
	}
	.experience-card {
		@include ultrahd {
			width: calc((100% - 40px) / 3);
			max-width: calc((100% - 40px) / 3);
			flex: 0 0 calc((100% - 40px) / 3);
		}
	}
}
</style>
