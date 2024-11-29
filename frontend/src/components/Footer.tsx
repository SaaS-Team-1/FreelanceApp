import { Footer, FooterBrand } from "flowbite-react";

export default function DefaultFooter() {
  return (
    <Footer
      container
      theme={{
        root: {
          base: "fixed inset-x-0 bottom-0 w-full bg-white shadow dark:bg-gray-800",
          container: "h-min-3 h-fit w-full",
          bgDark: "bg-gray-800",
        },
      }}
    >
      <div className="w-full text-center">
        <div className="flex w-full items-center justify-between">
          <FooterBrand
            href="/"
            src="/favicon.ico"
            alt="BoxCutter Logo"
            theme={{ img: "mr-2 h-5" }}
          />
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400 sm:text-center">
            Built using {"\u00A0"}
            <a
              href="https://github.com/florianfesti/boxes"
              className="text-gray-600 hover:underline dark:text-gray-100"
              target="_blank"
              rel="noreferrer"
            >
              Boxes.py
            </a>
            {"\u00A0"} and {"\u00A0"}
            <a
              href="https://flowbite.com/"
              className="text-gray-600 hover:underline dark:text-gray-100"
              target="_blank"
              rel="noreferrer"
            >
              Flowbite
            </a>
          </span>
        </div>
      </div>
    </Footer>
  );
}
