export function validateCheckoutContact(customer) {
  const errors = {}
  if (!customer.name.trim()) errors.name = 'Introduce el nombre del cliente.'
  if (!customer.email.trim()) errors.email = 'Introduce un email de contacto.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) errors.email = 'Introduce un email válido.'
  if (!customer.phone.trim()) errors.phone = 'Introduce un telefono de contacto.'
  return errors
}

export function isValidDtiDeliveryAddress(address) {
  return Boolean(
    address.line1.trim()
    && address.city.trim()
    && address.province.trim()
    && /^\d{5}$/.test(address.postalCode),
  )
}
