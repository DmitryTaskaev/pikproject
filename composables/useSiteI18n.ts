import { siteTranslations, type SiteTranslationKey } from '~/constants/siteTranslations'

export function useSiteI18n() {
	const { language } = useSiteLanguage()

	const t = <TKey extends SiteTranslationKey>(key: TKey) =>
		siteTranslations[key][language.value]

	return {
		t,
		translations: siteTranslations,
	}
}
