import { DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";

export default function HomeNavbar() {
  return (
    <header className="fixed z-40 w-full">
      <Navbar fluid>
        <NavbarBrand href="/">
          <img
            alt="Logo"
            height="24"
            src="/favicon.ico"
            width="24"
            className="ml-2 mr-1 "
          />
          <span className="mt-1 self-center whitespace-nowrap px-1 text-xl font-semibold uppercase dark:text-white">
            Ai Classroom
          </span>
        </NavbarBrand>
        <DarkThemeToggle className="z-50" />
      </Navbar>
    </header>
  );
}
