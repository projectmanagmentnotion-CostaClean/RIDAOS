import { updateValueAtPath } from '../utils/cmsObjectPaths'

type CmsFieldEditorProps = {
  label: string | number
  value: unknown
  onChange: (value: unknown) => void
  path?: Array<string | number>
  depth?: number
}

function getFieldLabel(label: string | number) {
  return typeof label === 'number' ? `Item ${label + 1}` : label
}

export function CmsFieldEditor({
  label,
  value,
  onChange,
  path = [],
  depth = 0,
}: CmsFieldEditorProps) {
  const fieldLabel = getFieldLabel(label)

  if (typeof value === 'string') {
    const isLong = value.length > 80 || value.includes('\n')

    return (
      <label className="cms-field">
        <span>{fieldLabel}</span>
        {isLong ? (
          <textarea
            className="form-input form-textarea"
            onChange={(event) => onChange(event.target.value)}
            rows={Math.max(4, Math.min(10, value.split('\n').length + 1))}
            value={value}
          />
        ) : (
          <input className="form-input" onChange={(event) => onChange(event.target.value)} type="text" value={value} />
        )}
      </label>
    )
  }

  if (typeof value === 'number') {
    return (
      <label className="cms-field">
        <span>{fieldLabel}</span>
        <input
          className="form-input"
          onChange={(event) => onChange(Number(event.target.value))}
          step="0.01"
          type="number"
          value={Number.isFinite(value) ? value : 0}
        />
      </label>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className="cms-field cms-field--toggle">
        <input checked={value} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
        <span>{fieldLabel}</span>
      </label>
    )
  }

  if (value === null) {
    return (
      <label className="cms-field">
        <span>{fieldLabel}</span>
        <input className="form-input" disabled type="text" value="null" />
      </label>
    )
  }

  if (Array.isArray(value)) {
    return (
      <fieldset className="cms-group">
        <legend>{fieldLabel}</legend>
        <div className="cms-group-grid">
          {value.map((item, index) => (
            <CmsFieldEditor
              depth={depth + 1}
              key={`${fieldLabel}-${index}`}
              label={index}
              onChange={(nextItem) => onChange(updateValueAtPath(value, [index], nextItem))}
              path={[...path, index]}
              value={item}
            />
          ))}
        </div>
      </fieldset>
    )
  }

  if (typeof value === 'object') {
    return (
      <fieldset className={`cms-group${depth > 0 ? ' cms-group--nested' : ''}`}>
        <legend>{fieldLabel}</legend>
        <div className="cms-group-grid">
          {Object.entries(value as Record<string, unknown>).map(([key, childValue]) => (
            <CmsFieldEditor
              depth={depth + 1}
              key={`${fieldLabel}-${key}`}
              label={key}
              onChange={(nextChildValue) => onChange(updateValueAtPath(value, [key], nextChildValue))}
              path={[...path, key]}
              value={childValue}
            />
          ))}
        </div>
      </fieldset>
    )
  }

  return null
}
