import { useEffect, type ReactNode } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import getApiError from '@common/utils/getApiError';
import { keepOptions } from '@/helpers';

import useUpdate from '../hooks/useUpdate';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { templateUpdateFormSchema, updateDefaultValues, type UpdateFormValues } from './schema';

interface IChildren extends UseFormReturn<UpdateFormValues> {
  isLoading: boolean;
}

interface IProps {
  template: Types.IEntity.Template;
  children: (props: IChildren) => ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IEntity.Template) => void;
}

const UpdateForm = ({ template, children, className, onError, onSettled, onSuccess }: IProps) => {
  const update = useUpdate();

  const form = useForm<UpdateFormValues>({
    defaultValues: updateDefaultValues,
    resolver: yupResolver(templateUpdateFormSchema)
  });

  const { reset } = form;

  useEffect(() => {
    reset(Mappers.FormValues(template));
  }, [template, reset]);

  const onSubmit = form.handleSubmit(values => {
    update.mutate(
      { id: template.id, values },
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
      <form className={className} onSubmit={onSubmit} noValidate>
        {children({ ...form, isLoading: update.isPending })}
      </form>
    </FormProvider>
  );
};

export default UpdateForm;
