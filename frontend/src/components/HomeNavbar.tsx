import { Navbar, NavbarBrand, Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function HomeNavbar() {
  return (
    <Navbar fluid>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8">
        <NavbarBrand href="/">
          <span className="text-3xl sm:text-4xl font-extrabold text-primary font-sans">UniGigs</span>
        </NavbarBrand>
        <div className="flex space-x-2 sm:space-x-4">
          <Button
            to={"login"}
            as={Link}
            color="surface-container"
            className="text-nowrap"
          >
            Log In
          </Button>

          <Button
            href={"login?register=1"}
            color="primary"
            className="text-nowrap"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </Navbar>
  );
}
