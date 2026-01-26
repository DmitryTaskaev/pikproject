export const useSearch = () => {
	const isSearchActive = useState('isSearchActive', () => false)

	const openSearch = () => {
		isSearchActive.value = true
	}

	const closeSearch = () => {
		isSearchActive.value = false
	}

	return {
		isSearchActive: readonly(isSearchActive),
		openSearch,
		closeSearch,
	}
}
