import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  AdminComment,
  AdminOrderOverride,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminProductionStatus,
  AdminUploadOverride,
  AdminUploadReviewStatus,
  AdminOrderPriority,
} from '../types/adminModels'
import { demoAdminOrderOverrides, demoAdminUploadOverrides } from '../services/demoAdminData'

type AdminUiStore = {
  mobileSidebarOpen: boolean
  orderOverrides: Record<string, AdminOrderOverride>
  uploadOverrides: Record<string, AdminUploadOverride>
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  updateOrderOverride: (orderId: string, patch: AdminOrderOverride) => void
  setOrderStatus: (orderId: string, status: AdminOrderStatus) => void
  setOrderPriority: (orderId: string, priority: AdminOrderPriority) => void
  setPaymentStatus: (orderId: string, paymentStatus: AdminPaymentStatus) => void
  setProductionStatus: (orderId: string, productionStatus: AdminProductionStatus) => void
  setOrderNotes: (orderId: string, notes: string) => void
  setProductionNotes: (orderId: string, productionNotes: string) => void
  setServiceNotes: (orderId: string, serviceNotes: string) => void
  addInternalComment: (orderId: string, comment: AdminComment) => void
  setOrderOwnership: (orderId: string, ownerUserId: string, serviceOwnerUserId?: string) => void
  updateUploadOverride: (uploadId: string, patch: AdminUploadOverride) => void
  setUploadStatus: (uploadId: string, status: AdminUploadReviewStatus) => void
  setUploadReviewNotes: (uploadId: string, reviewNotes: string) => void
}

export const useAdminUiStore = create<AdminUiStore>()(
  persist(
    (set) => ({
      mobileSidebarOpen: false,
      orderOverrides: demoAdminOrderOverrides,
      uploadOverrides: demoAdminUploadOverrides,
      toggleMobileSidebar: () =>
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
      updateOrderOverride: (orderId, patch) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              ...patch,
            },
          },
        })),
      setOrderStatus: (orderId, status) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              status,
            },
          },
        })),
      setOrderPriority: (orderId, priority) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              priority,
            },
          },
        })),
      setPaymentStatus: (orderId, paymentStatus) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              paymentStatus,
            },
          },
        })),
      setProductionStatus: (orderId, productionStatus) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              productionStatus,
            },
          },
        })),
      setOrderNotes: (orderId, notes) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              notes,
            },
          },
        })),
      setProductionNotes: (orderId, productionNotes) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              productionNotes,
            },
          },
        })),
      setServiceNotes: (orderId, serviceNotes) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              serviceNotes,
            },
          },
        })),
      addInternalComment: (orderId, comment) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              internalComments: [...(state.orderOverrides[orderId]?.internalComments ?? []), comment],
            },
          },
        })),
      setOrderOwnership: (orderId, ownerUserId, serviceOwnerUserId) =>
        set((state) => ({
          orderOverrides: {
            ...state.orderOverrides,
            [orderId]: {
              ...state.orderOverrides[orderId],
              ownerUserId,
              serviceOwnerUserId: serviceOwnerUserId ?? state.orderOverrides[orderId]?.serviceOwnerUserId ?? ownerUserId,
            },
          },
        })),
      updateUploadOverride: (uploadId, patch) =>
        set((state) => ({
          uploadOverrides: {
            ...state.uploadOverrides,
            [uploadId]: {
              ...state.uploadOverrides[uploadId],
              ...patch,
            },
          },
        })),
      setUploadStatus: (uploadId, status) =>
        set((state) => ({
          uploadOverrides: {
            ...state.uploadOverrides,
            [uploadId]: {
              ...state.uploadOverrides[uploadId],
              status,
            },
          },
        })),
      setUploadReviewNotes: (uploadId, reviewNotes) =>
        set((state) => ({
          uploadOverrides: {
            ...state.uploadOverrides,
            [uploadId]: {
              ...state.uploadOverrides[uploadId],
              reviewNotes,
            },
          },
        })),
    }),
    {
      name: 'ridaosprint-admin-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orderOverrides: state.orderOverrides,
        uploadOverrides: state.uploadOverrides,
      }),
    },
  ),
)
