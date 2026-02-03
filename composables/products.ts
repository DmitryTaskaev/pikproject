export interface ProductProperty {
	NAME: string
	CODE?: string
	SORT?: string | number
	LIST_PAGE_SHOW?: string
	VALUE?: string | number | null
}

export interface ProductItem {
	ID: string
	NAME: string
	CODE?: string
	['~CODE']?: string
	PREVIEW_TEXT?: string
	PREVIEW_PICTURE_SRC?: string
	PROPERTIES?: Record<string, ProductProperty & { SRC?: string[]; FILES?: unknown[] }>
}

export interface ProductSection {
	ID: string
	NAME: string
	CODE?: string
	['~CODE']?: string
	DESCRIPTION?: string
	UF_TYPE_ELEMENT?: string | null
	UF_SERVICES?: string | null
	UF_CONSTRUCTION_RU?: string | null
	UF_COMPOUND_RU?: string | null
	UF_SLIDER_RU?: string[] | null
	UF_SLIDER_RU_FILES?: Array<{ SRC?: string }> | null
	PICTURE_SRC?: string
	UF_SEO_TITLE?: string
	UF_SEO_DESCRIPTION?: string
}

export interface ProductSectionNode {
	SECTION: ProductSection
	ITEMS?: ProductItem[]
	CHILDREN?: ProductSectionNode[]
}

export interface ProductsTreeResponse {
	status: string
	data: {
		TREE: ProductSectionNode[]
	}
}

export interface ProductSectionDetailResponse {
	status: string
	data: {
		SECTION: ProductSection
		ITEMS: ProductItem[]
		CHILDREN?: ProductSectionNode[]
	}
}

export const resolveSectionCode = (section?: ProductSection) => {
	if (!section) return ''
	return section.CODE || section['~CODE'] || ''
}

export const resolveItemCode = (item?: ProductItem) => {
	if (!item) return ''
	return item.CODE || item['~CODE'] || ''
}

export const normalizePathSegments = (value: string | string[] | undefined) => {
	if (!value) return []
	return Array.isArray(value) ? value.map(String) : [String(value)]
}

export const resolvePathNodes = (
	tree: ProductSectionNode[],
	segments: string[],
): ProductSectionNode[] => {
	const nodes: ProductSectionNode[] = []
	let currentLevel = tree

	for (const segment of segments) {
		const match = currentLevel.find(node => {
			return resolveSectionCode(node.SECTION) === segment
		})
		if (!match) break
		nodes.push(match)
		currentLevel = match.CHILDREN || []
	}

	return nodes
}

export const findSectionByPath = (
	tree: ProductSectionNode[],
	segments: string[],
) => {
	const nodes = resolvePathNodes(tree, segments)
	if (nodes.length !== segments.length) return null
	return nodes[nodes.length - 1] || null
}

export const decodeHtml = (value: string) => {
	return value
		.replace(/&#40;/g, '(')
		.replace(/&#41;/g, ')')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
}

export const resolveImageSrc = (origin: string, src?: string) => {
	if (!src) return ''
	if (/^https?:\/\//.test(src)) return src
	if (src.startsWith('/')) return `${origin}${src}`
	return src
}

export const chunkArray = <T>(items: T[], size: number) => {
	const result: T[][] = []
	for (let i = 0; i < items.length; i += size) {
		result.push(items.slice(i, i + size))
	}
	return result
}

export interface ListPageProperty {
	code: string
	name: string
	sort: number
}

const parseSort = (value?: string | number) => {
	if (value === undefined || value === null) return Number.POSITIVE_INFINITY
	const parsed = Number(value)
	return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed
}

export const collectListPageProperties = (
	items: Array<{ PROPERTIES?: Record<string, ProductProperty> }>,
): ListPageProperty[] => {
	const map = new Map<string, ListPageProperty>()
	for (const item of items) {
		const props = item.PROPERTIES || {}
		for (const [key, prop] of Object.entries(props)) {
			if (prop?.LIST_PAGE_SHOW !== 'Y') continue
			const code = prop.CODE || key
			if (!code) continue
			if (!map.has(code)) {
				map.set(code, {
					code,
					name: prop.NAME || code,
					sort: parseSort(prop.SORT),
				})
			}
		}
	}
	return Array.from(map.values()).sort((a, b) => a.sort - b.sort)
}

export const mapListPageValues = (
	props: Record<string, ProductProperty> | undefined,
	order: ListPageProperty[],
) => {
	return order.map(item => {
		const value = props?.[item.code]?.VALUE
		return value === undefined || value === null || value === '' ? '' : String(value)
	})
}

const normalizeValue = (value: string) => value.trim()

const tryParseNumber = (value: string) => {
	const normalized = value.replace(',', '.')
	const num = Number(normalized)
	return Number.isNaN(num) ? null : num
}

export const mapListPageAggregates = (
	items: Array<{ PROPERTIES?: Record<string, ProductProperty> }>,
	order: ListPageProperty[],
) => {
	return order.map(prop => {
		const values = new Set<string>()
		for (const item of items) {
			const raw = item.PROPERTIES?.[prop.code]?.VALUE
			if (raw === undefined || raw === null || raw === '') continue
			values.add(normalizeValue(String(raw)))
		}
		const list = Array.from(values)
		if (list.length === 0) return ''
		const nums = list.map(tryParseNumber)
		if (nums.every(num => num !== null)) {
			const numeric = nums as number[]
			const min = Math.min(...numeric)
			const max = Math.max(...numeric)
			return min === max ? String(min) : `${min}–${max}`
		}
		return list.join(', ')
	})
}
