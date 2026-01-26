interface MainBannerItem {
	ID: string
	NAME: string
	PREVIEW_TEXT: string
	PREVIEW_PICTURE: string
	PREVIEW_PICTURE_SRC: string
}

interface MainBannerResponse {
	status: string
	data: {
		items: MainBannerItem[]
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

	return await $fetch<MainBannerResponse>(`${config.apiBase}/mainBanner`, {
		headers,
	})
})
