import { Button, Group, Modal } from "@mantine/core";

import { toast } from "@/common/utils/toast";
import { common, products } from "@/locale/uz";
import * as ProductsModule from "@/modules/products";
import { Form } from "@/pages/Products/components/form";

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
      title={products.addModal}
      size="lg"
    >
      <ProductsModule.Forms.Create
        className={classes.form}
        onSuccess={() => {
          toast.success(products.createSuccess);
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
      </ProductsModule.Forms.Create>
    </Modal>
  );
};

export default Create;
