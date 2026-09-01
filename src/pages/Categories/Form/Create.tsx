import { toast } from '@/common/utils/toast';
import { categories, common } from '@/locale/uz';

import { Group, Modal } from '@mantine/core';
import { Button } from '@/components/Button';
import { CreateForm } from '@/modules/categories/forms';

import { Form } from '@/pages/Categories/components/form';

import classes from './Form.module.css';

type IProps = {
  opened: boolean;
  onClose: () => void;
};

const Create = ({ opened, onClose }: IProps) => {
  return (
    <Modal opened={opened} onClose={onClose} title={categories.addModal} size="xl">
      <CreateForm
        className={classes.form}
        onSuccess={() => {
          toast.success(categories.createSuccess);
          onClose();
        }}
        onError={message => {
          toast.error(message || common.somethingWentWrong);
        }}
      >
        {({ isLoading }) => (
          <>
            <Form />

            <Group justify="flex-end" mt="lg">
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
