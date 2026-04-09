interface SendFormBody {
	lang?: 'ru' | 'en'
	NAME?: string
	PHONE?: string
	EMAIL?: string
	PAGE_URL?: string
	ACTIVE?: string
	POSITION_FROM?: string
}

export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const body = await readBody<SendFormBody>(event)

	const lang = body.lang === 'en' ? 'en' : 'ru'
	const endpoint = `${config.public.apiOrigin}/api/v1/${lang}/sendForm`

	const payload = {
		NAME: body.NAME || '',
		PHONE: body.PHONE || '',
		EMAIL: body.EMAIL || '',
		PAGE_URL: body.PAGE_URL || '',
		ACTIVE: 'Y',
		POSITION_FROM: body.POSITION_FROM || '',
	}

	return await $fetch(endpoint, {
		method: 'POST',
		body: payload,
		headers: {
			'Content-Type': 'application/json',
		},
	})
})
