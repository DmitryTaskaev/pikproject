export const useLocalizedAsyncData = <T>(
	key: string | (() => string),
	handler: (lang: 'ru' | 'en') => Promise<T>,
	options?: Record<string, unknown>,
) => {
	const { language } = useSiteLanguage()
	const watch = Array.isArray(options?.watch) ? options.watch : []
	const resolvedKey = computed(() => {
		const baseKey = typeof key === 'function' ? key() : key
		return `${baseKey}:${language.value}`
	})

	return useAsyncData<any>(
		resolvedKey,
		() => handler(language.value),
		{
			...options,
			watch: [...watch, language],
		},
	)
}
