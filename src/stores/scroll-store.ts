import { create } from "zustand";

// Navbar theme: "dark" = dark background (use light/white text), "light" = light background (use dark text)
type NavbarTheme = "dark" | "light";

interface ScrollState {
  scrollY: number;
  setScrollY: (y: number) => void;
  navbarTheme: NavbarTheme;
  setNavbarTheme: (theme: NavbarTheme) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollY: 0,
  setScrollY: (y) => set({ scrollY: y }),
  navbarTheme: "dark",
  setNavbarTheme: (theme) => set({ navbarTheme: theme }),
}));
