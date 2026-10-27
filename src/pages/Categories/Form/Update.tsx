import { useMemo } from 'react';
import { Button, Center, Group, Loader, Modal } from '@mantine/core';

import { toast } from '@/common/utils/toast';
import { categories, common } from '@/locale/uz';
import { UpdateForm } from '@/modules/categories/forms';
import { useSingle } from '@/modules/categories/hooks';
import type { CategoryIndex } from '@/modules/categories/tree';
import type * as Types from '@/modules/categories/types';
import { Form } from '@/pages/Categories/components/form';

import classes from './Form.module.css';

type IProps = {
  opened: boolean;
  onClose: () => void;
  category: Types.IEntity.Category | null;
  index: CategoryIndex;
};

const Update = ({ opened, onClose, category, index }: IProps) => {
  // The tree has no `attributeTemplateId`; the single category does.
  const single = useSingle(category?.id ?? 0, opened);

  // Editable fields come from the single category; the tree keeps level, code and counts.
  // Memoized: the form resets whenever this object changes.
  const current = useMemo(() => {
    if (!category || !single.data) return category;
    const { name, nameUz, nameRu, description, imageUrl, isActive, sortOrder, attributeTemplateId, parentId } =
      single.data;
    return {
      ...category,
      name,
      nameUz,
      nameRu,
      description,
      imageUrl,
      isActive,
      sortOrder,
      attributeTemplateId,
      parentId: parentId ?? category.parentId
    };
  }, [category, single.data]);

  if (!category || !current) return null;

  return (
    <Modal centered opened={opened} onClose={onClose} title={categories.editModal} size="xl">
      {single.isLoading ? (
        <Center py="xl">
          <Loader size="sm" />
        </Center>
      ) : (
        <UpdateForm
          category={current}
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
              <Form index={index} categoryId={category.id} />

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
      )}
    </Modal>
  );
};

export default Update;
