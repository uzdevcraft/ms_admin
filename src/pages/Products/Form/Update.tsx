import { Button, Group, Modal } from "@mantine/core";

import { toast } from "@/common/utils/toast";
import { common, products } from "@/locale/uz";
import * as ProductsModule from "@/modules/products";
import type * as Types from "@/modules/products/types";
import { Form } from "@/pages/Products/components/form";

import classes from "./Form.module.css";

type IProps = {
  opened: boolean;
  onClose: () => void;
  product: Types.IEntity.Product | null;
};

const Update = ({ opened, onClose, product }: IProps) => {
  if (!product) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={products.editModal}
      size="lg"
    >
      <ProductsModule.Forms.Update
        className={classes.form}
        product={product}
        onSuccess={() => {
          toast.success(products.updateSuccess);
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
      </ProductsModule.Forms.Update>
    </Modal>
  );
};

export default Update;
