let isScrollListenerAttached = false

export function useAnimations() {
	const initAnimation = () => {
		// Проверяем, что мы на клиенте
		if (typeof window === 'undefined') return

		// Функция для определения процента видимости в зависимости от класса элемента
		const getPercentVisible = (el: Element): number => {
			if (el.classList.contains('title_xxl')) return 100
			if (el.classList.contains('advantages__top')) return 40
			return 80 // значение по умолчанию
		}

		// Функция для анимации элементов
		const animateElement = (el: Element) => {
			if (el.classList.contains('animated')) return
			el.classList.add('animated')
		}

		const animateVisibleItems = () => {
			const itemsToAnimate = document.querySelectorAll('.to-animate')
			itemsToAnimate.forEach(el => {
				if (el.classList.contains('animated')) return
				const percentVisible = getPercentVisible(el)
				if (isElementInViewport(el, percentVisible)) {
					animateElement(el)
				}
			})
		}

		animateVisibleItems()

		if (!isScrollListenerAttached) {
			window.addEventListener(
				'scroll',
				animateVisibleItems,
				{ passive: true }
			)
			isScrollListenerAttached = true
		}
	}

	const isElementInViewport = (
		el: Element,
		percentVisible: number = 80
	): boolean => {
		const rect = el.getBoundingClientRect()
		const windowHeight =
			window.innerHeight || document.documentElement.clientHeight

		return !(
			Math.floor(100 - ((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100) <
				percentVisible ||
			Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) <
				percentVisible
		)
	}

	return { initAnimation }
}
