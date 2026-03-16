const SITE_LANGUAGE_COOKIE = 'site_language'
const DEFAULT_SITE_LANGUAGE = 'ru'

export const useSiteLanguage = () => {
	const language = useCookie<'ru' | 'en'>(SITE_LANGUAGE_COOKIE, {
		default: () => DEFAULT_SITE_LANGUAGE,
		path: '/',
		sameSite: 'lax',
		watch: true,
	}) as { value: 'ru' | 'en' }

	const normalizedLanguage = computed<'ru' | 'en'>(() =>
		language.value === 'en' ? 'en' : 'ru',
	)

	const languageLabel = computed(() =>
		normalizedLanguage.value === 'en' ? 'EN' : 'РУ',
	)

	const setLanguage = (value: string) => {
		language.value = value === 'en' ? 'en' : 'ru'
	}

	return {
		language: normalizedLanguage,
		languageLabel,
		setLanguage,
	}
}
