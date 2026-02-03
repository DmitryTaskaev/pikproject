<script setup lang="ts">
import type { PipeCardProps } from '~/components/cards/PipeCard.vue'
import type { ImageProps } from '~/components/ui/base/Image.vue'
import type { ConstructionSlideProps } from '~/components/slides/ConstructionSlide.vue'
import type {
	ProductProperty,
	ProductSectionDetailResponse,
	ProductsTreeResponse,
} from '~/composables/products'
import {
	chunkArray,
	collectListPageProperties,
	decodeHtml,
	mapListPageAggregates,
	mapListPageValues,
	normalizePathSegments,
	resolveImageSrc,
	findSectionByPath,
	resolvePathNodes,
	resolveSectionCode,
} from '~/composables/products'
import type { ListItem } from '~/components/ServiceItem.vue'

interface ServicesProperty {
	NAME: string
	VALUE?: string
}

interface ServicesItem {
	ID: string
	NAME: string
	PREVIEW_TEXT: string
	PREVIEW_PICTURE_SRC?: string
	PROPERTIES?: Record<string, ServicesProperty>
}

interface ServicesSectionDetail {
	SECTION: {
		ID: string
		NAME: string
		CODE?: string
		['~CODE']?: string
	}
	ITEMS: ServicesItem[]
}

interface ServicesDetailResponse {
	status: string
	data: ServicesSectionDetail
}

interface ConstructionPointItem {
	PROPERTIES?: Record<string, { VALUE?: string }>
	PROPERTY_POINT_DESCRIPTION_VALUE?: string
	PROPERTY_POINT_TOP_VALUE?: string
	PROPERTY_POINT_LEFT_VALUE?: string
}

interface ConstructionSectionNode {
	SECTION: {
		NAME: string
		DESCRIPTION?: string
		['~DESCRIPTION']?: string
		PICTURE_SRC?: string
	}
	ITEMS?: ConstructionPointItem[]
	CHILDREN?: ConstructionSectionNode[]
}

interface ConstructionResponse {
	status: string
	data: {
		TREE?: ConstructionSectionNode[]
	}
}

interface CompoundSectionNode {
	SECTION: {
		NAME: string
		DESCRIPTION?: string
		['~DESCRIPTION']?: string
		PICTURE_SRC?: string
		UF_TYPE_RU?: string | null
		['~UF_TYPE_RU']?: string | null
	}
	ITEMS?: ConstructionPointItem[]
	CHILDREN?: CompoundSectionNode[]
}

interface CompoundResponse {
	status: string
	data: {
		TREE?: CompoundSectionNode[]
	}
}

const fitting = {
	content: {
		desc: 'Для надземной прокладки теплотрасс и промышленных сетей. Обеспечивает высокую механическую прочность и стойкость к внешним воздействиям.',
		measures: [
			{
				title: 'Толщина изоляции:',
				value: '10-100',
			},
			{
				title: 'd оболочки:',
				value: '30-140',
			},
			{
				title: 'Срок годности:',
				value: '20 лет',
			},
		],
	},
}


const route = useRoute()
const config = useRuntimeConfig()

const pathSegments = computed(() => normalizePathSegments(route.params.path))
const pathString = computed(() => pathSegments.value.join('/'))
const itemCode = computed(() => pathSegments.value[pathSegments.value.length - 1] || '')
const sectionSegmentsForItem = computed(() => pathSegments.value.slice(0, -1))
const sectionPathForItem = computed(() => sectionSegmentsForItem.value.join('/'))

const withBasePath = (path: string) => {
	const normalized = path.startsWith('/') ? path : `/${path}`
	const base = config.app.baseURL || '/'
	const baseNormalized = base.endsWith('/') ? base.slice(0, -1) : base
	if (normalized.startsWith(baseNormalized + '/')) return normalized
	return `${baseNormalized}${normalized}`
}

const { data: treeData } = await useAsyncData('productsTree', () =>
	$fetch<ProductsTreeResponse>(`${config.app.baseURL}api/products`),
)

const pathIsSection = computed(() => {
	const tree = treeData.value?.data?.TREE || []
	return Boolean(findSectionByPath(tree, pathSegments.value))
})

const viewNodeForItem = computed(() => {
	if (!sectionSegmentsForItem.value.length) return null
	const tree = treeData.value?.data?.TREE || []
	return findSectionByPath(tree, sectionSegmentsForItem.value)
})

const { data: sectionData } = await useAsyncData(
	() => `catalog-section-${pathString.value}`,
	async () => {
		if (!pathString.value) return null
		const primary = await $fetch<ProductSectionDetailResponse>(
			`${config.app.baseURL}api/products`,
			{ query: { path: pathString.value } },
		)
		if (pathIsSection.value) return primary
		if (itemCode.value && viewNodeForItem.value?.SECTION?.ID) {
			const byId = await $fetch<ProductSectionDetailResponse>(
				`${config.app.baseURL}api/products`,
				{ query: { section_id: viewNodeForItem.value.SECTION.ID } },
			)
			if ((byId?.data?.ITEMS || []).length > 0) return byId
		}
		const primaryItems = primary?.data?.ITEMS || []
		const hasPrimarySection = Boolean(primary?.data?.SECTION)
		const shouldFallback =
			itemCode.value &&
			sectionPathForItem.value &&
			sectionPathForItem.value !== pathString.value &&
			(!hasPrimarySection || primaryItems.length === 0)
		if (shouldFallback) {
			return $fetch<ProductSectionDetailResponse>(
				`${config.app.baseURL}api/products`,
				{ query: { path: sectionPathForItem.value } },
			)
		}
		return primary
	},
	{ watch: [pathString, sectionPathForItem, itemCode] },
)

const section = computed(() => sectionData.value?.data?.SECTION)
const treeNode = computed(() => {
	const tree = treeData.value?.data?.TREE || []
	const nodeByFull = findSectionByPath(tree, pathSegments.value)
	if (nodeByFull) return nodeByFull
	if (sectionSegmentsForItem.value.length) {
		return findSectionByPath(tree, sectionSegmentsForItem.value)
	}
	return null
})

const items = computed(() => {
	const direct = sectionData.value?.data?.ITEMS || []
	if (direct.length > 0) {
		const seen = new Set<string>()
		return direct.filter(item => {
			const key = String(item.ID || item.CODE || item['~CODE'] || item.NAME || '')
			if (!key || seen.has(key)) return false
			seen.add(key)
			return true
		})
	}
	if (pathIsSection.value) return direct
	return treeNode.value?.ITEMS || []
})

const currentItem = computed(() => {
	const code = itemCode.value
	if (!code) return undefined
	return items.value.find(item => (item.CODE || item['~CODE'] || '') === code)
})

const isItemPage = computed(() => Boolean(currentItem.value))
type SectionType = 'INDUSTRY' | 'VIEW'

const resolveSectionType = (
	sectionValue: typeof section.value,
	sectionItems: Array<{ PROPERTIES?: Record<string, ProductProperty> }>,
): SectionType => {
	const raw =
		sectionValue?.UF_TYPE_ELEMENT ??
		(sectionValue as { ['~UF_TYPE_ELEMENT']?: string | null })?.[
			'~UF_TYPE_ELEMENT'
		]
	const normalized = String(raw || '').toUpperCase()
	if (normalized === 'INDUSTRY' || normalized === 'VIEW') {
		return normalized as SectionType
	}
	return sectionItems.length > 0 ? 'VIEW' : 'INDUSTRY'
}

const sectionType = computed(() => resolveSectionType(section.value, items.value))
const isIndustry = computed(() => sectionType.value === 'INDUSTRY')
const industryPicture = computed(() =>
	section.value?.PICTURE_SRC
		? resolveImageSrc(config.public.apiOrigin, section.value.PICTURE_SRC)
		: '',
)
const industrySliderSlides = computed(() => {
	const raw =
		section.value?.UF_SLIDER_RU ||
		section.value?.UF_SLIDER_RU_FILES?.map(file => file.SRC).filter(Boolean) ||
		[]
	const list = Array.isArray(raw) ? raw : raw ? [raw] : []
	return list
		.map(src => (src ? resolveImageSrc(config.public.apiOrigin, src) : ''))
		.filter(Boolean)
		.map(src => ({
			type: 'image' as const,
			src,
			alt: section.value?.NAME || '',
		}))
})

const constructionSectionId = computed(() => {
	const value = section.value?.UF_CONSTRUCTION_RU
	if (!value) return ''
	return String(value)
		.split(',')
		.map(v => v.trim())
		.filter(Boolean)[0]
})

const { data: constructionData } = await useAsyncData(
	() => `catalog-construction-${constructionSectionId.value}`,
	() =>
		constructionSectionId.value
			? $fetch<ConstructionResponse>(`${config.app.baseURL}api/construction`, {
					query: {
						section_id: constructionSectionId.value,
						include_subsections: 1,
					},
				})
			: null,
	{ watch: [constructionSectionId] },
)

const normalizeConstructionText = (value?: string) => {
	if (!value) return ''
	const decoded = decodeHtml(value)
	return decoded
		.replace(/<br\s*\/?\s*>/gi, '\n')
		.replace(/<[^>]+>/g, '')
		.trim()
}

const constructionSlides = computed<ConstructionSlideProps[]>(() => {
	const root = constructionData.value?.data?.TREE?.[0]
	const children = root?.CHILDREN || []
	return children.map(child => {
		const description = normalizeConstructionText(
			child.SECTION.DESCRIPTION || child.SECTION['~DESCRIPTION'],
		)
		const imageSrc = child.SECTION.PICTURE_SRC
			? resolveImageSrc(config.public.apiOrigin, child.SECTION.PICTURE_SRC)
			: ''
		const points = (child.ITEMS || [])
			.map(item => {
				const props = item.PROPERTIES || {}
				const title = props.POINT_DESCRIPTION?.VALUE || ''
				const top = props.POINT_TOP?.VALUE || ''
				const left = props.POINT_LEFT?.VALUE || ''
				if (!title || !top || !left) return null
				return { title, top, left }
			})
			.filter(Boolean) as Array<{ title: string; top: string; left: string }>

		return {
			image: {
				src: imageSrc,
				alt: child.SECTION.NAME || 'Конструкция',
			},
			description,
			points,
		}
	})
})

const compoundSectionId = computed(() => {
	const value = section.value?.UF_COMPOUND_RU
	if (!value) return ''
	return String(value)
		.split(',')
		.map(v => v.trim())
		.filter(Boolean)[0]
})

const { data: compoundData } = await useAsyncData(
	() => `catalog-compound-${compoundSectionId.value}`,
	() =>
		compoundSectionId.value
			? $fetch<CompoundResponse>(`${config.app.baseURL}api/compound`, {
					query: {
						section_id: compoundSectionId.value,
						include_subsections: 1,
					},
				})
			: null,
	{ watch: [compoundSectionId] },
)

const compoundSliders = computed(() => {
	const root = compoundData.value?.data?.TREE?.[0]
	const tabs = root?.CHILDREN || []
	return tabs
		.filter(tab => {
			const type = String(
				tab.SECTION.UF_TYPE_RU ||
					tab.SECTION['~UF_TYPE_RU'] ||
					'',
			).toUpperCase()
			return type === 'TAB'
		})
		.map(tab => {
			const slides: ConstructionSlideProps[] = (tab.CHILDREN || [])
				.filter(child => {
					const type = String(
						child.SECTION.UF_TYPE_RU ||
							child.SECTION['~UF_TYPE_RU'] ||
							'',
					).toUpperCase()
					return type === 'ITEM' || type === 'ELEMENT'
				})
				.map(child => {
					const description = normalizeConstructionText(
						child.SECTION.DESCRIPTION || child.SECTION['~DESCRIPTION'],
					)
					const imageSrc = child.SECTION.PICTURE_SRC
						? resolveImageSrc(config.public.apiOrigin, child.SECTION.PICTURE_SRC)
						: ''
					const points = (child.ITEMS || [])
						.map(item => {
							const props = item.PROPERTIES || {}
							const title = props.POINT_DESCRIPTION?.VALUE || ''
							const top = props.POINT_TOP?.VALUE || ''
							const left = props.POINT_LEFT?.VALUE || ''
							if (!title || !top || !left) return null
							return { title, top, left }
						})
						.filter(Boolean) as Array<{ title: string; top: string; left: string }>
					return {
						image: {
							src: imageSrc,
							alt: child.SECTION.NAME || 'Способ соединения',
						},
						description,
						points,
					}
				})
			return {
				button: tab.SECTION.NAME || 'Способ',
				slides,
			}
		})
		.filter(tab => tab.slides.length > 0)
})

type VariantSectionNode = {
	SECTION: any
	ITEMS?: any[]
	pathSegments?: string[]
	CHILDREN?: VariantSectionNode[]
}

const sectionChildren = computed<VariantSectionNode[]>(() => {
	return (sectionData.value?.data?.CHILDREN || []) as VariantSectionNode[]
})

const treeChildren = computed<VariantSectionNode[]>(() => {
	return (treeNode.value?.CHILDREN || []) as VariantSectionNode[]
})

const variantChildren = computed<VariantSectionNode[]>(() => {
	if (treeChildren.value.length > 0) return treeChildren.value
	return sectionChildren.value
})

const resolveNodeType = (node: VariantSectionNode): SectionType => {
	return resolveSectionType(
		node.SECTION,
		(node.ITEMS || []) as Array<{ PROPERTIES?: Record<string, ProductProperty> }>,
	)
}

const viewSections = computed<VariantSectionNode[]>(() => {
	return variantChildren.value.filter(child => resolveNodeType(child) === 'VIEW')
})

const collectVariantSections = (
	nodes: VariantSectionNode[],
	parentSegments: string[] = [],
): VariantSectionNode[] => {
	const result: VariantSectionNode[] = []
	for (const node of nodes) {
		const nodeCode = resolveSectionCode(node.SECTION)
		const nextSegments = nodeCode ? [...parentSegments, nodeCode] : parentSegments
		if ((node.ITEMS || []).length > 0) {
			result.push({
				SECTION: node.SECTION,
				ITEMS: node.ITEMS,
				pathSegments: nextSegments,
			})
		}
		if (node.CHILDREN?.length) {
			result.push(...collectVariantSections(node.CHILDREN, nextSegments))
		}
	}
	return result
}

const buildCatalogSection = (node: VariantSectionNode) => {
	const nodeCode = resolveSectionCode(node.SECTION)
	const sectionSegments =
		node.pathSegments && node.pathSegments.length > 0
			? node.pathSegments
			: nodeCode
				? [nodeCode]
				: []
	const currentSegments = pathSegments.value
	const tailMatches =
		sectionSegments.length > 0 &&
		currentSegments.slice(-sectionSegments.length).join('/') ===
			sectionSegments.join('/')
	const baseSegments = tailMatches
		? currentSegments
		: [...currentSegments, ...sectionSegments]
	const basePath = baseSegments.filter(Boolean).join('/')
	const listPageProps = collectListPageProperties(node.ITEMS || [])
	const titleList = listPageProps.map(item => `${item.name}:`)
	const cards = (node.ITEMS || []).map(item => ({
		image: {
			src: resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC),
			alt: item.NAME,
		} as ImageProps,
		name: item.NAME,
		settings: mapListPageValues(
			item.PROPERTIES as Record<string, ProductProperty>,
			listPageProps,
		),
		href: withBasePath(
			`/catalog/${basePath}/${item.CODE || item['~CODE'] || ''}`,
		),
	}))
	return {
		title: node.SECTION.NAME ? ['Каталог', node.SECTION.NAME] : ['Каталог'],
		titleList,
		slides: chunkArray(cards, 7),
	}
}

const catalogSections = computed(() => {
	if (viewSections.value.length > 0) {
		return viewSections.value.map(buildCatalogSection)
	}
	const variantSections = collectVariantSections(variantChildren.value)
	if (variantSections.length > 0) {
		return variantSections.map(buildCatalogSection)
	}
	if (items.value.length > 0) {
		return [
			buildCatalogSection({
				SECTION: section.value,
				ITEMS: items.value,
			}),
		]
	}
	return []
})

const listPageProperties = computed(() =>
	collectListPageProperties(items.value).slice(0, 6),
)
const titleList = computed(() =>
	listPageProperties.value.map(item => `${item.name}:`),
)

const slides = computed(() => {
	const cards: PipeCardProps[] = items.value.map(item => ({
		image: {
			src: resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC),
			alt: item.NAME,
		} as ImageProps,
		name: item.NAME,
		settings: mapListPageValues(
			item.PROPERTIES as Record<string, ProductProperty>,
			listPageProperties.value,
		),
		href: withBasePath(
			`/catalog/${pathString.value}/${item.CODE || item['~CODE'] || ''}`,
		),
	}))
	return chunkArray(cards, 3)
})

const heroTitle = computed(() => section.value?.NAME || '')
const heroDescriptions = computed(() => {
	const description = section.value?.DESCRIPTION
	if (!description) return []
	return [decodeHtml(description)]
})

const heroMeasures = computed(() => {
	const values = mapListPageAggregates(items.value, listPageProperties.value)
	return listPageProperties.value
		.map((prop, index) => ({
			title: `${prop.name}:`,
			value: values[index] || '',
		}))
		.filter(item => item.value !== '')
})

const viewPicture = computed(() => {
	const src = section.value?.PICTURE_SRC
	return src ? resolveImageSrc(config.public.apiOrigin, src) : ''
})

const tableRowLimit = 6

type ViewSectionEntry = {
	node: VariantSectionNode
	pathSegments: string[]
}

const collectViewSections = (
	nodes: VariantSectionNode[],
	parentSegments: string[] = [],
): ViewSectionEntry[] => {
	const result: ViewSectionEntry[] = []
	for (const node of nodes) {
		const code = resolveSectionCode(node.SECTION)
		const nextSegments = code ? [...parentSegments, code] : parentSegments
		if (resolveNodeType(node) === 'VIEW') {
			result.push({ node, pathSegments: nextSegments })
		}
	}
	return result
}

const tableViewSections = computed(() => {
	return variantChildren.value
		.map(child => {
			const code = resolveSectionCode(child.SECTION)
			if (!code) return null
			return { node: child, pathSegments: [...pathSegments.value, code] }
		})
		.filter(Boolean) as ViewSectionEntry[]
})

const viewIds = computed(() =>
	tableViewSections.value.map(entry => entry.node.SECTION.ID).join(','),
)

const { data: viewDetailsData } = await useAsyncData(
	() => `catalog-view-items-${pathString.value}-${viewIds.value}`,
	async () => {
		if (!viewIds.value) return []
		const entries = tableViewSections.value
		const responses = await Promise.all(
			entries.map(entry =>
				$fetch<ProductSectionDetailResponse>(`${config.app.baseURL}api/products`, {
					query: { section_id: entry.node.SECTION.ID },
				}),
			),
		)
		return responses.map((res, index) => ({
			entry: entries[index],
			section: res.data?.SECTION || entries[index].node.SECTION,
			items: res.data?.ITEMS || [],
		}))
	},
	{ watch: [viewIds] },
)

const tableAllItems = computed(() => {
	const list = viewDetailsData.value || []
	const seen = new Set<string>()
	const result: any[] = []
	for (const entry of list) {
		for (const item of entry.items || []) {
			const id = String(item.ID || item.CODE || item['~CODE'] || '')
			if (id && seen.has(id)) continue
			if (id) seen.add(id)
			result.push(item)
		}
	}
	return result
})

const tableProperties = computed(() => {
	const list = collectListPageProperties(tableAllItems.value)
	if (list.length > 0) return list.slice(0, tableRowLimit)
	const map = new Map<string, { code: string; name: string; sort: number }>()
	for (const item of tableAllItems.value) {
		const props = item.PROPERTIES || {}
		for (const [key, prop] of Object.entries(props)) {
			const code = prop?.CODE || key
			if (!code) continue
			if (!map.has(code)) {
				map.set(code, {
					code,
					name: prop?.NAME || code,
					sort: Number(prop?.SORT || 0),
				})
			}
		}
	}
	return Array.from(map.values())
		.sort((a, b) => a.sort - b.sort)
		.slice(0, tableRowLimit)
})

const tableTitles = computed(() => {
	const resolveTitle = (code: string, name: string) => {
		const upper = code.toUpperCase()
		if (upper.includes('DIAMETR')) return 'Диаметр изделия:'
		if (upper.includes('SDR')) return 'SDR изделия:'
		if (upper.includes('GOST')) return 'ГОСТ изделия:'
		if (upper.includes('TU') || upper.includes('SPEC')) return 'ТУ изделия:'
		if (upper.includes('MATERIAL')) return 'Материал изделия:'
		return name ? `${name}:` : ''
	}
	const titles = tableProperties.value.map(item =>
		resolveTitle(item.code, item.name),
	)
	if (titles.length >= tableRowLimit) return titles.slice(0, tableRowLimit)
	return titles.concat(Array(tableRowLimit - titles.length).fill(''))
})

const itemDetailsList = computed(() => {
	const props = currentItem.value?.PROPERTIES as
		| Record<string, ProductProperty>
		| undefined
	const list = collectListPageProperties([{ PROPERTIES: props || {} }])
	return list
		.map(item => ({
			title: `${item.name}:`,
			value:
				props?.[item.code]?.VALUE === undefined ||
				props?.[item.code]?.VALUE === null ||
				props?.[item.code]?.VALUE === ''
					? ''
					: String(props?.[item.code]?.VALUE),
		}))
		.filter(item => item.value !== '')
})

const itemSlides = computed(() => {
	const gallery = currentItem.value?.PROPERTIES?.MORE_PHOTO as
		| { SRC?: string[]; FILES?: Array<{ SRC?: string }> }
		| undefined
	const sources =
		gallery?.SRC ||
		gallery?.FILES?.map(file => file.SRC).filter(Boolean) ||
		[]
	const uniqueSources = sources.filter(Boolean)
	return uniqueSources.map(src => ({
		image: {
			src: resolveImageSrc(config.public.apiOrigin, src),
			alt: currentItem.value?.NAME || 'Изображение',
		},
	}))
})

const itemDocuments = computed(() => {
	const docs = currentItem.value?.PROPERTIES?.DOCUMNETS as
		| {
				SRC?: string[]
				FILES?: Array<{ SRC?: string; FILE_SIZE?: number; ORIGINAL_NAME?: string }>
				VALUE?: unknown
		  }
		| undefined
	const files = docs?.FILES || []
	if (files.length > 0) {
		return files.map(file => ({
			text: [file.ORIGINAL_NAME || 'Документ'],
			size: Number.isFinite(Number(file.FILE_SIZE))
				? (Number(file.FILE_SIZE) / (1024 * 1024)).toFixed(1)
				: undefined,
			href: file.SRC ? resolveImageSrc(config.public.apiOrigin, file.SRC) : undefined,
		}))
	}
	const rawSources = docs?.SRC ?? docs?.VALUE ?? []
	const srcs = Array.isArray(rawSources)
		? rawSources
		: rawSources
			? [rawSources]
			: []
	const normalized = srcs
		.map(src => {
			if (typeof src === 'string') return src
			if (src && typeof src === 'object') {
				const obj = src as { SRC?: string; ORIGINAL_NAME?: string }
				return obj.SRC || ''
			}
			return ''
		})
		.filter(Boolean)
	return normalized.map(src => ({
		text: ['Документ'],
		href: resolveImageSrc(config.public.apiOrigin, src),
	}))
})

const itemCatalogProperties = computed(() => {
	const list = collectListPageProperties(items.value)
	return list.slice(0, 6)
})

const itemCatalogTitleList = computed(() =>
	itemCatalogProperties.value.map(item => `${item.name}:`),
)

const itemOtherCards = computed<PipeCardProps[]>(() => {
	const seen = new Set<string>()
	return items.value
		.filter(item => (item.CODE || item['~CODE'] || '') !== itemCode.value)
		.filter(item => {
			const key = String(item.ID || item.CODE || item['~CODE'] || item.NAME || '')
			if (!key || seen.has(key)) return false
			seen.add(key)
			return true
		})
		.map(item => ({
			image: {
				src: resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC),
				alt: item.NAME,
			} as ImageProps,
			name: item.NAME,
			settings: mapListPageValues(
				item.PROPERTIES as Record<string, ProductProperty>,
				itemCatalogProperties.value,
			),
			href: withBasePath(
				`/catalog/${sectionPathForItem.value}/${
					item.CODE || item['~CODE'] || ''
				}`,
			),
		}))
})

const itemCatalogTitle = computed(() => {
	return section.value?.NAME
		? `Другие варианты ${section.value.NAME}`
		: 'Другие варианты'
})

const itemHeroTitle = computed(() => currentItem.value?.NAME || '')
const itemHeroDesc = computed(() =>
	currentItem.value?.PREVIEW_TEXT
		? decodeHtml(currentItem.value.PREVIEW_TEXT)
		: '',
)

const getItemSeoValue = (key: 'SEO_TITLE' | 'SEO_DESCRIPTION') => {
	const item = currentItem.value as
		| {
				[key: string]: unknown
				PROPERTIES?: Record<string, { VALUE?: unknown }>
		  }
		| null
	if (!item) return ''
	const direct = item[key]
	if (typeof direct === 'string' && direct.trim()) return direct.trim()
	const propValue = item.PROPERTIES?.[key]?.VALUE
	if (typeof propValue === 'string' && propValue.trim()) return propValue.trim()
	if (
		propValue &&
		typeof propValue === 'object' &&
		'TEXT' in propValue &&
		typeof (propValue as { TEXT?: unknown }).TEXT === 'string' &&
		(propValue as { TEXT?: string }).TEXT?.trim()
	) {
		return (propValue as { TEXT: string }).TEXT.trim()
	}
	return ''
}

const seoTitle = computed(() => {
	const itemTitle = getItemSeoValue('SEO_TITLE')
	return itemTitle || section.value?.UF_SEO_TITLE || ''
})

const seoDescription = computed(() => {
	const itemDescription = getItemSeoValue('SEO_DESCRIPTION')
	return itemDescription || section.value?.UF_SEO_DESCRIPTION || ''
})

const collectPropertyValues = (
	list: Array<{ PROPERTIES?: Record<string, ProductProperty> }>,
	code: string,
) => {
	const values = new Set<string>()
	for (const item of list) {
		const raw = item.PROPERTIES?.[code]?.VALUE
		if (raw === undefined || raw === null || raw === '') continue
		values.add(String(raw).trim())
	}
	const result = Array.from(values)
	const numeric = result
		.map(value => Number(String(value).replace(',', '.')))
		.filter(value => !Number.isNaN(value))
	if (numeric.length === result.length) {
		return result
			.map(value => Number(String(value).replace(',', '.')))
			.sort((a, b) => a - b)
			.map(value => String(value))
	}
	return result.sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }))
}

const formatRowValues = (values: string[]) => {
	if (values.length === 0) return []
	const chunks = chunkArray(values, 7)
	return chunks
}

const isClickableProperty = (code: string, name: string) => {
	const upper = code.toUpperCase()
	if (upper.includes('DIAMETR')) return true
	if (upper.includes('SDR')) return true
	if (name.toLowerCase().includes('диаметр')) return true
	if (name.toLowerCase().includes('sdr')) return true
	return false
}

const tableClickableRows = computed(() => {
	return tableProperties.value
		.map((prop, index) =>
			isClickableProperty(prop.code, prop.name) ? index : -1,
		)
		.filter(index => index >= 0)
})

const tableDropdowns = computed(() => {
	return tableProperties.value.map(prop => {
		if (!isClickableProperty(prop.code, prop.name)) return null
		const values = collectPropertyValues(tableAllItems.value, prop.code)
		return values.length > 0 ? values : null
	})
})

const buildItemHref = (segments: string[], code: string) => {
	if (!code) return ''
	return withBasePath(`/catalog/${segments.join('/')}/${code}`)
}

const buildValueLinks = (
	itemsList: Array<{ PROPERTIES?: Record<string, ProductProperty>; CODE?: string; ['~CODE']?: string }>,
	propCode: string,
	entrySegments: string[],
) => {
	const map = new Map<string, string>()
	for (const item of itemsList) {
		const raw = item.PROPERTIES?.[propCode]?.VALUE
		if (raw === undefined || raw === null || raw === '') continue
		const value = String(raw).trim()
		const code = item.CODE || item['~CODE'] || ''
		if (!value || !code) continue
		if (!map.has(value)) {
			map.set(value, buildItemHref(entrySegments, code))
		}
	}
	return map
}

const productTableSlides = computed(() => {
	if (!isIndustry.value) return []
	const list = viewDetailsData.value || []
	const cards = list
		.filter(item => item.items && item.items.length > 0)
		.map(item => {
		const itemsList = item.items
		const sectionInfo = item.section || item.entry.node.SECTION
		const entry = item.entry
		const rows = tableProperties.value.map(prop => {
			const values = collectPropertyValues(itemsList, prop.code)
			return formatRowValues(values)
		})
		const rowLinks = tableProperties.value.map(prop => {
			if (!isClickableProperty(prop.code, prop.name)) return []
			const valueLinks = buildValueLinks(itemsList, prop.code, entry.pathSegments)
			const values = collectPropertyValues(itemsList, prop.code)
			const lines = formatRowValues(values)
			return lines.map(line =>
				line.map(value => valueLinks.get(value) || ''),
			)
		})
		const preview =
			itemsList.find(item => item.PREVIEW_PICTURE_SRC)?.PREVIEW_PICTURE_SRC ||
			sectionInfo.PICTURE_SRC ||
			'production/product-01'
		const href = withBasePath(`/catalog/${entry.pathSegments.join('/')}`)
		return {
			caption: {
				title: sectionInfo.NAME,
			image: {
					src: resolveImageSrc(config.public.apiOrigin, preview),
					alt: sectionInfo.NAME,
				} as ImageProps,
				href,
			},
			rows,
			clickableRows: tableClickableRows.value,
			rowLinks,
		}
	})
	return chunkArray(cards, 5)
})

const catalogItems = computed(() => {
	const list = viewDetailsData.value || []
	const seen = new Set<string>()
	const result: Array<{ item: any; pathSegments: string[] }> = []
	for (const entry of list) {
		const entryPath = entry.entry?.pathSegments || pathSegments.value
		for (const item of entry.items || []) {
			const id = String(item.ID || item.CODE || item['~CODE'] || '')
			if (id && seen.has(id)) continue
			if (id) seen.add(id)
			result.push({ item, pathSegments: entryPath })
		}
	}
	return result
})

const uniqueByName = (list: Array<{ code: string; name: string; sort: number }>) => {
	const seen = new Set<string>()
	return list.filter(item => {
		const key = item.name?.toLowerCase() || item.code
		if (seen.has(key)) return false
		seen.add(key)
		return true
	})
}

const catalogProperties = computed(() => {
	const list = collectListPageProperties(catalogItems.value.map(entry => entry.item))
	return uniqueByName(list).slice(0, 6)
})

const catalogTitleList = computed(() =>
	catalogProperties.value.map(item => `${item.name}:`),
)

const catalogSlides = computed(() => {
	const dedupeValues = (values: string[]) => {
		const seen = new Set<string>()
		return values.map(value => {
			const key = String(value || '')
				.trim()
				.toLowerCase()
				.replace(/[^\p{L}\p{N}]+/gu, '')
			if (!key) return ''
			if (seen.has(key)) return ''
			seen.add(key)
			return value
		})
	}
	const cards: PipeCardProps[] = catalogItems.value.map(entry => ({
		image: {
			src: resolveImageSrc(config.public.apiOrigin, entry.item.PREVIEW_PICTURE_SRC),
			alt: entry.item.NAME,
		} as ImageProps,
		name: entry.item.NAME,
		settings: dedupeValues(
			mapListPageValues(
				entry.item.PROPERTIES as Record<string, ProductProperty>,
				catalogProperties.value,
			),
		),
		href: buildItemHref(
			entry.pathSegments,
			entry.item.CODE || entry.item['~CODE'] || '',
		),
	}))
	return chunkArray(cards, 7)
})

const breadcrumbsList = computed(() => {
	const tree = treeData.value?.data?.TREE || []
	const nodes = resolvePathNodes(
		tree,
		isItemPage.value ? sectionSegmentsForItem.value : pathSegments.value,
	)
	const trail = nodes.map((node, index) => {
		const codes = nodes
			.slice(0, index + 1)
			.map(item => resolveSectionCode(item.SECTION))
			.filter(Boolean)
		const href = `/catalog/${codes.join('/')}`
		return { title: node.SECTION.NAME, href }
	})
	return [
		{ title: 'Главная', href: '/' },
		{ title: 'Каталог', href: '/catalog' },
		...trail,
		...(isItemPage.value && currentItem.value
			? [
					{
						title: currentItem.value.NAME || 'Товар',
						href: `/catalog/${pathSegments.value.join('/')}`,
					},
				]
			: []),
	]
})

const resolveServiceImage = (src?: string) => {
	if (!src) return undefined
	return { src: resolveImageSrc(config.public.apiOrigin, src), alt: '' }
}

const mapServiceProperties = (props?: Record<string, ServicesProperty>) => {
	if (!props) return []
	return Object.values(props)
		.filter(item => item?.NAME && item?.VALUE)
		.map(item => ({
			title: `${item.NAME}:`,
			value: String(item.VALUE),
		}))
}

const serviceSectionId = computed(() => {
	const value = section.value?.UF_SERVICES
	if (!value) return ''
	return String(value)
		.split(',')
		.map(v => v.trim())
		.filter(Boolean)[0]
})

const { data: servicesData } = await useAsyncData(
	() => `catalog-services-${serviceSectionId.value}`,
	() =>
		serviceSectionId.value
			? $fetch<ServicesDetailResponse>(`${config.app.baseURL}api/services`, {
					query: { section_id: serviceSectionId.value },
				})
			: null,
	{ watch: [serviceSectionId] },
)

const serviceSection = computed(() => servicesData.value?.data?.SECTION)
const servicesList = computed<ListItem[]>(() => {
	const list = servicesData.value?.data?.ITEMS || []
	return list.map(item => ({
		title: [item.NAME],
		content: {
			desc: decodeHtml(item.PREVIEW_TEXT || ''),
			measures: mapServiceProperties(item.PROPERTIES),
		},
		image: resolveServiceImage(item.PREVIEW_PICTURE_SRC),
	}))
})

const servicesLinkTitle = computed(() => serviceSection.value?.NAME || '')
const servicesLinkHref = computed(() => {
	const code = serviceSection.value?.CODE || serviceSection.value?.['~CODE'] || ''
	return code ? `${config.app.baseURL}services/${code}` : `${config.app.baseURL}services`
})
</script>

<template>
	<main class="main">
		<Breadcrumbs :list="breadcrumbsList" />
		<template v-if="isItemPage">
			<PCHero
				:title="itemHeroTitle"
				:application="itemHeroDesc"
				:details="itemDetailsList"
				:slides="itemSlides"
			/>
			<PCDocuments v-if="itemDocuments.length" :slides="itemDocuments" />
			<PCCatalog
				v-if="itemOtherCards.length"
				:title="itemCatalogTitle"
				:title-list="itemCatalogTitleList"
				:card-list="itemOtherCards"
			/>
		</template>
		<template v-else>
		<HeroVideo
			v-if="isIndustry && industrySliderSlides.length"
			:slides="industrySliderSlides"
		/>
		<SHero
			v-if="isIndustry"
			:title="heroTitle"
			:descriptions="heroDescriptions"
			:image-src="industryPicture"
		/>
		<TableSection
			v-if="isIndustry && productTableSlides.length"
			title="Варианты труб"
			:titles="tableTitles"
			:dropdowns="tableDropdowns"
			:slides="productTableSlides"
		/>
		<CatalogSection
			v-if="isIndustry && catalogSlides.length"
			:title="['Каталог труб']"
			:title-list="catalogTitleList"
			:slides="catalogSlides"
		/>
		<FittingBlock
			v-if="isIndustry"
			:list-item="fitting"
			:is-big-btn="true"
			title="Фитинги"
		/>
		<ConstructionSection
			v-if="isIndustry && constructionSlides.length"
			title="Конструкция"
			:slides="constructionSlides"
		/>
		<PPHero
			v-if="!isIndustry"
			:title="heroTitle"
			:descriptions="heroDescriptions"
			:measures="heroMeasures"
			:image-src="viewPicture"
		/>
		<ConstructionSection
			v-if="!isIndustry && constructionSlides.length"
			title="Конструкция"
			:slides="constructionSlides"
		/>
		<ConstructionSection
			v-if="compoundSliders.length"
			title="Способы соединения"
			:sliders="compoundSliders"
		/>
		<PPCatalog
			v-if="!isIndustry"
			:title="heroTitle ? ['Полный каталог', heroTitle] : ['Полный каталог']"
			:title-list="titleList"
			:slides="slides"
		/>
		</template>
		<ServicesBlock
			v-if="servicesList.length"
			:service="{ title: servicesLinkTitle, href: servicesLinkHref }"
			:list-items="servicesList"
		/>
		<SeoBlock
			v-if="seoTitle || seoDescription"
			:title="seoTitle"
			:description="seoDescription"
		/>
		<ConsultationBlock />
		<ActionsPopup />
	</main>
	<DocumentationModal />
	<OrderModal />
</template>

<style lang="scss"></style>
