import { useEffect, useRef } from 'react'
import {
  drawCoverImage,
  FRAME_SEQUENCE_TOTAL,
  getFrameSequencePixelRatio,
  getFrameSequenceUrl,
  scheduleFrameBatch,
  shouldReduceFrameSequenceMotion,
} from '../../lib/frameSequence'

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
    let currentFrame = 0
    let lastDrawnFrame = -1
    let resizeObserver: ResizeObserver | null = null
    const scrollSource =
      root.closest<HTMLElement>('.home-sequence-scroll') ??
      root.closest<HTMLElement>('.home-fullscreen-hero') ??
      root
    const loadedImages = new Map<number, HTMLImageElement>()
    const loadingFrames = new Set<number>()

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

    const findClosestLoadedFrame = (frameIndex: number) => {
      if (loadedImages.has(frameIndex)) {
        return loadedImages.get(frameIndex) ?? null
      }

      for (let offset = 1; offset < FRAME_SEQUENCE_TOTAL; offset += 1) {
        const previous = frameIndex - offset
        const next = frameIndex + offset

        if (previous >= 0 && loadedImages.has(previous)) {
          return loadedImages.get(previous) ?? null
        }

        if (next < FRAME_SEQUENCE_TOTAL && loadedImages.has(next)) {
          return loadedImages.get(next) ?? null
        }
      }

      return null
    }

    const drawFrame = (frameIndex: number) => {
      const image = findClosestLoadedFrame(frameIndex)

      if (!image) {
        return
      }

      if (lastDrawnFrame === frameIndex && loadedImages.has(frameIndex)) {
        return
      }

      resizeCanvas()
      drawCoverImage(canvas, context, image, canvas.width, canvas.height)
      lastDrawnFrame = frameIndex
      root.style.setProperty('--vehicle-sequence-progress', String(frameIndex / (FRAME_SEQUENCE_TOTAL - 1)))
      root.dataset.vehicleFrame = String(frameIndex + 1)
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
        lastDrawnFrame = -1
        drawFrame(currentFrame)
      })
    }

    const loadFrame = (frameIndex: number) => {
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
      image.loading = frameIndex === 0 ? 'eager' : 'lazy'
      loadingFrames.add(frameIndex)

      image.onload = () => {
        loadingFrames.delete(frameIndex)
        loadedImages.set(frameIndex, image)

        if (destroyed) {
          return
        }

        if (frameIndex === currentFrame || frameIndex === 0 || !findClosestLoadedFrame(currentFrame)) {
          window.requestAnimationFrame(() => drawFrame(currentFrame))
        }
      }

      image.onerror = () => {
        loadingFrames.delete(frameIndex)
      }

      image.src = getFrameSequenceUrl(frameIndex)
    }

    const queueNearbyFrames = (frameIndex: number) => {
      loadFrame(frameIndex)
      loadFrame(frameIndex - 1)
      loadFrame(frameIndex + 1)
      loadFrame(frameIndex - 2)
      loadFrame(frameIndex + 2)
    }

    const updateFromScroll = () => {
      frameRequest = 0
      const progress = canAnimateVehicleSequence() ? getScrollProgress() : 0
      const nextFrame = Math.round(progress * (FRAME_SEQUENCE_TOTAL - 1))
      currentFrame = nextFrame
      queueNearbyFrames(nextFrame)
      drawFrame(nextFrame)
    }

    const requestScrollUpdate = () => {
      if (frameRequest) {
        return
      }

      frameRequest = window.requestAnimationFrame(updateFromScroll)
    }

    const preloadFrames = () => {
      loadFrame(0)
      loadFrame(FRAME_SEQUENCE_TOTAL - 1)

      let nextFrame = 1
      const batch = () => {
        if (destroyed) {
          return
        }

        for (let count = 0; count < 10 && nextFrame < FRAME_SEQUENCE_TOTAL; count += 1, nextFrame += 1) {
          loadFrame(nextFrame)
        }

        if (nextFrame < FRAME_SEQUENCE_TOTAL) {
          scheduleFrameBatch(batch)
        }
      }

      batch()
    }

    resizeCanvas()
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
