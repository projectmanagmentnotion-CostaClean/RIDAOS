import type { ProductTemplateAsset } from '../../../domain/storage'

type TemplateGuidePanelProps = {
  template: ProductTemplateAsset
}

export function TemplateGuidePanel({ template }: TemplateGuidePanelProps) {
  return (
    <article className="content-card template-guide-panel">
      <p className="section-label">PRINT_TEMPLATE_GUIDES</p>
      <div className="summary-list compact-summary">
        <div className="summary-row">
          <span>Sangrado</span>
          <strong>{template.bleedMm} mm</strong>
        </div>
        <div className="summary-row">
          <span>Zona segura</span>
          <strong>{template.safeAreaMm} mm</strong>
        </div>
        <div className="summary-row">
          <span>Corte</span>
          <strong>{template.cutlineRequired ? 'Requerido' : 'No requerido'}</strong>
        </div>
        <div className="summary-row">
          <span>Orientacion</span>
          <strong>{template.orientation}</strong>
        </div>
      </div>
      <ul className="hint-list">
        <li>Rojo: linea de corte final.</li>
        <li>Amarillo: zona segura para textos y logos.</li>
        <li>Exterior: sangrado para fondos e imagenes.</li>
      </ul>
      {template.usageNotes?.length ? (
        <ul className="hint-list">
          {template.usageNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
