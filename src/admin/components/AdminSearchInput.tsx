type AdminSearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function AdminSearchInput({
  value,
  onChange,
  placeholder = 'Buscar pedido, cliente o producto',
}: AdminSearchInputProps) {
  return (
    <label className="admin-search-input">
      <span className="sr-only">Buscar</span>
      <input
        className="form-input"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  )
}

export default AdminSearchInput
