// "use client";

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useRef, useState } from "react";

export function ComponentSignin() {
  const [openLoginModal, setOpenLoginModal] = useState(true); // Login modal opens by default
  const [openCreateAccountModal, setOpenCreateAccountModal] = useState(false);
  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const buttonStyle = {
    backgroundColor: 'rgba(0, 140, 210, 1)', // Darker shade of the original blue
    color: 'white',
    border: 'none',
  };

  return (
    <>
      {/* Login Modal (opens by default) */}
      <Modal
        show={openLoginModal}
        size="md"
        popup
        onClose={() => setOpenLoginModal(false)}
        initialFocus={emailInputRef}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Sign in to our platform
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                id="email"
                ref={emailInputRef}
                placeholder="name@student.kuleuven.be"
                required
                className="focus:border-[rgba(0,140,210,1)] focus:ring-0" // Custom border color on focus
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput
                id="password"
                type="password"
                required
                className="focus:border-[rgba(0,140,210,1)] focus:ring-0" // Custom border color on focus
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember"
                  className="text-[rgba(0,140,210,1)] checked:bg-[rgba(0,140,210,1)] focus:ring-[rgba(0,140,210,1)]"
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <button
                onClick={() => {
                  setOpenLoginModal(false); // Close Login modal
                  setOpenForgotPasswordModal(true); // Open Forgot Password modal
                }}
                className="text-sm text-[rgba(0,140,210,1)] underline hover:text-[rgba(0,140,210,1)]"
              >
                Lost Password?
              </button>
            </div>
            <div className="flex w-full justify-center">
              <Button
                style={buttonStyle}
                className="focus:ring-0 active:bg-[rgba(0,140,210,1)]"
              >
                Log in to your account
              </Button>
            </div>
            <div className="flex justify-center text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <button
                onClick={() => {
                  setOpenLoginModal(false); // Close Login modal
                  setOpenCreateAccountModal(true); // Open Create Account modal
                }}
                className="text-[rgba(0,140,210,1)] underline hover:text-[rgba(0,140,210,1)]"
              >
                Create account
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Create Account Modal */}
      <Modal
        show={openCreateAccountModal}
        size="md"
        popup
        onClose={() => setOpenCreateAccountModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Create an Account
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="first-name" value="First Name" />
              </div>
              <TextInput
                id="first-name"
                placeholder="First Name"
                required
                className="focus:border-[rgba(0,140,210,1)] focus:ring-0" // Custom border color on focus
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="last-name" value="Last Name" />
              </div>
              <TextInput
                id="last-name"
                placeholder="Last Name"
                required
                className="focus:border-[rgba(0,140,210,1)] focus:ring-0" // Custom border color on focus
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput
                id="username"
                placeholder="Username"
                required
                className="focus:border-[rgba(0,140,210,1)] focus:ring-0" // Custom border color on focus
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                id="email"
                placeholder="name@student.kuleuven.be"
                required
                className="focus:border-[rgba(0,140,210,1)] focus:ring-0" // Custom border color on focus
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Create password" />
              </div>
              <TextInput
                id="password"
                type="password"
                required
                className="focus:border-[rgba(0,140,210,1)] focus:ring-0" // Custom border color on focus
              />
            </div>
            <div className="flex w-full justify-center">
              <Button
                style={buttonStyle}
                className="focus:ring-0 active:bg-[rgba(0,140,210,1)]"
              >
                Create your account
              </Button>
            </div>
            <div className="flex justify-center text-sm font-medium text-gray-500 dark:text-gray-300">
              Already have an account?&nbsp;
              <button
                onClick={() => {
                  setOpenCreateAccountModal(false); // Close Create Account modal
                  setOpenLoginModal(true); // Open Login modal
                }}
                className="text-[rgba(0,140,210,1)] underline hover:text-[rgba(0,140,210,1)]"
              >
                Log in
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        show={openForgotPasswordModal}
        size="md"
        popup
        onClose={() => setOpenForgotPasswordModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Forgot Password
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="reset-email" value="Your email" />
              </div>
              <TextInput
                id="reset-email"
                placeholder="name@student.kuleuven.be"
                required
                className="focus:border-[rgba(0,140,210,1)] focus:ring-0" // Custom border color on focus
              />
            </div>
            <div className="flex w-full justify-center">
              <Button
                style={buttonStyle}
                className="focus:ring-0 active:bg-[rgba(0,140,210,1)]"
              >
                Send Reset Link
              </Button>
            </div>
            <div className="flex justify-center text-sm font-medium text-gray-500 dark:text-gray-300">
              Remembered your password?&nbsp;
              <button
                onClick={() => {
                  setOpenForgotPasswordModal(false); // Close Forgot Password modal
                  setOpenLoginModal(true); // Open Login modal
                }}
                className="text-[rgba(0,140,210,1)] underline hover:text-[rgba(0,140,210,1)]"
              >
                Log in
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
