import { getAdminDashboardOverview, getAdminOrderDetail, listAdminOrders, listAdminUploads, listProductionQueue } from '../../../admin/services/orderAdminService'
import type { DispatchDashboardData, OperationsDashboardData, OperationsFilters, OperationsOrderRecord, OperationsUploadRecord } from '../types/operations'
import { buildOperationsDashboard, enrichOperationsOrder, enrichOperationsUpload, filterOperationsOrders, getProductionStats } from './operationsMappers'
import { buildCapacityBoard } from '../capacity/capacitySelectors'
import { buildSchedulingBoard } from '../scheduling/schedulingService'
import { buildDispatchDashboard, groupDispatchColumns } from '../dispatch/dispatchService'

export async function getOperationsOrders(filters: OperationsFilters): Promise<OperationsOrderRecord[]> {
  const orders = await listAdminOrders({
    search: filters.search,
    status: filters.status,
    priority: filters.priority,
  })

  return filterOperationsOrders(orders.map(enrichOperationsOrder), filters)
}

export async function getOperationsOrderDetail(orderId: string) {
  const order = await getAdminOrderDetail(orderId)
  return order ? enrichOperationsOrder(order) : null
}

export async function getOperationsUploads(): Promise<OperationsUploadRecord[]> {
  const [orders, uploads] = await Promise.all([listAdminOrders(), listAdminUploads()])
  const enrichedOrders = orders.map(enrichOperationsOrder)
  const ordersById = new Map(enrichedOrders.map((order) => [order.id, order]))
  return uploads.map((upload) => enrichOperationsUpload(upload, ordersById))
}

export async function getOperationsDashboard(): Promise<OperationsDashboardData> {
  const overview = await getAdminDashboardOverview()
  const orders = overview.orders.map(enrichOperationsOrder)
  const ordersById = new Map(orders.map((order) => [order.id, order]))
  const uploads = overview.uploads.map((upload) => enrichOperationsUpload(upload, ordersById))
  return buildOperationsDashboard(orders, uploads)
}

export async function getProductionOperations() {
  const orders = (await listProductionQueue()).map(enrichOperationsOrder)
  return {
    orders,
    stats: getProductionStats(orders),
  }
}

export async function getOperationsCapacityBoard() {
  const orders = (await listAdminOrders()).map(enrichOperationsOrder)
  const today = new Date().toISOString().slice(0, 10)
  return buildCapacityBoard(orders, today)
}

export async function getOperationsSchedulingBoard() {
  const orders = (await listAdminOrders()).map(enrichOperationsOrder)
  return buildSchedulingBoard(orders)
}

export async function getOperationsDispatchDashboard(): Promise<DispatchDashboardData> {
  const orders = (await listAdminOrders()).map(enrichOperationsOrder)
  return buildDispatchDashboard(orders)
}

export async function getOperationsDispatchBoard() {
  const orders = (await listAdminOrders()).map(enrichOperationsOrder)
  return groupDispatchColumns(orders)
}
