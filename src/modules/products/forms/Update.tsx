import { useEffect, type ReactNode } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import getApiError from '@common/utils/getApiError';
import { keepOptions } from '@/helpers';
import type * as ProductAttributes from '@/modules/product-attributes/types';

import { isPartialSaveError } from '../errors';
import useUpdate from '../hooks/useUpdate';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { productUpdateFormSchema, updateDefaultValues, type UpdateFormValues } from './schema';

interface IChildren extends UseFormReturn<UpdateFormValues> {
  isLoading: boolean;
}

interface IProps {
  product: Types.IEntity.Product;
  attributes?: ProductAttributes.ProductAttributes;
  children: (props: IChildren) => ReactNode;
  className?: string;
  onBeforeSubmit?: (values: UpdateFormValues, form: UseFormReturn<UpdateFormValues>) => boolean;
  /** Called when the static schema rejects the values. */
  onInvalid?: () => void;
  /** `error` is the raw mutation error — e.g. `PartialSaveError` when only variants / specs failed. */
  onError?: (message: string, error: unknown) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IEntity.Product, values: UpdateFormValues) => void;
}

const UpdateForm = ({
  product,
  attributes,
  children,
  className,
  onBeforeSubmit,
  onInvalid,
  onError,
  onSettled,
  onSuccess
}: IProps) => {
  const update = useUpdate();

  const form = useForm<UpdateFormValues>({
    defaultValues: updateDefaultValues,
    resolver: yupResolver(productUpdateFormSchema)
  });

  const { reset } = form;

  useEffect(() => {
    reset(Mappers.FormValues(product, attributes));
  }, [product, attributes, reset]);

  const onSubmit = form.handleSubmit(
    values => {
      if (onBeforeSubmit && !onBeforeSubmit(values, form)) return;

      update.mutate(
        {
          id: product.id,
          values,
          saved: { hadVariants: Boolean(attributes?.variants.length), hadSpecs: Boolean(attributes?.specGroups.length) }
        },
        {
          onSuccess: data => {
            onSuccess?.(data, values);
          },
          onError: error => {
            onError?.(getApiError(isPartialSaveError(error) ? error.cause : error).message || error.message, error);
          },
          onSettled: () => {
            form.reset({ ...form.getValues() }, { ...keepOptions });
            onSettled?.();
          }
        }
      );
    },
    () => onInvalid?.()
  );

  return (
    <FormProvider {...form}>
      <form className={className} onSubmit={onSubmit} noValidate>
        {children({ ...form, isLoading: update.isPending })}
      </form>
    </FormProvider>
  );
};

export default UpdateForm;
