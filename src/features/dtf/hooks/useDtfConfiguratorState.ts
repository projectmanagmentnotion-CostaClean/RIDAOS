import { useEffect, useMemo, useState } from 'react'
import { addToCart } from '../../../lib/cart'
import { BASE_PRICE_PER_METER, calculateDTFPricing, type DTFQuality, type DTFUrgency } from '../../../lib/pricing'
import type { CartItem } from '../../../types/ecommerce'
import type { ArtworkPreviewSummary } from '../../artwork-upload'
import { useLiveToast } from '../../live-feedback'

type SimulationResult = {
  meters: number
  quality: DTFQuality
  urgency: DTFUrgency
  turnaroundPreference: string
  total: number
  fileName: string
  notes: string
}

type FilePreview = {
  canPreview: boolean
  fileName: string
  fileType: string
  fileSizeLabel: string
  formatLabel: string
  objectUrl?: string
}

const previewableTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']

const formatFileSize = (file: File) => {
  if (file.size < 1024 * 1024) {
    return `${Math.max(file.size / 1024, 0.1).toFixed(1)} KB`
  }

  return `${(file.size / (1024 * 1024)).toFixed(2)} MB`
}

const detectFormatLabel = (file: File) => {
  const extension = file.name.split('.').pop()?.toUpperCase()

  if (extension) {
    return extension
  }

  if (file.type) {
    return file.type.toUpperCase()
  }

  return 'DESCONOCIDO'
}

export function useDtfConfiguratorState() {
  const { error, info, success } = useLiveToast()
  const [meters, setMeters] = useState('1')
  const [quality, setQuality] = useState<DTFQuality>('standard')
  const [urgency, setUrgency] = useState<DTFUrgency>('normal')
  const [turnaroundPreference, setTurnaroundPreference] = useState('Planificacion estandar')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [errors, setErrors] = useState<{ meters?: string; file?: string }>({})
  const [simulation, setSimulation] = useState<SimulationResult | null>(null)
  const [cartMessage, setCartMessage] = useState('')

  const metersValue = Number(meters)
  const pricing = useMemo(() => {
    const basePricing = calculateDTFPricing(metersValue, quality, urgency)
    const extraServicesTotal = selectedExtras.length * 3.5

    return {
      ...basePricing,
      extras: basePricing.extras + extraServicesTotal,
      total: basePricing.total + extraServicesTotal,
    }
  }, [metersValue, quality, selectedExtras.length, urgency])

  const previewUrl = useMemo(() => {
    if (!selectedFile || !previewableTypes.includes(selectedFile.type)) {
      return null
    }

    return URL.createObjectURL(selectedFile)
  }, [selectedFile])

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    },
    [previewUrl],
  )

  const filePreview = useMemo<FilePreview | null>(() => {
    if (!selectedFile) {
      return null
    }

    const formatLabel = detectFormatLabel(selectedFile)

    return {
      canPreview: Boolean(previewUrl) && previewableTypes.includes(selectedFile.type),
      fileName: selectedFile.name,
      fileType: selectedFile.type || 'Tipo no detectado',
      fileSizeLabel: formatFileSize(selectedFile),
      formatLabel,
      objectUrl: previewUrl ?? undefined,
    }
  }, [previewUrl, selectedFile])

  const summaryItems = useMemo(
    () => [
      { label: 'Metraje', value: metersValue > 0 ? `${metersValue} m` : 'Pendiente' },
      { label: 'Calidad', value: quality === 'premium' ? 'Premium' : 'Standard' },
      { label: 'Urgencia', value: urgency === 'express' ? 'Express' : 'Normal' },
      { label: 'Turnaround', value: turnaroundPreference },
      { label: 'Archivo', value: selectedFile ? selectedFile.name : 'Por subir' },
    ],
    [metersValue, quality, selectedFile, turnaroundPreference, urgency],
  )

  const setFile = (file: File | null) => {
    setSelectedFile(file)
    setErrors((current) => ({ ...current, file: undefined }))
  }

  const toggleExtra = (label: string) => {
    setSelectedExtras((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  const validate = () => {
    const nextErrors: { meters?: string; file?: string } = {}

    if (!(metersValue > 0)) {
      nextErrors.meters = 'Introduce un metraje mayor que 0.'
    }

    if (!selectedFile) {
      nextErrors.file = 'Selecciona un archivo antes de continuar.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleAddToCart = (previewSummary?: ArtworkPreviewSummary | null) => {
    if (!validate() || !selectedFile) {
      error('Faltan datos por revisar', 'Completa el metraje y confirma un archivo antes de continuar.')
      return
    }

    const itemId = `dtf-${Date.now()}`
    const cartItem: CartItem = {
      id: itemId,
      lineQuantity: 1,
      productType: 'dtf',
      productName: 'DTI por metro',
      configuration: {
        meters: metersValue,
        quality,
        urgency,
        turnaroundPreference,
        extras: selectedExtras,
        summary: [
          'Producto: DTI por metro',
          `Metraje: ${metersValue} m`,
          `Calidad: ${quality === 'premium' ? 'Premium' : 'Standard'}`,
          `Urgencia: ${urgency === 'express' ? 'Express' : 'Normal'}`,
          `Turnaround: ${turnaroundPreference}`,
          `Archivo: ${selectedFile.name}`,
          ...(selectedExtras.length ? [`Extras: ${selectedExtras.join(', ')}`] : []),
        ],
        notes: notes.trim(),
      },
      pricing: {
        unitPrice: BASE_PRICE_PER_METER,
        unitLabel: 'metro',
        subtotal: pricing.subtotal,
        extras: pricing.extras,
        total: pricing.total,
      },
      artwork: {
        id: `upload-${Date.now()}`,
        itemId,
        fileName: selectedFile.name,
        fileType: selectedFile.type || 'application/octet-stream',
        fileSize: selectedFile.size,
        formatLabel: detectFormatLabel(selectedFile),
        status: 'pending_review',
        uploadedAt: new Date().toISOString(),
        notes: notes.trim(),
        previewSummary: previewSummary ?? undefined,
      },
    }

    addToCart(cartItem)
    setErrors({})
    setCartMessage(
      'Pedido preparado en tu carrito. Mantiene urgencia, turnaround y extras listos para pasar a confirmacion.',
    )
    success('Añadido al carrito', 'Tu pedido DTI ya aparece en el resumen de compra.')
  }

  const handleSimulateOrder = () => {
    if (!validate() || !selectedFile) {
      setSimulation(null)
      error('No se puede preparar el pedido', 'Necesitas un metraje valido y un archivo confirmado.')
      return
    }

    setSimulation({
      meters: metersValue,
      quality,
      urgency,
      turnaroundPreference,
      total: pricing.total,
      fileName: selectedFile.name,
      notes: notes.trim(),
    })
    setCartMessage('')
    info('Pedido preparado', 'Ya puedes revisar el resumen antes de pasar al carrito.')
  }

  return {
    meters,
    setMeters,
    quality,
    setQuality,
    urgency,
    setUrgency,
    turnaroundPreference,
    setTurnaroundPreference,
    selectedFile,
    setFile,
    notes,
    setNotes,
    selectedExtras,
    toggleExtra,
    errors,
    simulation,
    cartMessage,
    pricing,
    filePreview,
    summaryItems,
    handleAddToCart,
    handleSimulateOrder,
  }
}
