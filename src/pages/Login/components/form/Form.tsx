import { IconLock, IconUser } from '@tabler/icons-react';
import { Stack } from '@mantine/core';

import * as Fields from '@/containers/Fields';
import { common } from '@/locale/uz';

export default function Form() {
  return (
    <Stack gap="lg">
      <Fields.Text
        name="username"
        label={common.username}
        placeholder={common.usernamePlaceholder}
        leftSection={<IconUser size={16} stroke={1.5} />}
        autoFocus
      />

      <Fields.Password
        name="password"
        label={common.password}
        placeholder={common.passwordPlaceholder}
        leftSection={<IconLock size={16} stroke={1.5} />}
      />
    </Stack>
  );
}
