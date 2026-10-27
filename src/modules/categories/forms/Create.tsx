import type { ReactNode } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import getApiError from '@common/utils/getApiError';
import { keepOptions } from '@/helpers';

import useCreate from '../hooks/useCreate';
import type * as Types from '../types';
import { categoryFormSchema, defaultValues, type CreateFormValues } from './schema';

interface IChildren extends UseFormReturn<CreateFormValues> {
  isLoading: boolean;
}

interface IProps {
  children: (props: IChildren) => ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IEntity.Category) => void;
  /** Preset parent — "add subcategory" from a tree node. */
  parentId?: number | null;
}

const CreateForm = ({ children, className, onError, onSettled, onSuccess, parentId = null }: IProps) => {
  const create = useCreate();

  const form = useForm<CreateFormValues>({
    defaultValues: { ...defaultValues, parentId },
    resolver: yupResolver(categoryFormSchema)
  });

  const onSubmit = form.handleSubmit(values => {
    create.mutate(values, {
      onSuccess: data => {
        onSuccess?.(data);
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
