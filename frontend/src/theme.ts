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
    base: "flex flex-col gap-2 rounded-xl bg-surface-container h-full text-on-surface ",
    tablist: {
      base: "flex text-center rounded-t-xl overflow-hidden h-fit",
      variant: {
        default: "flex-wrap rounded-t-xl",
        fullWidth:
          "grid w-full grid-flow-col rounded-t-xl text-sm font-medium",
      },
      tabitem: {
        base: "flex border-gray-300  border-b border-x items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        variant: {
          default: {
            base: "rounded-t-lg ",
            active: {
              on: "bg-gray-100 text-primary dark:bg-gray-800 dark:text-blue-500",
              off: "text-secondary hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300",
            },
          },
          fullWidth: {
            base: "ml-0 flex w-full first:ml-0 first:border-l-0 last:border-r-0",
            active: {
              on: "active bg-primary-container p-4 text-primary",
              off: "text-on-surface hover:bg-surface-container-highest hover:text-on-surface/50",
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
    root: {
      base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
      show: {
        on: "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
        off: "hidden",
      },
      sizes: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
      },
      positions: {
        "top-left": "items-start justify-start",
        "top-center": "items-start justify-center",
        "top-right": "items-start justify-end",
        "center-left": "items-center justify-start",
        center: "items-center justify-center",
        "center-right": "items-center justify-end",
        "bottom-right": "items-end justify-end",
        "bottom-center": "items-end justify-center",
        "bottom-left": "items-end justify-start",
      },
    },
    content: {
      
      base: "relative h-full w-full p-4 md:h-auto",
      inner:
        "relative flex max-h-[90dvh] flex-col rounded-xl bg-white shadow dark:bg-gray-700",
    },
    body: {
      base: "flex-1 overflow-auto p-6",
      popup: "pt-0",
    },
    header: {
      base: "flex items-start justify-between rounded-t-xl p-5 dark:border-gray-600 bg-primary-container",
      popup: "border-b-0 p-2",
      title: "text-2xl font-bold text-on-primary-container lg:text-4xl",
      close: {
        base: "ml-auto inline-flex items-center rounded-xl bg-transparent p-1.5 text-sm text-on-primary-container hover:bg-primary-container/50 hover:text-on-primary-container/50",
        icon: "h-5 w-5",
      },
    },
    footer: {
      base: "flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600",
      popup: "border-t",
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
  datepicker: {
    root: {
      base: "relative",
      input: {
        field: {
          input: {
            colors: {
              "surface-container":
                "bg-surface-container text-on-surface-container group-hover:bg-surface-container/90 border-0 focus:ring-0 focus:bg-surface-container-highest",
            },
          },
        },
      },
    },
    popup: {
      root: {
        base: "absolute -top-96 z-50 block pt-2",
        inline: "relative top-0 z-auto",
        inner:
          "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700",
      },
      header: {
        base: "",
        title:
          "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
        selectors: {
          base: "mb-2 flex justify-between",
          button: {
            base: "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
            prev: "",
            next: "",
            view: "",
          },
        },
      },
      view: {
        base: "p-1",
      },
      footer: {
        base: "mt-2 flex space-x-2",
        button: {
          base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-cyan-300",
          today:
            "bg-primary text-white hover:bg-primary/80 dark:bg-primary/60 dark:hover:bg-primary",
          clear:
            "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
        },
      },
    },
    views: {
      days: {
        header: {
          base: "mb-1 grid grid-cols-7",
          title:
            "h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400",
        },
        items: {
          base: "grid w-64 grid-cols-7",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-primary text-white hover:bg-primary/60",
            disabled: "text-gray-500",
          },
        },
      },
      months: {
        items: {
          base: "grid w-64 grid-cols-4",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-primary text-white hover:bg-primary/60",
            disabled: "text-gray-500",
          },
        },
      },
      years: {
        items: {
          base: "grid w-64 grid-cols-4",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-primary text-white hover:bg-primary/60",
            disabled: "text-gray-500",
          },
        },
      },
      decades: {
        items: {
          base: "grid w-64 grid-cols-4",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-primary text-white hover:bg-primary/60",
            disabled: "text-gray-500",
          },
        },
      },
    },
  },
};
