import { useEffect, useRef, type CSSProperties } from 'react'
import { canUseCustomCursor, initGooeyCursor } from '../lib/mouseFollower'

const blobMultipliers = [1.14, 0.78, 0.72, 0.68, 0.62, 0.56, 0.5, 0.44]

function CustomCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const root = rootRef.current
    const blobs = blobRefs.current.filter(Boolean) as HTMLDivElement[]

    if (!root || blobs.length !== 8 || !canUseCustomCursor()) {
      return
    }

    const cursor = initGooeyCursor({ root, blobs })

    return () => {
      cursor.destroy()
    }
  }, [])

  return (
    <>
      <svg aria-hidden="true" className="gooey-cursor-filter" width="0" height="0" focusable="false">
        <defs>
          <filter id="ridaos-gooey-cursor-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 32 -12"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div aria-hidden="true" className="gooey-cursor" ref={rootRef}>
        {blobMultipliers.map((multiplier, index) => (
          <div
            className={`gooey-cursor__blob${index === 0 ? ' gooey-cursor__blob--main' : ''}`}
            key={`gooey-blob-${index}`}
            ref={(node) => {
              blobRefs.current[index] = node
            }}
            style={{ '--blob-size-multiplier': String(multiplier) } as CSSProperties}
          />
        ))}
      </div>
    </>
  )
}

export default CustomCursor
