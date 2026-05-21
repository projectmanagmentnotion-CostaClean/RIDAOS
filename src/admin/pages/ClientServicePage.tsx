import { useState } from 'react'
import AdminFilterBar from '../components/AdminFilterBar'
import AdminSearchInput from '../components/AdminSearchInput'
import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import AdminShell from '../layouts/AdminShell'
import ClientServiceDashboardWidgets from '../../features/operations/client-service/components/ClientServiceDashboardWidgets'
import ClientServiceTemplatePreviewList from '../../features/operations/client-service/components/ClientServiceTemplatePreviewList'
import ClientServiceTicketList from '../../features/operations/client-service/components/ClientServiceTicketList'
import SlaMonitorCards from '../../features/operations/client-service/components/SlaMonitorCards'
import { approvalStateLabels, escalationLevelLabels, incidentTypeLabels, slaStatusLabels, ticketStatusLabels } from '../../features/operations/client-service/mock/clientServiceMockData'
import { defaultClientServiceFilters, useOperationsClientService } from '../../features/operations/client-service/hooks/useOperationsClientService'
import { getClientServiceTemplatePreviewData } from '../../features/operations/client-service/services/clientServiceService'
import type { ClientServiceFilters } from '../../features/operations/client-service/types/clientService'

/**
 * Editable Zones:
 * - ADMIN_CLIENT_SERVICE
 * - ADMIN_SLA_MONITOR
 * - ADMIN_ARTWORK_APPROVALS
 * - ADMIN_RESPONSE_TEMPLATES
 * - ADMIN_CUSTOMER_ISSUES
 * - ADMIN_ESCALATION_PANEL
 * Visual component: src/admin/pages/ClientServicePage.tsx
 * Service layer: src/features/operations/client-service/services/clientServiceService.ts
 */
function ClientServicePage() {
  const [filters, setFilters] = useState<ClientServiceFilters>(defaultClientServiceFilters)
  const { dashboard, tickets } = useOperationsClientService(filters)
  const messagePreviewSource = tickets[0]
  const messagePreviews = messagePreviewSource ? getClientServiceTemplatePreviewData(messagePreviewSource) : []

  return (
    <AdminShell
      description="Mesa interna de atencion al cliente, approvals, SLA y escalado mock preparada para migrar a real data."
      title="Client service y approvals"
    >
      {dashboard ? (
        <AdminSection
          description="Open tickets, SLA, approvals y escalados en una sola lectura operativa."
          title="Service dashboard"
        >
          <ClientServiceDashboardWidgets data={dashboard} />
        </AdminSection>
      ) : null}

      <AdminSection
        description="Busca por cliente, estado, SLA, approval o tipo de incidencia."
        title="Filtros de soporte"
      >
        <AdminFilterBar>
          <AdminSearchInput
            onChange={(value) => setFilters((current) => ({ ...current, search: value }))}
            value={filters.search}
          />
          <label className="field-group">
            <span className="field-label">Ticket</span>
            <select
              className="form-input"
              onChange={(event) => setFilters((current) => ({ ...current, ticketStatus: event.target.value as ClientServiceFilters['ticketStatus'] }))}
              value={filters.ticketStatus}
            >
              <option value="all">Todos</option>
              {Object.entries(ticketStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">SLA</span>
            <select
              className="form-input"
              onChange={(event) => setFilters((current) => ({ ...current, slaStatus: event.target.value as ClientServiceFilters['slaStatus'] }))}
              value={filters.slaStatus}
            >
              <option value="all">Todos</option>
              {Object.entries(slaStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Approval</span>
            <select
              className="form-input"
              onChange={(event) => setFilters((current) => ({ ...current, approvalState: event.target.value as ClientServiceFilters['approvalState'] }))}
              value={filters.approvalState}
            >
              <option value="all">Todas</option>
              {Object.entries(approvalStateLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Escalado</span>
            <select
              className="form-input"
              onChange={(event) => setFilters((current) => ({ ...current, escalationLevel: event.target.value as ClientServiceFilters['escalationLevel'] }))}
              value={filters.escalationLevel}
            >
              <option value="all">Todos</option>
              {Object.entries(escalationLevelLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Incidencia</span>
            <select
              className="form-input"
              onChange={(event) => setFilters((current) => ({ ...current, incidentType: event.target.value as ClientServiceFilters['incidentType'] }))}
              value={filters.incidentType}
            >
              <option value="all">Todas</option>
              {Object.entries(incidentTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </AdminFilterBar>
      </AdminSection>

      <div className="admin-two-column">
        <AdminSection description="Tickets con approval, SLA y recommendation de respuesta." title="Tickets y approvals">
          {tickets.length === 0 ? (
            <EmptyAdminState title="Sin tickets para estos filtros" description="Prueba otra combinacion para recuperar la cola de service mock." />
          ) : (
            <ClientServiceTicketList tickets={tickets} />
          )}
        </AdminSection>

        <AdminSection description="Casos en riesgo o fuera de SLA que piden respuesta hoy." title="SLA monitor">
          {dashboard ? <SlaMonitorCards tickets={dashboard.urgentReviews} /> : null}
        </AdminSection>
      </div>

      <div className="admin-two-column">
        <AdminSection description="Previews premium de mensajes, sin envio real." title="Response templates">
          {messagePreviews.length ? (
            <ClientServiceTemplatePreviewList items={messagePreviews} />
          ) : (
            <EmptyAdminState title="Sin previews" description="Cuando haya un ticket cargado se mostraran templates sugeridos." />
          )}
        </AdminSection>

        <AdminSection description="Atajos para approvals y escalaciones urgentes." title="Quick actions">
          <div className="admin-quick-actions">
            <a className="content-card admin-quick-action" href="#/admin/uploads">
              <strong>Artwork review</strong>
            </a>
            <a className="content-card admin-quick-action" href="#/admin/orders?priority=urgent">
              <strong>Urgentes y SLA</strong>
            </a>
            <a className="content-card admin-quick-action" href="#/admin/production">
              <strong>Coordinar produccion</strong>
            </a>
          </div>
        </AdminSection>
      </div>
    </AdminShell>
  )
}

export default ClientServicePage
