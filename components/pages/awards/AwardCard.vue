<script setup lang="ts">
interface AwardCardProps {
    title: string
    description?: string
    image?: string
}

const { title, description, image } = defineProps<AwardCardProps>()
</script>

<template>
    <div class="award-card">
        <div class="award-card__image">
            <Image
                v-if="image"
                class="award-card__image--item"
                :src="image"
                :alt="title"
            />
        </div>
        <Text size="sm" design="tertiary" line-height="sm">
            {{ description || title }}
        </Text>
    </div>

</template>

<style lang="scss">
    .award-card {
        width: 100%;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        row-gap: var(--space-sm);

        &__image {
            background: var(--primary-bg);
            border-radius: 12px;
            height: 240px;
            flex: 0 0 240px;
            width: 100%;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            &--item {
                width: 70%;
                height: 70%;
                object-fit: contain;
                display: block;
            }
        }
    }
</style>
