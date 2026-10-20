import type { ChangeEvent } from 'react'
import type { ConfiguratorField } from '../types/product'

type ConfiguratorFieldRendererProps = {
  field: ConfiguratorField
  value: string
  error?: string
  onChange: (key: string, value: string) => void
  onFileChange?: (key: string, file: File | null) => void
}

function ConfiguratorFieldRenderer({
  field,
  value,
  error,
  onChange,
  onFileChange,
}: ConfiguratorFieldRendererProps) {
  const fieldId = `config-field-${field.key}`
  const hintId = field.hint ? `${fieldId}-hint` : undefined
  const helpTextId = field.helpText ? `${fieldId}-help` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const describedBy = [hintId, helpTextId, errorId].filter(Boolean).join(' ') || undefined
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(field.key, event.target.value)
  }

  return (
    <label className="field-group" htmlFor={fieldId}>
      <span className="field-label">{field.label}</span>
      {field.type === 'select' || field.type === 'variant' || field.type === 'size' ? (
        <select
          className="form-input"
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          id={fieldId}
          onChange={handleInputChange}
          required={field.required}
          value={value}
        >
          {field.options.map((option) => (
            <option key={`${field.key}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      {field.type === 'quantity' || field.type === 'meters' || field.type === 'area' ? (
        <input
          className="form-input"
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          id={fieldId}
          max={field.max}
          min={field.min}
          onChange={handleInputChange}
          required={field.required}
          step={field.step}
          type="number"
          value={value}
        />
      ) : null}

      {field.type === 'text' ? (
        <input
          className="form-input"
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          id={fieldId}
          onChange={handleInputChange}
          required={field.required}
          type="text"
          value={value}
        />
      ) : null}

      {field.type === 'textarea' ? (
        <textarea
          className="form-input form-textarea"
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          id={fieldId}
          onChange={handleInputChange}
          required={field.required}
          rows={field.rows ?? 4}
          value={value}
        />
      ) : null}

      {field.type === 'file' ? (
        <>
          <input
            accept={field.accept}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            className="form-input form-input-file"
            id={fieldId}
            onChange={(event) => onFileChange?.(field.key, event.target.files?.[0] ?? null)}
            required={field.required}
            type="file"
          />
          <span className="file-meta" id={`${fieldId}-selected-file`}>{value || 'Sin archivo adjunto'}</span>
        </>
      ) : null}

      {field.hint ? <span className="file-meta" id={hintId}>{field.hint}</span> : null}
      {field.helpText ? <span className="file-meta" id={helpTextId}>{field.helpText}</span> : null}
      {error ? <span className="field-error" id={errorId} role="alert">{error}</span> : null}
    </label>
  )
}

export default ConfiguratorFieldRenderer
