import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const FRAME_SEQUENCE_TOTAL = 300

let frameSequencePluginsRegistered = false

export function ensureFrameSequencePlugins() {
  if (!frameSequencePluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    frameSequencePluginsRegistered = true
  }
}

export function getFrameSequenceUrl(frameIndex: number) {
  const safeIndex = Math.min(Math.max(frameIndex, 0), FRAME_SEQUENCE_TOTAL - 1) + 1
  return `/frames/ezgif-frame-${String(safeIndex).padStart(3, '0')}.jpg`
}

export function shouldReduceFrameSequenceMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function getFrameSequencePixelRatio(isMobile: boolean) {
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  return Math.min(devicePixelRatio, isMobile ? 1.35 : 2)
}

export function drawCoverImage(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
) {
  const sourceWidth =
    image instanceof HTMLImageElement ? image.naturalWidth || image.width : (image as { width: number }).width
  const sourceHeight =
    image instanceof HTMLImageElement ? image.naturalHeight || image.height : (image as { height: number }).height

  if (!sourceWidth || !sourceHeight || !width || !height) {
    return
  }

  const ratio = Math.max(width / sourceWidth, height / sourceHeight)
  const drawWidth = sourceWidth * ratio
  const drawHeight = sourceHeight * ratio
  const offsetX = (width - drawWidth) * 0.5
  const offsetY = (height - drawHeight) * 0.5

  context.clearRect(0, 0, width, height)
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)

  canvas.style.aspectRatio = `${sourceWidth} / ${sourceHeight}`
}

export function scheduleFrameBatch(task: () => void) {
  if (typeof window === 'undefined') {
    return
  }

  if ('requestIdleCallback' in window) {
    const scheduleIdle = window.requestIdleCallback as (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number

    scheduleIdle(() => task(), { timeout: 180 })
    return
  }

  globalThis.setTimeout(task, 60)
}
