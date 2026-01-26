import { createError, getQuery } from 'h3'

interface ServiceSection {
	SECTION: {
		ID: string
		CODE?: string
		['~CODE']?: string
	}
}

export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	const query = getQuery(event) as { section_id?: string; code?: string }

	if (query.section_id) {
		return await $fetch(`${config.apiBase}/services`, {
			headers,
			query: { section_id: query.section_id },
		})
	}

	if (query.code) {
		const normalizedCode = String(query.code).trim()
		const listResponse = await $fetch<{ data?: { TREE?: ServiceSection[] } }>(
			`${config.apiBase}/services`,
			{ headers },
		)
		const match = listResponse.data?.TREE?.find(item => {
			const sectionCode = item.SECTION.CODE || item.SECTION['~CODE'] || ''
			return sectionCode === normalizedCode
		})

		if (!match?.SECTION?.ID) {
			if (/^\d+$/.test(normalizedCode)) {
				return await $fetch(`${config.apiBase}/services`, {
					headers,
					query: { section_id: normalizedCode },
				})
			}
			throw createError({
				statusCode: 404,
				statusMessage: 'Service section not found',
			})
		}

		return await $fetch(`${config.apiBase}/services`, {
			headers,
			query: { section_id: match.SECTION.ID },
		})
	}

	return await $fetch(`${config.apiBase}/services`, { headers })
})
