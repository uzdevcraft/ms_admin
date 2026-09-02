import { Button, Group, Modal } from '@mantine/core';

import { toast } from '@/common/utils/toast';
import { categories, common } from '@/locale/uz';
import { UpdateForm } from '@/modules/categories/forms';
import type * as Types from '@/modules/categories/types';
import { Form } from '@/pages/Categories/components/form';

import classes from './Form.module.css';

type IProps = {
  opened: boolean;
  onClose: () => void;
  category: Types.IEntity.Category | null;
};

const Update = ({ opened, onClose, category }: IProps) => {
  if (!category) return null;

  return (
    <Modal centered opened={opened} onClose={onClose} title={categories.editModal} size="lg">
      <UpdateForm
        category={category}
        className={classes.form}
        onSuccess={() => {
          toast.success(categories.updateSuccess);
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
      </UpdateForm>
    </Modal>
  );
};

export default Update;
