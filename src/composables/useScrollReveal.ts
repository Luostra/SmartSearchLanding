import { onBeforeUnmount, onMounted } from 'vue'

/** Reveal each element once; retain readable content without observer support. */
export function useScrollReveal() {
  let observer: IntersectionObserver | undefined
  let media: MediaQueryList | undefined
  const targets: HTMLElement[] = []

  function reveal(element: HTMLElement) {
    element.dataset.revealed = 'true'
    observer?.unobserve(element)
  }

  function revealAll() {
    targets.forEach(reveal)
    observer?.disconnect()
  }

  function onMotionChange() {
    if (media?.matches) revealAll()
  }

  function onFocus(event: FocusEvent) {
    if (!(event.target instanceof Element)) return
    const target = event.target.closest<HTMLElement>('[data-reveal]')
    if (target) {
      target.style.transitionDelay = '0ms'
      reveal(target)
    }
  }

  onMounted(() => {
    media = matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches || !('IntersectionObserver' in window)) return

    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' })

    const groups: [string, string, number][] = [
      ['#demo .section-heading, #demo .demo-shell', 'rise', 90],
      ['#how .section-heading, #how .steps-grid > article', 'slide', 85],
      ['#possibilities .feature-copy, #possibilities .feature-list > article', 'focus', 80],
      ['.use-cases .section-heading, .use-grid > button', 'float', 85],
      ['#faq > div:first-child, #faq .faq-list > article', 'soft', 55],
    ]

    groups.forEach(([selector, effect, delay]) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        element.dataset.reveal = effect
        element.style.setProperty('--reveal-delay', Math.min(index * delay, 240) + 'ms')
        targets.push(element)
        observer!.observe(element)
      })
    })
    media.addEventListener('change', onMotionChange)
    document.addEventListener('focusin', onFocus)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    media?.removeEventListener('change', onMotionChange)
    document.removeEventListener('focusin', onFocus)
  })
}
