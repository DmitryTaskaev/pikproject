<script setup lang="ts"></script>

<template>
	<Modal
		class="experience-card-modal"
		name="experience-card-modal"
		mode="center"
	>
		<div class="experience-card-modal__container">
			<div class="experience-card-modal__top">
				<Text
					class="experience-card-modal__top--title"
					:uppercase="true"
					line-height="xs"
					letter-spacing="sm"
					design="primary"
					>Инновации</Text
				>
				<CloseButton
					class="experience-card-modal__close"
					is-modal-closer
					name="experience-card-modal"
				></CloseButton>
			</div>
			<div class="experience-card-modal__content">
				<Text
					class="experience-card-modal__content--desc"
					size="sm"
					line-height="lg"
					letter-spacing="sm"
					>Завод оснащён оборудованием ведущих мировых производителей:
					KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery.
					Использование современных экструзионных линий и автоматизированных
					систем управления позволяет выпускать трубы диаметром от 63 до 1220 мм
					в различных исполнениях и с разнообразными типами изоляции (ППУ, ППМ,
					ВУС). Производственные мощности предприятия достигают 15 000 тонн
					готовой продукции в год. Это обеспечивает высокую скорость выполнения
					заказов и устойчивую поставку трубной продукции на объекты различного
					масштаба.</Text
				>
			</div>
		</div>
	</Modal>
</template>

<style lang="scss">
.experience-card-modal {
	padding: 0 var(--container-padding);
	&__container {
		border-radius: 5px;
		border: 1px solid #b8cce1;
		padding: var(--space-sm);
		background: #f7f9ff;
		max-width: 375px;
	}
	&__top {
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		&--title {
			font-size: 22px;
		}
	}
}
</style>
