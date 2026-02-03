import { createError, getQuery } from 'h3'

export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
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

	return await $fetch(`${config.apiBase}/construction`, {
		headers,
		query: {
			section_id: query.section_id,
			include_subsections: query.include_subsections ?? 1,
		},
	})
})
