import type { ReactNode } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import getApiError from '@common/utils/getApiError';
import { keepOptions } from '@/helpers';

import useCreate from '../hooks/useCreate';
import type * as Types from '../types';
import { defaultValues, productFormSchema, type CreateFormValues } from './schema';

interface IChildren extends UseFormReturn<CreateFormValues> {
  isLoading: boolean;
}

interface IProps {
  children: (props: IChildren) => ReactNode;
  className?: string;
  /** Extra checks that depend on server data (required category attributes, variants). Return false to stop. */
  onBeforeSubmit?: (values: CreateFormValues, form: UseFormReturn<CreateFormValues>) => boolean;
  /** Called when the static schema rejects the values. */
  onInvalid?: () => void;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IEntity.Product, values: CreateFormValues) => void;
}

const CreateForm = ({ children, className, onBeforeSubmit, onInvalid, onError, onSettled, onSuccess }: IProps) => {
  const create = useCreate();

  const form = useForm<CreateFormValues>({
    defaultValues,
    resolver: yupResolver(productFormSchema)
  });

  const onSubmit = form.handleSubmit(
    values => {
      if (onBeforeSubmit && !onBeforeSubmit(values, form)) return;

      create.mutate(values, {
        onSuccess: data => {
          onSuccess?.(data, values);
        },
        onError: error => {
          onError?.(getApiError(error).message || error.message);
        },
        onSettled: () => {
          form.reset({ ...form.getValues() }, { ...keepOptions });
          onSettled?.();
        }
      });
    },
    () => onInvalid?.()
  );

  return (
    <FormProvider {...form}>
      <form className={className} onSubmit={onSubmit} noValidate>
        {children({ ...form, isLoading: create.isPending })}
      </form>
    </FormProvider>
  );
};

export default CreateForm;
