import { createError, getQuery } from 'h3'
import { getApiBase } from '../utils/api'
import { CATALOG_CACHE_MAX_AGE, setCatalogCacheHeaders } from '../utils/cache'

interface ServiceSection {
	SECTION: {
		ID: string
		CODE?: string
		['~CODE']?: string
	}
}

export default defineCachedEventHandler(async event => {
	setCatalogCacheHeaders(event)
	const config = useRuntimeConfig()
	const apiBase = getApiBase(event)
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	const query = getQuery(event) as { section_id?: string; code?: string }

	if (query.section_id) {
		return await $fetch(`${apiBase}/services`, {
			headers,
			query: { section_id: query.section_id },
		})
	}

	if (query.code) {
		const normalizedCode = String(query.code).trim()
		const listResponse = await $fetch<{ data?: { TREE?: ServiceSection[] } }>(
			`${apiBase}/services`,
			{ headers },
		)
		const match = listResponse.data?.TREE?.find(item => {
			const sectionCode = item.SECTION.CODE || item.SECTION['~CODE'] || ''
			return sectionCode === normalizedCode
		})

		if (!match?.SECTION?.ID) {
			if (/^\d+$/.test(normalizedCode)) {
				return await $fetch(`${apiBase}/services`, {
					headers,
					query: { section_id: normalizedCode },
				})
			}
			throw createError({
				statusCode: 404,
				statusMessage: 'Service section not found',
			})
		}

		return await $fetch(`${apiBase}/services`, {
			headers,
			query: { section_id: match.SECTION.ID },
		})
	}

	return await $fetch(`${apiBase}/services`, { headers })
}, {
	maxAge: CATALOG_CACHE_MAX_AGE,
	swr: true,
	getKey: event => {
		const query = getQuery(event) as {
			section_id?: string
			code?: string
			lang?: string
		}
		const apiBase = getApiBase(event)
		return [
			'services',
			apiBase,
			query.section_id || '',
			query.code || '',
			query.lang || '',
		]
			.map(part => encodeURIComponent(String(part)))
			.join(':')
	},
})
