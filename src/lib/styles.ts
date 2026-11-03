export const THEMES = {
  LIGHT: "booknook-light",
  DARK: "booknook-dark",
} as const;

export type ThemeType = (typeof THEMES)[keyof typeof THEMES];

export const STYLES = {
  heading: {
    hero: "font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-base-content leading-tight",
    main: "font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-base-content leading-snug",
    section: "font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-base-content",
    sub: "font-serif text-xl sm:text-2xl font-semibold text-base-content/90",
    eyebrow: "text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary mb-2",
  },
  section: {
    container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20",
    compact: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12",
    padded: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24",
  },
  button: {
    primary:
      "inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm sm:text-base px-6 py-3 rounded-lg bg-primary text-primary-content shadow-sm hover:shadow-md hover:brightness-110 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm sm:text-base px-6 py-3 rounded-lg bg-secondary text-secondary-content shadow-sm hover:shadow-md hover:brightness-110 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm sm:text-base px-6 py-3 rounded-lg border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-content active:scale-[0.98] transition-all duration-200 cursor-pointer",
    ghost:
      "inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm sm:text-base px-4 py-2 rounded-lg text-base-content/80 hover:text-base-content hover:bg-base-200 transition-colors duration-200 cursor-pointer",
  },
  card: {
    cozy: "bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200",
    shelf: "bg-base-200/60 border border-base-300 rounded-2xl p-6 sm:p-8 backdrop-blur-sm",
  },
} as const;
