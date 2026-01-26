import { createError, getQuery } from 'h3'

interface NewsItem {
	ID: string
	CODE: string
}

export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	const query = getQuery(event) as {
		id?: string
		code?: string
		page?: string
		limit?: string
	}

	if (query.id) {
		return await $fetch(`${config.apiBase}/news`, {
			headers,
			query: { id: query.id },
		})
	}

	if (query.code) {
		const listResponse = await $fetch<{ data?: { items?: NewsItem[] } }>(
			`${config.apiBase}/news`,
			{ headers },
		)
		const match = listResponse.data?.items?.find(
			item => item.CODE === query.code,
		)

		if (!match) {
			throw createError({
				statusCode: 404,
				statusMessage: 'News item not found',
			})
		}

		return await $fetch(`${config.apiBase}/news`, {
			headers,
			query: { id: match.ID },
		})
	}

	return await $fetch(`${config.apiBase}/news`, {
		headers,
		query: {
			page: query.page,
			limit: query.limit,
		},
	})
})
