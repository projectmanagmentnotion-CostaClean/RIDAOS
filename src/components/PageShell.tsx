import { forwardRef, type ReactNode } from 'react'

type PageShellProps = {
  children: ReactNode
  className?: string
}

const PageShell = forwardRef<HTMLElement, PageShellProps>(function PageShell(
  { children, className },
  ref,
) {
  return (
    <section
      className={className ? `page ${className}` : 'page'}
      data-animate="reveal"
      data-scroll-section
      ref={ref}
    >
      {children}
    </section>
  )
})

export default PageShell
