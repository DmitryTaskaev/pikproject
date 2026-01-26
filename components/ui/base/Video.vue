<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface VideoSource {
	src: string
	type?: string
}

interface VideoProps {
	src: string | VideoSource[]
	poster?: string
	class?: string | string[]
	autoplay?: boolean
	muted?: boolean
	loop?: boolean
	controls?: boolean
}

const props = withDefaults(defineProps<VideoProps>(), {
	autoplay: false,
	muted: false,
	loop: false,
	controls: false,
})

const containerEl = ref<HTMLElement | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const isIntersected = ref(false)
const isPlaying = ref(false)
let observer: IntersectionObserver | null = null

const classes = computed(() => {
	if (props.class) {
		return Array.isArray(props.class) ? props.class : [props.class]
	}
	return undefined
})

const sources = computed<VideoSource[]>(() => {
	if (Array.isArray(props.src)) return props.src
	const ext = props.src.split('.').pop() || 'mp4'
	const type =
		ext === 'webm' ? 'video/webm' : ext === 'ogv' ? 'video/ogg' : 'video/mp4'
	return [{ src: props.src, type }]
})

const showControls = computed(() => {
	return props.controls && isPlaying.value
})

const handlePlay = async () => {
	if (!videoEl.value) return
	try {
		await videoEl.value.play()
		isPlaying.value = true
	} catch {
		// ignore
	}
}

onMounted(() => {
	if (typeof window === 'undefined') return
	if ('IntersectionObserver' in window) {
		observer = new IntersectionObserver(
			entries => {
				if (entries.some(e => e.isIntersecting)) {
					isIntersected.value = true
					observer?.disconnect()
				}
			},
			{ rootMargin: '200px' }
		)
		if (containerEl.value) observer.observe(containerEl.value)
		else if (videoEl.value) observer.observe(videoEl.value)
	} else {
		isIntersected.value = true
	}
})

onBeforeUnmount(() => {
	observer?.disconnect()
})
</script>

<template>
	<div class="base-video" :class="classes" ref="containerEl">
		<video
			class="base-video__media"
			ref="videoEl"
			:muted="props.muted"
			:loop="props.loop"
			:controls="showControls"
			playsinline
			preload="none"
			:poster="props.poster"
		>
			<template v-if="isIntersected">
				<source
					v-for="(s, i) in sources"
					:key="i"
					:src="s.src"
					:type="s.type"
				/>
			</template>
		</video>
		<button
			v-if="!isPlaying"
			class="base-video__play"
			type="button"
			@click="handlePlay"
			aria-label="Play video"
		>
			<Text
				class="base-video__play--title"
				tag="span"
				size="sm"
				design="secondary"
				line-height="xl"
				>Смотреть видео</Text
			>
			<Icon class="base-video__play--icon" name="base-arrow"></Icon>
		</button>
	</div>
</template>

<style lang="scss">
.base-video {
	position: relative;
	display: block;

	&__media {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 12px;
		overflow: hidden;
		background: var(--primary-bg);
	}

	&__play {
		width: 171px;
		justify-content: space-between;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: inline-flex;
		align-items: center;
		height: 48px;
		border-radius: 3000px;
		background-color: var(--page-bg);
		border: none;
		cursor: pointer;
		padding: 0 var(--space-sm);
		will-change: transform;
		&--icon {
			transform: rotate(-90deg);
			color: var(--main-bg);
			width: 14px;
			height: 7px;
		}
		&:hover {
			.icon {
				animation: bounce-arrow-right 1s linear infinite;
			}
		}
	}
}
</style>
