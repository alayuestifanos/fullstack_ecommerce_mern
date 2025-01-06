import { create } from 'zustand'

export const useUiStore = create((set) => ({
  cartOpen: false,
  authModalOpen: false,
  authModalMode: 'login',
  userDropdownOpen: false,

  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),
  setCartOpen: (open) => set({ cartOpen: open }),

  openAuthModal: (mode = 'login') =>
    set({ authModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ authModalOpen: false }),

  toggleUserDropdown: () =>
    set((s) => ({ userDropdownOpen: !s.userDropdownOpen })),
  setUserDropdown: (open) => set({ userDropdownOpen: open }),
}))
