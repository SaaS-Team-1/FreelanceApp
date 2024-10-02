/** @type {import('prettier').Config} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  // tailwindcss
  tailwindAttributes: ["theme"],
  tailwindFunctions: ["twMerge", "createTheme"],
};
