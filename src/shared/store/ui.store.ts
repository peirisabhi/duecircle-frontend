import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UiState {
  isDarkMode: boolean
  isSidebarCollapsed: boolean
  isOnline: boolean

  // Actions
  toggleDarkMode: () => void
  setDarkMode: (value: boolean) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (value: boolean) => void
  setOnline: (value: boolean) => void
}

export const useUiStore = create<UiState>()(
  devtools(
    persist(
      (set) => ({
        isDarkMode: false,
        isSidebarCollapsed: false,
        isOnline: navigator.onLine,

        toggleDarkMode: () =>
          set((s) => {
            const next = !s.isDarkMode
            document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
            return { isDarkMode: next }
          }),

        setDarkMode: (value) => {
          document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light')
          set({ isDarkMode: value })
        },

        toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

        setSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),

        setOnline: (value) => set({ isOnline: value }),
      }),
      {
        name: 'dc-ui-prefs',
        partialize: (s) => ({
          isDarkMode: s.isDarkMode,
          isSidebarCollapsed: s.isSidebarCollapsed,
        }),
      }
    ),
    { name: 'ui-store' }
  )
)

// Selectors
export const selectIsDarkMode = (s: UiState) => s.isDarkMode
export const selectIsSidebarCollapsed = (s: UiState) => s.isSidebarCollapsed
export const selectIsOnline = (s: UiState) => s.isOnline
