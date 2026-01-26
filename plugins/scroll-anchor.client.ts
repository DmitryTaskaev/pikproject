export default defineNuxtPlugin(nuxtApp => {
	if (import.meta.server) return

	const { getScrollOffset } = useScrollOffset()

	const scrollToElement = (hash: string) => {
		if (!hash) return

		const element = document.querySelector(hash)
		if (!element) return

		const offset = getScrollOffset()
		const elementPosition = element.getBoundingClientRect().top + window.scrollY
		const offsetPosition = elementPosition - offset

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth',
		})
	}

	const handleAnchorClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement
		const link = target.closest<HTMLAnchorElement>('a[href^="#"]')

		if (!link) return

		const href = link.getAttribute('href')
		if (!href || href === '#') return

		// Проверяем, что это якорная ссылка на текущей странице (не на другую страницу)
		if (href.startsWith('#') && !href.includes('/')) {
			e.preventDefault()
			scrollToElement(href)
		}
	}

	const handleHashChange = () => {
		if (window.location.hash) {
			setTimeout(() => {
				scrollToElement(window.location.hash)
			}, 100)
		}
	}

	// Обработка навигации через Nuxt router
	nuxtApp.hook('page:finish', () => {
		if (window.location.hash) {
			setTimeout(() => {
				scrollToElement(window.location.hash)
			}, 300)
		}
	})

	// Обработка кликов по якорным ссылкам
	document.addEventListener('click', handleAnchorClick)

	// Обработка изменения хеша в URL
	window.addEventListener('hashchange', handleHashChange)

	// Обработка хеша при загрузке страницы
	if (window.location.hash) {
		setTimeout(() => {
			scrollToElement(window.location.hash)
		}, 500)
	}
})
