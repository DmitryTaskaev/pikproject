export const useHomeBreadcrumbTitle = () => {
	const { t } = useSiteI18n()

	return computed(() => String(t('common_home')))
}
