import { useEffect, type ReactNode } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";

import getApiError from "@common/utils/getApiError";
import { keepOptions } from "@/helpers";

import useUpdate from "../hooks/useUpdate";
import type * as Types from "../types";
import {
  productUpdateFormSchema,
  updateDefaultValues,
  type UpdateFormValues,
} from "./schema";

interface IChildren extends UseFormReturn<UpdateFormValues> {
  isLoading: boolean;
}

interface IProps {
  product: Types.IEntity.Product;
  children: (props: IChildren) => ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IEntity.Product) => void;
}

const toFormValues = (
  product: Types.IEntity.Product,
): UpdateFormValues => ({
  id: product.id,
  categoryId: product.categoryId,
  name: product.name,
  nameUz: product.nameUz,
  nameRu: product.nameRu,
  description: product.description,
  descriptionUz: product.descriptionUz,
  descriptionRu: product.descriptionRu,
  price: product.price,
  discountPrice: product.discountPrice,
  imageUrl: product.imageUrl,
  stockQuantity: product.stockQuantity,
  isActive: product.isActive,
  sortOrder: product.sortOrder,
});

const UpdateForm = ({
  product,
  children,
  className,
  onError,
  onSettled,
  onSuccess,
}: IProps) => {
  const update = useUpdate();

  const form = useForm<UpdateFormValues>({
    defaultValues: updateDefaultValues,
    resolver: yupResolver(productUpdateFormSchema),
  });

  useEffect(() => {
    form.reset(toFormValues(product));
  }, [product, form.reset]);

  const onSubmit = form.handleSubmit((values) => {
    update.mutate(
      { id: product.id, values },
      {
        onSuccess: (data) => {
          onSuccess?.(data);
        },
        onError: (error) => {
          onError?.(getApiError(error).message || error.message);
        },
        onSettled: () => {
          form.reset({ ...form.getValues() }, { ...keepOptions });
          onSettled?.();
        },
      },
    );
  });

  return (
    <FormProvider {...form}>
      <form className={className} onSubmit={onSubmit}>
        {children({ ...form, isLoading: update.isPending })}
      </form>
    </FormProvider>
  );
};

export default UpdateForm;
