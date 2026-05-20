type CmsJsonEditorProps = {
  value: string
  onChange: (value: string) => void
  onApply: () => void
}

export function CmsJsonEditor({ value, onChange, onApply }: CmsJsonEditorProps) {
  return (
    <article className="content-card cms-json-editor">
      <div className="cms-json-editor__head">
        <div>
          <p className="section-label">JSON mock</p>
          <h3>Edicion avanzada segura</h3>
          <p>Aplica el JSON solo cuando quieras sustituir el draft del panel visual.</p>
        </div>
        <button className="action-button action-button-muted" onClick={onApply} type="button">
          Aplicar JSON
        </button>
      </div>
      <textarea className="form-input form-textarea cms-json-editor__textarea" onChange={(event) => onChange(event.target.value)} rows={18} value={value} />
    </article>
  )
}
