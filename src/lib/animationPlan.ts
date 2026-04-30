export const animationPlan = {
  heroReveal:
    'Apply GSAP timeline reveals to nodes marked with data-animate="hero" for staged title, copy, and CTA entrances.',
  sectionReveal:
    'Map ScrollTrigger to data-animate="reveal" and data-animate="panel" so sections and cards fade, lift, and settle on enter.',
  stickyConfigurator:
    'Use ScrollTrigger pinning later on the DTF configurator summary column to keep pricing and file preview visible while scrolling.',
  portfolioParallax:
    'Use data-parallax hooks on future portfolio media blocks for restrained depth movement tied to scroll progress.',
  adminPanelReveals:
    'Add subtle staggered panel reveals to dashboard KPIs, review queues, and status boards without slowing the workflow.',
  lenisInitialization:
    'Implemented: Lenis initializes once at app shell level with reduced-motion opt-out and route-based scroll resets.',
  scrollTriggerMapping:
    'Future: bind ScrollTrigger scenes to data-scroll-section containers to keep route sections isolated and easier to maintain.',
} as const

export type AnimationPlan = typeof animationPlan
