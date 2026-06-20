import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Organization, OrgMembership } from '@shared/types'

interface OrgState {
  activeOrg: Organization | null
  memberships: OrgMembership[]

  // Actions
  setActiveOrg: (org: Organization | null) => void
  setMemberships: (memberships: OrgMembership[]) => void
  switchOrg: (orgId: string) => void
}

export const useOrgStore = create<OrgState>()(
  devtools(
    persist(
      (set, get) => ({
        activeOrg: null,
        memberships: [],

        setActiveOrg: (org) => {
          // Keep localStorage in sync for the axios interceptor
          if (org) {
            localStorage.setItem('dc_active_org', org.id)
          } else {
            localStorage.removeItem('dc_active_org')
          }
          set({ activeOrg: org })
        },

        setMemberships: (memberships) => {
          set({ memberships })
          // If no active org yet, default to first membership
          if (!get().activeOrg && memberships.length > 0) {
            const first = memberships[0].org
            localStorage.setItem('dc_active_org', first.id)
            set({ activeOrg: first })
          }
        },

        switchOrg: (orgId) => {
          const membership = get().memberships.find((m) => m.org.id === orgId)
          if (membership) {
            localStorage.setItem('dc_active_org', orgId)
            set({ activeOrg: membership.org })
          }
        },
      }),
      {
        name: 'dc-org-store',
        // Only persist the active org ID, not full objects (re-fetched on boot)
        partialize: (state) => ({ activeOrg: state.activeOrg }),
      }
    ),
    { name: 'org-store' }
  )
)

// Selectors
export const selectActiveOrg = (s: OrgState) => s.activeOrg
export const selectMemberships = (s: OrgState) => s.memberships
