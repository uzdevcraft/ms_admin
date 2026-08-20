import { type ReactNode } from "react";

import { useLogin } from "@/modules/auth/hooks";
// import { useAuthStore } from "@/modules/auth/store";
import { Splash } from "@/components/Splash";

export function Auth({ children }: { children: ReactNode }) {
  const { isLoggingIn } = useLogin();
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoggingIn) {
    // return <h1>Logging in...</h1>;
    return <Splash />;
  }

  // if (!isAuthenticated) {
  //   return <h1>Not Authenticated</h1>;
  // }

  return <>{children}</>;
}
