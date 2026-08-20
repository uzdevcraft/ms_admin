import { useEffect, type ReactNode } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";

import getApiError from "@common/utils/getApiError";
import { keepOptions } from "@/helpers";

import useUpdateStatus from "../hooks/useUpdateStatus";
import type * as Types from "../types";
import {
  updateStatusDefaultValues,
  updateStatusSchema,
  type UpdateStatusFormValues,
} from "./schema";

interface IChildren extends UseFormReturn<UpdateStatusFormValues> {
  isLoading: boolean;
}

interface IProps {
  order: Types.IEntity.Order;
  children: (props: IChildren) => ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: () => void;
}

const UpdateStatusForm = ({
  order,
  children,
  className,
  onError,
  onSettled,
  onSuccess,
}: IProps) => {
  const updateStatus = useUpdateStatus();

  const form = useForm<UpdateStatusFormValues>({
    defaultValues: updateStatusDefaultValues,
    resolver: yupResolver(updateStatusSchema),
  });

  useEffect(() => {
    form.reset({ status: order.status });
  }, [order, form.reset]);

  const onSubmit = form.handleSubmit((values) => {
    updateStatus.mutate(
      { id: order.id, status: values.status },
      {
        onSuccess: () => {
          onSuccess?.();
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
        {children({ ...form, isLoading: updateStatus.isPending })}
      </form>
    </FormProvider>
  );
};

export default UpdateStatusForm;
