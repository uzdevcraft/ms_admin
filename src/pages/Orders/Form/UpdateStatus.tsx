import { Button, Group, Modal, Stack, Text } from '@mantine/core';

import formatPrice from '@common/utils/formatPrice';
import { toast } from '@/common/utils/toast';
import { common, orders } from '@/locale/uz';
import { UpdateStatusForm } from '@/modules/orders/forms';
import type * as Types from '@/modules/orders/types';
import { Form } from '@/pages/Orders/components/form';

import classes from './Form.module.css';

type IProps = {
  opened: boolean;
  onClose: () => void;
  order: Types.IEntity.Order | null;
};

const UpdateStatus = ({ opened, onClose, order }: IProps) => {
  if (!order) return null;

  return (
    <Modal opened={opened} centered onClose={onClose} title={orders.updateStatusModal} size="md">
      <Stack gap="sm" mb="md">
        <Text size="sm">
          Buyurtma <strong>#{order.id}</strong> — {order.userFullName}
        </Text>
        <Text size="sm" c="dimmed">
          {orders.totalAmount(formatPrice(order.totalAmount))}
        </Text>
      </Stack>

      <UpdateStatusForm
        className={classes.form}
        order={order}
        onSuccess={() => {
          toast.success(orders.statusUpdated);
          onClose();
        }}
        onError={message => {
          toast.error(message || common.somethingWentWrong);
        }}
      >
        {({ isLoading }) => (
          <>
            <Form />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={onClose}>
                {common.cancel}
              </Button>
              <Button type="submit" loading={isLoading}>
                {common.save}
              </Button>
            </Group>
          </>
        )}
      </UpdateStatusForm>
    </Modal>
  );
};

export default UpdateStatus;
