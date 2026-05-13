import { useEffect, useState } from 'react'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import AdminShell from '../layouts/AdminShell'
import { listAdminCustomers } from '../services/orderAdminService'
import type { AdminCustomerSummary } from '../types/adminModels'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)

function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomerSummary[]>([])

  useEffect(() => {
    let cancelled = false

    void listAdminCustomers().then((data) => {
      if (!cancelled) {
        setCustomers(data)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminShell
      description="Vista de clientes recientes con volumen de pedidos y valor acumulado."
      title="Clientes"
    >
      <AdminSection title="Base de clientes">
        {customers.length === 0 ? (
          <EmptyAdminState description="Los clientes apareceran a medida que entren pedidos." title="No hay clientes disponibles" />
        ) : (
          <div className="admin-data-table">
            <div className="admin-data-row admin-data-row-head">
              <span>Cliente</span>
              <span>Email</span>
              <span>Telefono</span>
              <span>Pedidos</span>
              <span>Valor</span>
              <span>Ultimo pedido</span>
            </div>
            {customers.map((customer) => (
              <div className="admin-data-row" key={customer.id}>
                <span>{customer.name}</span>
                <span>{customer.email}</span>
                <span>{customer.phone}</span>
                <span>{customer.totalOrders}</span>
                <span>{formatCurrency(customer.totalValue)}</span>
                <span>{new Date(customer.lastOrderAt).toLocaleDateString('es-ES')}</span>
              </div>
            ))}
          </div>
        )}
      </AdminSection>
    </AdminShell>
  )
}

export default CustomersPage
