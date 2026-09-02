import { Stack } from '@mantine/core';
import { IconLock, IconUser } from '@tabler/icons-react';

import * as Fields from '@/containers/Fields';

export default function Form() {
  return (
    <Stack gap="lg">
      <Fields.Text
        size="md"
        name="username"
        label="Username"
        placeholder="Peshmat"
        leftSection={<IconUser size={16} stroke={1.5} />}
        autoFocus
      />

      <Fields.Password
        size="md"
        label="Parol"
        name="password"
        placeholder="1234"
        leftSection={<IconLock size={16} stroke={1.5} />}
      />
    </Stack>
  );
}
