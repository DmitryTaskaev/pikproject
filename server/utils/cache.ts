import { setResponseHeader, type H3Event } from 'h3'

export const CATALOG_CACHE_MAX_AGE = 60 * 60 * 24 * 7
export const CATALOG_CACHE_CONTROL =
	'public, max-age=604800, stale-while-revalidate=604800'

export const setCatalogCacheHeaders = (event: H3Event) => {
	setResponseHeader(event, 'cache-control', CATALOG_CACHE_CONTROL)
}
