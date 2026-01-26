<script setup lang="ts">
interface AwardsListItem {
	title: string
	description?: string
	image?: string
}

interface AwardsListProps {
	items: AwardsListItem[]
	title?: string
}

const props = defineProps<AwardsListProps>()
</script>

<template>
    <div class="awards-list">
        <div class="container">
            <div class="awards-list__title">{{ props.title }}</div>
            <div class="awards-list__body">
                <AwardCard
                    v-for="(item, index) in props.items"
                    :key="index"
                    :title="item.title"
                    :description="item.description"
                    :image="item.image"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .awards-list {
        padding-bottom: var(--space-sm);
        margin-bottom: var(--space-xl);

        &__title {
            margin-bottom: var(--space-md);
            font-size: 12px;
            line-height: 14px;
            letter-spacing: -.5px;
            color: var(--main-bg);
        }

        &__body {
            display: grid;
            grid-template-columns: 100%;
            row-gap: var(--space-lg);

            @include tablet {
                grid-template-columns: repeat(2, calc((100% - 1 * var(--space-xs)) / 2));
                column-gap: var(--space-xs);
            }

            @include ultrahd {
                grid-template-columns: repeat(4, calc((100% - 3 * var(--space-sm)) / 4));
                column-gap: var(--space-sm);
            }
        }
    }
</style>
