import { getApiBase } from '../utils/api'

interface CompanyBlockTextResponse {
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

	return await $fetch<CompanyBlockTextResponse>(`${apiBase}/companyBlockText`, {
		headers,
	})
})
