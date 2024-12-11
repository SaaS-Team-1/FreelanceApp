import { CustomFlowbiteTheme } from "flowbite-react";

export const flowbiteTheme: CustomFlowbiteTheme = {
  badge: {
    root: {
      color: {
        primary: "bg-primary text-on-primary group-hover:bg-on-secondary/80",
        secondary:
          "bg-secondary text-on-secondary group-hover:bg-on-secondary/80",
        tertiary: "bg-tertiary text-on-tertiary group-hover:bg-on-secondary/80",
        error: "bg-error text-on-error group-hover:bg-on-secondary/80",
        "primary-container":
          "bg-primary-container text-on-primary-container group-hover:bg-primary-container/90",
        "secondary-container":
          "bg-secondary-container text-on-secondary-container group-hover:bg-secondary-container/90",
        "tertiary-container":
          "bg-tertiary-container text-on-tertiary-container group-hover:bg-tertiary-container/90",
        "surface-container":
          "bg-surface-container text-on-surface-container group-hover:bg-surface-container/90",
        yellow: "bg-amber-200 text-amber-700 group-hover:bg-on-secondary/80",
      },
    },
  },
  button: {
    color: {
      primary: "bg-primary text-on-primary group-hover:bg-on-secondary/80",
      secondary:
        "bg-secondary text-on-secondary group-hover:bg-on-secondary/80",
      tertiary: "bg-tertiary text-on-tertiary group-hover:bg-on-secondary/80",
      error: "bg-error text-on-error group-hover:bg-on-secondary/80",
      "primary-container":
        "bg-primary-container text-on-primary-container group-hover:bg-primary-container/90",
      "secondary-container":
        "bg-secondary-container text-on-secondary-container group-hover:bg-secondary-container/90",
      "tertiary-container":
        "bg-tertiary-container text-on-tertiary-container group-hover:bg-tertiary-container/90",
      "surface-container":
        "bg-surface-container text-on-surface-container group-hover:bg-surface-container/90",
      yellow: "bg-amber-200 text-amber-700 group-hover:bg-on-secondary/80",
    },
  },

  tabs: {
    base: "flex flex-col gap-2 rounded-lg bg-gray-800 p-4 shadow-md h-full",
    tablist: {
      base: "flex text-center  h-fit",
      variant: {
        default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
        underline:
          "-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700",
        pills:
          "flex-wrap space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400",
        fullWidth:
          "grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-sm font-medium shadow dark:divide-gray-700 dark:text-gray-400",
      },
      tabitem: {
        base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        variant: {
          default: {
            base: "rounded-t-lg ",
            active: {
              on: "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500",
              off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300",
            },
          },
          underline: {
            base: "rounded-t-lg",
            active: {
              on: "active rounded-t-lg border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500",
              off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
            },
          },
          pills: {
            base: "",
            active: {
              on: "rounded-lg bg-blue-600 text-white",
              off: "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
            },
          },
          fullWidth: {
            base: "ml-0 flex w-full rounded-none first:ml-0",
            active: {
              on: "active rounded-none bg-gray-100 p-4 text-gray-900 dark:bg-gray-700 dark:text-white",
              off: "rounded-none bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white",
            },
          },
        },
        icon: "mr-2 h-5 w-5",
      },
    },
    tabitemcontainer: {
      base: "",
      variant: {
        default: "",
        underline: "",
        pills: "",
        fullWidth: "",
      },
    },
    tabpanel: "py-3",
  },
  footer: {
    root: {
      base: "flex flex-col",
    },
    brand: {
      base: "m-6 flex items-center",
    },
    groupLink: {
      base: "flex flex-col flex-wrap text-gray-500 dark:text-white",
      link: {
        base: "mb-4 last:mr-0 md:mr-6",
      },
    },
    icon: {
      base: "text-gray-400 hover:text-gray-900 dark:hover:text-white",
    },
  },
  modal: {
    body: {
      base: "space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8",
    },
  },
  sidebar: {
    root: {
      base: "h-full bg-gray-50",
      inner:
        "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-gray-800",
    },
    collapse: {
      list: "space-y-2 py-2 list-none",
    },
    item: {
      base: "no-underline flex items-center rounded-lg p-2 text-lg font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    },
    itemGroup: {
      base: "list-none border-t border-gray-200 pt-3 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
    },
  },
  clipboard: {
    button: {
      base: "inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-3 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
      label: "text-center text-sm font-medium text-white sm:w-auto",
    },
    withIcon: {
      base: "end-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800",
      icon: {
        defaultIcon: "h-4 w-4",
        successIcon: "h-4 w-4 text-blue-700 dark:text-blue-500",
      },
    },
    withIconText: {
      base: "end-2.5 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
      icon: {
        defaultIcon: "me-1.5 h-3 w-3",
        successIcon: "me-1.5 h-3 w-3 text-blue-700 dark:text-blue-500",
      },
      label: {
        base: "inline-flex items-center",
        defaultText: "text-xs font-semibold",
        successText: "text-xs font-semibold text-blue-700 dark:text-blue-500",
      },
    },
  },
};
