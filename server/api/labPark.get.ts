import { getApiBase } from '../utils/api'

interface LabParkResponse {
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

	return await $fetch<LabParkResponse>(`${apiBase}/labPark`, {
		headers,
	})
})
