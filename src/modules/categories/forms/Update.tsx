import { useEffect, type ReactNode } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import getApiError from '@common/utils/getApiError';
import { keepOptions } from '@/helpers';

import useUpdate from '../hooks/useUpdate';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { categoryUpdateFormSchema, updateDefaultValues, type UpdateFormValues } from './schema';

interface IChildren extends UseFormReturn<UpdateFormValues> {
  isLoading: boolean;
}

interface IProps {
  category: Types.IEntity.Category;
  children: (props: IChildren) => ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IEntity.Category) => void;
}

const UpdateForm = ({ category, children, className, onError, onSettled, onSuccess }: IProps) => {
  const update = useUpdate();

  const form = useForm<UpdateFormValues>({
    defaultValues: updateDefaultValues,
    resolver: yupResolver(categoryUpdateFormSchema)
  });

  const { reset } = form;

  useEffect(() => {
    reset(Mappers.FormValues(category));
  }, [category, reset]);

  const onSubmit = form.handleSubmit(values => {
    update.mutate(
      { id: category.id, values, initial: Mappers.FormValues(category) },
      {
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
      }
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
