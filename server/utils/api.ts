import { getCookie, getQuery, type H3Event } from 'h3'

const SITE_LANGUAGE_COOKIE = 'site_language'
const DEFAULT_SITE_LANGUAGE = 'ru'

export const getApiBase = (event: H3Event) => {
	const config = useRuntimeConfig(event)
	const query = getQuery(event)
	const queryLanguage = typeof query.lang === 'string' ? query.lang : undefined
	const cookieLanguage = getCookie(event, SITE_LANGUAGE_COOKIE)
	const language
		= queryLanguage === 'en' || cookieLanguage === 'en'
			? 'en'
			: DEFAULT_SITE_LANGUAGE

	return config.apiBase.replace(/\/(ru|en)$/, `/${language}`)
}
