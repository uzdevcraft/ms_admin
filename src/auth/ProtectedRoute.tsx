import { Center, Loader } from '@mantine/core';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader color="violet" size="lg" />
      </Center>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
