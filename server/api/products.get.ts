import { createError, getQuery } from 'h3'

interface ProductSectionNode {
	SECTION: {
		ID: string
		CODE?: string
		['~CODE']?: string
	}
	CHILDREN?: ProductSectionNode[]
}

const resolveSectionCode = (section: ProductSectionNode['SECTION']) => {
	return section.CODE || section['~CODE'] || ''
}

const findByPath = (
	nodes: ProductSectionNode[],
	segments: string[],
): ProductSectionNode | null => {
	if (segments.length === 0) return null
	const [head, ...rest] = segments
	const match = nodes.find(node => resolveSectionCode(node.SECTION) === head)
	if (!match) return null
	if (rest.length === 0) return match
	return findByPath(match.CHILDREN || [], rest)
}

export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	const query = getQuery(event) as {
		section_id?: string
		code?: string
		path?: string
	}

	if (query.section_id) {
		return await $fetch(`${config.apiBase}/products`, {
			headers,
			query: { section_id: query.section_id },
		})
	}

	if (query.path) {
		const rawPath = String(query.path).trim()
		if (!rawPath) {
			throw createError({ statusCode: 400, statusMessage: 'Path is empty' })
		}
		const segments = rawPath.split('/').filter(Boolean)
		const listResponse = await $fetch<{ data?: { TREE?: ProductSectionNode[] } }>(
			`${config.apiBase}/products`,
			{ headers },
		)
		const tree = listResponse.data?.TREE || []
		const match = findByPath(tree, segments)

		if (!match?.SECTION?.ID) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Product section not found',
			})
		}

		return await $fetch(`${config.apiBase}/products`, {
			headers,
			query: { section_id: match.SECTION.ID },
		})
	}

	if (query.code) {
		const normalizedCode = String(query.code).trim()
		const listResponse = await $fetch<{ data?: { TREE?: ProductSectionNode[] } }>(
			`${config.apiBase}/products`,
			{ headers },
		)
		const tree = listResponse.data?.TREE || []

		const walk = (nodes: ProductSectionNode[]): ProductSectionNode | null => {
			for (const node of nodes) {
				const code = resolveSectionCode(node.SECTION)
				if (code === normalizedCode) return node
				const childMatch = walk(node.CHILDREN || [])
				if (childMatch) return childMatch
			}
			return null
		}

		const match = walk(tree)
		if (!match?.SECTION?.ID) {
			if (/^\d+$/.test(normalizedCode)) {
				return await $fetch(`${config.apiBase}/products`, {
					headers,
					query: { section_id: normalizedCode },
				})
			}
			throw createError({
				statusCode: 404,
				statusMessage: 'Product section not found',
			})
		}

		return await $fetch(`${config.apiBase}/products`, {
			headers,
			query: { section_id: match.SECTION.ID },
		})
	}

	return await $fetch(`${config.apiBase}/products`, { headers })
})
