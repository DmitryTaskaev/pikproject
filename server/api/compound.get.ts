import { createError, getQuery } from 'h3'
import { getApiBase } from '../utils/api'

export default defineCachedEventHandler(async event => {
	const config = useRuntimeConfig()
	const apiBase = getApiBase(event)
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	const query = getQuery(event) as {
		section_id?: string
		include_subsections?: string | number
	}

	if (!query.section_id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'section_id is required',
		})
	}

	return await $fetch(`${apiBase}/compound`, {
		headers,
		query: {
			section_id: query.section_id,
			include_subsections: query.include_subsections ?? 1,
		},
	})
}, {
	maxAge: 900,
	swr: true,
	getKey: event => {
		const query = getQuery(event) as {
			section_id?: string
			include_subsections?: string | number
			lang?: string
		}
		const apiBase = getApiBase(event)
		return [
			'compound',
			apiBase,
			query.section_id || '',
			query.include_subsections ?? 1,
			query.lang || '',
		]
			.map(part => encodeURIComponent(String(part)))
			.join(':')
	},
})
