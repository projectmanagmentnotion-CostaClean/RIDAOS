export const storefrontMotionSelectors = {
  hero: '[data-animate="hero"]',
  reveal: '[data-animate="reveal"]',
  panel: '[data-animate="panel"]',
  parallax: '[data-parallax]',
  overlay: '[data-overlay-reveal]',
} as const

export const productMotionSelectors = {
  hero: '.product-visual-hero, .product-experience-hero',
  reveal: '[data-product-reveal]',
  panel:
    '.product-config-card, .product-gallery-frame, .product-summary-card, .product-option-asset-card, .discoverability-card, .commerce-recommendations__grid .content-card',
  parallax:
    '[data-product-depth], .product-visual-hero__image, .product-gallery-frame__image, .product-visual-hero__beam, .product-gallery-frame__grid',
  overlay:
    '.product-visual-hero__glow, .product-visual-hero__grid, .product-gallery-frame__grid, .storefront-family-visual__beam',
} as const

export type MotionSelectorSet = typeof storefrontMotionSelectors
