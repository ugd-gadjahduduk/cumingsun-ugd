import { useEffect } from 'react'

export function useCursorInteraction(isDesktop: boolean) {
  useEffect(() => {
    if (!isDesktop) return

    const handleMouseDown = () => {
      document.body.classList.remove('cursor-grab')
      document.body.classList.add('cursor-grabbing')
    }

    const handleMouseUp = () => {
      document.body.classList.remove('cursor-grabbing')
      document.body.classList.add('cursor-grab')
    }

    const handleMouseMove = () => {
      document.body.classList.add('cursor-grab')
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      // Cleanup cursor classes
      document.body.classList.remove('cursor-grab', 'cursor-grabbing')
    }
  }, [isDesktop])
}
