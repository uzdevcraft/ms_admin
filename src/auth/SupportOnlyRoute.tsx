import { Center, Loader } from '@mantine/core';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { SUPPORT_ADMIN_USERNAME } from '../config/supportAdmin';

export function SupportOnlyRoute() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader color="violet" size="lg" />
      </Center>
    );
  }

  if (session?.username !== SUPPORT_ADMIN_USERNAME) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
