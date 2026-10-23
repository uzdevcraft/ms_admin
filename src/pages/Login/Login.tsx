import { toast } from '@/common/utils/toast';

import { Button } from '@/components/Button';
import { Logo } from '@/layouts/components/Logo';
import { Center, Paper, Space, Stack, Title } from '@mantine/core';

import { login } from '@/locale/uz';
import { LoginForm } from '@/modules/auth/forms';
import { Form } from '@/pages/Login/components/form';

import classes from './Login.module.scss';

const Login = () => {
  return (
    <Center classNames={{ root: classes.center }}>
      <Paper classNames={{ root: classes.paper }}>
        <LoginForm
          onSuccess={() => toast.success('Muvaffaqiyatli kirdingiz')}
          onError={error => toast.error(error || 'Nimadir xato ketdi')}
        >
          {({ isLoading }) => (
            <Stack gap="lg">
              <Stack align="center" gap="md">
                <Logo />
                <Title order={2} className={classes.title}>
                  {login.title}
                </Title>
              </Stack>

              <Form />

              <Space />

              <Button type="submit" fullWidth size="md" loading={isLoading} title="Kirish" />
            </Stack>
          )}
        </LoginForm>
      </Paper>
    </Center>
  );
};

export default Login;
