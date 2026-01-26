<script setup lang="ts"></script>

<template>
	<div class="table-feature">
		<div class="table-feature__caption">Наименование:</div>
		<div class="table-feature__wrap">Назначение<br />изделия:</div>
		<div class="table-feature__wrap">ГОСТ<br />изделия:</div>
		<div class="table-feature__wrap">ТУ<br />изделия:</div>
		<div class="table-feature__wrap">Материал<br />изделия:</div>
		<div class="table-feature__wrap">
			Диаметр изделия:
			<Dropdown
				:list="[
					'63',
					'80',
					'110',
					'120',
					'130',
					'160',
					'200',
					'240',
					'400',
					'800',
				]"
			/>
		</div>
		<div class="table-feature__wrap">
			SDR изделия:
			<Dropdown :list="['9', '11', '13.6', '17', '21', '26', '41']" />
		</div>
		<div class="table-feature__wrap">Кол-во слоев<br />изделия:</div>
		<div class="table-feature__wrap table-feature__wrap_additional">
			Доп характеристика<br />изделия:
		</div>
		<div class="table-feature__wrap table-feature__wrap_additional">
			Доп характеристика<br />изделия:
		</div>
	</div>
</template>

<style lang="scss">
.table-feature {
	// flex: 1 1 auto;
	display: grid;
	// grid-template-columns: minmax(224px, 1fr);
	width: 224px;
	flex: 0 0 224px;
	grid-template-rows: 205px repeat(4, 122px) repeat(2, 141px) repeat(1, 122px);
	&__caption,
	&__wrap {
		padding: 26px;
		font-weight: 500;
		font-size: 15px;
		line-height: 100%;
		color: #2e4169;

		border-top: 1px solid var(--graphic-main);
		border-right: 1px solid var(--graphic-main);
		&:first-child {
			border-top: none;
		}
	}
	&__caption {
	}
	&__wrap {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		gap: 12px;
		&_additional {
			display: none;
		}
	}

	// &_extended {
	// 	grid-template-rows:
	// 		205px repeat(4, 122px) repeat(2, 141px)
	// 		repeat(3, 122px);
	// 	.table-feature__wrap_additional {
	// 		display: flex;
	// 	}
	// }
}
</style>
