import { type FormEvent, type ReactNode, useState } from "react";
import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { toast } from "@/common/utils/toast";

import { APP_NAME, APP_TAGLINE } from "@/config/brand";
import { storage, VITE_ADMIN_PASSWORD } from "@/common/services";

const ADMIN_PASSWORD = VITE_ADMIN_PASSWORD;

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [access, setAccess] = useState(storage.session.get("access") || false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const toastId = toast.loading("Logging in...");

    if (password === ADMIN_PASSWORD) {
      toast.success("Login successful", {
        id: toastId,
        description: "You are now logged in",
        closeButton: false,
      });
      storage.session.set("access", true);
      setAccess(true);
    } else {
      toast.error("Login failed", {
        id: toastId,
        description: "Invalid password",
        closeButton: false,
      });
      storage.session.set("access", false);
      setAccess(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin();
  };

  if (access) {
    return children;
  }

  return (
    <Center mih="100vh" p="md" bg="var(--mantine-color-body)">
      <Paper w={400} maw="100%" p="xl" radius="md" withBorder shadow="sm">
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={2}>{APP_NAME}</Title>
              <Text c="dimmed" size="sm">
                {APP_TAGLINE}
              </Text>
              <Text mt="xs" fw={500}>
                Login to the dashboard
              </Text>
            </Stack>

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftSection={<IconLock size={16} stroke={1.5} />}
              autoFocus
            />

            <Button type="submit" fullWidth>
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};

export default AuthProvider;
