import { useState } from 'react'
import type { AdminCommentCategory } from '../../../admin/types/adminModels'

type InternalNotesComposerProps = {
  onSubmit: (payload: { body: string; category: AdminCommentCategory }) => Promise<void>
}

const categoryLabels: Record<AdminCommentCategory, string> = {
  internal: 'Interna',
  qa: 'QA',
  production: 'Produccion',
  service: 'Service',
}

function InternalNotesComposer({ onSubmit }: InternalNotesComposerProps) {
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<AdminCommentCategory>('internal')

  return (
    <div className="configurator-form">
      <label className="field-group">
        <span className="field-label">Tipo de nota</span>
        <select
          className="form-input"
          onChange={(event) => setCategory(event.target.value as AdminCommentCategory)}
          value={category}
        >
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="field-group">
        <span className="field-label">Nueva nota</span>
        <textarea
          className="form-input form-textarea"
          onChange={(event) => setBody(event.target.value)}
          rows={3}
          value={body}
        />
      </label>
      <button
        className="action-button"
        onClick={async () => {
          if (!body.trim()) {
            return
          }

          await onSubmit({ body: body.trim(), category })
          setBody('')
          setCategory('internal')
        }}
        type="button"
      >
        Anadir nota
      </button>
    </div>
  )
}

export default InternalNotesComposer
