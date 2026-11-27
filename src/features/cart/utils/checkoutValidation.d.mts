export function validateCheckoutContact(customer: { name: string; email: string; phone: string }): Partial<Record<'name' | 'email' | 'phone', string>>
export function isValidDtiDeliveryAddress(address: { line1: string; city: string; province: string; postalCode: string }): boolean
