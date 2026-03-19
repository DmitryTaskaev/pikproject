import { getApiBase } from '../utils/api'

interface CompanyProductionResponse {
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

	return await $fetch<CompanyProductionResponse>(`${apiBase}/companyProduction`, {
		headers,
	})
})
