import { Button, Group, Modal } from '@mantine/core';

import { toast } from '@/common/utils/toast';
import { categories, common } from '@/locale/uz';
import { CreateForm } from '@/modules/categories/forms';
import type { CategoryIndex } from '@/modules/categories/tree';
import type * as Types from '@/modules/categories/types';
import { Form } from '@/pages/Categories/components/form';

import classes from './Form.module.css';

type IProps = {
  opened: boolean;
  onClose: () => void;
  /** "Add child" from a tree node; `null` — a new department. */
  parent: Types.IEntity.Category | null;
  index: CategoryIndex;
};

const Create = ({ opened, onClose, parent, index }: IProps) => (
  <Modal
    centered
    opened={opened}
    onClose={onClose}
    title={parent ? categories.addChildModal(parent.name) : categories.addModal}
    size="xl"
  >
    {/* Keyed by parent so the preset parent applies on every open. */}
    <CreateForm
      key={parent?.id ?? 0}
      parentId={parent?.id ?? null}
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
          <Form index={index} />

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
