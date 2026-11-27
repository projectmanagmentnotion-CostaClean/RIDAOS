import { useEffect, useRef } from 'react'
import {
  drawCoverImage,
  FRAME_SEQUENCE_TOTAL,
  getFrameSequencePixelRatio,
  getFrameSequenceUrl,
  shouldReduceFrameSequenceMotion,
} from '../../lib/frameSequence'
import { getHomeSequenceFrameWindow } from '../../motion/cinematic/homeSequencePolicy.mjs'

function canAnimateVehicleSequence() {
  return (
    typeof window !== 'undefined' &&
    !shouldReduceFrameSequenceMotion()
  )
}

function HomeVehicleScrollSequence() {
  const rootRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })

    if (!root || !canvas || !context) {
      return
    }

    let destroyed = false
    let frameRequest = 0
    let resizeRequest = 0
    let requestedFrameNumber = 1
    let currentFrameNumber = 0
    let lastDrawnFrameNumber = 0
    let resizeObserver: ResizeObserver | null = null
    const scrollSource =
      root.closest<HTMLElement>('.home-sequence-scroll') ??
      root.closest<HTMLElement>('.home-fullscreen-hero') ??
      root
    const loadedImages = new Map<number, HTMLImageElement>()
    const loadingFrames = new Map<number, HTMLImageElement>()

    const resizeCanvas = () => {
      const bounds = root.getBoundingClientRect()
      const width = Math.max(1, Math.round(bounds.width))
      const height = Math.max(1, Math.round(bounds.height))
      const pixelRatio = getFrameSequencePixelRatio(false)
      const internalWidth = Math.max(1, Math.round(width * pixelRatio))
      const internalHeight = Math.max(1, Math.round(height * pixelRatio))

      if (canvas.width !== internalWidth || canvas.height !== internalHeight) {
        canvas.width = internalWidth
        canvas.height = internalHeight
      }

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'
    }

    const clampFrameNumber = (frameNumber: number) => {
      return Math.min(Math.max(Math.round(frameNumber), 1), FRAME_SEQUENCE_TOTAL)
    }

    const getFrameIndex = (frameNumber: number) => clampFrameNumber(frameNumber) - 1

    const syncCanvasDiagnostics = () => {
      canvas.dataset.currentFrame = String(currentFrameNumber || 0)
      canvas.dataset.requestedFrame = String(requestedFrameNumber || 0)
      canvas.dataset.loadedFrame = String(lastDrawnFrameNumber || 0)
      root.dataset.vehicleFrame = String(currentFrameNumber || 0)
    }

    const drawFrame = (frameNumber: number) => {
      const safeFrameNumber = clampFrameNumber(frameNumber)
      const image = loadedImages.get(getFrameIndex(safeFrameNumber)) ?? null

      if (!image) {
        syncCanvasDiagnostics()
        return
      }

      if (lastDrawnFrameNumber === safeFrameNumber) {
        currentFrameNumber = safeFrameNumber
        syncCanvasDiagnostics()
        return
      }

      resizeCanvas()
      drawCoverImage(canvas, context, image, canvas.width, canvas.height)
      currentFrameNumber = safeFrameNumber
      lastDrawnFrameNumber = safeFrameNumber
      root.style.setProperty('--vehicle-sequence-progress', String((safeFrameNumber - 1) / (FRAME_SEQUENCE_TOTAL - 1)))
      syncCanvasDiagnostics()
    }

    const getScrollProgress = () => {
      const viewportHeight = window.innerHeight || 1
      const rect = scrollSource.getBoundingClientRect()
      const sourceHeight = Math.max(scrollSource.offsetHeight, rect.height)
      const travelDistance = Math.max(1, sourceHeight - viewportHeight)
      const raw = Math.min(Math.max(-rect.top, 0), travelDistance) / travelDistance

      return Math.min(Math.max(raw, 0), 1)
    }

    const requestResize = () => {
      if (resizeRequest) {
        window.cancelAnimationFrame(resizeRequest)
      }

      resizeRequest = window.requestAnimationFrame(() => {
        resizeRequest = 0
        lastDrawnFrameNumber = 0
        drawFrame(currentFrameNumber || requestedFrameNumber)
      })
    }

    const loadFrame = (frameNumber: number, priority: 'high' | 'low' = 'low') => {
      const frameIndex = getFrameIndex(frameNumber)

      if (
        frameIndex < 0 ||
        frameIndex >= FRAME_SEQUENCE_TOTAL ||
        loadedImages.has(frameIndex) ||
        loadingFrames.has(frameIndex)
      ) {
        return
      }

      const image = new Image()
      image.decoding = 'async'

      if (priority === 'high' || frameIndex === 0) {
        image.loading = 'eager'
      }

      if ('fetchPriority' in image) {
        ;(image as HTMLImageElement & { fetchPriority?: 'high' | 'low' | 'auto' }).fetchPriority =
          priority === 'high' ? 'high' : 'low'
      }

      loadingFrames.set(frameIndex, image)

      image.onload = () => {
        if (loadingFrames.get(frameIndex) !== image) return
        loadingFrames.delete(frameIndex)
        loadedImages.set(frameIndex, image)

        if (destroyed) {
          return
        }

        const loadedFrameNumber = frameIndex + 1

        if (
          loadedFrameNumber === requestedFrameNumber ||
          loadedFrameNumber === currentFrameNumber ||
          lastDrawnFrameNumber === 0
        ) {
          window.requestAnimationFrame(() => {
            drawFrame(requestedFrameNumber)
          })
        }
      }

      image.onerror = () => {
        if (loadingFrames.get(frameIndex) === image) loadingFrames.delete(frameIndex)
      }

      image.src = getFrameSequenceUrl(frameIndex)
    }

    const reduceMotion = shouldReduceFrameSequenceMotion()

    const retainFrameWindow = (frameNumber: number) => {
      const frameWindow = new Set(getHomeSequenceFrameWindow(frameNumber, {
        reduceMotion,
        frameCount: FRAME_SEQUENCE_TOTAL,
      }))
      for (const loadedFrameIndex of loadedImages.keys()) {
        if (!frameWindow.has(loadedFrameIndex + 1)) {
          loadedImages.delete(loadedFrameIndex)
        }
      }
      for (const [loadingFrameIndex, image] of loadingFrames) {
        if (!frameWindow.has(loadingFrameIndex + 1)) {
          loadingFrames.delete(loadingFrameIndex)
          image.onload = null
          image.onerror = null
          image.src = ''
        }
      }
    }

    const queueNearbyFrames = (frameNumber: number) => {
      for (const nextFrameNumber of getHomeSequenceFrameWindow(frameNumber, {
        reduceMotion,
        frameCount: FRAME_SEQUENCE_TOTAL,
      })) {
        loadFrame(nextFrameNumber, nextFrameNumber === frameNumber ? 'high' : 'low')
      }
      retainFrameWindow(frameNumber)
    }

    const updateFromScroll = () => {
      frameRequest = 0
      const canAnimate = canAnimateVehicleSequence()
      const progress = canAnimate ? getScrollProgress() : 0
      const nextFrameNumber = 1 + Math.round(progress * (FRAME_SEQUENCE_TOTAL - 1))
      requestedFrameNumber = clampFrameNumber(nextFrameNumber)
      syncCanvasDiagnostics()
      if (canAnimate) {
        queueNearbyFrames(requestedFrameNumber)
      } else {
        loadFrame(1, 'high')
        retainFrameWindow(1)
      }
      drawFrame(requestedFrameNumber)
    }

    const requestScrollUpdate = () => {
      if (frameRequest) {
        return
      }

      frameRequest = window.requestAnimationFrame(updateFromScroll)
    }

    const preloadFrames = () => {
      queueNearbyFrames(1)
    }

    resizeCanvas()
    syncCanvasDiagnostics()
    preloadFrames()
    resizeObserver = new ResizeObserver(requestResize)
    resizeObserver.observe(root)
    window.addEventListener('scroll', requestScrollUpdate, { passive: true })
    window.addEventListener('resize', requestResize)
    requestScrollUpdate()

    return () => {
      destroyed = true
      if (frameRequest) {
        window.cancelAnimationFrame(frameRequest)
      }
      if (resizeRequest) {
        window.cancelAnimationFrame(resizeRequest)
      }
      resizeObserver?.disconnect()
      window.removeEventListener('scroll', requestScrollUpdate)
      window.removeEventListener('resize', requestResize)
      for (const image of loadingFrames.values()) {
        image.onload = null
        image.onerror = null
        image.src = ''
      }
      loadingFrames.clear()
      loadedImages.clear()
    }
  }, [])

  return (
    <section className="home-vehicle-sequence" data-home-vehicle-sequence="active" ref={rootRef}>
      <canvas aria-hidden="true" className="home-vehicle-sequence__canvas" ref={canvasRef} />
      <div className="home-vehicle-sequence__shade" aria-hidden="true" />
    </section>
  )
}

export default HomeVehicleScrollSequence
