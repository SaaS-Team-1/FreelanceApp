import { Navbar, NavbarBrand, Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";



export default function HomeNavbar() {

  return (
    <header className="fixed z-40 w-full bg-surface-container shadow-lg">
      <Navbar fluid>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <NavbarBrand href="/">
            <img
              alt="Logo"
              height="24"
              src="/favicon.ico"
              width="24"
              className="ml-2 mr-2"
            />
            <span className="text-2xl font-bold text-primary">
              UniGigs
            </span>
          </NavbarBrand>
          <div className="flex space-x-4">
              <Button
                to={"app"} as={Link}
                color="color-on-primary"
                className="hover:bg-slate-200"
              >
                Log In
              </Button>

              <Button
                to={"app"} as={Link}
                color="primary"
                className="hover:opacity-80"
              >
                Sign Up
              </Button>

          </div>
        </div>
      </Navbar>
    </header>
  );
}