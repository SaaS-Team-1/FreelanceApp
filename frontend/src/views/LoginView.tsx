import { useAuth, useFunctions } from "@/utils/reactfire";
import { useState, KeyboardEvent } from "react";
import "firebaseui/dist/firebaseui.css";
import { httpsCallable } from "firebase/functions";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

type RgParams = {
  email: string;
  password: string;
  displayName: string;
  profile: { location: string; bio: string };
};
type RgReturn = { status: string; message: string };

type LoginType = Pick<RgParams, "email" | "password">;

export default function LoginView() {
  const auth = useAuth();
  const functions = useFunctions();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [screen, setScreen] = useState<"register" | "login" | "forgot">(
    "login",
  );

  const [registrationForm, setRegistrationData] = useState<
    RgParams | Partial<RgParams>
  >({
    profile: { location: "", bio: "" },
  });
  const [loginForm, setLoginData] = useState<Partial<LoginType>>({
    email: "",
    password: "",
  });

  const [forgotForm, setForgotData] = useState<{ email?: string }>({
    email: "",
  });

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await httpsCallable<RgParams, RgReturn>(
        functions,
        "common-createUser",
      )(registrationForm as RgParams);
      if (result.data.status == "error") {
        setErrorMessage(result.data.message);
        return;
      }
      if (registrationForm.email && registrationForm.password) {
        await signInWithEmailAndPassword(
          auth,
          registrationForm.email,
          registrationForm.password,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.message ||
        (error.code
          ? `Registration failed: ${error.code}`
          : "An unexpected error occurred during registration");
      setErrorMessage(message);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSuccessMessage(null);

      if (forgotForm?.email) {
        await sendPasswordResetEmail(auth, loginForm.email as string);
      }
      setSuccessMessage("Email Sent!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.message ||
        (error.code
          ? `Login failed: ${error.code}`
          : "An unexpected error occurred during registration");
      setErrorMessage(message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (loginForm?.email && loginForm?.password) {
        await signInWithEmailAndPassword(
          auth,
          loginForm.email,
          loginForm.password,
        );
        navigate("/app");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.message ||
        (error.code
          ? `Login failed: ${error.code}`
          : "An unexpected error occurred during registration");
      setErrorMessage(message);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (screen == "login") {
        handleLogin(e);
      } else if (screen == "forgot") {
        handleForgot(e);
      } else {
        handleRegister(e);
      }
    }
  };

  const loginSection = (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold text-on-surface lg:text-5xl lg:leading-[55px]">
          Welcome Back
        </h2>
        <div className="flex flex-row justify-stretch">
          <p className="w-full text-sm text-on-surface">
            Sign in to access your account
          </p>
          <button
            onClick={() => setScreen("forgot")}
            className="w-fit text-nowrap text-sm text-on-surface underline"
            type="button"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-on-surface"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={(e) => {
              loginForm.email = e.target.value;
              setLoginData(loginForm);
            }}
            className="block w-full rounded-lg border-surface-dim bg-primary-container p-2.5 text-sm text-on-primary-container outline-none focus:border-0 focus:ring-4 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-on-surface"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={(e) => {
              loginForm.password = e.target.value;
              setLoginData(loginForm);
            }}
            className="block w-full rounded-lg border-surface-dim bg-primary-container p-2.5 text-sm text-on-primary-container outline-none focus:border-0 focus:ring-4 focus:ring-primary/20"
            required
          />
        </div>

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-on-primary hover:bg-primary/80"
          >
            Sign In
          </button>

          <button
            onClick={() => setScreen("register")}
            className="font-extrabold text-primary hover:underline"
            type="button"
          >
            Create New Account
          </button>
        </div>
      </form>
    </div>
  );
  const forgotSection = (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold text-on-surface lg:text-5xl lg:leading-[55px]">
          Forgot Password
        </h2>
      </div>

      <form onSubmit={handleForgot} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-on-surface"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={(e) => {
              loginForm.email = e.target.value;
              setForgotData(loginForm);
            }}
            className="block w-full rounded-lg border-surface-dim bg-primary-container p-2.5 text-sm text-on-primary-container outline-none focus:border-0 focus:ring-4 focus:ring-primary/20"
            required
          />
        </div>

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-on-primary hover:bg-primary/80"
          >
            Reset Password
          </button>

          <button
            onClick={() => setScreen("login")}
            className="font-extrabold text-primary hover:underline"
            type="button"
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );

  const registrationSection = (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold text-on-surface lg:text-5xl lg:leading-[55px]">
          Create Your Account
        </h2>
        <p className="mt-4 text-sm text-on-surface">
          Join our platform by filling out the registration form. Fields with an
          * are required
        </p>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-on-surface"
            >
              Email *
            </label>
            <input
              type="email"
              name="email"
              onChange={(e) => {
                registrationForm.email = e.target.value;
                setRegistrationData(registrationForm);
              }}
              className="block w-full rounded-lg border-surface-dim bg-primary-container p-2.5 text-sm text-on-primary-container outline-none focus:border-0 focus:ring-4 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label
              htmlFor="displayName"
              className="mb-2 block text-sm font-medium text-on-surface"
            >
              Display Name *
            </label>
            <input
              type="text"
              name="displayName"
              onChange={(e) => {
                registrationForm.displayName = e.target.value;
                setRegistrationData(registrationForm);
              }}
              className="block w-full rounded-lg border-surface-dim bg-primary-container p-2.5 text-sm text-on-primary-container outline-none focus:border-0 focus:ring-4 focus:ring-primary/20"
              required
              minLength={5}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-on-surface"
            >
              Password *
            </label>
            <input
              type="password"
              name="password"
              onChange={(e) => {
                registrationForm.password = e.target.value;
                setRegistrationData(registrationForm);
              }}
              className="block w-full rounded-lg border-surface-dim bg-primary-container p-2.5 text-sm text-on-primary-container outline-none focus:border-0 focus:ring-4 focus:ring-primary/20"
              required
              minLength={8}
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-on-surface"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              onChange={(e) => {
                registrationForm.profile!.location = e.target.value;
                setRegistrationData(registrationForm);
              }}
              className="block w-full rounded-lg border-surface-dim bg-primary-container p-2.5 text-sm text-on-primary-container outline-none focus:border-0 focus:ring-4 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium text-on-surface"
          >
            Bio
          </label>
          <textarea
            name="bio"
            onChange={(e) => {
              registrationForm.profile!.bio = e.target.value;
              setRegistrationData(registrationForm);
            }}
            className="block w-full rounded-lg border-surface-dim bg-primary-container p-2.5 text-sm text-on-primary-container outline-none focus:border-0 focus:ring-4 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-on-primary hover:bg-primary/80"
          >
            Create Account
          </button>

          <button
            onClick={() => setScreen("login")}
            className="font-extrabold text-primary hover:underline"
            type="button"
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );

  let child;
  switch (screen) {
    case "forgot":
      child = forgotSection;
      break;
    case "register":
      child = registrationSection;
      break;
    default:
      child = loginSection;
      break;
  }

  return (
    <div className="font-[sans-serif]" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex flex-col min-h-screen items-center justify-center px-4 py-6 space-y-4">
        {errorMessage && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span>
              <span className="font-medium">Error:</span> {errorMessage}
            </span>
            <button
              className="ml-4 inline-flex items-center text-sm text-red-700 underline hover:no-underline"
              onClick={() => setErrorMessage(null)}
            >
              Close
            </button>
          </Alert>
        )}
        {successMessage && (
          <Alert color="green" icon={HiInformationCircle}>
            <span>
              <span className="font-medium">Success: </span> {successMessage}
            </span>
            <button
              className="ml-4 inline-flex items-center text-sm text-red-700 underline hover:no-underline"
              onClick={() => setSuccessMessage(null)}
            >
              Close
            </button>
          </Alert>
        )}
        <div className="grid w-full max-w-2xl items-center gap-10 rounded-3xl bg-surface-container-low p-10">
          {child}
        </div>
      </div>
    </div>
  );
}
