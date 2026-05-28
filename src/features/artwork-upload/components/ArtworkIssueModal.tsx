import { useEffect, useRef } from 'react'
import type { ArtworkReferenceIssue } from '../../../domain/storage'
import { publicRoutes } from '../../../lib/navigation'

type ArtworkIssueModalProps = {
  issues: ArtworkReferenceIssue[]
  open: boolean
  onClose: () => void
  onRequestDesignerHelp: () => void
}

export function ArtworkIssueModal({
  issues,
  open,
  onClose,
  onRequestDesignerHelp,
}: ArtworkIssueModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
      return
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    const firstButton = panelRef.current?.querySelector<HTMLElement>('button, a')
    firstButton?.focus()
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className="live-dialog-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-describedby="artwork-issue-description"
        aria-labelledby="artwork-issue-title"
        aria-modal="true"
        className="live-dialog live-dialog--default"
        onClick={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
      >
        <div className="live-dialog__copy">
          <p className="section-label">Revision del archivo</p>
          <h2 id="artwork-issue-title">Tu archivo necesita un pequeno ajuste antes de seguir.</h2>
          <p id="artwork-issue-description">
            Hemos detectado un punto importante para preparar bien la referencia de impresion. Aqui te explicamos que
            revisar y como resolverlo sin perder la solicitud.
          </p>
          <div className="admin-list-card">
            {issues.map((issue) => (
              <article className="admin-list-row admin-list-row-block" key={issue.id}>
                <div>
                  <strong>{issue.title}</strong>
                  <p>{issue.description}</p>
                  <small>{issue.whyItMatters}</small>
                  <p>{issue.correctionHint}</p>
                </div>
                <span
                  className={`status-badge status-${issue.severity === 'critical' ? 'danger' : issue.severity === 'warning' ? 'warning' : 'info'}`}
                >
                  {issue.severity === 'critical' ? 'Ajuste necesario' : issue.severity === 'warning' ? 'Conviene revisar' : 'Informacion'}
                </span>
              </article>
            ))}
          </div>
        </div>
        <div className="live-dialog__actions">
          <button className="action-button action-button-muted" onClick={onClose} type="button">
            Subir otro archivo
          </button>
          <a className="action-button action-button-muted action-link-button" href={publicRoutes.guia} onClick={onClose}>
            Ver requisitos
          </a>
          <button className="action-button" onClick={onRequestDesignerHelp} type="button">
            Solicitar ayuda de diseno Ridaos
          </button>
        </div>
      </div>
    </div>
  )
}
