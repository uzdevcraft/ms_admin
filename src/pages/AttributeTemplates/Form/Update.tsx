import { Button, Group, Modal } from '@mantine/core';

import { toast } from '@/common/utils/toast';
import { attributeTemplates as locale, common } from '@/locale/uz';
import { UpdateForm } from '@/modules/attribute-templates/forms';
import type * as Types from '@/modules/attribute-templates/types';
import { Form } from '@/pages/AttributeTemplates/components/form';

import classes from './Form.module.css';

type IProps = {
  opened: boolean;
  onClose: () => void;
  template: Types.IEntity.Template | null;
};

const Update = ({ opened, onClose, template }: IProps) => {
  if (!template) return null;

  return (
    <Modal centered opened={opened} onClose={onClose} title={locale.editModal} size="lg">
      <UpdateForm
        template={template}
        className={classes.form}
        onSuccess={() => {
          toast.success(locale.updateSuccess);
          onClose();
        }}
        onError={message => {
          toast.error(message || common.somethingWentWrong);
        }}
      >
        {({ isLoading }) => (
          <>
            <Form replaces />

            <Group justify="flex-end" mt="lg">
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
