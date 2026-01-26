interface MainBottomBannerIcon {
	SRC: string
}

interface MainBottomBannerItem {
	ID: string
	NAME: string
	SORT: string
	PROPERTIES: {
		ICON?: MainBottomBannerIcon
	}
}

interface MainBottomBannerResponse {
	status: string
	data: {
		items: MainBottomBannerItem[]
	}
	meta: {
		lang: string
		version: string
		endpoint: string
	}
}

export default defineEventHandler(async () => {
	const config = useRuntimeConfig()
	const headers: Record<string, string> = {}

	if (config.apiKey) {
		headers['X-API-KEY'] = config.apiKey
	}

	return await $fetch<MainBottomBannerResponse>(
		`${config.apiBase}/mainBottomBanner`,
		{ headers },
	)
})
