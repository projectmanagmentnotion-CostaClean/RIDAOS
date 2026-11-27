export const HOME_SEQUENCE_FRAME_COUNT: number
export const HOME_SEQUENCE_FRAME_BEHIND: number
export const HOME_SEQUENCE_FRAME_AHEAD: number

export function getHomeSequenceFrameWindow(
  frameNumber: number,
  options?: { reduceMotion?: boolean; frameCount?: number },
): number[]
