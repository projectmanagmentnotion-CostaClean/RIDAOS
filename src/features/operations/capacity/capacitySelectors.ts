import type { AdminMachineAssignment, AdminOperator, AdminSchedulingWindow } from '../../../admin/types/adminModels'
import { capacityMachines, capacityOperators, capacityWindows } from './capacityMockData'
import type {
  CapacityBoardData,
  DailyCapacitySnapshot,
  MachineSlot,
  OperationsOrderRecord,
  OperatorWorkload,
  SchedulingConflict,
  SlotRecommendation,
} from '../types/operations'

const HOUR_BY_PRODUCT: Record<OperationsOrderRecord['productType'], number> = {
  dtf: 2,
  textile: 2.5,
  paper: 1.5,
  material: 3,
  accessory: 1,
}

function clampDateLabel(date: Date) {
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

export function getEstimatedJobHours(order: OperationsOrderRecord) {
  const base = HOUR_BY_PRODUCT[order.productType] ?? 2
  return order.priority === 'urgent' ? base + 0.5 : base
}

export function buildCapacitySnapshot(orders: OperationsOrderRecord[], date: string): DailyCapacitySnapshot {
  const totalCapacity = capacityOperators.reduce((sum, operator) => sum + operator.dailyCapacityHours, 0)
  const dayOrders = orders.filter((order) => order.scheduledDate === date)
  const usedCapacity = dayOrders.reduce((sum, order) => sum + getEstimatedJobHours(order), 0)
  const unassignedJobs = orders.filter(
    (order) =>
      !order.operator?.id ||
      !order.machine?.id ||
      !order.scheduledDate ||
      !order.scheduledWindow,
  ).length

  return {
    date,
    usedCapacity,
    remainingCapacity: Math.max(totalCapacity - usedCapacity, 0),
    totalCapacity,
    overloaded: usedCapacity > totalCapacity,
    unassignedJobs,
  }
}

export function buildOperatorWorkload(orders: OperationsOrderRecord[], date: string): OperatorWorkload[] {
  return capacityOperators.map((operator) => {
    const assigned = orders.filter(
      (order) => order.operator?.id === operator.id && order.scheduledDate === date,
    )
    const usedHours = assigned.reduce((sum, order) => sum + getEstimatedJobHours(order), 0)
    return {
      operator,
      capacityHours: operator.dailyCapacityHours,
      scheduledJobs: assigned.length,
      urgentJobs: assigned.filter((order) => order.priority === 'urgent').length,
      usedHours,
      remainingHours: Math.max(operator.dailyCapacityHours - usedHours, 0),
      overloaded: usedHours > operator.dailyCapacityHours,
    }
  })
}

export function buildMachineQueue(orders: OperationsOrderRecord[], date: string) {
  return capacityMachines.map((machine) => {
    const queuedJobs = orders.filter(
      (order) =>
        order.machine?.id === machine.id &&
        order.scheduledDate === date &&
        !['delivered', 'shipped'].includes(order.queueStage),
    ).length
    const capacity = machine.dailySlots
    return {
      machine,
      queuedJobs,
      overloaded: queuedJobs > capacity,
    }
  })
}

export function buildCapacityBoard(orders: OperationsOrderRecord[], date: string): CapacityBoardData {
  const today = buildCapacitySnapshot(orders, date)
  const operatorWorkload = buildOperatorWorkload(orders, date)
  const machineQueue = buildMachineQueue(orders, date)
  const upcomingDeliveries = [...orders]
    .filter((order) => order.dueDate >= date)
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate))
    .slice(0, 5)
  const deliveryPlanning = [...orders]
    .filter((order) => order.shippingStatus === 'ready_for_dispatch' || order.priority === 'urgent')
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate))
    .reduce<CapacityBoardData['deliveryPlanning']>((acc, order) => {
      const key = order.dueDate.slice(0, 10)
      const bucket = acc.find((entry) => entry.date === key)
      if (bucket) {
        bucket.items.push(order)
      } else {
        acc.push({ date: key, items: [order] })
      }
      return acc
    }, [])
    .slice(0, 3)

  return {
    today,
    upcomingDeliveries,
    operatorWorkload,
    machineQueue,
    unassignedJobs: orders.filter(
      (order) =>
        !order.operator?.id ||
        !order.machine?.id ||
        !order.scheduledDate ||
        !order.scheduledWindow,
    ),
    overloadedOperators: operatorWorkload.filter((item) => item.overloaded),
    deliveryPlanning,
  }
}

export function buildMachineSlots(
  orders: OperationsOrderRecord[],
  date: string,
): { slots: MachineSlot[]; conflicts: SchedulingConflict[] } {
  const slotMap = new Map<string, OperationsOrderRecord[]>()

  for (const order of orders) {
    if (!order.machine?.id || !order.scheduledDate || !order.scheduledWindow) {
      continue
    }
    const key = `${order.machine.id}:${order.scheduledDate}:${order.scheduledWindow}`
    const existing = slotMap.get(key) ?? []
    existing.push(order)
    slotMap.set(key, existing)
  }

  const conflicts: SchedulingConflict[] = []
  const slots: MachineSlot[] = []

  for (const machine of capacityMachines) {
    for (const window of capacityWindows) {
      const slotsPerWindow = Math.max(1, Math.ceil(machine.dailySlots / capacityWindows.length))
      for (let index = 0; index < slotsPerWindow; index += 1) {
        const key = `${machine.id}:${date}:${window.key}`
        const assigned = slotMap.get(key) ?? []
        const order = assigned[index]
        const overloaded = assigned.length > slotsPerWindow
        if (index === 0 && overloaded) {
          conflicts.push({
            id: `conflict-${machine.id}-${date}-${window.key}`,
            level: 'critical',
            message: `${machine.label} supera la capacidad en ${window.label.toLowerCase()} del ${clampDateLabel(new Date(date))}.`,
            orderIds: assigned.map((item) => item.id),
          })
        }
        slots.push({
          id: `${machine.id}-${date}-${window.key}-${index}`,
          machine,
          date,
          window: window.key as AdminSchedulingWindow,
          order,
          overloaded,
        })
      }
    }
  }

  return { slots, conflicts }
}

export function getNextBusinessDays(count: number, fromDate = new Date()) {
  const result: string[] = []
  const cursor = new Date(fromDate)
  while (result.length < count) {
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) {
      result.push(cursor.toISOString().slice(0, 10))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return result
}

export function recommendSchedulingSlot(
  order: OperationsOrderRecord,
  orders: OperationsOrderRecord[],
): SlotRecommendation {
  const days = getNextBusinessDays(5)
  const preferredOperator = order.operator ?? capacityOperators[0]
  const preferredMachine =
    capacityMachines.find((machine) => machine.id === order.machine?.id) ?? capacityMachines[0]

  for (const date of days) {
    const operatorLoad = buildOperatorWorkload(orders, date).find((item) => item.operator.id === preferredOperator.id)
    const machineLoad = buildMachineQueue(orders, date).find((item) => item.machine.id === preferredMachine.id)
    for (const window of capacityWindows) {
      const slotsPerWindow = Math.max(1, Math.ceil(preferredMachine.dailySlots / capacityWindows.length))
      const slotOrders = orders.filter(
        (item) =>
          item.machine?.id === preferredMachine.id &&
          item.scheduledDate === date &&
          item.scheduledWindow === (window.key as AdminSchedulingWindow),
      )
      if (slotOrders.length < slotsPerWindow && (operatorLoad?.remainingHours ?? 0) >= getEstimatedJobHours(order)) {
        return {
          date,
          window: window.key as AdminSchedulingWindow,
          machine: preferredMachine,
          operator: preferredOperator,
          conflictLevel: machineLoad?.overloaded || operatorLoad?.overloaded ? 'busy' : 'clear',
          note: machineLoad?.overloaded
            ? 'Hueco disponible pero con cola cargada.'
            : 'Hueco limpio recomendado para lanzar el pedido.',
        }
      }
    }
  }

  return {
    date: days[0],
    window: capacityWindows[0].key as AdminSchedulingWindow,
    machine: preferredMachine,
    operator: preferredOperator,
    conflictLevel: 'busy',
    note: 'No hay slot limpio. Conviene reequilibrar operador o mover prioridad.',
  }
}

export function getCapacityMeta() {
  return {
    operators: capacityOperators as AdminOperator[],
    machines: capacityMachines as AdminMachineAssignment[],
    windows: capacityWindows,
  }
}
