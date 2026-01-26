interface ThreeBlockMainItem {
	ID: string
	NAME: string
	SORT: string
	PREVIEW_TEXT: string
}

interface ThreeBlockMainResponse {
	status: string
	data: {
		items: ThreeBlockMainItem[]
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

	return await $fetch<ThreeBlockMainResponse>(
		`${config.apiBase}/threeBlockMain`,
		{ headers },
	)
})
