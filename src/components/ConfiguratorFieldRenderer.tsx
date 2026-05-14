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
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(field.key, event.target.value)
  }

  return (
    <label className="field-group" htmlFor={`config-field-${field.key}`}>
      <span className="field-label">{field.label}</span>
      {field.type === 'select' || field.type === 'variant' || field.type === 'size' ? (
        <select
          className="form-input"
          id={`config-field-${field.key}`}
          onChange={handleInputChange}
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
          id={`config-field-${field.key}`}
          max={field.max}
          min={field.min}
          onChange={handleInputChange}
          step={field.step}
          type="number"
          value={value}
        />
      ) : null}

      {field.type === 'text' ? (
        <input
          className="form-input"
          id={`config-field-${field.key}`}
          onChange={handleInputChange}
          type="text"
          value={value}
        />
      ) : null}

      {field.type === 'textarea' ? (
        <textarea
          className="form-input form-textarea"
          id={`config-field-${field.key}`}
          onChange={handleInputChange}
          rows={field.rows ?? 4}
          value={value}
        />
      ) : null}

      {field.type === 'file' ? (
        <>
          <input
            accept={field.accept}
            className="form-input form-input-file"
            id={`config-field-${field.key}`}
            onChange={(event) => onFileChange?.(field.key, event.target.files?.[0] ?? null)}
            type="file"
          />
          <span className="file-meta">{value || 'Sin archivo adjunto'}</span>
        </>
      ) : null}

      {field.helpText ? <span className="file-meta">{field.helpText}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  )
}

export default ConfiguratorFieldRenderer
