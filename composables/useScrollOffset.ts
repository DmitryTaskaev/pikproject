export function useScrollOffset() {
	const getScrollOffset = (): number => {
		if (typeof window === 'undefined') return 0

		const isPromoVisible = !document.body.classList.contains('promo-hidden')
		const promoHeight = isPromoVisible ? 30 : 0

		// Высота шапки: 94px на обычных экранах, 114px на ultrahd (min-width: 1440px)
		const isUltrahd = window.matchMedia('(min-width: 1440px)').matches
		const headerHeight = isUltrahd ? 114 : 94

		return promoHeight + headerHeight
	}

	return { getScrollOffset }
}
