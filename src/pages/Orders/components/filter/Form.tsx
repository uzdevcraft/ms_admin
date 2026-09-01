import * as Fields from '@/containers/Fields';

import { forms, orders } from '@/locale/uz';

import { ORDER_STATUS_OPTIONS } from '@/modules/orders/forms';

export default function Form() {
  return (
    <Fields.Select
      name="status"
      aria-label={forms.status}
      placeholder={orders.allStatuses}
      data={ORDER_STATUS_OPTIONS}
      clearable
    />
  );
}
