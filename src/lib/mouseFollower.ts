import gsap from 'gsap'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function hasFinePointer() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
}

export function canUseCustomCursor() {
  return hasFinePointer() && !prefersReducedMotion()
}

type GooeyCursorRefs = {
  root: HTMLElement
  blobs: HTMLElement[]
}

const interactiveSelector = [
  '[data-cursor]',
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '.product-card',
  '.portfolio-card',
  '.work-row',
  '.configurator-card',
  '.admin-card',
  '.catalog-product-card',
  '.dtf-cockpit-panel',
  '.admin-order-card',
  '.admin-file-card',
  '.admin-board-column',
].join(', ')

const blobDurations = [0.12, 0.17, 0.22, 0.28, 0.34, 0.4, 0.48, 0.56]
const formFieldSelector = 'input, select, textarea'

function setCursorSizeState(nextState: 'big' | 'small' | 'default') {
  document.body.classList.remove('cursor-is-big', 'cursor-is-small')

  if (nextState === 'big') {
    document.body.classList.add('cursor-is-big')
  }

  if (nextState === 'small') {
    document.body.classList.add('cursor-is-small')
  }
}

export function initGooeyCursor({ root, blobs }: GooeyCursorRefs) {
  if (typeof window === 'undefined' || !canUseCustomCursor() || blobs.length < 8) {
    return {
      destroy() {},
    }
  }

  const rootOpacityTo = gsap.quickTo(root, 'opacity', {
    duration: 0.18,
    ease: 'power2.out',
  })

  const blobSetters = blobs.map((blob, index) => ({
    x: gsap.quickTo(blob, 'x', {
      duration: blobDurations[index],
      ease: index === 0 ? 'power3.out' : 'power2.out',
    }),
    y: gsap.quickTo(blob, 'y', {
      duration: blobDurations[index],
      ease: index === 0 ? 'power3.out' : 'power2.out',
    }),
  }))

  const state = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    prevX: window.innerWidth * 0.5,
    prevY: window.innerHeight * 0.5,
    speed: 0,
    angle: 0,
    visible: false,
  }

  const renderMotion = () => {
    const normalizedSpeed = gsap.utils.clamp(0, 1, state.speed / 28)
    const scaleX = gsap.utils.interpolate(1, 2.35, normalizedSpeed)
    const scaleY = gsap.utils.interpolate(1, 0.58, normalizedSpeed)

    root.style.setProperty('--cursor-scale-x', scaleX.toFixed(3))
    root.style.setProperty('--cursor-scale-y', scaleY.toFixed(3))
    root.style.setProperty('--cursor-rotation', `${state.angle.toFixed(2)}deg`)

    state.speed *= 0.88

    if (state.speed < 0.01) {
      state.speed = 0
    }
  }

  const tick = () => {
    renderMotion()
  }

  const moveBlobs = () => {
    blobSetters.forEach((setter) => {
      setter.x(state.x)
      setter.y(state.y)
    })
  }

  const showCursor = () => {
    if (state.visible) {
      return
    }

    state.visible = true
    rootOpacityTo(1)
  }

  const hideCursor = () => {
    state.visible = false
    rootOpacityTo(0)
    setCursorSizeState('default')
  }

  const handlePointerMove = (event: PointerEvent) => {
    const nextX = event.clientX
    const nextY = event.clientY
    const dx = nextX - state.prevX
    const dy = nextY - state.prevY

    state.x = nextX
    state.y = nextY
    state.speed = Math.max(state.speed, Math.hypot(dx, dy))

    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
      state.angle = Math.atan2(dy, dx) * (180 / Math.PI)
    }

    state.prevX = nextX
    state.prevY = nextY

    showCursor()
    moveBlobs()
  }

  const handlePointerOver = (event: PointerEvent) => {
    const target =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>(interactiveSelector)
        : null

    if (!target) {
      setCursorSizeState('default')
      return
    }

    if (target.matches(formFieldSelector) || target.dataset.cursor === 'small') {
      setCursorSizeState('small')
      return
    }

    setCursorSizeState('big')
  }

  const handleWindowLeave = () => {
    hideCursor()
  }

  document.body.classList.add('has-gooey-cursor')
  setCursorSizeState('default')
  root.style.setProperty('--cursor-scale-x', '1')
  root.style.setProperty('--cursor-scale-y', '1')
  root.style.setProperty('--cursor-rotation', '0deg')

  gsap.set(blobs, {
    x: state.x,
    y: state.y,
  })

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerover', handlePointerOver)
  window.addEventListener('blur', handleWindowLeave)
  document.addEventListener('mouseleave', handleWindowLeave)
  gsap.ticker.add(tick)

  return {
    destroy() {
      document.body.classList.remove('has-gooey-cursor', 'cursor-is-big', 'cursor-is-small')
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('blur', handleWindowLeave)
      document.removeEventListener('mouseleave', handleWindowLeave)
      gsap.ticker.remove(tick)
    },
  }
}
