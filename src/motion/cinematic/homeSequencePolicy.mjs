export const HOME_SEQUENCE_FRAME_COUNT = 300
export const HOME_SEQUENCE_FRAME_BEHIND = 2
export const HOME_SEQUENCE_FRAME_AHEAD = 6

export function getHomeSequenceFrameWindow(frameNumber, { reduceMotion = false, frameCount = HOME_SEQUENCE_FRAME_COUNT } = {}) {
  const total = Math.max(1, Math.floor(Number(frameCount) || HOME_SEQUENCE_FRAME_COUNT))
  if (reduceMotion) return [1]

  const center = Math.min(Math.max(Math.round(Number(frameNumber) || 1), 1), total)
  const first = Math.max(1, center - HOME_SEQUENCE_FRAME_BEHIND)
  const last = Math.min(total, center + HOME_SEQUENCE_FRAME_AHEAD)
  return Array.from({ length: last - first + 1 }, (_, index) => first + index)
}
