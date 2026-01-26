interface LabBannerResponse {
	status: string
	data: unknown
}

export default defineEventHandler(async () => {
	const config = useRuntimeConfig()
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	return await $fetch<LabBannerResponse>(`${config.apiBase}/labBanner`, {
		headers,
	})
})
