import { getApiBase } from '../utils/api'

interface LabPricesResponse {
	status: string
	data: unknown
	meta?: unknown
}

export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const apiBase = getApiBase(event)
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	return await $fetch<LabPricesResponse>(`${apiBase}/labPrices`, {
		headers,
	})
})
