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
      description="Vista interna de clientes preparada para seguimiento comercial, recurrencia y contexto operativo."
      title="Clientes"
    >
      <AdminSection
        description="Lectura rapida del cliente, su valor acumulado y ultima actividad registrada."
        title="Base de clientes"
      >
        {customers.length === 0 ? (
          <EmptyAdminState description="Los clientes apareceran a medida que entren pedidos." title="No hay clientes disponibles" />
        ) : (
          <div className="admin-customer-grid">
            {customers.map((customer) => (
              <article className="content-card admin-customer-card" key={customer.id}>
                <div className="order-card-head">
                  <div>
                    <p className="section-label">Cliente activo</p>
                    <h3>{customer.name}</h3>
                  </div>
                  <strong>{customer.totalOrders} pedidos</strong>
                </div>
                <div className="summary-list">
                  <div className="summary-row">
                    <span>Email</span>
                    <strong>{customer.email}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Telefono</span>
                    <strong>{customer.phone}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Valor acumulado</span>
                    <strong>{formatCurrency(customer.totalValue)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Ultimo pedido</span>
                    <strong>{new Date(customer.lastOrderAt).toLocaleDateString('es-ES')}</strong>
                  </div>
                </div>
                <p className="admin-inline-note">
                  Mantener este bloque preparado permite enchufar historial real, notas y roles sin rehacer la lectura del cliente.
                </p>
              </article>
            ))}
          </div>
        )}
      </AdminSection>
    </AdminShell>
  )
}

export default CustomersPage
