import { getReportHistoryMock, listReportDefinitions } from '../services/reportingService'

export function useReportingCatalog() {
  return {
    definitions: listReportDefinitions(),
    history: getReportHistoryMock(),
  }
}
