import AdminSection from '../components/AdminSection'
import EmptyAdminState from '../components/EmptyAdminState'
import AdminShell from '../layouts/AdminShell'
import { useOperationsCapacity } from '../../features/operations/hooks/useOperationsCapacity'
import { useOperationsDashboard } from '../../features/operations/hooks/useOperationsDashboard'
import { useOperationsDispatch } from '../../features/operations/hooks/useOperationsDispatch'
import { useOperationsClientService } from '../../features/operations/client-service/hooks/useOperationsClientService'
import { useAdminAccounts } from '../../features/admin-accounts/hooks/useAdminAccounts'
import { OperationalDocumentCard, ReportHistoryMock, ReportPreviewPanel, buildAdminKpiReport, useReportingCatalog } from '../../features/reporting'

/**
 * Editable Zones:
 * - REPORTING_CENTER
 * - REPORT_EXPORTS
 * - REPORT_ADMIN_KPIS
 * Visual component: src/admin/pages/ReportingPage.tsx
 * Service layer: src/features/reporting/services/reportingService.ts
 */
function ReportingPage() {
  const { definitions, history } = useReportingCatalog()
  const dashboard = useOperationsDashboard()
  const { capacity } = useOperationsCapacity()
  const { dashboard: dispatch } = useOperationsDispatch()
  const { dashboard: clientService } = useOperationsClientService()
  const accounts = useAdminAccounts()

  const kpiReport =
    dashboard && capacity && dispatch && clientService
      ? buildAdminKpiReport({ dashboard, capacity, dispatch, clientService, accounts })
      : null

  return (
    <AdminShell
      description="Centro de reportes, exportacion y documentos operativos preparado para JSON, CSV y vista imprimible."
      title="Reportes y exportaciones"
    >
      <AdminSection
        description="Catalogo de reportes disponibles para pedidos, produccion, preprensa, dispatch, service y KPIs."
        title="Centro de reportes"
      >
        <div className="admin-quick-actions">
          {definitions.map((definition) => (
            <OperationalDocumentCard definition={definition} key={definition.id} />
          ))}
        </div>
      </AdminSection>

      <div className="admin-two-column">
        <AdminSection
          description="Vista de referencia para exportacion ejecutiva desde el dashboard operativo."
          title="Reporte de KPIs"
        >
          {kpiReport ? (
            <ReportPreviewPanel report={kpiReport} title="REPORT_ADMIN_KPIS" />
          ) : (
            <EmptyAdminState
              title="Esperando datos"
              description="Cuando el dashboard operativo termine de cargar, se activara el preview del reporte."
            />
          )}
        </AdminSection>

        <AdminSection
          description="Historial local de exportaciones y vistas imprimibles generadas recientemente."
          title="Historial de reportes"
        >
          <ReportHistoryMock items={history} />
        </AdminSection>
      </div>
    </AdminShell>
  )
}

export default ReportingPage
