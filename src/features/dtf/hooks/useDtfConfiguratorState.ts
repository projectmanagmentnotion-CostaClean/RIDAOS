import { useEffect, useMemo, useState } from 'react'
import type { ArtworkReferenceAcceptance } from '../../../domain/storage'
import { addToCart } from '../../../lib/cart'
import { publicRoutes } from '../../../lib/navigation'
import type { CartItem } from '../../../types/ecommerce'
import type { ArtworkPreviewSummary } from '../../artwork-upload'
import { useLiveToast } from '../../live-feedback'
import { calculateDtiInnuroPrice, DTI_INNURO_PRICE_PER_METER } from '../../../config/pricing/dtiInnuroPricing.mjs'
import { rememberDtiArtwork } from '../dtiCheckout'

type SimulationResult = {
  meters: number
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<{ meters?: string; file?: string }>({})
  const [simulation, setSimulation] = useState<SimulationResult | null>(null)
  const [cartMessage, setCartMessage] = useState('')

  const metersValue = Number(meters)
  const pricing = useMemo(() => {
    const price = calculateDtiInnuroPrice(metersValue)

    return {
      subtotal: price.total,
      extras: 0,
      total: price.total,
      vatIncluded: true,
      valid: price.valid,
    }
  }, [metersValue])

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
      { label: 'Ancho útil', value: '55 cm' },
      { label: 'Archivo', value: selectedFile ? selectedFile.name : 'Por subir' },
    ],
    [metersValue, selectedFile],
  )

  const setFile = (file: File | null) => {
    setSelectedFile(file)
    setErrors((current) => ({ ...current, file: undefined }))
  }

  const validate = () => {
    const nextErrors: { meters?: string; file?: string } = {}

    if (!(metersValue >= 1)) {
      nextErrors.meters = 'El pedido mínimo es de 1 m.'
    }

    if (!selectedFile) {
      nextErrors.file = 'Selecciona un archivo antes de continuar.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleAddToCart = (
    previewSummary?: ArtworkPreviewSummary | null,
    acceptance?: ArtworkReferenceAcceptance | null,
  ) => {
    if (!validate() || !selectedFile) {
      error('Faltan datos por revisar', 'Completa el metraje y confirma un archivo antes de continuar.')
      return
    }

    const itemId = `dtf-${Date.now()}`
    const cartItem: CartItem = {
      id: itemId,
      lineQuantity: 1,
      productType: 'dtf',
      productName: 'DTI Innuro por metro',
      configuration: {
        meters: metersValue,
        productHref: publicRoutes.dtf,
        summary: [
          'Producto: DTI Innuro',
          `Metraje: ${metersValue} m`,
          'Ancho útil: 55 cm',
          `Archivo: ${selectedFile.name}`,
        ],
        notes: notes.trim(),
      },
      pricing: {
        unitPrice: DTI_INNURO_PRICE_PER_METER,
        unitLabel: 'metro',
        subtotal: pricing.subtotal,
        extras: pricing.extras,
        total: pricing.total,
        vatIncluded: true,
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
        acceptance: acceptance ?? undefined,
        previewSummary: previewSummary ?? undefined,
      },
    }

    addToCart(cartItem)
    rememberDtiArtwork(itemId, selectedFile)
    setErrors({})
    setCartMessage(
      'Solicitud local guardada en el carrito. No se ha realizado ningún cobro ni envío real.',
    )
    success('Añadido al carrito', 'Solicitud local de DTI Innuro; sin cobro.')
  }

  const handleSimulateOrder = () => {
    if (!validate() || !selectedFile) {
      setSimulation(null)
      error('No se puede preparar el pedido', 'Necesitas un metraje valido y un archivo confirmado.')
      return
    }

    setSimulation({
      meters: metersValue,
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
    selectedFile,
    setFile,
    notes,
    setNotes,
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
