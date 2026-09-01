import { Button, Center, Paper, Stack, Text } from '@mantine/core';

import { toast } from '@/common/utils/toast';
import Logo from '@/layouts/components/Logo';
import { common, login as loginLocale } from '@/locale/uz';
import { LoginForm } from '@/modules/auth/forms';
import { Form } from '@/pages/Login/components/form';

const Login = () => {
  return (
    <Center mih="100vh" p="md" bg="var(--mantine-color-body)">
      <Paper w={400} maw="100%" p="xl" radius="md" withBorder shadow="md">
        <LoginForm
          onSuccess={() => toast.success(loginLocale.success)}
          onError={error => toast.error(error || common.somethingWentWrong)}
        >
          {({ isLoading }) => (
            <Stack gap="lg">
              <Stack align="center" gap={4}>
                <Logo />
                <Text fw={500}>{loginLocale.title}</Text>
              </Stack>

              <Form />

              <Button type="submit" fullWidth loading={isLoading}>
                {common.signIn}
              </Button>
            </Stack>
          )}
        </LoginForm>
      </Paper>
    </Center>
  );
};

export default Login;
