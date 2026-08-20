import { Button, Group, Modal } from "@mantine/core";

import { toast } from "@/common/utils/toast";
import { categories, common } from "@/locale/uz";
import * as CategoriesModule from "@/modules/categories";
import { Form } from "@/pages/Categories/components/form";

import classes from "./Form.module.css";

type IProps = {
  opened: boolean;
  onClose: () => void;
};

const Create = ({ opened, onClose }: IProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={categories.addModal}
      size="md"
    >
      <CategoriesModule.Forms.Create
        className={classes.form}
        onSuccess={() => {
          toast.success(categories.createSuccess);
          onClose();
        }}
        onError={(message) => {
          toast.error(message || common.somethingWentWrong);
        }}
      >
        {({ isLoading, register, control, formState: { errors } }) => (
          <>
            <Form register={register} control={control} errors={errors} />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={onClose}>
                {common.cancel}
              </Button>
              <Button type="submit" loading={isLoading}>
                {common.create}
              </Button>
            </Group>
          </>
        )}
      </CategoriesModule.Forms.Create>
    </Modal>
  );
};

export default Create;
