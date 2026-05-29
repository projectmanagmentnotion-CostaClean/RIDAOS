import type { ConfigState } from '../../../../lib/configuratorState'
import type { ConfiguratorField } from '../../../../types/product'
import ConfiguratorFieldRenderer from '../../../../components/ConfiguratorFieldRenderer'

type ProductConfiguratorVisualFieldsProps = {
  entryId: string
  fields: ConfiguratorField[]
  config: ConfigState
  fieldErrors: Partial<Record<string, string>>
  onChange: (key: string, value: string) => void
  onFileChange?: (key: string, file: File | null) => void
}

type ConfigSectionDefinition = {
  id: string
  title: string
  description?: string
  fieldKeys: string[]
}

type OptionDescription = {
  description?: string
  badge?: string
  warning?: string
  accent?: 'green' | 'cyan' | 'pink' | 'gold' | 'silver'
}

function isChoiceField(
  field: ConfiguratorField,
): field is Extract<ConfiguratorField, { type: 'select' | 'variant' | 'size' }> {
  return field.type === 'select' || field.type === 'variant' || field.type === 'size'
}

function getFieldValueLabel(field: ConfiguratorField, value: string) {
  if (!value) {
    return 'Por definir'
  }

  if (isChoiceField(field)) {
    return field.options.find((option) => option.value === value)?.label ?? value
  }

  if (field.type === 'quantity') {
    return `${value} uds`
  }

  if (field.type === 'meters') {
    return `${value} m`
  }

  if (field.type === 'area') {
    return `${value} m2`
  }

  return value
}

function getSectionDefinitions(entryId: string): ConfigSectionDefinition[] | null {
  if (entryId === 'tarjetas-estandar') {
    return [
      {
        id: 'quantity',
        title: 'Cantidad',
        description: 'Las tiradas cerradas ayudan a comparar acabado, tacto y coste por unidad.',
        fieldKeys: ['quantity'],
      },
      {
        id: 'format',
        title: 'Formato',
        description: 'Elige el formato de presencia que mejor encaja con la marca.',
        fieldKeys: ['format'],
      },
      {
        id: 'printSides',
        title: 'Caras e impresion',
        description: 'Si eliges anverso y reverso, prepara ambas caras o solicita ayuda de diseno.',
        fieldKeys: ['printSides'],
      },
      {
        id: 'paper',
        title: 'Papel y gramaje',
        description: 'La rigidez y el tacto empiezan aqui antes del laminado o el foil.',
        fieldKeys: ['paperStock'],
      },
      {
        id: 'lamination',
        title: 'Laminado y tacto',
        description: 'Mate, brillo y soft touch son acabados de superficie, no reservas especiales.',
        fieldKeys: ['lamination'],
      },
      {
        id: 'specialFinish',
        title: 'Acabado especial',
        description: 'Foil y barniz 3D necesitan una reserva separada para marcar la aplicacion.',
        fieldKeys: ['specialFinish'],
      },
      {
        id: 'fileReview',
        title: 'Preparacion de archivo',
        description: 'Decide si traes el arte final listo o si quieres apoyo de revision.',
        fieldKeys: ['fileReview'],
      },
      {
        id: 'notes',
        title: 'Indicaciones del trabajo',
        description: 'Anota referencias de foil, barniz, sangrado o cualquier detalle comercial.',
        fieldKeys: ['notes'],
      },
    ]
  }

  if (entryId === 'flyer-a6' || entryId === 'flyer-a5') {
    return [
      {
        id: 'quantity',
        title: 'Cantidad',
        description: 'Compara la tirada con una lectura clara de coste y formato.',
        fieldKeys: ['quantity'],
      },
      {
        id: 'format',
        title: 'Formato',
        description: 'A6 a A3 y DL con una lectura visual pensada para acciones reales.',
        fieldKeys: ['format'],
      },
      {
        id: 'orientation',
        title: 'Orientacion',
        description: 'Elige la disposicion principal antes de preparar el PDF final.',
        fieldKeys: ['orientation'],
      },
      {
        id: 'printSides',
        title: 'Caras e impresion',
        description: 'Si es a dos caras, recomendamos PDF con anverso y reverso bien separados.',
        fieldKeys: ['printSides'],
      },
      {
        id: 'paper',
        title: 'Papel y gramaje',
        description: 'Una misma campana cambia mucho entre 135 g ligero y 300 g rigido.',
        fieldKeys: ['paperStock'],
      },
      {
        id: 'finish',
        title: 'Plastificado y acabado',
        description: 'Mate, brillo y soft touch se aplican como superficie final del flyer.',
        fieldKeys: ['finish'],
      },
      {
        id: 'fileReview',
        title: 'Preparacion de archivo',
        description: 'Activa ayuda si necesitas revisar el PDF o cerrar una doble cara con soporte.',
        fieldKeys: ['fileReview'],
      },
      {
        id: 'notes',
        title: 'Indicaciones del trabajo',
        description: 'Usa este bloque para especificar reparto, uso o notas para la pieza.',
        fieldKeys: ['notes'],
      },
    ]
  }

  if (entryId === 'pegatina-sin-laminar' || entryId === 'pegatina-laminada') {
    return [
      {
        id: 'quantity',
        title: 'Cantidad',
        description: 'Controla la tirada visible antes de definir material y corte.',
        fieldKeys: ['quantity'],
      },
      {
        id: 'shape',
        title: 'Forma y corte',
        description: 'Selecciona el contorno principal antes de preparar la linea de corte.',
        fieldKeys: ['shape'],
      },
      {
        id: 'sizePreset',
        title: 'Tamano',
        description: 'Los tamanos predefinidos ayudan a comparar impacto y soporte final.',
        fieldKeys: ['sizePreset'],
      },
      {
        id: 'material',
        title: 'Material',
        description: 'Blanco, transparente o exterior segun uso y superficie de aplicacion.',
        fieldKeys: ['material'],
      },
      {
        id: 'finish',
        title: 'Acabado',
        description: 'Define brillo, mate o proteccion exterior sin salir del mismo flujo.',
        fieldKeys: ['finish'],
      },
      {
        id: 'notes',
        title: 'Indicaciones del trabajo',
        description: 'Aclara hoja, individual, referencia de corte o necesidades del montaje.',
        fieldKeys: ['notes'],
      },
    ]
  }

  return null
}

function getFallbackSections(fields: ConfiguratorField[]) {
  return fields.map((field) => ({
    id: field.key,
    title: field.label,
    description: field.hint ?? field.helpText,
    fieldKeys: [field.key],
  }))
}

function getFieldPresentation(entryId: string, field: ConfiguratorField) {
  if (!isChoiceField(field)) {
    return 'default'
  }

  if (field.key === 'format' || field.key === 'shape' || field.key === 'orientation' || field.key === 'printSides' || field.key === 'specialFinish') {
    return 'visual-grid'
  }

  if (field.key === 'quantity' && (entryId === 'tarjetas-estandar' || entryId === 'flyer-a6' || entryId === 'flyer-a5')) {
    return 'pill-grid'
  }

  return 'row-list'
}

function getOptionDescription(fieldKey: string, optionValue: string): OptionDescription {
  const descriptions: Record<string, Record<string, OptionDescription>> = {
    quantity: {
      '100': { description: 'Tirada corta para primeras versiones o series controladas.', accent: 'cyan' },
      '250': { description: 'Equilibrio habitual para marca y equipo comercial.', accent: 'green' },
      '500': { description: 'Escala comoda para eventos, reposicion y mano comercial.', accent: 'green' },
      '1000': { description: 'Buen coste por unidad sin perder agilidad de reposicion.', accent: 'pink' },
      '2500': { description: 'Pensado para volumen con lectura clara de coste unitario.', accent: 'pink' },
      '5000': { description: 'Tirada alta para reparto, buzoneo o campana amplia.', accent: 'pink' },
    },
    format: {
      standard: { description: 'La referencia mas reconocible para uso profesional.', accent: 'cyan' },
      european: { description: 'Formato estilizado y mas panoramico para marca.', accent: 'green' },
      compact: { description: 'Compacto y directo para una lectura rapida.', accent: 'green' },
      square: { description: 'Presencia diferencial con lectura mas editorial.', badge: 'Premium', accent: 'pink' },
      rounded: { description: 'Misma base comercial con un gesto mas tactil.', badge: 'Especial', accent: 'pink' },
      a6: { description: 'Ligero y rapido para reparto directo.', accent: 'cyan' },
      a5: { description: 'Formato versatil para campanas de mano.', accent: 'green' },
      a4: { description: 'Mas presencia visual y mejor espacio de lectura.', accent: 'green' },
      a3: { description: 'Mayor impacto para promociones, cartel de mano o interior.', badge: 'Impacto', accent: 'pink' },
      dl: { description: 'Formato estrecho para menu, promo o buzoneo.', accent: 'cyan' },
    },
    orientation: {
      vertical: { description: 'Lectura clasica y composicion mas editorial.', accent: 'cyan' },
      horizontal: { description: 'Mas panoramico para imagen, menu o composicion apaisada.', accent: 'green' },
    },
    printSides: {
      'front-only': { description: 'Solo anverso para mensajes directos o reparto rapido.', accent: 'cyan' },
      'back-only': { description: 'Solo reverso cuando el anverso viene resuelto por otro soporte.', accent: 'cyan' },
      double: { description: 'Anverso y reverso con ambas caras preparadas en el archivo.', badge: 'PDF recomendado', accent: 'pink' },
      single: { description: 'Una cara para lectura inmediata y entrega agil.', accent: 'cyan' },
    },
    paperStock: {
      'coated-350': { description: 'Estucado clasico con buena rigidez para volumen.', badge: 'Estandar', accent: 'cyan' },
      'premium-400': { description: 'Mayor presencia y cuerpo para una tarjeta mas premium.', badge: 'Premium', accent: 'green' },
      'recycled-300': { description: 'Tono mas natural con lectura sostenible y tactil.', badge: 'Premium', accent: 'green' },
      'textured-special': { description: 'Textura visible con mas caracter de marca.', badge: 'Especial', accent: 'pink' },
      '135-gloss': { description: 'Ligero y agil para reparto o mailing promocional.', badge: 'Estandar', accent: 'cyan' },
      '170-matte': { description: 'Mas cuerpo sin dejar de ser flexible.', badge: 'Estandar', accent: 'green' },
      '250-matte': { description: 'Punto medio entre presencia y manejabilidad.', badge: 'Premium', accent: 'green' },
      '300-matte': { description: 'Rigidez visible para un flyer con mas empaque.', badge: 'Premium', accent: 'pink' },
      '170-recycled': { description: 'Lectura mas natural con menor brillo superficial.', badge: 'Especial', accent: 'green' },
    },
    lamination: {
      none: { description: 'Superficie sin plastificado adicional.', accent: 'cyan' },
      matte: { description: 'Proteccion sobria con lectura mas suave.', accent: 'green' },
      gloss: { description: 'Brillo visible para color y contraste mas vivos.', accent: 'green' },
      'soft-touch': { description: 'Acabado aterciopelado con tacto premium.', badge: 'Premium', accent: 'pink' },
    },
    finish: {
      none: { description: 'Sin capa final adicional.', accent: 'cyan' },
      matte: { description: 'Acabado mate para una lectura contenida.', accent: 'green' },
      gloss: { description: 'Brillo comercial para color mas vivo.', accent: 'green' },
      'soft-touch': { description: 'Acabado tactil premium para presentacion mas cuidada.', badge: 'Premium', accent: 'pink' },
      'premium-clear': { description: 'Capa transparente premium para presentacion limpia.', badge: 'Premium', accent: 'cyan' },
      'outdoor-protect': { description: 'Pensado para mayor resistencia exterior.', badge: 'Exterior', accent: 'green' },
    },
    specialFinish: {
      none: { description: 'Sin reserva especial adicional.', accent: 'cyan' },
      'foil-gold': {
        description: 'Efecto metalico dorado aplicado mediante reserva.',
        badge: 'Requiere reserva',
        warning: 'Necesita capa o pagina separada sin degradados ni transparencias.',
        accent: 'gold',
      },
      'foil-silver': {
        description: 'Efecto metalico plata aplicado mediante reserva.',
        badge: 'Requiere reserva',
        warning: 'Necesita capa o pagina separada sin degradados ni transparencias.',
        accent: 'silver',
      },
      'varnish-3d': {
        description: 'Relieve transparente sobre zonas concretas.',
        badge: 'Requiere reserva',
        warning: 'Marca la reserva con una capa o pagina separada y trazos limpios.',
        accent: 'pink',
      },
    },
    fileReview: {
      basic: { description: 'Comprobacion inicial incluida para detectar incidencias visibles.', badge: 'Incluida', accent: 'cyan' },
      advanced: { description: 'Revision mas completa antes de cerrar la referencia final.', badge: 'Pro', accent: 'green' },
      assisted: { description: 'Soporte de Ridaos para preparar o cerrar el archivo contigo.', badge: 'Ayuda Ridaos', accent: 'pink' },
    },
    shape: {
      square: { description: 'Lectura estable para etiqueta o branding basico.', accent: 'cyan' },
      rectangular: { description: 'Formato flexible para packaging o cierre comercial.', accent: 'green' },
      circle: { description: 'Golpe visual limpio y directo sobre superficie.', accent: 'green' },
      oval: { description: 'Contorno mas organico para lineas suaves.', accent: 'green' },
      custom: { description: 'Necesita linea de corte clara o ayuda de diseno.', badge: 'Linea de corte', accent: 'pink' },
      'full-cut': { description: 'Corte completo para entrega individual definida.', badge: 'Troquel', accent: 'pink' },
      'kiss-cut': { description: 'Medio corte para despegar sin perder base de soporte.', badge: 'Kiss cut', accent: 'pink' },
    },
    material: {
      white: { description: 'Base neutra y versatil para la mayoria de aplicaciones.', accent: 'cyan' },
      transparent: { description: 'Pensado para cristal, packaging o efectos de vacio visual.', badge: 'Premium', accent: 'green' },
      'outdoor-vinyl': { description: 'Vinilo orientado a uso exterior o mayor exposicion.', badge: 'Exterior', accent: 'green' },
      'adhesive-paper': { description: 'Opcion ligera para interior o uso puntual.', accent: 'cyan' },
      repositionable: { description: 'Permite recolocar con mas margen de ajuste.', badge: 'Flexible', accent: 'pink' },
    },
    sizePreset: {
      '5x5': { description: 'Compacta y directa para detalle o cierre pequeno.', accent: 'cyan' },
      '10x10': { description: 'Equilibrio rapido para branding y packaging.', accent: 'green' },
      '15x15': { description: 'Mas presencia sin ir a formatos muy amplios.', accent: 'green' },
      '20x20': { description: 'Impacto medio con lectura a distancia corta.', accent: 'pink' },
      '30x50': { description: 'Formato mas dominante para superficies visibles.', badge: 'Grande', accent: 'pink' },
      custom: { description: 'Tamano personalizado segun soporte o proyecto.', badge: 'A medida', accent: 'pink' },
    },
  }

  return descriptions[fieldKey]?.[optionValue] ?? {}
}

function renderOptionPreview(fieldKey: string, optionValue: string, optionLabel: string) {
  if (fieldKey === 'format') {
    if (optionValue === 'square') {
      return <span className="product-option-preview product-option-preview--square" aria-hidden="true" />
    }

    if (optionValue === 'rounded') {
      return <span className="product-option-preview product-option-preview--rounded" aria-hidden="true" />
    }

    if (optionValue === 'a3' || optionValue === 'a4' || optionValue === 'a5' || optionValue === 'a6' || optionValue === 'dl') {
      return (
        <span className="product-option-sheet" aria-hidden="true">
          <span className="product-option-sheet__page" />
          <span className="product-option-sheet__badge">{optionLabel}</span>
        </span>
      )
    }

    return <span className="product-option-preview product-option-preview--landscape" aria-hidden="true" />
  }

  if (fieldKey === 'orientation') {
    return (
      <span className={`product-option-orientation product-option-orientation--${optionValue}`} aria-hidden="true">
        <span />
      </span>
    )
  }

  if (fieldKey === 'printSides') {
    return (
      <span className="product-option-faces" aria-hidden="true">
        <span className="product-option-faces__card" />
        {optionValue === 'double' ? <span className="product-option-faces__card product-option-faces__card--back" /> : null}
      </span>
    )
  }

  if (fieldKey === 'specialFinish') {
    return (
      <span className={`product-option-finish product-option-finish--${optionValue.replace(/[^a-z0-9]+/g, '-')}`} aria-hidden="true">
        <span />
      </span>
    )
  }

  if (fieldKey === 'shape') {
    return <span className={`product-option-sticker product-option-sticker--${optionValue.replace(/[^a-z0-9]+/g, '-')}`} aria-hidden="true" />
  }

  if (fieldKey === 'sizePreset') {
    return (
      <span className="product-option-sheet product-option-sheet--size" aria-hidden="true">
        <span className="product-option-sheet__page" />
        <span className="product-option-sheet__badge">{optionLabel}</span>
      </span>
    )
  }

  return <span className="product-option-preview product-option-preview--fallback" aria-hidden="true" />
}

function renderChoiceField(
  entryId: string,
  field: Extract<ConfiguratorField, { type: 'select' | 'variant' | 'size' }>,
  value: string,
  error: string | undefined,
  onChange: (key: string, value: string) => void,
) {
  const presentation = getFieldPresentation(entryId, field)

  if (presentation === 'visual-grid' || presentation === 'pill-grid') {
    return (
      <div
        className={`product-option-grid${presentation === 'pill-grid' ? ' product-option-grid--compact' : ''}`}
        role="radiogroup"
        aria-label={field.label}
      >
        {field.options.map((option) => {
          const selected = option.value === value
          const meta = getOptionDescription(field.key, option.value)

          return (
            <button
              aria-checked={selected}
              className={`product-option-card${selected ? ' is-selected' : ''}`}
              data-accent={meta.accent ?? 'green'}
              key={`${field.key}-${option.value}`}
              onClick={() => onChange(field.key, option.value)}
              role="radio"
              type="button"
            >
              {renderOptionPreview(field.key, option.value, option.label)}
              <span className="product-option-card__copy">
                <span className="product-option-card__title-row">
                  <strong>{option.label}</strong>
                  {meta.badge ? <span className="product-option-card__badge">{meta.badge}</span> : null}
                </span>
                {meta.description ? <span>{meta.description}</span> : null}
                {meta.warning ? <small>{meta.warning}</small> : null}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="product-option-list" role="radiogroup" aria-label={field.label}>
      {field.options.map((option) => {
        const selected = option.value === value
        const meta = getOptionDescription(field.key, option.value)

        return (
          <button
            aria-checked={selected}
            className={`product-option-row${selected ? ' is-selected' : ''}`}
            data-accent={meta.accent ?? 'cyan'}
            key={`${field.key}-${option.value}`}
            onClick={() => onChange(field.key, option.value)}
            role="radio"
            type="button"
          >
            <span className="product-option-row__radio" aria-hidden="true" />
            <span className="product-option-row__copy">
              <span className="product-option-row__title">
                <strong>{option.label}</strong>
                {meta.badge ? <span className="product-option-row__badge">{meta.badge}</span> : null}
              </span>
              {meta.description ? <span>{meta.description}</span> : null}
            </span>
          </button>
        )
      })}
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  )
}

function renderField(
  entryId: string,
  field: ConfiguratorField,
  value: string,
  error: string | undefined,
  onChange: (key: string, value: string) => void,
  onFileChange?: (key: string, file: File | null) => void,
) {
  if (isChoiceField(field)) {
    return renderChoiceField(entryId, field, value, error, onChange)
  }

  if (field.type === 'textarea') {
    return (
      <div className="product-config-field">
        <ConfiguratorFieldRenderer error={error} field={field} onChange={onChange} onFileChange={onFileChange} value={value} />
      </div>
    )
  }

  if (field.type === 'text' || field.type === 'quantity' || field.type === 'meters' || field.type === 'area') {
    return (
      <div className="product-config-field product-config-field--inline">
        <ConfiguratorFieldRenderer error={error} field={field} onChange={onChange} onFileChange={onFileChange} value={value} />
      </div>
    )
  }

  return (
    <div className="product-config-field">
      <ConfiguratorFieldRenderer error={error} field={field} onChange={onChange} onFileChange={onFileChange} value={value} />
    </div>
  )
}

export function ProductConfiguratorVisualFields({
  entryId,
  fields,
  config,
  fieldErrors,
  onChange,
  onFileChange,
}: ProductConfiguratorVisualFieldsProps) {
  const definitions = getSectionDefinitions(entryId) ?? getFallbackSections(fields)
  const sections = definitions
    .map((definition) => ({
      ...definition,
      fields: definition.fieldKeys
        .map((fieldKey) => fields.find((field) => field.key === fieldKey))
        .filter(Boolean) as ConfiguratorField[],
    }))
    .filter((section) => section.fields.length > 0)

  return (
    <div className="product-config-sections">
      {sections.map((section) => {
        const selectedLabels = section.fields
          .map((field) => getFieldValueLabel(field, config[field.key] ?? ''))
          .filter(Boolean)
          .join(' · ')

        return (
          <section className="product-option-section" key={section.id}>
            <header className="product-option-section__header">
              <div>
                <p className="section-label">{section.title}</p>
                {section.description ? <p className="product-option-section__description">{section.description}</p> : null}
              </div>
              <span className="product-option-section__summary">{selectedLabels || 'Por definir'}</span>
            </header>

            <div className="product-option-section__content">
              {section.fields.map((field) => (
                <div className="product-option-section__field" key={field.key}>
                  {renderField(
                    entryId,
                    field,
                    config[field.key] ?? '',
                    fieldErrors[field.key],
                    onChange,
                    onFileChange,
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
