import { toast } from '@/common/utils/toast';
import { common, products } from '@/locale/uz';

import { Group, Modal } from '@mantine/core';
import { Button } from '@/components/Button';

import { CreateForm } from '@/modules/products/forms';
import { Form } from '@/pages/Products/components/form';

import classes from './Form.module.css';

type IProps = {
  opened: boolean;
  onClose: () => void;
};

const Create = ({ opened, onClose }: IProps) => {
  return (
    <Modal centered opened={opened} onClose={onClose} title={products.addModal} size="xl">
      <CreateForm
        className={classes.form}
        onSuccess={() => {
          toast.success(products.createSuccess);
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
              <Button type="submit" title={common.create} loading={isLoading} />
            </Group>
          </>
        )}
      </CreateForm>
    </Modal>
  );
};

export default Create;
