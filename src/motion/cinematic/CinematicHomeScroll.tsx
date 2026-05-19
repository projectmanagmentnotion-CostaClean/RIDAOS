import type { RefObject } from 'react'
import { cinematicAssets } from './cinematicAssets'
import './cinematic.css'
import { cinematicScenes } from './cinematicScenes'
import type { CinematicSceneDefinition } from './cinematic.types'
import { useCinematicScroll } from './useCinematicScroll'
import { useRef } from 'react'

type CinematicHomeScrollProps = {
  scopeRef: RefObject<HTMLElement | null>
}

/**
 * Editable Zone: CINEMATIC_SCROLL_SYSTEM
 * Scenes: src/motion/cinematic/cinematicScenes.ts
 * Assets: src/motion/cinematic/cinematicAssets.ts
 * Hook: src/motion/cinematic/useCinematicScroll.ts
 */
function CinematicScenePlaceholder({ scene }: { scene: CinematicSceneDefinition }) {
  const asset = cinematicAssets[scene.assetKey]

  return (
    <div
      className={`cinematic-scene-layer ${scene.className}`}
      data-scene={scene.id}
      data-zone-target={scene.triggerZoneId}
      style={{ ['--scene-accent' as string]: scene.accent }}
    >
      <div className="cinematic-scene-orb" data-cinematic-layer="orb" />
      <div className="cinematic-scene-placeholder" data-cinematic-layer="placeholder">
        <div className="cinematic-scene-outline" />
        <div className="cinematic-scene-shape" />
        <div className="cinematic-scene-copy">
          <span>{scene.label}</span>
          <small>{asset.label}</small>
        </div>
      </div>
      <div className="cinematic-scene-shimmer" data-cinematic-layer="shimmer" />
    </div>
  )
}

function CinematicHomeScroll({ scopeRef }: CinematicHomeScrollProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useCinematicScroll({
    scopeRef,
    overlayRef,
    scenes: cinematicScenes,
  })

  return (
    <div
      aria-hidden="true"
      className="cinematic-home-scroll"
      ref={overlayRef}
    >
      <div className="cinematic-home-scroll__viewport">
        {cinematicScenes.map((scene) => (
          <CinematicScenePlaceholder key={scene.id} scene={scene} />
        ))}
      </div>
    </div>
  )
}

export default CinematicHomeScroll
