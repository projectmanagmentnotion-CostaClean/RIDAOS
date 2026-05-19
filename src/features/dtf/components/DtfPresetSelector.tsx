type DtfPresetSelectorProps = {
  presets: string[]
  value: string
  onSelect: (preset: string) => void
}

export function DtfPresetSelector({ presets, value, onSelect }: DtfPresetSelectorProps) {
  return (
    <div className="dtf-meter-presets">
      {presets.map((preset) => (
        <button
          className={`meter-preset-button${value === preset ? ' is-selected' : ''}`}
          key={preset}
          onClick={() => onSelect(preset)}
          type="button"
        >
          {preset} m
        </button>
      ))}
    </div>
  )
}
