import type { ReactNode } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";

import getApiError from "@common/utils/getApiError";
import { keepOptions } from "@/helpers";

import useCreate from "../hooks/useCreate";
import type * as Types from "../types";
import {
  categoryFormSchema,
  defaultValues,
  type CategoryFormValues,
} from "./schema";

interface IChildren extends UseFormReturn<CategoryFormValues> {
  isLoading: boolean;
}

interface IProps {
  children: (props: IChildren) => ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IEntity.Category) => void;
}

const CreateForm = ({
  children,
  className,
  onError,
  onSettled,
  onSuccess,
}: IProps) => {
  const create = useCreate();

  const form = useForm<CategoryFormValues>({
    defaultValues,
    resolver: yupResolver(categoryFormSchema),
  });

  const onSubmit = form.handleSubmit((values) => {
    create.mutate(values, {
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
