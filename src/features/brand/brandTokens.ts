export const brandTokens = {
  black: '#050505',
  charcoal: '#101113',
  graphite: '#181A1D',
  brickDark: '#171111',
  neonGreen: '#39FF14',
  neonPink: '#FF00B8',
  cyan: '#4BE7FF',
  softWhite: '#F6EFE7',
  mutedText: 'rgba(246, 239, 231, 0.7)',
  borderDark: 'rgba(255, 255, 255, 0.08)',
  glowGreen: '0 0 28px rgba(57, 255, 20, 0.25)',
  glowPink: '0 0 28px rgba(255, 0, 184, 0.22)',
  glowCyan: '0 0 28px rgba(75, 231, 255, 0.2)',
} as const

export type BrandTokenKey = keyof typeof brandTokens
