import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import {
  drawCoverImage,
  ensureFrameSequencePlugins,
  FRAME_SEQUENCE_TOTAL,
  getFrameSequencePixelRatio,
  getFrameSequenceUrl,
  scheduleFrameBatch,
  shouldReduceFrameSequenceMotion,
} from '../lib/frameSequence'

function FrameSequenceIntro() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current

    if (!section || !canvas) {
      return
    }

    const context2d = canvas.getContext('2d', { alpha: false })

    if (!context2d) {
      return
    }

    ensureFrameSequencePlugins()

    let destroyed = false
    let currentFrame = 0
    let lastDrawnFrame = -1
    let activeIsMobile = false
    let resizeFrame = 0
    let resizeObserver: ResizeObserver | null = null

    const loadedImages = new Map<number, HTMLImageElement>()
    const loadingFrames = new Set<number>()

    const updateProgress = (frameIndex: number) => {
      section.style.setProperty('--frame-progress', String(frameIndex / (FRAME_SEQUENCE_TOTAL - 1)))
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

    const resizeCanvas = () => {
      const bounds = section.getBoundingClientRect()
      const width = Math.max(1, Math.round(bounds.width))
      const height = Math.max(1, Math.round(bounds.height))
      const pixelRatio = getFrameSequencePixelRatio(activeIsMobile)
      const internalWidth = Math.max(1, Math.round(width * pixelRatio))
      const internalHeight = Math.max(1, Math.round(height * pixelRatio))

      if (canvas.width !== internalWidth || canvas.height !== internalHeight) {
        canvas.width = internalWidth
        canvas.height = internalHeight
      }

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context2d.setTransform(1, 0, 0, 1, 0, 0)
      context2d.imageSmoothingEnabled = true
      context2d.imageSmoothingQuality = 'high'
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
      drawCoverImage(canvas, context2d, image, canvas.width, canvas.height)
      lastDrawnFrame = frameIndex
      updateProgress(frameIndex)
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
      image.loading = 'eager'
      loadingFrames.add(frameIndex)

      image.onload = () => {
        loadingFrames.delete(frameIndex)
        loadedImages.set(frameIndex, image)

        if (destroyed) {
          return
        }

        if (frameIndex === 0 || frameIndex === currentFrame || !loadedImages.has(currentFrame)) {
          window.requestAnimationFrame(() => drawFrame(currentFrame))
        }
      }

      image.onerror = () => {
        loadingFrames.delete(frameIndex)
      }

      image.src = getFrameSequenceUrl(frameIndex)
    }

    const preloadRemainingFrames = (startIndex: number, batchSize: number) => {
      let nextIndex = startIndex

      const queueBatch = () => {
        if (destroyed) {
          return
        }

        for (let count = 0; count < batchSize && nextIndex < FRAME_SEQUENCE_TOTAL; count += 1, nextIndex += 1) {
          loadFrame(nextIndex)
        }

        if (nextIndex < FRAME_SEQUENCE_TOTAL) {
          scheduleFrameBatch(queueBatch)
        }
      }

      queueBatch()
    }

    const handleResize = () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame)
      }

      resizeFrame = window.requestAnimationFrame(() => {
        drawFrame(currentFrame)
      })
    }

    loadFrame(0)
    loadFrame(FRAME_SEQUENCE_TOTAL - 1)
    preloadRemainingFrames(1, shouldReduceFrameSequenceMotion() ? 6 : 14)

    const media = gsap.matchMedia()

    const context = gsap.context(() => {
      media.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (matchContext) => {
          activeIsMobile = Boolean(matchContext.conditions?.mobile)
          currentFrame = 0
          lastDrawnFrame = -1
          resizeCanvas()
          drawFrame(0)

          resizeObserver?.disconnect()
          resizeObserver = new ResizeObserver(handleResize)
          resizeObserver.observe(section)
          window.addEventListener('resize', handleResize)

          if (matchContext.conditions?.reduce) {
            section.classList.add('is-reduced-motion')

            return () => {
              section.classList.remove('is-reduced-motion')
              resizeObserver?.disconnect()
              resizeObserver = null
              window.removeEventListener('resize', handleResize)
            }
          }

          section.classList.remove('is-reduced-motion')

          const playhead = { frame: 0 }
          const overlay = section.querySelector<HTMLElement>('.frame-intro__overlay')
          const progressFill = section.querySelector<HTMLElement>('.frame-intro__progress-fill')

          const introTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: activeIsMobile ? '+=140%' : '+=190%',
              scrub: 0.45,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          introTimeline.to(
            playhead,
            {
              frame: FRAME_SEQUENCE_TOTAL - 1,
              ease: 'none',
              onUpdate: () => {
                const nextFrame = Math.round(playhead.frame)

                if (nextFrame !== currentFrame) {
                  currentFrame = nextFrame
                  drawFrame(nextFrame)
                } else {
                  updateProgress(nextFrame)
                }
              },
            },
            0,
          )

          if (overlay) {
            introTimeline.fromTo(
              overlay,
              {
                yPercent: 0,
                autoAlpha: 1,
              },
              {
                yPercent: -8,
                autoAlpha: 0.32,
                ease: 'none',
                immediateRender: false,
              },
              0,
            )
          }

          if (progressFill) {
            introTimeline.fromTo(
              progressFill,
              {
                scaleX: 0,
              },
              {
                scaleX: 1,
                ease: 'none',
                transformOrigin: 'left center',
                immediateRender: false,
              },
              0,
            )
          }

          return () => {
            introTimeline.scrollTrigger?.kill()
            introTimeline.kill()
            resizeObserver?.disconnect()
            resizeObserver = null
            window.removeEventListener('resize', handleResize)
          }
        },
      )
    }, section)

    return () => {
      destroyed = true

      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame)
      }

      resizeObserver?.disconnect()
      media.revert()
      context.revert()
    }
  }, [])

  return (
    <section className="frame-intro" ref={sectionRef}>
      <canvas className="frame-intro__canvas" ref={canvasRef} />
      <div className="frame-intro__shade" aria-hidden="true" />
      <div className="frame-intro__overlay">
        <p className="frame-intro__eyebrow">RIDAOSPRINT</p>
        <h2 className="frame-intro__title">DTF / VINILO / ROTULACION</h2>
        <p className="frame-intro__hint">Scroll para iniciar</p>
        <div className="frame-intro__progress" aria-hidden="true">
          <div className="frame-intro__progress-fill" />
        </div>
      </div>
    </section>
  )
}

export default FrameSequenceIntro
