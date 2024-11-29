import flowbite from "flowbite-react/tailwind";
import colors from "tailwindcss/colors";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f4f8fd",
          100: "#e8f1fb",
          200: "#c6ddf4",
          300: "#a3c8ed",
          400: "#5e9fe0",
          500: "#1976d2",
          600: "#176abd",
          700: "#13599e",
          800: "#0f477e",
          900: "#0c3a67",
          DEFAULT: "#1976d2", //500
          on: "#f4f8fd", //50
          dark: {
            DEFAULT: "#a3c8ed", //300
            on: "#0f477e", //800
          },
        },
        secondary: {
          50: "#f4fbfa",
          100: "#e9f6f5",
          200: "#c9e9e6",
          300: "#a8dbd7",
          400: "#67c1b8",
          500: "#26a69a",
          600: "#22958b",
          700: "#1d7d74",
          800: "#17645c",
          900: "#13514b",
          DEFAULT: "#26a69a", //500
          on: "#f4fbfa", //50
          dark: {
            DEFAULT: "#a8dbd7", //300
            on: "#17645c", //800
          },
        },
        tertiary: {
          50: "#faf4fb",
          100: "#f5e9f7",
          200: "#e6c9eb",
          300: "#d7a9df",
          400: "#ba68c8",
          500: "#9c27b0",
          600: "#8c239e",
          700: "#751d84",
          800: "#5e176a",
          900: "#4c1356",
          DEFAULT: "#9c27b0", //500
          on: "#faf4fb", //50
          dark: {
            DEFAULT: "#d7a9df", //300
            on: "#5e176a", //800
          },
        },
        error: {
          50: "#fcf2f3",
          100: "#f9e6e8",
          200: "#f0bfc5",
          300: "#e699a1",
          400: "#d44d5b",
          500: "#c10015",
          600: "#ae0013",
          700: "#910010",
          800: "#74000d",
          900: "#5f000a",
          DEFAULT: "#c10015", //500
          on: "#fcf2f3", //50
          dark: {
            DEFAULT: "#e699a1", //300
            on: "#74000d", //800
          },
        },
        surface: {
          50: colors.gray[50],
          100: colors.gray[100],
          200: colors.gray[200],
          300: colors.gray[300],
          400: colors.gray[400],
          500: colors.gray[500],
          600: colors.gray[600],
          700: colors.gray[700],
          800: colors.gray[800],
          900: colors.gray[900],
          DEFAULT: colors.gray[50], //50
          on: colors.gray[900], //900
          dark: {
            DEFAULT: colors.gray[900], //900
            on: colors.gray[50], //50
          },
        },
      },
    },
  },

  plugins: [flowbite.plugin()],
  darkMode: "class",
};
