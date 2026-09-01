import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../store";

interface ILocationState {
  from?: { pathname?: string };
}

/**
 * Guards guest-only routes (the login page): an authenticated user is sent
 * back where they came from, or to the dashboard.
 */
export function Guest({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    const state = location.state as ILocationState | null;
    return <Navigate to={state?.from?.pathname ?? "/"} replace />;
  }

  return <>{children}</>;
}

export default Guest;
