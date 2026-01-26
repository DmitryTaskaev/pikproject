export function useModals() {
  let modalOpening = false
  let scrollTop = 0
  const openOverlay = () => {
    setTimeout(() => {
      const overlay = document.querySelector<HTMLElement>('.js-overlay')
      scrollTop = window.scrollY
      overlay?.classList.add('overlay_visible')
      document.body.classList.add('modal-opened')
      document.documentElement.classList.add('modal-opened')
    }, 200)
  }
  const closeOverlay = () => {
    setTimeout(() => {
      const overlay = document.querySelector<HTMLElement>('.js-overlay')
      document.body.classList.remove('modal-opened')
      document.documentElement.classList.remove('modal-opened')
      if (scrollTop) {
        window.scrollTo({ top: scrollTop, behavior: 'instant' })
        scrollTop = 0
      }
      overlay?.classList.remove('overlay_visible')
    }, 200)
  }
  const openModal = (e: Event) => {
    e.preventDefault()
    if (modalOpening) return false

    const target = e.target as HTMLElement
    const opener = target.classList.contains('js-modal-opener')
      ? target
      : target.closest<HTMLElement>('.js-modal-opener')
    const modalName = opener?.dataset.modal
    if (!modalName) return

    const openedModal = document.querySelector<HTMLElement>('.modal_visible.js-modal')
    const modal = document.querySelector<HTMLElement>(`.js-modal[data-modal=${modalName}]`)

    if (!modal) return

    if (openedModal) {
      modalOpening = true
      openedModal.classList.remove('modal_visible')
      setTimeout(() => {
        modal.classList.add('modal_visible')
        modalOpening = false
      }, 500)
    } else {
      modal.classList.add('modal_visible')
      openOverlay()
    }
  }

  const closeModals = (e: Event) => {
    e.preventDefault()

    const openedModals = document.querySelectorAll<HTMLElement>('.js-modal.modal_visible')

    if (openedModals && openedModals.length) {
      openedModals.forEach((el) => el.classList.remove('modal_visible'))
      closeOverlay()
    }
  }

  const initModals = () => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const opener = target.closest<HTMLElement>('.js-modal-opener')
      const closer = target.closest<HTMLElement>('.js-modal-closer')
      const isOverlay = target.classList.contains('js-overlay')

      if (opener) openModal(e)
      if (closer || isOverlay) closeModals(e)
    })
  }

  return { initModals }
}
