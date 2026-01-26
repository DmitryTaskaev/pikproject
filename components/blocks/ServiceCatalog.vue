<script setup lang="ts">
interface ServicesSection {
	SECTION: {
		ID: string
		NAME: string
		CODE?: string
		['~CODE']?: string
	}
}

interface ServicesResponse {
	status: string
	data: {
		TREE: ServicesSection[]
	}
}

const fallbackServicesList = [
	{
		icon: {
			name: 'oflantsovka',
			isSprite: false,
		},
		title: ['Офланцовка'],
		href: '/piktube/services',
	},
	{
		icon: {
			name: 'polyurethane-isolation',
			isSprite: false,
		},
		title: ['Нанесение ППУ ', 'изоляции'],
		href: '/piktube/services',
	},
	{
		icon: {
			name: 'pipes-isolation',
			isSprite: false,
		},
		title: ['Нанесение ППМ ', 'изоляции'],
		href: '/piktube/services',
	},
	{
		icon: {
			name: 'oil-isolation',
			isSprite: false,
		},
		title: ['Изоляция ', 'в нефтегазовой ', 'отрасли'],
		href: '/piktube/services',
	},
]

const config = useRuntimeConfig()
const { data: servicesData } = await useAsyncData('servicesCatalogHome', () =>
	$fetch<ServicesResponse>(`${config.app.baseURL}api/services`),
)

const servicesList = computed(() => {
	const tree = servicesData.value?.data?.TREE
	if (!tree || tree.length === 0) return fallbackServicesList

	const icons = fallbackServicesList.map(item => item.icon)
	return tree
		.map((section, index) => {
			const code = section.SECTION.CODE || section.SECTION['~CODE'] || ''
			if (!code) return null
			return {
				icon: icons[index] || { name: 'pipes', isSprite: false },
				title: [section.SECTION.NAME],
				href: `${config.app.baseURL}services/${code}`,
			}
		})
		.filter(Boolean)
})
</script>

<template>
	<section class="service-catalog">
		<div class="container">
			<BorderLine
				class="service-catalog__container"
				position="top"
				design="primary"
			>
				<CustomTitle class="service-catalog__title"> Услуги </CustomTitle>
				<div class="service-catalog__wrap">
					<SectionWrapper
						class="service-catalog__services"
						title="Категории услуг"
						tag="h3"
					>
						<div class="service-catalog__services--list">
							<ServiceCard
								v-for="(item, index) in servicesList"
								:key="index"
								v-bind="item"
							/>
						</div>
					</SectionWrapper>
				</div>
			</BorderLine>
		</div>
	</section>
</template>

<style lang="scss">
.service-catalog {
	margin-bottom: 120px;
	@include tablet {
		margin-bottom: 160px;
	}
	@include ultrahd {
		margin-bottom: 170px;
	}
	&__container {
		padding-top: var(--space-md);
	}
	&__title {
		text-align: center;
		margin-bottom: 80px;
		@include ultrahd {
			margin-bottom: 110px;
		}
	}
	&__wrap {
	}
	&__services {
		&--list {
			display: grid;
			grid-template-columns: 1fr;
			gap: var(--space-xs);

			@include tablet {
				grid-template-columns: repeat(2, 1fr);
			}
			@include ultrahd {
				grid-template-columns: repeat(3, 1fr);
				gap: var(--space-sm);
			}
		}
	}
}
</style>
