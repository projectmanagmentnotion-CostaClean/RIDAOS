import type {
  AdminMachineAssignment,
  AdminMachineType,
  AdminOperator,
  AdminSchedulingWindow,
} from '../../../admin/types/adminModels'

export type CapacityOperator = AdminOperator & {
  specialty: string
  shift: 'morning' | 'midday' | 'afternoon'
  dailyCapacityHours: number
}

export type CapacityMachine = AdminMachineAssignment & {
  dailySlots: number
  slotDurationHours: number
  focus: string
}

export type CapacityWindowDefinition = {
  key: AdminSchedulingWindow
  label: string
  range: string
}

export const capacityOperators: CapacityOperator[] = [
  {
    id: 'operator-laura',
    name: 'Laura M.',
    role: 'Mesa de revision',
    specialty: 'Preflight y validacion de artes',
    shift: 'morning',
    dailyCapacityHours: 6,
  },
  {
    id: 'operator-sergio',
    name: 'Sergio R.',
    role: 'Produccion DTF',
    specialty: 'DTF por metro y textil',
    shift: 'midday',
    dailyCapacityHours: 7,
  },
  {
    id: 'operator-noa',
    name: 'Noa C.',
    role: 'Acabados y salida',
    specialty: 'Packaging, control de calidad y expedicion',
    shift: 'afternoon',
    dailyCapacityHours: 6,
  },
  {
    id: 'operator-ivan',
    name: 'Ivan P.',
    role: 'Rotulacion y corte',
    specialty: 'Wrapping, plotter y montaje',
    shift: 'midday',
    dailyCapacityHours: 7,
  },
]

export const capacityMachines: CapacityMachine[] = [
  {
    id: 'machine-dtf-main',
    label: 'DTF main press',
    type: 'dtf_press',
    dailySlots: 3,
    slotDurationHours: 2,
    focus: 'Produccion DTF y textil',
  },
  {
    id: 'machine-plotter-cut',
    label: 'Plotter de corte',
    type: 'cut_plotter',
    dailySlots: 3,
    slotDurationHours: 2,
    focus: 'Vinilo, corte y perfiles',
  },
  {
    id: 'machine-large-format',
    label: 'Impresora gran formato',
    type: 'large_format_printer',
    dailySlots: 2,
    slotDurationHours: 3,
    focus: 'Lona, rigidos y paneles',
  },
  {
    id: 'machine-laminator',
    label: 'Laminadora',
    type: 'laminator',
    dailySlots: 2,
    slotDurationHours: 2,
    focus: 'Proteccion y acabado',
  },
  {
    id: 'machine-prep-table',
    label: 'Mesa de preparacion',
    type: 'prep_table',
    dailySlots: 4,
    slotDurationHours: 1,
    focus: 'Empaquetado, picking y preflight',
  },
]

export const capacityWindows: CapacityWindowDefinition[] = [
  { key: 'morning', label: 'Manana', range: '08:00 - 11:30' },
  { key: 'midday', label: 'Mediodia', range: '11:30 - 15:00' },
  { key: 'afternoon', label: 'Tarde', range: '15:00 - 18:30' },
]

export const defaultMachineByProductType: Record<string, AdminMachineType> = {
  dtf: 'dtf_press',
  textile: 'dtf_press',
  paper: 'large_format_printer',
  material: 'large_format_printer',
  accessory: 'prep_table',
}
