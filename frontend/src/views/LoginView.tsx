import { useAuth, useFunctions } from "@/utils/reactfire";
import { useState, KeyboardEvent } from "react";
import "firebaseui/dist/firebaseui.css";
import { httpsCallable } from "firebase/functions";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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

  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationForm, setRegistrationData] = useState<
    RgParams | Partial<RgParams>
  >({
    profile: { location: "", bio: "" },
  });
  const [loginForm, setLoginData] = useState<Partial<LoginType>>({
    email: "",
    password: "",
  });

  if (!loginForm) {
    return;
  }

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await httpsCallable<RgParams, RgReturn>(
        functions,
        "common-createUser",
      )(registrationForm as RgParams);
      setShowRegistration(false)
    } catch (error) {
      console.error("Registration error:", error);
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
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!showRegistration) {
        handleLogin(e);
      } else {
        handleRegister(e);
      }
    }
  };

  return (
    <div className="font-[sans-serif]" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="grid w-full max-w-2xl items-center gap-10 rounded-3xl bg-slate-200 p-10">
          {!showRegistration ? (
            // Login Section
            <div className="w-full space-y-6">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-800 lg:text-5xl lg:leading-[55px]">
                  Welcome Back
                </h2>
                <p className="mt-4 text-sm text-gray-600">
                  Sign in to access your account
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900"
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
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900"
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
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleLogin}
                    className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => setShowRegistration(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Create New Account
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Registration Section
            <div className="w-full space-y-6">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-800 lg:text-5xl lg:leading-[55px]">
                  Create Your Account
                </h2>
                <p className="mt-4 text-sm text-gray-600">
                  Join our platform by filling out the registration form
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={(e) => {
                        registrationForm.email = e.target.value;
                        setRegistrationData(registrationForm);
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="displayName"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      onChange={(e) => {
                        registrationForm.displayName = e.target.value;
                        setRegistrationData(registrationForm);
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      onChange={(e) => {
                        registrationForm.password = e.target.value;
                        setRegistrationData(registrationForm);
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 block text-sm font-medium text-gray-900"
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
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    onChange={(e) => {
                      registrationForm.profile!.bio = e.target.value;
                      setRegistrationData(registrationForm);
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleRegister}
                    className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Create Account
                  </button>

                  <button
                    onClick={() => setShowRegistration(false)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Already have an account? Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}