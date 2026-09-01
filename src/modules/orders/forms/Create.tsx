import type { ReactNode } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import getApiError from '@common/utils/getApiError';
import { keepOptions } from '@/helpers';

import useCreate from '../hooks/useCreate';
import { defaultValues, orderFormSchema, type CreateFormValues } from './schema';

interface IChildren extends UseFormReturn<CreateFormValues> {
  isLoading: boolean;
}

interface IProps {
  children: (props: IChildren) => ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: () => void;
}

const CreateForm = ({ children, className, onError, onSettled, onSuccess }: IProps) => {
  const create = useCreate();

  const form = useForm<CreateFormValues>({
    defaultValues,
    resolver: yupResolver(orderFormSchema)
  });

  const onSubmit = form.handleSubmit(values => {
    create.mutate(values, {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: error => {
        onError?.(getApiError(error).message || error.message);
      },
      onSettled: () => {
        form.reset({ ...form.getValues() }, { ...keepOptions });
        onSettled?.();
      }
    });
  });

  return (
    <FormProvider {...form}>
      <form className={className} onSubmit={onSubmit}>
        {children({ ...form, isLoading: create.isPending })}
      </form>
    </FormProvider>
  );
};

export default CreateForm;
