import { useAuth, useFunctions } from "@/utils/reactfire";
import * as firebaseui from "firebaseui";
import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebaseui/dist/firebaseui.css";
import { httpsCallable } from "firebase/functions";

type FnParams = {
  email: string;
  password: string;
  displayName: string;
  profile: { location: string; bio: string };
};
type FnReturn = { status: string; message: string };

export default function LoginView() {
  const auth = useAuth();
  const functions = useFunctions();

  const [formData, setFormData] = useState<FnParams | Partial<FnParams>>({
    profile: { location: "", bio: "" },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await httpsCallable<FnParams, FnReturn>(
        functions,
        "common-createUser",
      )(formData as FnParams);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          console.log(authResult);

          auth.updateCurrentUser(authResult.user);
          return false; // Prevent redirect
        },
        signInFailure: function (authResult: firebaseui.auth.AuthUIError) {
          console.log(authResult);
        },
      },
      signInOptions: [
        // This array contains all the ways an user can authenticate in your application. For this example, is only by email.
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        },
      ],
      signInFlow: "popup",
      // credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    });
  }, []);

  return (
    <div className="font-[sans-serif]">
      <div className="fle-col flex min-h-screen items-center justify-center px-4 py-6">
        <div className="grid w-full max-w-6xl items-center gap-10 rounded-3xl bg-slate-200 p-10 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-800 lg:text-5xl lg:leading-[55px]">
              Seamless Login for Exclusive Access
            </h2>
            <p className="mt-6 text-sm text-gray-800">
              Immerse yourself in a hassle-free login journey with our
              intuitively designed login form. Effortlessly access your account.
            </p>
          </div>
          <div id="firebaseui-auth-container"></div>
          <div className="grid w-full max-w-6xl items-center gap-10 rounded-3xl bg-slate-200 p-10 md:grid-cols-2">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-800 lg:text-5xl lg:leading-[55px]">
                Create Your Account
              </h2>
              <p className="mt-6 text-sm text-gray-800">
                Join our platform by filling out the registration form
              </p>
            </div>
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
                  formData.email = e.target.value;
                  setFormData(formData);
                }}
                value={formData.email}
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
                  formData.password = e.target.value;
                  setFormData(formData);
                }}
                value={formData.password}
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
                  formData.displayName = e.target.value;
                  setFormData(formData);
                }}
                value={formData.displayName}
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
                  formData.profile!.location = e.target.value;
                  setFormData(formData);
                }}
                value={formData.profile?.location}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
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
                  formData.profile!.bio = e.target.value;
                  setFormData(formData);
                }}
                value={formData.profile?.bio}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}