import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  darkMode: ["false"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary))",
        "surface-tint": "rgb(var(--color-surface-tint))",
        "on-primary": "rgb(var(--color-on-primary))",
        "primary-container": "rgb(var(--color-primary-container))",
        "on-primary-container": "rgb(var(--color-on-primary-container))",
        secondary: "rgb(var(--color-secondary))",
        "on-secondary": "rgb(var(--color-on-secondary))",
        "secondary-container": "rgb(var(--color-secondary-container))",
        "on-secondary-container": "rgb(var(--color-on-secondary-container))",
        tertiary: "rgb(var(--color-tertiary))",
        "on-tertiary": "rgb(var(--color-on-tertiary))",
        "tertiary-container": "rgb(var(--color-tertiary-container))",
        "on-tertiary-container": "rgb(var(--color-on-tertiary-container))",
        error: "rgb(var(--color-error))",
        "on-error": "rgb(var(--color-on-error))",
        "error-container": "rgb(var(--color-error-container))",
        "on-error-container": "rgb(var(--color-on-error-container))",
        background: "rgb(var(--color-background))",
        "on-background": "rgb(var(--color-on-background))",
        surface: "rgb(var(--color-surface))",
        "on-surface": "rgb(var(--color-on-surface))",
        "surface-variant": "rgb(var(--color-surface-variant))",
        "on-surface-variant": "rgb(var(--color-on-surface-variant))",
        outline: "rgb(var(--color-outline))",
        "outline-variant": "rgb(var(--color-outline-variant))",
        shadow: "rgb(var(--color-shadow))",
        scrim: "rgb(var(--color-scrim))",
        "inverse-surface": "rgb(var(--color-inverse-surface))",
        "inverse-on-surface": "rgb(var(--color-inverse-on-surface))",
        "inverse-primary": "rgb(var(--color-inverse-primary))",
        "primary-fixed": "rgb(var(--color-primary-fixed))",
        "on-primary-fixed": "rgb(var(--color-on-primary-fixed))",
        "primary-fixed-dim": "rgb(var(--color-primary-fixed-dim))",
        "on-primary-fixed-variant":
          "rgb(var(--color-on-primary-fixed-variant))",
        "secondary-fixed": "rgb(var(--color-secondary-fixed))",
        "on-secondary-fixed": "rgb(var(--color-on-secondary-fixed))",
        "secondary-fixed-dim": "rgb(var(--color-secondary-fixed-dim))",
        "on-secondary-fixed-variant":
          "rgb(var(--color-on-secondary-fixed-variant))",
        "tertiary-fixed": "rgb(var(--color-tertiary-fixed))",
        "on-tertiary-fixed": "rgb(var(--color-on-tertiary-fixed))",
        "tertiary-fixed-dim": "rgb(var(--color-tertiary-fixed-dim))",
        "on-tertiary-fixed-variant":
          "rgb(var(--color-on-tertiary-fixed-variant))",
        "surface-dim": "rgb(var(--color-surface-dim))",
        "surface-bright": "rgb(var(--color-surface-bright))",
        "surface-container-lowest":
          "rgb(var(--color-surface-container-lowest))",
        "surface-container-low": "rgb(var(--color-surface-container-low))",
        "surface-container": "rgb(var(--color-surface-container))",
        "surface-container-high": "rgb(var(--color-surface-container-high))",
        "surface-container-highest":
          "rgb(var(--color-surface-container-highest))",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
