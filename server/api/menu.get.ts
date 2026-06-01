import { getApiBase } from '../utils/api'
import { CATALOG_CACHE_MAX_AGE, setCatalogCacheHeaders } from '../utils/cache'

export default defineCachedEventHandler(async event => {
	setCatalogCacheHeaders(event)
	const config = useRuntimeConfig()
	const apiBase = getApiBase(event)
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	return await $fetch(`${apiBase}/menu`, { headers })
}, {
	maxAge: CATALOG_CACHE_MAX_AGE,
	swr: true,
	getKey: event => {
		const apiBase = getApiBase(event)
		return ['menu', apiBase].map(part => encodeURIComponent(part)).join(':')
	},
})
