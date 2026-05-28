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

  useEffect(() => {
    if (!open) {
      return
    }

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
    <div className="live-dialog-backdrop" role="presentation">
      <div
        aria-describedby="artwork-issue-description"
        aria-labelledby="artwork-issue-title"
        aria-modal="true"
        className="live-dialog live-dialog--default"
        ref={panelRef}
        role="dialog"
      >
        <div className="live-dialog__copy">
          <p className="section-label">Comprobacion inicial</p>
          <h2 id="artwork-issue-title">Tu archivo necesita un ajuste antes de imprimir.</h2>
          <p id="artwork-issue-description">
            Hemos detectado puntos que conviene corregir o revisar antes de usar este archivo como referencia de impresion.
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
                  {issue.severity === 'critical' ? 'Corregir' : issue.severity === 'warning' ? 'Revisar' : 'Info'}
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
            Ver requisitos del archivo
          </a>
          <button className="action-button" onClick={onRequestDesignerHelp} type="button">
            Solicitar ayuda de diseño Ridaos
          </button>
        </div>
      </div>
    </div>
  )
}
