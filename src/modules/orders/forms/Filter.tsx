import type { ReactNode } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';

import { filterDefaultValues, orderFilterSchema, type FilterFormValues } from './schema';

type IChildren = UseFormReturn<FilterFormValues>;

interface IProps {
  children: (props: IChildren) => ReactNode;
  className?: string;
  values?: FilterFormValues;
  onFilter: (values: FilterFormValues) => void;
}

const FilterForm = ({ children, className, values, onFilter }: IProps) => {
  const form = useForm<FilterFormValues>({
    defaultValues: values ?? filterDefaultValues,
    resolver: yupResolver(orderFilterSchema)
  });

  const onSubmit = form.handleSubmit(nextValues => {
    onFilter(nextValues);
  });

  return (
    <FormProvider {...form}>
      <form className={className} onSubmit={onSubmit}>
        {children({ ...form })}
      </form>
    </FormProvider>
  );
};

export default FilterForm;
