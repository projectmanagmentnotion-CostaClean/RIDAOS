type AdminSearchInputProps = {
  value: string
  onChange: (value: string) => void
  label?: string
}

function AdminSearchInput({
  value,
  onChange,
  label = 'Buscar pedido, cliente o producto',
}: AdminSearchInputProps) {
  return (
    <label className="admin-search-input">
      <span className="sr-only">Buscar</span>
      <input
        className="form-input"
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        value={value}
      />
    </label>
  )
}

export default AdminSearchInput
