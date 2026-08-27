import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";

import { useMemo } from "react";

import { Toaster } from "sonner";
import { AuthProvider } from "@/containers";
import { ModalsProvider } from "@mantine/modals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider, localStorageColorSchemeManager } from "@mantine/core";

import getRoutesData from "./router";

import { COLOR_SCHEME_STORAGE_KEY, theme } from "@/theme";

const colorSchemeManager = localStorageColorSchemeManager({
  key: COLOR_SCHEME_STORAGE_KEY,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  const routes = getRoutesData();

  const router = useMemo(() => {
    return createBrowserRouter(routes);
  }, [routes]);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={theme}
        defaultColorScheme="dark"
        colorSchemeManager={colorSchemeManager}
      >
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <ModalsProvider>
            <RouterProvider router={router} />
          </ModalsProvider>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
