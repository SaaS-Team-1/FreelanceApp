import { useSigninCheck } from "@/utils/reactfire";
import * as React from "react";

export const AuthWrapper = ({
  children,
  fallback,
  signedIn = false,
}: React.PropsWithChildren<{
  fallback: JSX.Element;
  signedIn?: boolean;
}>): JSX.Element => {
  const { data: signInCheckResult } = useSigninCheck();

  if (!children) {
    throw new Error("Children must be provided");
  }

  if (signInCheckResult?.signedIn === signedIn) {
    return children as JSX.Element;
  } else {
    return fallback;
  }
};
