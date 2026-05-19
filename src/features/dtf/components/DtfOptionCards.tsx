import type { DTFQuality, DTFUrgency } from '../../../lib/pricing'

type DtfOptionCardsProps = {
  quality: DTFQuality
  urgency: DTFUrgency
  turnaroundPreference: string
  selectedExtras: string[]
  onQualityChange: (value: DTFQuality) => void
  onUrgencyChange: (value: DTFUrgency) => void
  onTurnaroundChange: (value: string) => void
  onToggleExtra: (value: string) => void
}

const turnaroundOptions = [
  'Planificacion estandar',
  'Ventana prioritaria',
  'Salida compacta 24/48h',
]

const extras = [
  'Chequeo visual avanzado',
  'Separacion por tiradas',
  'Etiquetado de bobina',
]

export function DtfOptionCards({
  quality,
  urgency,
  turnaroundPreference,
  selectedExtras,
  onQualityChange,
  onUrgencyChange,
  onTurnaroundChange,
  onToggleExtra,
}: DtfOptionCardsProps) {
  return (
    <>
      <div className="dtf-option-grid">
        <button
          className={`dtf-option-card${quality === 'standard' ? ' is-active' : ''}`}
          onClick={() => onQualityChange('standard')}
          type="button"
        >
          <strong>Standard</strong>
          <span>Base limpia para volumen o reposicion.</span>
        </button>
        <button
          className={`dtf-option-card${quality === 'premium' ? ' is-active' : ''}`}
          onClick={() => onQualityChange('premium')}
          type="button"
        >
          <strong>Premium</strong>
          <span>Mas control de acabado y mejor lectura comercial.</span>
        </button>
      </div>

      <div className="dtf-option-grid">
        <button
          className={`dtf-option-card${urgency === 'normal' ? ' is-active' : ''}`}
          onClick={() => onUrgencyChange('normal')}
          type="button"
        >
          <strong>Urgencia normal</strong>
          <span>Se integra en la cola preparada sin recargo.</span>
        </button>
        <button
          className={`dtf-option-card${urgency === 'express' ? ' is-active' : ''}`}
          onClick={() => onUrgencyChange('express')}
          type="button"
        >
          <strong>Urgencia express</strong>
          <span>Activa suplemento y prioridad comercial.</span>
        </button>
      </div>

      <div className="dtf-turnaround-row">
        {turnaroundOptions.map((option) => (
          <button
            className={`turnaround-chip${turnaroundPreference === option ? ' is-active' : ''}`}
            key={option}
            onClick={() => onTurnaroundChange(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>

      <div className="dtf-extras-grid">
        {extras.map((extra) => (
          <button
            className={`dtf-extra-card${selectedExtras.includes(extra) ? ' is-active' : ''}`}
            key={extra}
            onClick={() => onToggleExtra(extra)}
            type="button"
          >
            {extra}
          </button>
        ))}
      </div>
    </>
  )
}
