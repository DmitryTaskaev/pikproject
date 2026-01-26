interface LabPricesResponse {
	status: string
	data: unknown
	meta?: unknown
}

export default defineEventHandler(async () => {
	const config = useRuntimeConfig()
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	return await $fetch<LabPricesResponse>(`${config.apiBase}/labPrices`, {
		headers,
	})
})
