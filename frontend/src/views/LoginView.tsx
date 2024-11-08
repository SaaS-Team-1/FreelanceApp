import { useAuth } from "@/utils/reactfire";
import * as firebaseui from "firebaseui";
import { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebaseui/dist/firebaseui.css";

export default function LoginView() {
  const auth = useAuth();
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
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full bg-slate-200 rounded-3xl p-10">
          <div>
            <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-gray-800">
              Seamless Login for Exclusive Access
            </h2>
            <p className="text-sm mt-6 text-gray-800">
              Immerse yourself in a hassle-free login journey with our
              intuitively designed login form. Effortlessly access your account.
            </p>
          </div>
          <div id="firebaseui-auth-container"></div>
        </div>
      </div>
    </div>
  );
}

// import { Auth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
// import {
//   SuspenseWithPerf,
//   useAuth,
//   useSigninCheck,
//   useUser,
// } from "@/utils/reactfire";
// import { Button } from "flowbite-react";
// import Loading from "@/components/Loading";

// const signOut = (auth: Auth) =>
//   auth.signOut().then(() => console.log("signed out"));
// const signIn = async (auth: Auth) => {
//   const provider = new GoogleAuthProvider();

//   await signInWithPopup(auth, provider);
// };
// const UserDetails = () => {
//   const auth = useAuth();
//   const { data: user } = useUser();

//   return (
//     <>
//       <CardSection title="Displayname">
//         {(user as User).displayName}
//       </CardSection>
//       <CardSection title="Providers">
//         <ul>
//           {(user as User).providerData?.map((profile) => (
//             <li key={profile?.providerId}>{profile?.providerId}</li>
//           ))}
//         </ul>
//       </CardSection>
//       <CardSection title="Sign Out">
//         <Button label="Sign Out" onClick={() => signOut(auth)} />
//       </CardSection>
//     </>
//   );
// };

// const SignInForm = () => {
//   const auth = useAuth();

//   return (
//     <CardSection title="Sign-in form">
//       <Button label="Sign in with Google" onClick={() => signIn(auth)} />
//     </CardSection>
//   );
// };
