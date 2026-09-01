import { toast } from '@/common/utils/toast';
import { common, products } from '@/locale/uz';

import type * as Types from '@/modules/products/types';

import { Button } from '@/components/Button';
import { Group, Modal } from '@mantine/core';

import { UpdateForm } from '@/modules/products/forms';
import { Form } from '@/pages/Products/components/form';

import classes from './Form.module.css';

type IProps = {
  opened: boolean;
  onClose: () => void;
  product: Types.IEntity.Product | null;
};

const Update = ({ opened, onClose, product }: IProps) => {
  if (!product) return null;

  return (
    <Modal opened={opened} onClose={onClose} title={products.editModal} size="xl">
      <UpdateForm
        product={product}
        className={classes.form}
        onSuccess={() => {
          toast.success(products.updateSuccess);
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
              <Button variant="default" title={common.cancel} onClick={onClose} />
              <Button type="submit" loading={isLoading} title={common.save} />
            </Group>
          </>
        )}
      </UpdateForm>
    </Modal>
  );
};

export default Update;
