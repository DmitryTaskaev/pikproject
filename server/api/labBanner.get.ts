import { getApiBase } from '../utils/api'

interface LabBannerResponse {
	status: string
	data: unknown
}

export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const apiBase = getApiBase(event)
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	return await $fetch<LabBannerResponse>(`${apiBase}/labBanner`, {
		headers,
	})
})
