import { capacityMachines } from '../capacity/capacityMockData'
import { buildMachineSlots, getNextBusinessDays } from '../capacity/capacitySelectors'
import type { OperationsOrderRecord, SchedulingBoardData, SchedulingBoardDay } from '../types/operations'

const dayLabel = (date: string) =>
  new Date(date).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })

export function buildSchedulingBoard(orders: OperationsOrderRecord[]): SchedulingBoardData {
  const days = getNextBusinessDays(5).map<SchedulingBoardDay>((date) => {
    const deliveries = orders
      .filter((order) => order.dueDate.slice(0, 10) === date)
      .sort((left, right) => left.priority.localeCompare(right.priority))
    const { slots } = buildMachineSlots(orders, date)
    return {
      date,
      label: dayLabel(date),
      deliveries,
      machineSlots: slots.filter((slot) => capacityMachines.some((machine) => machine.id === slot.machine.id)),
    }
  })

  const conflicts = days.flatMap((day) =>
    buildMachineSlots(orders, day.date).conflicts.concat(
      day.deliveries
        .filter((order) => !order.operator?.id || !order.machine?.id)
        .map((order) => ({
          id: `unassigned-${day.date}-${order.id}`,
          level: 'warning' as const,
          message: `${order.id} llega a entrega sin operador o maquina asignada.`,
          orderIds: [order.id],
        })),
    ),
  )

  return { days, conflicts }
}
