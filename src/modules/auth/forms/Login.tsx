import type { ReactNode } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";

import getApiError from "@common/utils/getApiError";
import { keepOptions } from "@/helpers";

import useLogin from "../hooks/useLogin";
import type * as Types from "../types";
import { defaultValues, loginFormSchema, type LoginFormValues } from "./schema";

interface IChildren extends UseFormReturn<LoginFormValues> {
  isLoading: boolean;
}

interface IProps {
  children: (props: IChildren) => ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IEntity.Login) => void;
}

const LoginForm = ({
  children,
  className,
  onError,
  onSettled,
  onSuccess,
}: IProps) => {
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    defaultValues,
    resolver: yupResolver(loginFormSchema),
  });

  const onSubmit = form.handleSubmit((values) => {
    login.mutate(values, {
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
        {children({ ...form, isLoading: login.isPending })}
      </form>
    </FormProvider>
  );
};

export default LoginForm;
