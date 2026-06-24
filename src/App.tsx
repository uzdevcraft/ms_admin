import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "./api";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { SupportOnlyRoute } from "./auth/SupportOnlyRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { CategoriesPage } from "./pages/Categories/CategoriesPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { LoginPage } from "./pages/Login/LoginPage";
import { OrdersPage } from "./pages/Orders/OrdersPage";
import { ProductsPage } from "./pages/Products/ProductsPage";
import { UserTestingPage } from "./pages/UserTesting/UserTestingPage";
import { UsersPage } from "./pages/Users/UsersPage";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  headings: { fontFamily: "Inter, system-ui, -apple-system, sans-serif" },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications position="top-right" />
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route element={<SupportOnlyRoute />}>
                      <Route
                        path="user-testing"
                        element={<UserTestingPage />}
                      />
                    </Route>
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
