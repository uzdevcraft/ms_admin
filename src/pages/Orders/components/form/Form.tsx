import { Stack } from '@mantine/core';

import * as Fields from '@/containers/Fields';
import { forms } from '@/locale/uz';
import { ORDER_STATUS_OPTIONS } from '@/modules/orders/forms';

export default function Form() {
  return (
    <Stack gap="sm">
      <Fields.Select name="status" label={forms.status} data={ORDER_STATUS_OPTIONS} />
    </Stack>
  );
}
