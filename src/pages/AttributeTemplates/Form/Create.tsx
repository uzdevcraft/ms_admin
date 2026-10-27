import { Button, Group, Modal } from '@mantine/core';

import { toast } from '@/common/utils/toast';
import { attributeTemplates as locale, common } from '@/locale/uz';
import { CreateForm } from '@/modules/attribute-templates/forms';
import { Form } from '@/pages/AttributeTemplates/components/form';

import classes from './Form.module.css';

type IProps = {
  opened: boolean;
  onClose: () => void;
};

const Create = ({ opened, onClose }: IProps) => (
  <Modal centered opened={opened} onClose={onClose} title={locale.addModal} size="lg">
    <CreateForm
      className={classes.form}
      onSuccess={() => {
        toast.success(locale.createSuccess);
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
            <Button variant="default" onClick={onClose}>
              {common.cancel}
            </Button>
            <Button type="submit" loading={isLoading}>
              {common.create}
            </Button>
          </Group>
        </>
      )}
    </CreateForm>
  </Modal>
);

export default Create;
