import { Button, Group, Modal } from "@mantine/core";

import { toast } from "@/common/utils/toast";
import { categories, common } from "@/locale/uz";
import * as CategoriesModule from "@/modules/categories";
import type * as Types from "@/modules/categories/types";
import { Form } from "@/pages/Categories/components/form";

import classes from "./Form.module.css";

type IProps = {
  opened: boolean;
  onClose: () => void;
  category: Types.IEntity.Category | null;
};

const Update = ({ opened, onClose, category }: IProps) => {
  if (!category) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={categories.editModal}
      size="md"
    >
      <CategoriesModule.Forms.Update
        className={classes.form}
        category={category}
        onSuccess={() => {
          toast.success(categories.updateSuccess);
          onClose();
        }}
        onError={(message) => {
          toast.error(message || common.somethingWentWrong);
        }}
      >
        {({ isLoading, register, control, formState: { errors } }) => (
          <>
            <Form
              register={register}
              control={control}
              errors={errors}
              showId
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={onClose}>
                {common.cancel}
              </Button>
              <Button type="submit" loading={isLoading}>
                {common.saveChanges}
              </Button>
            </Group>
          </>
        )}
      </CategoriesModule.Forms.Update>
    </Modal>
  );
};

export default Update;
