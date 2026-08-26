import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconLock, IconUser } from "@tabler/icons-react";
import { toast } from "@/common/utils/toast";
import getApiError from "@/common/utils/getApiError";

import { APP_NAME, APP_TAGLINE } from "@/config/brand";
import { storage } from "@/common/services";
import { useLogin } from "@/modules/auth/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { common } from "@/locale/uz";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [access, setAccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: login, isPending } = useLogin();

  useEffect(() => {
    const token = storage.local.get("accessToken");
    if (token) {
      useAuthStore.setState({ accessToken: token, isAuthenticated: true });
      setAccess(true);
    }
  }, []);

  const handleLogin = async () => {
    const toastId = toast.loading("Kirish...");

    try {
      await login({ username, password });
      toast.success("Muvaffaqiyatli kirdingiz", {
        id: toastId,
        closeButton: false,
      });
      setAccess(true);
    } catch (error: unknown) {
      toast.error(getApiError(error).message || common.somethingWentWrong, {
        id: toastId,
        closeButton: false,
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleLogin();
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
                Boshqaruv paneliga kirish
              </Text>
            </Stack>

            <TextInput
              label={common.username}
              placeholder={common.usernamePlaceholder}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              leftSection={<IconUser size={16} stroke={1.5} />}
              autoFocus
            />

            <PasswordInput
              label={common.password}
              placeholder={common.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftSection={<IconLock size={16} stroke={1.5} />}
            />

            <Button type="submit" fullWidth loading={isPending}>
              {common.signIn}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};

export default AuthProvider;
