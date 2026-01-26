export default defineEventHandler(async () => {
	const config = useRuntimeConfig()
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	return await $fetch(`${config.apiBase}/mainSliderBottom`, { headers })
})
