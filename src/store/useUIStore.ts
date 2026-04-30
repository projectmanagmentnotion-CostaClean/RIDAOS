import { create } from 'zustand'

type UIStore = {
  loadingScopes: Record<string, boolean>
  errorScopes: Record<string, string | null>
  setLoading: (scope: string, loading: boolean) => void
  setError: (scope: string, message: string | null) => void
  clearError: (scope: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  loadingScopes: {},
  errorScopes: {},
  setLoading: (scope, loading) =>
    set((state) => ({
      loadingScopes: {
        ...state.loadingScopes,
        [scope]: loading,
      },
    })),
  setError: (scope, message) =>
    set((state) => ({
      errorScopes: {
        ...state.errorScopes,
        [scope]: message,
      },
    })),
  clearError: (scope) =>
    set((state) => ({
      errorScopes: {
        ...state.errorScopes,
        [scope]: null,
      },
    })),
}))
